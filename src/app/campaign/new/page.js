"use client";

import { useState, useContext } from "react";
import heroes from "../../../../public/heroes.json";
import { useRouter } from "next/navigation";
import { CampaignContext } from "@/context/campaign";

export default function NewCampaignPage() {
  const [numOfAgency, setNumOfAgency] = useState(0);
  const [agencies, setAgencies] = useState([]);
  const [steps, setSteps] = useState(1);
  const router = useRouter();
  const [_, setCampaignState] = useContext(CampaignContext);

  const handleAgencyInput = (e) => {
    setNumOfAgency(e.target.value);
    const agencies = [];
    for (let i = 0; i < parseInt(e.target.value); i++) {
      const agency = {};
      agency.name = `Agency ${i + 1}`;
      agency.heroes = [];
      agencies.push(agency);
    }
    setAgencies(agencies);
  };

  const completeSetup = async () => {
    const resp = await fetch("/api/campaign", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agencies: agencies }),
    }).then((res) => res.json());
    setCampaignState(resp.campaign);
    router.push("/campaign/" + resp.campaign.id);
  };

  return (
    <main>
      <h1 className="text-2xl font-bold my-4">New Campaign Setup</h1>
      {steps >= 1 && (
        <>
          <input
            className="border-blue-500 border-2"
            type="number"
            onChange={handleAgencyInput}
          />
          <h1>Number of agencies: {numOfAgency}</h1>
          <button className="bg-blue-500 py-2 px-4" onClick={() => setSteps(2)}>
            Next
          </button>
        </>
      )}

      <div className="mt-4" />
      {steps >= 2 && (
        <>
          <h1 className="font-bold">Agency heros</h1>
          {agencies.map((agency) => {
            return (
              <div key={agency.name} className="space-y-2">
                <div>Agency Name: {agency.name}</div>
                <div>Heroes: {JSON.stringify(agency.heroes)}</div>
                <label className="block" htmlFor="hero">
                  Select Hero
                </label>
                <select
                  name="hero"
                  id={`${agency.name}-hero`}
                  multiple={true}
                  className="border-blue-500 border-2"
                  onChange={(e) => {
                    const targetAgency = e.target.id.split("-")[0];
                    const options = [...e.target.selectedOptions];
                    const values = options.map((option) => option.value);
                    const selectedHeroes = heroes.filter((hero) =>
                      values.includes(hero.name)
                    );
                    const newAgencies = [...agencies];
                    newAgencies.forEach((agency) => {
                      if (agency.name === targetAgency) {
                        agency.heroes = selectedHeroes;
                      }
                    });
                    setAgencies(newAgencies);
                  }}
                >
                  {heroes.map((hero) => {
                    return (
                      <option key={hero.id} value={hero.name}>
                        {hero.name}
                      </option>
                    );
                  })}
                </select>
                <div className="mt-4" />
              </div>
            );
          })}

          <button className="bg-blue-500 py-2 px-4" onClick={completeSetup}>
            Complete setup
          </button>
        </>
      )}
    </main>
  );
}
