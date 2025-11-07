export default defineEventHandler(async (event) => {
  const expenses = await prisma.expense.findMany({
    include: {
      payer: true,
    },
  });
  return expenses;
});
