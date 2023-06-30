import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  console.log("GET");
  const result = await prisma.agency.findMany();
  return new Response(JSON.stringify(result));
}

export async function HEAD(request) {}

export async function POST(request) {
  console.log("POST");
  try {
    const body = await request.json();
    console.log("POST", body);
    const { name } = body;
    const result = await prisma.agency.create({
      data: {
        name,
      },
    });
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.log("error", error);
    return new Response(500);
  }
}

export async function PUT(request) {}

export async function DELETE(request) {}

export async function PATCH(request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request) {}
