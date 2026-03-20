const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      bankBin: "970422",
      bankAccount: "0962345599",
      bankName: "MAIKERY", // The user didn't provide an account name, using store name.
      bankShortName: "MBBank",
    },
    create: {
      id: "default",
      bankBin: "970422",
      bankAccount: "0962345599",
      bankName: "MAIKERY",
      bankShortName: "MBBank",
      storeName: "MaiKery",
    }
  });
  console.log("Updated bank settings to MBBank for:", "0962345599");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
