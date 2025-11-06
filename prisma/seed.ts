import { PrismaClient } from "@prisma/client";
import { previousSaturday, previousTuesday, subDays, subWeeks } from "date-fns";

const prisma = new PrismaClient();

const randomIndex = (array: any[]) => {
  return Math.floor(Math.random() * array.length);
};

async function main() {
  // Destroy everything
  await prisma.expense.deleteMany({});
  await prisma.user.deleteMany({});

  // Create multiple users
  await prisma.user.createMany({
    data: [
      { email: "alice@example.com", name: "Alice" },
      { email: "bob@example.com", name: "Bob" },
      { email: "charlie@example.com", name: "Charlie" },
      { email: "diana@example.com", name: "Diana" },
      { email: "eve@example.com", name: "Eve" },
      { email: "frank@example.com", name: "Frank" },
      { email: "grace@example.com", name: "Grace" },
      { email: "henry@example.com", name: "Henry" },
      { email: "isabella@example.com", name: "Isabella" },
      { email: "jack@example.com", name: "Jack" },
    ],
  });

  console.log("Users created");

  const users = await prisma.user.findMany({});

  await prisma.expense.createMany({
    data: [
      {
        title: "Izakaya in Shimokitazawa",
        totalAmount: 15800,
        paidAt: previousSaturday(new Date()),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Karaoke night",
        totalAmount: 8400,
        paidAt: previousSaturday(new Date()),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Light bulbs for living room",
        totalAmount: 3600,
        paidAt: previousTuesday(new Date()),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Halloween party decorations & snacks",
        totalAmount: 12400,
        paidAt: subDays(new Date(), 3),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Sushi delivery for movie night",
        totalAmount: 9800,
        paidAt: subDays(new Date(), 5),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Kitchen sponges and dish soap",
        totalAmount: 980,
        paidAt: subWeeks(new Date(), 1),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Yakiniku in Ebisu",
        totalAmount: 18500,
        paidAt: subDays(previousSaturday(new Date()), 7),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Shared coffee beans",
        totalAmount: 3200,
        paidAt: subWeeks(new Date(), 1),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Pizza & drinks game night",
        totalAmount: 8400,
        paidAt: subDays(new Date(), 10),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "New rice cooker",
        totalAmount: 16500,
        paidAt: subWeeks(new Date(), 2),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Ramen in Nakameguro",
        totalAmount: 5400,
        paidAt: subDays(new Date(), 8),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Toilet paper bulk purchase",
        totalAmount: 2800,
        paidAt: subWeeks(new Date(), 1),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Shared dinner ingredients - Taco night",
        totalAmount: 7600,
        paidAt: subDays(new Date(), 4),
        payerId: users[randomIndex(users)].id,
      },
      {
        title: "Disney+ subscription",
        totalAmount: 990,
        paidAt: subDays(new Date(), 15),
        payerId: users[randomIndex(users)].id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
