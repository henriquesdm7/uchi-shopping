import { unifyProductSchema } from '#shared/utils/product.schema'
import { unifyProducts } from '#server/utils/services/product'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  
  const body = await readValidatedBody(event, (body) => unifyProductSchema.safeParse(body))
  if (!body.success) {
      throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          data: body.error.issues,
      })
  }

  try {
      await unifyProducts(body.data.baseProductId, body.data.duplicateProductId)
      return { success: true }
  } catch (error: any) {
      throw createError({
          statusCode: 500,
          statusMessage: error.message || 'Erro ao unificar produtos'
      })
  }
})
