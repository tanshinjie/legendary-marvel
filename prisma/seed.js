const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const csvFilePath = path.join(__dirname, "game-selection.csv");

async function main() {
  try {
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        await seed(results);
      });
    return results;
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

async function seed(data) {
  for (const row of data) {
    await prisma.hero.create({
      data: {
        name: row.Heroes,
      },
    });
    await prisma.mastermind.create({
      data: {
        name: row.Mastermind,
      },
    });
    await prisma.scheme.create({
      data: {
        name: row.Scheme,
      },
    });
    await prisma.henchman.create({
      data: {
        name: row["Free Henchman"],
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
