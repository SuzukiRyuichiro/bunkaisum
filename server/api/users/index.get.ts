export default defineEventHandler(async (event) => {
  const db = usePrisma(event);
  const users = await db.user.findMany();
  return users;
});
