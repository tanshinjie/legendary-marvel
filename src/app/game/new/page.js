"use client";

import { useContext, useEffect, useState, Fragment } from "react";
import consequences from "../../../../public/consequences.json";
import heroes from "../../../../public/heroes.json";
import masterminds from "../../../../public/masterminds.json";
import schemes from "../../../../public/schemes.json";
import freeVillainsRaw from "../../../../public/freeVillains.json";
import freeHenchmenRaw from "../../../../public/freeHenchmen.json";
import mastermindAlwaysLead from "../../../../public/mastermindAlwaysLead.json";
import { useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "../../../core/fetcher";
import useSWR from "swr";
import { CampaignContext } from "../../../context/campaign";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

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
    const consequence =
      gameResult.toUpperCase() === "LOSE"
        ? consequences.find((c) => c.scheme === gameState.scheme.name)
        : null;
    newGameState.consequence = consequence;
    setGameState(newGameState);
    console.log(consequences.find((c) => c.scheme === gameState.scheme.name));
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

    const consequencePayload = {
      id: searchParams.get("campaignId"),
      consequence: consequence,
    };
    consequencePayload.consequence.status = "ON";

    const resp2 = await fetch("/api/campaign", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consequencePayload),
    }).then((res) => res.json());

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
            <CustomCombobox
              options={freeVillainsRaw}
              selected={freeVillains}
              onChangeHandler={setFreeVillains}
            />
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
            <CustomCombobox
              options={freeHenchmenRaw}
              selected={freeHenchmen}
              onChangeHandler={setFreeHenchmen}
            />
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
          <div className="mt-4" />
          {gameState.consequence && (
            <div>
              <h3 className="font-bold">
                NOTE: You lost in the scheme. The consequence is:
              </h3>
              <p>{gameState.consequence.consequence}</p>
            </div>
          )}
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

function CustomCombobox(props) {
  const { options, onChangeHandler, selected } = props;
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? options
      : options.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={selected} onChange={onChangeHandler}>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(person) => person.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredPeople.map((person) => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
