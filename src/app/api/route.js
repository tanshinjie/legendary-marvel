import { prisma } from "../../core/prisma";

export async function GET(request) {
  const agency = await prisma.agency.findMany();
  console.log(agency);
  return new Response(JSON.stringify({ message: "OK" }));
}

export async function HEAD(request) {}

export async function POST(request) {}

export async function PUT(request) {}

export async function DELETE(request) {}

export async function PATCH(request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request) {}
