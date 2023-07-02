"use client";

import { useContext, useEffect, useState } from "react";
import heroes from "../../../../public/heroes.json";
import masterminds from "../../../../public/masterminds.json";
import schemes from "../../../../public/schemes.json";
import freeVillains from "../../../../public/freeVillains.json";
import freeHenchmen from "../../../../public/freeHenchmen.json";
import mastermindAlwaysLead from "../../../../public/mastermindAlwaysLead.json";
import { useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "../../../core/fetcher";
import useSWR from "swr";
import { CampaignContext } from "../../../context/campaign";

export default function Game() {
  const [gameState, setGameState] = useState(null);
  const [steps, setSteps] = useState(0);
  const [freeVillains, setFreeVillains] = useState([]);
  const [freeHenchmen, setFreeHenchmen] = useState([]);
  const [gameResult, setGameResult] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [campaignState, setCampaignState] = useContext(CampaignContext);

  const [agencyParticipation, setAgencyParticipation] = useState(null);

  const { data: agencyData } = useSWR(
    "/api/agency?campaignId=" + searchParams.get("campaignId"),
    fetcher
  );

  useEffect(() => {
    if (agencyData) {
      let agencyParticipation = [];
      agencyData.forEach((agency) => {
        agencyParticipation.push({ ...agency, isIn: true });
      });
      setAgencyParticipation(agencyParticipation);
    }
  }, [agencyData]);

  const generateRandomGame = () => {
    setGameState(randomCampaign());
  };

  const startGame = () => {
    const newGameState = { ...gameState };
    newGameState.startTime = new Date();
    newGameState.freeVillains = freeVillains;
    newGameState.freeHenchmen = freeHenchmen;
    setGameState(newGameState);
    setSteps(5);
  };

  const endGame = () => {
    const newGameState = { ...gameState };
    newGameState.endTime = new Date();
    setGameState(newGameState);
    setSteps(6);
  };

  const saveGame = async () => {
    const newGameState = { ...gameState };
    newGameState.agencies = agencyParticipation;
    // TODO: Remove hardcode
    newGameState.freeAgents = [];
    setGameState(newGameState);
    const payload = {
      game: {
        ...newGameState,
        campaignId: searchParams.get("campaignId"),
        mainHero: newGameState.hero,
        henchmen: newGameState.freeHenchmen,
        outcome: gameResult.toUpperCase(),
      },
    };
    delete payload["game"].freeHenchmen;
    delete payload["game"].hero;
    const resp = await fetch("/api/log", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    console.log(resp);
    setSteps(7);
  };

  const nextGame = () => {
    router.push("/campaign/" + searchParams.get("campaignId"));
  };

  return (
    <main>
      {steps >= 0 && (
        <>
          <h1 className="text-2xl font-bold">New game</h1>
          <h2 className="text-xl font-bold">Game mode: Normal</h2>
          <br />
          <h1 className="font-bold">Main Hero</h1>
          <h2>{gameState && gameState.hero.name}</h2>
          <br />
          <h1 className="font-bold">Mastermind</h1>
          <h2>{gameState && gameState.mastermind.name}</h2>
          <h1 className="font-bold">Always lead</h1>
          <h2>
            {gameState &&
              JSON.stringify(
                mastermindAlwaysLead.filter(
                  (item) => item.mastermind === gameState.mastermind.name
                )
              )}
          </h2>
          <br />
          <h1 className="font-bold">Scheme</h1>
          <h2>{gameState && gameState.scheme.name}</h2>
          <div className="space-x-2">
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={generateRandomGame}
            >
              Generate
            </button>
            <button
              className="bg-blue-500 py-2 px-4"
              onClick={() => setSteps(1)}
            >
              Next
            </button>
          </div>
        </>
      )}
      <div className="mt-4" />
      {steps >= 1 && (
        <>
          <h1 className="font-bold">Participating agencies</h1>
          <div>
            {agencyData.map((agency) => {
              return (
                <div key={agency.name}>
                  <div
                    onChange={(e) => {
                      let newAgencyParticipation = [...agencyParticipation];
                      newAgencyParticipation.forEach((_agency) => {
                        if (_agency.name === agency.name) {
                          if (e.target.value === "yes") {
                            _agency.isIn = true;
                          } else {
                            _agency.isIn = false;
                          }
                        }
                      });
                      setAgencyParticipation(newAgencyParticipation);
                    }}
                  >
                    <div>Agency Name: {agency.name}</div>
                    <div>
                      Heroes:{" "}
                      {JSON.stringify(
                        agencyParticipation.find(
                          (_agency) => _agency.name === agency.name
                        ).heroes
                      )}
                    </div>
                    <input
                      type="radio"
                      defaultChecked
                      name={agency.name}
                      value="yes"
                    />
                    <label>Yes</label>
                    <div />
                    <input type="radio" name={agency.name} value="no" />
                    <label>No</label>
                  </div>
                  <div>
                    {agencyParticipation.find(
                      (_agency) => agency.name === _agency.name
                    ).isIn && (
                      <div>
                        <div>
                          Hero to deploy:{" "}
                          {JSON.stringify(
                            agencyParticipation.find(
                              (_agency) => _agency.name === agency.name
                            ).selectedHeroes
                          )}
                        </div>
                        <select
                          className="border-2 border-blue-500"
                          name="hero"
                          id="hero"
                          multiple={true}
                          onChange={(e) => {
                            const options = [...e.target.selectedOptions];
                            const values = options.map(
                              (option) => option.value
                            );
                            const selectedHeroes = heroes.filter((hero) =>
                              values.includes(hero.name)
                            );
                            const newAgencyParticipation = [
                              ...agencyParticipation,
                            ];
                            newAgencyParticipation.forEach((_agency) => {
                              if (_agency.name === agency.name) {
                                _agency.selectedHeroes = selectedHeroes;
                              }
                            });
                            setAgencyParticipation([...newAgencyParticipation]);
                          }}
                        >
                          {agencyData
                            .find((_agency) => _agency.name === agency.name)
                            .heroes.map((hero) => (
                              <option key={hero.id} value={hero.name}>
                                {hero.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button className="bg-blue-500 py-2 px-4" onClick={() => setSteps(2)}>
            Next
          </button>
        </>
      )}
      <div className="mt-4" />
      {steps >= 2 && (
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
              onClick={() => setSteps(3)}
            >
              Next
            </button>
          </div>
        </>
      )}
      <div className="mt-4" />
      {steps >= 3 && (
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
          <h1 className="font-bold">Hire a free agent?</h1>
          <div>{JSON.stringify(campaignState.freeAgents)}</div>
          <div className="space-x-2">
            <button className="bg-blue-500 py-2 px-4" onClick={startGame}>
              Start game
            </button>
          </div>
        </>
      )}
      <div className="mt-4" />
      {steps >= 5 && (
        <>
          <h1 className="font-bold">
            Start time: {gameState.startTime.toLocaleString()}
          </h1>
          <div className="space-x-2">
            <button className="bg-blue-500 py-2 px-4" onClick={endGame}>
              End game
            </button>
          </div>
        </>
      )}
      <div className="mt-4" />
      {steps >= 6 && (
        <>
          <h1 className="font-bold">
            End time: {gameState.endTime.toLocaleString()}
          </h1>
          <label htmlFor="gameResult">Game result</label>
          <select
            name="gameResult"
            id="gameResult"
            onChange={(e) => {
              setGameResult(e.target.value);
            }}
          >
            <option value="win">Win</option>
            <option value="lose">Lose</option>
            <option value="draw">Draw</option>
          </select>
          <div className="space-x-2">
            <button className="bg-blue-500 py-2 px-4" onClick={saveGame}>
              Save
            </button>
          </div>
        </>
      )}
      <div className="mt-4" />
      {steps >= 7 && (
        <>
          <h1 className="font-bold">Game summary:</h1>
          <div>{JSON.stringify(gameState)}</div>
          <div className="space-x-2">
            <button className="bg-blue-500 py-2 px-4" onClick={nextGame}>
              Next game
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
