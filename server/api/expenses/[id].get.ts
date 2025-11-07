export default defineEventHandler(async (event) => {
  const paramId = getRouterParam(event, "id");

  if (!paramId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request. Need to provide an ID",
    });
  }

  const id = Number.parseInt(paramId);

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request. Need to provide an ID",
    });
  }

  const db = usePrisma(event);
  const expense = await db.expense.findUnique({
    where: { id },
    include: {
      payer: true,
    },
  });

  if (!expense) {
    throw createError({
      statusCode: 404,
      statusMessage: "Expense not found",
    });
  }

  return expense;
});
