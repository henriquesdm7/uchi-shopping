export default defineEventHandler(async (event) => {
  return prisma.user.findMany();
})
