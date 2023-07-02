"use client";

import { useState } from "react";
import heroes from "../../../public/heroes.json";
import masterminds from "../../../public/masterminds.json";
import schemes from "../../../public/schemes.json";
import freeVillains from "../../../public/freeVillains.json";
import freeHenchmen from "../../../public/freeHenchmen.json";
import mastermindAlwaysLead from "../../../public/mastermindAlwaysLead.json";
import { useRouter } from "next/navigation";

export default function Game() {
  const [gameState, setGameState] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [steps, setSteps] = useState(0);
  const [numOfAgency, setNumOfAgency] = useState(1);
  const [agencyHeros, setAgencyHeros] = useState({});
  const [freeVillains, setFreeVillains] = useState([]);
  const [freeHenchmen, setFreeHenchmen] = useState([]);
  const [gameResult, setGameResult] = useState();

  const generateRandomGame = () => {
    setGameState(randomCampaign());
  };

  const handleAgencyInput = (e) => {
    setNumOfAgency(e.target.value);

    const agencyHeros = {};
    for (let i = 0; i < parseInt(e.target.value); i++) {
      agencyHeros[`Agency ${i + 1}`] = [];
    }
    setAgencyHeros(agencyHeros);
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

  const saveGame = () => {
    const newGameState = { ...gameState };
    newGameState.gameResult = gameResult;
    setGameState(newGameState);
    setGameLog([...gameLog, newGameState]);
    setSteps(7);
  };

  const nextGame = () => {
    console.log("nextGame");
  };

  return (
    <main>
      {steps >= 0 && (
        <>
          <h1 className="text-2xl font-bold">
            Marvel Legendary Campaign Timeline
          </h1>
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
                <select
                  name="hero"
                  id="hero"
                  multiple={true}
                  onChange={(e) => {
                    const options = [...e.target.selectedOptions];
                    const values = options.map((option) => option.value);
                    const newAgencyHeroes = {
                      ...agencyHeros,
                      [key]: [...values],
                    };
                    setAgencyHeros(newAgencyHeroes);
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
