import { describe, it, expect } from "vitest";
import { $fetch } from "@nuxt/test-utils/e2e";

describe("/api/expenses/[id]", () => {
  it("should return 400 for invalid ID", async () => {
    try {
      await $fetch("/api/expenses/abc");
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
      expect(error.statusMessage).toContain("Bad Request");
    }
  });

  it("should return 404 for non-existent expense", async () => {
    try {
      await $fetch("/api/expenses/99999");
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.statusMessage).toContain("not found");
    }
  });

  it("should return expense for valid ID", async () => {
    // Assuming you have seeded data with ID 1
    const expense = await $fetch("/api/expenses/1");

    expect(expense).toHaveProperty("id", 1);
    expect(expense).toHaveProperty("title");
    expect(expense).toHaveProperty("payer");
  });
});
