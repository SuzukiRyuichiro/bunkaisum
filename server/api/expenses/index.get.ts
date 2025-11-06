import { Prisma } from "@prisma/client";
export type ExpenseWithPayer = Prisma.ExpenseGetPayload<{
  include: {
    payer: true;
  };
}>;

export default defineEventHandler(async (event) => {
  const expenses = await prisma.expense.findMany({
    include: {
      payer: true,
    },
  });
  return expenses;
});
