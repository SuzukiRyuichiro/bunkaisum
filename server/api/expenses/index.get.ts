export default defineEventHandler(async (event) => {
  const db = usePrisma(event);
  const expenses = await db.expense.findMany({
    include: {
      payer: true,
    },
  });
  return expenses;
});
