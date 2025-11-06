import { describe, it, expect, beforeEach } from "vitest";
import { $fetch, setup } from "@nuxt/test-utils";
import { prisma } from "../../../../server/utils/prisma";

await setup({});

describe("/api/expenses/[id]", () => {
  let expenseId: number;

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        name: "Peter Parker",
        email: "mail@mail.com",
      },
    });

    const expense = await prisma.expense.create({
      data: {
        title: "Lunch",
        totalAmount: 3000,
        payerId: user.id,
        paidAt: new Date(),
      },
    });

    expenseId = expense.id;
  });

  it("should return 400 for invalid ID", async () => {
    try {
      await $fetch("/api/expenses/abc");
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
    }
  });

  it("should return 404 for non-existent expense", async () => {
    try {
      await $fetch("/api/expenses/99999");
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
    }
  });

  it("should return expense for valid ID", async () => {
    // Assuming you have seeded data with ID 1
    const expense = await $fetch(`/api/expenses/${expenseId}`);

    expect(expense).toHaveProperty("id", expenseId);
    expect(expense).toHaveProperty("title");
    expect(expense).toHaveProperty("payer");
  });
});
