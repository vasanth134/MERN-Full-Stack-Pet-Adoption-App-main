import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { SearchBar } from "./searchBar";
import { PetCard } from "./petCard";
import { Pagination } from "./pagination";

export const PetSearchPage: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const petsData = useLoaderData() as any[]; // Ensure it's an array
  const [filteredPets, setFilteredPets] = useState<any[]>(petsData);

  useEffect(() => {
    let params = queryString.parse(window.location.search);
    let updatedPets = [...petsData];

    // **Filtering by species**
    if (params.species) {
      let speciesArray = typeof params.species === "string" ? params.species.split(",") : [];
      updatedPets = updatedPets.filter((pet) => speciesArray.includes(pet.species));
    }

    // **Sorting**
    if (params.sort) {
      if (params.sort === "age") {
        updatedPets.sort((a, b) => a.age - b.age);
      } else if (params.sort === "fee") {
        updatedPets.sort((a, b) => a.fee - b.fee);
      } else if (params.sort === "dateAdded") {
        updatedPets.sort((a, b) => new Date(b.dateAddedToSite).getTime() - new Date(a.dateAddedToSite).getTime());
      }
    }

    setFilteredPets(updatedPets);
  }, [searchParams, petsData]);

  const resultsCount = filteredPets.length;

  // **Pagination Logic**
  const limit = Number(searchParams.get("limit")) || 6;
  const page = Number(searchParams.get("page")) || 1;
  const pages = Math.ceil(resultsCount / limit);
  const next = (page < pages ? page + 1 : page).toString(); // Convert to string
  const previous = (page > 1 ? page - 1 : page).toString(); // Convert to string
  const pageList = Array.from({ length: pages }, (_, i) => (i + 1).toString()); // Convert numbers to strings

  // Slice data for current page
  const displayedPets = filteredPets.slice((page - 1) * limit, page * limit);

  // **Update Search Params**
  const updateSearchParams = (newParams: Record<string, string | number>) => {
    const currentParams = queryString.parse(window.location.search);
    const updatedParams = { ...currentParams, ...newParams };
    setSearchParams(queryString.stringify(updatedParams));
  };

  const clearQuery = () => setSearchParams({});

  const sortQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, id: value } = e.currentTarget;
    updateSearchParams({ [name]: value, page: 1 });
  };

  const speciesQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id: value } = e.currentTarget;
    const currentParams = queryString.parse(window.location.search);

    let speciesList = typeof currentParams.species === "string" ? currentParams.species.split(",") : [];

    if (!speciesList.includes(value)) {
      speciesList.push(value);
    } else {
      speciesList = speciesList.filter((item) => item !== value);
    }

    updateSearchParams({ species: speciesList.join(","), page: 1 });
  };

  const paginationQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id: value } = e.currentTarget;
    updateSearchParams({ page: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4">
      <SearchBar clearQuery={clearQuery} sortQuery={sortQuery} speciesQuery={speciesQuery} />

      <ul className="flex flex-wrap justify-evenly gap-4 my-5">
        {displayedPets.length > 0 ? (
          displayedPets.map((pet) => (
            <PetCard key={pet._id} {...pet} />
          ))
        ) : (
          <h3 className="text-center text-gray-600">No pets found.</h3>
        )}
      </ul>

      {pages > 1 && (
        <Pagination pageList={pageList} next={next} previous={previous} paginationQuery={paginationQuery} />
      )}
    </div>
  );
};
