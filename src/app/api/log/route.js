import { prisma } from "../../../core/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("campaignId");
  const logs = await prisma.game.findMany({
    where: {
      campaignId: id,
    },
  });
  return new Response(JSON.stringify(logs));
}

export async function HEAD(request) {}

export async function POST(request) {
  const body = await request.json();
  const { game } = body;
  let newLog = await prisma.game.create({
    data: game,
  });

  return new Response(
    JSON.stringify({
      message: "New log created.",
      log: newLog,
    })
  );
}

export async function PUT(request) {}

export async function DELETE(request) {}

export async function PATCH(request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request) {}
