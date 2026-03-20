import { deleteProduct } from '#server/utils/services/product'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required' })
  }

  try {
    await deleteProduct(id)
    return { success: true }
  } catch (error: any) {
    if (error.message === 'PROD_IN_USE') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Produto possui vínculos (Compras ou Listas). Utilize a opção de Unificação.',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao excluir o produto.'
    })
  }
})
