import { prisma } from "@/lib/prisma";

/**
 * Generate a daily sequential order ID in format: MKddmmyynnn
 * Uses database-backed DailyOrderSequence to ensure uniqueness under concurrency.
 */
export async function generateOrderId(): Promise<string> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const dateKey = `${dd}${mm}${yy}`;

  // Use a transaction to safely increment and read the counter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await prisma.$transaction(async (tx: any) => {
    const seq = await tx.dailyOrderSequence.upsert({
      where: { date: dateKey },
      update: { counter: { increment: 1 } },
      create: { date: dateKey, counter: 1 },
    });
    return seq;
  });

  const nnn = String(result.counter).padStart(3, "0");
  return `MK${dateKey}${nnn}`;
}
