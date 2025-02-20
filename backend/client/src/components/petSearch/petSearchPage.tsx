import queryString from "query-string";
import { useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { SearchBar } from "./searchBar";
import { PetCard } from "./petCard";
import { Pagination } from "./pagination";

export const PetSearchPage: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const petsData = useLoaderData() as any; // Ensuring `petsData` is of a flexible type

  console.log("Pets Data:", petsData);
  console.log("Pets Data Type:", Array.isArray(petsData));
  console.log("Pets Data Length:", Array.isArray(petsData) ? petsData.length : "N/A");

  // Ensure petsData is an array, otherwise fallback to an empty array
  const pets: PetCard[] = Array.isArray(petsData) ? petsData : [];
  const resultsCount = pets.length; // Total pets count

  // Pagination variables
  const limit: number = Number(searchParams.get("limit") || 6);
  const page: number = Number(searchParams.get("page") || 1);
  const pages: number = Math.ceil(resultsCount / limit);
  const next = page < pages ? page + 1 : page;
  const previous = page > 1 ? page - 1 : page;
  const pageList: number[] = Array.from({ length: pages }, (_, i) => i + 1);

  // Update search params (fixes TS error)
  const updateSearchParams = (newParams: Record<string, string | number>) => {
    const currentParams = queryString.parse(window.location.search);
    const updatedParams = { ...currentParams, ...newParams };
    setSearchParams(queryString.stringify(updatedParams));
  };

  // Clear all search queries
  const clearQuery = () => {
    setSearchParams({});
  };

  // Update search params for sorting
  const sortQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, id: value } = e.currentTarget;
    updateSearchParams({ [name]: value, page: 1 });
  };

  // Update search params for species filter
  const speciesQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, id: value } = e.currentTarget;
    const currentParams = queryString.parse(window.location.search);

    // Ensure species is always treated as a string before using `.split()`
    let speciesList: string[] = [];
    if (typeof currentParams.species === "string") {
      speciesList = currentParams.species.split(",");
    }

    if (!speciesList.includes(value)) {
      speciesList.push(value);
    } else {
      speciesList = speciesList.filter((item: string) => item !== value);
    }

    updateSearchParams({ species: speciesList.join(","), page: 1 });
  };

  // Handle pagination
  const paginationQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, id: value } = e.currentTarget;
    updateSearchParams({ [name]: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4">
      {/* Search and Filters */}
      <SearchBar clearQuery={clearQuery} sortQuery={sortQuery} speciesQuery={speciesQuery} />

      {/* Pets List */}
      <ul className="flex flex-row flex-wrap justify-evenly gap-x-1 gap-y-7 my-5">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <PetCard
              key={pet._id}
              species={pet.species}
              _id={pet._id}
              name={pet.name}
              fee={pet.fee}
              image={pet.image}
              gender={pet.gender}
              age={pet.age}
              dateAddedToSite={pet.dateAddedToSite}
            />
          ))
        ) : (
          <div className="flex flex-col justify-center my-4">
            <h3 className="text-center mb-4">Woof... We're having trouble finding pets right now.</h3>
          </div>
        )}
      </ul>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex my-20">
          <Pagination pageList={pageList} next={next} previous={previous} paginationQuery={paginationQuery} />
        </div>
      )}
    </div>
  );
};
