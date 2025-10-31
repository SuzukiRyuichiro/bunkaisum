import { mountSuspended } from "@nuxt/test-utils/runtime";
import { it, expect, describe } from "vitest";
import Expense from "./Expense.vue";

describe("Expense", () => {
  it("can mount the component", async () => {
    const component = await mountSuspended(Expense, {
      props: {
        expense: {
          id: 1,
          title: "Test Expense",
          totalAmount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
          payerId: 1,
          payer: {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });
    expect(component.html()).toContain("Paid by");
    expect(component.html()).toContain("Test User");
  });
});
