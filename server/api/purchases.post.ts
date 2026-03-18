import {processReceiptImage, listGeminiModels, GEMINI_MODEL} from "#server/utils/services/gemini";
import {prisma} from "#server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)
  if (!body) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const filePart = body.find(part => part.name === 'file')
  const marketIdPart = body.find(part => part.name === 'marketId')
  const datePart = body.find(part => part.name === 'date')

  if (!filePart || !filePart.filename) {
    throw createError({ statusCode: 400, message: 'File is required' })
  }

  const mimeType = filePart.type || 'image/jpeg'; // Default if undefined

  console.log('--- Processing Receipt with Gemini ---')
  console.log('File Name:', filePart.filename)
  console.log('Content-Type:', filePart.type)

  try {
    // Fetch limited set of existing categories and products for context
    const categories = await prisma.category.findMany({
      select: { name: true },
    }).then(cats => cats.map(c => c.name));

    // Fetch popular products or all (if small list)
    // For now, let's limit to 100 most recent? Or just all names if table is small.
    // Assuming table is small for now.
    const products = await prisma.product.findMany({
      select: { name: true },
      take: 200,
    }).then(prods => prods.map(p => p.name));

    const startTime = Date.now()
    const { data: aiResult, usage } = await processReceiptImage(filePart.data, mimeType, categories, products)
    const durationMs = Date.now() - startTime

    await prisma.aiRequest.create({
      data: {
        feature: 'receipt_extraction',
        model: GEMINI_MODEL,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        durationMs: durationMs,
        status: 'SUCCESS',
      }
    })

    console.log('--- Extraction Result ---')
    console.log(JSON.stringify(aiResult, null, 2))
    console.log('--- Usage ---')
    console.log(JSON.stringify(usage, null, 2))
    console.log('-------------------------')

    // Save to Database
    const marketId = marketIdPart?.data.toString();
    const dateInput = datePart?.data.toString();

    if (!marketId) {
       throw new Error('Market ID is missing');
    }

    // Prefer form date, fallback to AI date, fallback to now
    const purchaseDate = dateInput ? new Date(dateInput) : (aiResult.date ? new Date(aiResult.date) : new Date());

    const purchase = await prisma.$transaction(async (tx) => {
      // Create Purchase
      const p = await tx.purchase.create({
        data: {
          marketId: marketId,
          date: purchaseDate,
          total: Number(aiResult.total) || 0,
        }
      });

      // Process Items
      if (aiResult.items && Array.isArray(aiResult.items)) {
        for (const item of aiResult.items) {
          // 1. Find or Create Category
          let categoryId = null;
          if (item.category && typeof item.category === 'string') {
            // Check if exist
            const cat = await tx.category.upsert({
              where: { name: item.category },
              update: {},
              create: { name: item.category },
            });
            categoryId = cat.id;
          }

          // 2. Find or Create Product
          // Clean name slightly (trim, uppercase first letter?)
          const productName = item.description ? item.description.trim() : 'Unknown Product';

          const product = await tx.product.upsert({
            where: { name: productName },
            update: {
              // Only update category if we have one
              ...(categoryId ? { categoryId } : {})
            },
            create: {
              name: productName,
              categoryId,
            }
          });

          // 3. Create Purchase Item
          await tx.purchaseItem.create({
            data: {
              purchaseId: p.id,
              productId: product.id,
              quantity: Number(item.quantity) || 1,
              unitPrice: Number(item.unitPrice) || 0,
              totalPrice: Number(item.totalPrice) || 0,
            }
          });
        }
      }
      return p;
    });

    console.log('Purchase saved with ID:', purchase.id);

    return {
      success: true,
      message: 'Processing complete and saved',
      data: aiResult,
      purchaseId: purchase.id
    }
  } catch (e: any) {
    console.error('Gemini Error:', e)

    // Try to list available models to debug
    if (e.toString().includes('404') || e.toString().includes('not found')) {
      console.log('Attempting to list available models for debug...');
      const models = await listGeminiModels();
      console.log('Available models:', models.map((m: any) => m.name));
    }

    throw createError({
      statusCode: 500,
      message: 'AI Processing Failed: ' + (e.message || 'Unknown error')
    })
  }
})
