import { prisma } from "../../../core/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: id,
    },
  });
  return new Response(JSON.stringify(campaign));
}

export async function HEAD(request) {}

export async function POST(request) {
  const body = await request.json();
  let newCampaign = await prisma.campaign.create({
    data: {},
  });

  const agencies = body.agencies;
  const newAgencies = await Promise.all(
    agencies.map(async (agency) => {
      const newAgency = await prisma.agency.create({
        data: {
          name: agency.name,
          heroes: agency.heroes,
          campaignId: newCampaign.id,
        },
      });
      return newAgency;
    })
  );
  newCampaign = await prisma.campaign.update({
    where: {
      id: newCampaign.id,
    },
    data: {
      agencies: newAgencies,
    },
  });
  return new Response(
    JSON.stringify({
      message: "New campaign created.",
      campaign: newCampaign,
      agencies: newAgencies,
    })
  );
}

export async function PUT(request) {}

export async function DELETE(request) {}

export async function PATCH(request) {
  const body = await request.json();
  let campaign = await prisma.campaign.update({
    where: {
      id: body.id,
    },
    data: {
      consequences: {
        push: body.consequence,
      },
    },
  });

  return new Response(
    JSON.stringify({
      message: "Campaign updated.",
      campaign,
    })
  );
}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request) {}
