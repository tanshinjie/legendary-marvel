"use client";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../../../core/fetcher";
import { useContext } from "react";
import { CampaignContext } from "@/context/campaign";

export default function CampaignPage({ params }) {
  const router = useRouter();
  const [campaignState] = useContext(CampaignContext);

  const { data: agencyData, isLoading } = useSWR(
    "/api/agency?campaignId=" + params.id,
    fetcher
  );

  const { data: logData, isLoading: _isLoading } = useSWR(
    "/api/log?campaignId=" + params.id,
    fetcher
  );

  if (isLoading || _isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold my-4">Campaign Overview</h1>

      <div>
        <h3 className="font-bold my-4">Active consequnces</h3>
        <div>{JSON.stringify(campaignState.consequences)}</div>
      </div>

      <div>
        <h3 className="font-bold">Agency</h3>
        <div>{JSON.stringify(agencyData)}</div>
      </div>

      <div>
        <h3 className="font-bold">Free Villains</h3>
        <div>{JSON.stringify(campaignState.freeVillains)}</div>
      </div>

      <div>
        <h3 className="font-bold">Free Agents</h3>
        <div>{JSON.stringify(campaignState.freeAgents)}</div>
      </div>

      <div>
        <h3 className="font-bold">New game</h3>
        <div className="space-y-4 flex flex-col">
          <button
            className="bg-blue-500 py-4 px-8"
            onClick={() => router.push("/game/new?campaignId=" + params.id)}
          >
            Normal
          </button>
          <button disabled className="bg-blue-400 py-4 px-8">
            Fixing the world
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-bold">Past games</h3>
        <div>Number of games: {logData.length}</div>
        <div>
          {logData.map((log) => (
            <div key={log.id}>
              <div>Outcome: {log.outcome}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
