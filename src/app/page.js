"use client";

import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();
  return (
    <main>
      <div className="flex flex-col text-center">
        <h1 className="font-bold text-3xl my-24">
          Legendary Marvel Campaign Timeline
        </h1>
        <div className="space-y-4 flex flex-col mt-20">
          <button
            className="bg-blue-500 py-4 px-8"
            onClick={() => router.push("/campaign/new")}
          >
            New campaign
          </button>
          <button disabled className="bg-blue-400 py-4 px-8">
            Continue previous campaign
          </button>
        </div>
      </div>
    </main>
  );
}
