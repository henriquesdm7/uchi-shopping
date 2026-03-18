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

  console.log('--- New Purchase Upload ---')
  console.log('Market ID:', marketIdPart?.data.toString())
  console.log('Date:', datePart?.data.toString())
  console.log('File Name:', filePart.filename)
  console.log('File Type:', filePart.type)
  console.log('File Size:', filePart.data.length, 'bytes')
  console.log('---------------------------')

  return { success: true, message: 'File received for processing' }
})

