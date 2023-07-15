"use client";

import { useState, useContext } from "react";
import heroesRaw from "../../../../public/heroes.json";
import { useRouter } from "next/navigation";
import { CampaignContext } from "@/context/campaign";
import { Combobox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

function filterOptions(currentAgency, agencies) {
  const selectedHeroes = [];
  agencies.forEach((agency) => {
    if (agency.name !== currentAgency.name) {
      selectedHeroes.push(...agency.heroes);
    }
  });
  return heroesRaw.filter((hero) => !selectedHeroes.includes(hero));
}
export default function NewCampaignPage() {
  const [numOfAgency, setNumOfAgency] = useState(0);
  const [agencies, setAgencies] = useState([]);
  const [steps, setSteps] = useState(1);
  const router = useRouter();
  const [_, setCampaignState] = useContext(CampaignContext);
  const [selectedHeroes, setSelectedHeroes] = useState([]);

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
                <CustomComboboxMultiple
                  options={filterOptions(agency, agencies)}
                  onChangeHandler={(values) => {
                    const targetAgency = agency.name;
                    setSelectedHeroes([...selectedHeroes, ...values]);
                    const newAgencies = [...agencies];
                    newAgencies.forEach((agency) => {
                      if (agency.name === targetAgency) {
                        agency.heroes = values;
                      }
                    });
                    setAgencies(newAgencies);
                  }}
                  multiple
                />
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

export function CustomComboboxMultiple(props) {
  const { options, onChangeHandler } = props;
  const [selectedPeople, setSelectedPeople] = useState([]);

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

  const onChange = (value) => {
    setSelectedPeople(value);
    onChangeHandler(value);
  };

  return (
    <Combobox value={selectedPeople} onChange={onChange} multiple>
      <div>
        <div className="shadow-md">
          <Combobox.Button as="div">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(people) =>
                people.map((person) => person.name).join(", ")
              }
              placeholder="Select Hero"
              onChange={(event) => setQuery(event.target.value)}
            />
          </Combobox.Button>
        </div>
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
      </div>
    </Combobox>
  );
}
