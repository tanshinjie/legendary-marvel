"use client";

import { useState } from "react";
import heroes from "../../public/heroes.json";
import masterminds from "../../public/masterminds.json";
import schemes from "../../public/schemes.json";
import freeVillains from "../../public/freeVillains.json";
import freeHenchmen from "../../public/freeHenchmen.json";

export default function Home() {
  const [campaignState, setCampaignState] = useState(randomCampaign());
  const [steps, setSteps] = useState(0);
  const [numOfAgency, setNumOfAgency] = useState(1);
  const [agencyHeros, setAgencyHeros] = useState({});
  const [freeVillains, setFreeVillains] = useState([]);
  const [freeHenchmen, setFreeHenchmen] = useState([]);

  const handleAgencyInput = (e) => {
    setNumOfAgency(e.target.value);

    const agencyHeros = {};
    for (let i = 0; i < parseInt(e.target.value); i++) {
      agencyHeros[`Agency ${i + 1}`] = [];
    }
    setAgencyHeros(agencyHeros);
  };

  const generateHeroesForAgency = (agencyName) => () => {
    const randomHero1 = heroes[Math.floor(Math.random() * heroes.length)];
    const randomHero2 = heroes[Math.floor(Math.random() * heroes.length)];
    const randomHero3 = heroes[Math.floor(Math.random() * heroes.length)];
    const newAgencyHeroes = {
      ...agencyHeros,
      [agencyName]: [randomHero1, randomHero2, randomHero3],
    };
    setAgencyHeros(newAgencyHeroes);
  };

  return (
    <main>
      {steps >= 0 && (
        <>
          <h1 className="text-2xl font-bold">Marvel Legendary Randomizer</h1>
          <br />
          <h1 className="font-bold">Main Hero</h1>
          <h2>{campaignState.hero.name}</h2>
          <br />
          <h1 className="font-bold">Mastermind</h1>
          <h2>{campaignState.mastermind.name}</h2>
          <br />
          <h1 className="font-bold">Scheme</h1>
          <h2>{campaignState.scheme.name}</h2>
          <div className="space-x-2">
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={() => setSteps(1)}
            >
              Next
            </button>
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={() => setCampaignState(randomCampaign())}
            >
              Refresh
            </button>
          </div>
        </>
      )}
      <div className="mt-4" />
      {steps >= 1 && (
        <>
          <input type="number" onChange={handleAgencyInput} />
          <h1>Number of agency: {numOfAgency}</h1>
          <button className="bg-blue-500 py-2 px-4" onClick={() => setSteps(2)}>
            Next
          </button>
        </>
      )}
      <div className="mt-4" />
      {steps >= 2 && (
        <>
          <h1 className="font-bold">Agency heros</h1>
          {Object.entries(agencyHeros).map(([key, value]) => {
            return (
              <>
                <div key={key}>Agency Name: {key}</div>
                <div>Heroes: {JSON.stringify(agencyHeros[key])}</div>
                <button
                  className="bg-blue-500 py-2 px-4"
                  onClick={generateHeroesForAgency(key)}
                >
                  Click to generate randomized hero
                </button>
                <div className="mt-4" />
              </>
            );
          })}

          <button className="bg-blue-500 py-2 px-4" onClick={() => setSteps(3)}>
            Next
          </button>
        </>
      )}
      <div className="mt-4" />
      {steps >= 3 && (
        <>
          <h1 className="font-bold">Free villains</h1>
          <div>{JSON.stringify(freeVillains)}</div>
          <div className="space-x-2">
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={() => setFreeVillains([randomFreeVillains()])}
            >
              Click to generate randomized free villains
            </button>
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={() => setSteps(4)}
            >
              Next
            </button>
          </div>
        </>
      )}
      <div className="mt-4" />
      {steps >= 4 && (
        <>
          <h1 className="font-bold">Free henchmen</h1>
          <div>{JSON.stringify(freeHenchmen)}</div>
          <div className="space-x-2">
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={() => setFreeHenchmen([randomHenchmen()])}
            >
              Click to generate randomized free henchmen
            </button>
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={() => setSteps(5)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

function randomCampaign() {
  return {
    hero: randomHero(),
    mastermind: randomMastermind(),
    scheme: randomScheme(),
  };
}

function randomHero() {
  return heroes[Math.floor(Math.random() * heroes.length)];
}
function randomMastermind() {
  return masterminds[Math.floor(Math.random() * masterminds.length)];
}
function randomScheme() {
  return schemes[Math.floor(Math.random() * schemes.length)];
}
function randomFreeVillains() {
  return freeVillains[Math.floor(Math.random() * freeVillains.length)];
}
function randomHenchmen() {
  return freeHenchmen[Math.floor(Math.random() * freeHenchmen.length)];
}

const mockConsequence = [
  {
    id: 1,
    name: "The new age is here.",
    schemeId: 1,
    effect: "Ongoing",
    description:
      'Before the beginning of the first turn, draw the top 5 cards in the hero deck and set it aside as the "Evolution" Pile. The Mastermind and Always Lead Villains is Empowered by each colour in the Evolution Pile.',
  },
  {
    id: 2,
    name: "Aliens swarmed the Earth.",
    schemeId: 2,
    effect: "Ongoing",
    description:
      "During setup, fill every city space with 2 Brood, indicating aliens are everywhere. Playing cards from the villain deck will not push the Brood forward. Villains are now their attack + the number of Broods below them. Heroes still can fight The Brood when there are no Villains on the top of The Broods, resolve the Fight effect accordingly.",
  },
  {
    id: 3,
    schemeId: 3,
    name: "Society has been injected with Techno-Organic Virus.",
    effect: "Ongoing",
    description: "Wound and Binding cannot be KO'ed.",
  },
  {
    id: 4,
    name: "We have to stay low.",
    schemeId: 4,
    name: "Society has been injected with Techno-Organic Virus.",
    effect: "Ongoing",
    description: "Wound and Binding cannot be KO'ed.",
  },
];
