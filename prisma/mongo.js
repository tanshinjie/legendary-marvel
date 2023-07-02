const { PrismaClient } = require("@prisma/client");
const heroes = require("../public/heroes.json");

const prisma = new PrismaClient();

async function main() {
  const newCampaign = await prisma.agency.create({
    data: {
      name: "Agency B",
      heroes: [heroes[0], heroes[1], heroes[2]],
    },
  });
  console.log(newCampaign);
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
