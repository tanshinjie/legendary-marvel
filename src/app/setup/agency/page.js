"use client";
import { useForm } from "react-hook-form";
import { Toast } from "flowbite-react";
import useSWRMutation from "swr/mutation";
import fetcher from "@/core/fetcher";

export default function SetupAgency() {
  const { register, handleSubmit } = useForm();
  const { trigger, data, error } = useSWRMutation("/api/agency", fetcher.post);

  const onSubmit = async (data) => {
    console.log("data", data);
    trigger(data);
  };
  return (
    <main>
      <h1>Create Agency</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Avengers Wannabe"
            required
            {...register("name")}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
      {data}
      {data && (
        <Toast>
          <div className="ml-3 text-sm font-normal">
            Agency created successfully!
          </div>
          <Toast.Toggle />
        </Toast>
      )}
    </main>
  );
}
