import { afterEach } from "vitest";
import { prisma } from "../server/utils/prisma";

afterEach(async () => {
  await prisma.expense.deleteMany({});
  await prisma.user.deleteMany({});
});
