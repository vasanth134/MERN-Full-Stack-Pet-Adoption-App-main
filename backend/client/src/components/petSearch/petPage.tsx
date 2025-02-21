import { useState, useContext } from "react";
import { useLoaderData } from "react-router-dom";
import CartContext from "../../context/cartContext/cartContext";
import { multipleSpeciesStringConverter } from "../helpers";

export const PetPage = () => {
  const pet = useLoaderData() as Pet;

  const [showAdoption, setShowAdoption] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const { addToCart, cartItems, removeFromCart } = useContext(CartContext);

  const isInCart = (pet: Pet) => {
    return !!cartItems.find((item: Pet) => item._id === pet._id);
  };

  return (
    <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
      {/* Pet Image for Larger Screens */}
      <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
        <img
          className="w-full rounded-lg"
          src={`/uploads/${pet.image}`}
          alt={`${pet.species} for adoption.`}
        />
      </div>
      {/* Pet Image for Smaller Screens */}
      <div className="md:hidden">
        <img
          className="w-full"
          src={`/uploads/${pet.image}`}
          alt={`${pet.species} for adoption.`}
        />
      </div>

      {/* Pet Details */}
      <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm leading-none text-gray-600">
            {multipleSpeciesStringConverter(pet.species)}
          </p>
          <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2">
            {pet.name}
          </h1>
        </div>

        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <p className="text-base leading-4 text-gray-800">Age: {pet.age}</p>
        </div>

        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <p className="text-base leading-4 text-gray-800">
            {`${pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}`}
          </p>
        </div>

        {/* Add/Remove Pet from Cart */}
        {!isInCart(pet) ? (
          <button
            onClick={() => addToCart(pet)}
            className="text-base flex rounded-lg items-center justify-center leading-none text-white bg-slate-700 w-full py-4 hover:bg-gray-900"
          >
            <svg
              className="mr-3"
              width="25"
              height="25"
              viewBox="0 0 512 525"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke="white"
                  strokeWidth="25"
                  d="M191.4,164.127c29.081-9.964,44.587-41.618,34.622-70.699c-9.952-29.072-41.6-44.592-70.686-34.626 ..."
                />
              </g>
            </svg>
            Add {pet.name} to Basket
          </button>
        ) : (
          <button
            onClick={() => removeFromCart(pet)}
            className="text-base flex rounded-lg items-center justify-center leading-none text-white bg-slate-700 w-full py-4 hover:bg-gray-900"
          >
            <svg
              className="mr-3"
              width="25"
              height="25"
              viewBox="0 0 512 525"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke="white"
                  strokeWidth="25"
                  d="M191.4,164.127c29.081-9.964,44.587-41.618,34.622-70.699c-9.952-29.072-41.6-44.592-70.686-34.626 ..."
                />
              </g>
            </svg>
            Remove {pet.name} from Basket
          </button>
        )}
      </div>
    </div>
  );
};

export default PetPage;
