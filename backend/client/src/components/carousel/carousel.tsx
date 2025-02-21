import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";

import { CarouselItem } from "./carouselItem";

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowCountOffset, setWindowCountOffset] = useState(1);
  const [length, setLength] = useState(0);
  const petData = useLoaderData() as PetData;

  // ✅ Ensure petData.data exists before accessing .length
  useEffect(() => {
    if (petData?.data) {
      setLength(petData.data.length);
    }
  }, [petData?.data]);

  const next = () => {
    if (currentIndex < length - 1) {
      setCurrentIndex((prevState) => prevState + 1);
    }
    if (currentIndex === length - windowCountOffset) {
      setCurrentIndex(0);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
    if (currentIndex === 0) {
      setCurrentIndex(length - windowCountOffset);
    }
  };

  const detectWindow = () => {
    if (window.innerWidth >= 768) return setWindowCountOffset(5);
    if (window.innerWidth >= 640) return setWindowCountOffset(4);
    return setWindowCountOffset(1);
  };

  useEffect(() => {
    detectWindow();
    window.addEventListener("resize", detectWindow);
    return () => window.removeEventListener("resize", detectWindow);
  }, []);

  return (
    <div className="carousel-container w-full mt-5 flex flex-col">
      <div className="carousel-wrapper flex w-full relative">
        <button
          onClick={prev}
          className="left-arrow rounded-full bg-slate-500 text-white text-lg absolute z-10 top-1/2 w-10 h-10 -translate-y-1/2 -left-5"
        >
          &lt;
        </button>

        <div className="carousel-content-wrapper overflow-hidden w-full h-full">
          <div
            className="carousel-content flex transition-all w-full sm:w-1/4 md:w-1/5 duration-700 ease-in-out left-6 gap-x-0"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {/* ✅ Prevent crash by checking petData?.data */}
            {petData?.data?.length ? (
              petData.data.map((pet: CarouselPet) => (
                <CarouselItem
                  key={pet._id}
                  species={pet.species}
                  _id={pet._id}
                  name={pet.name}
                  image={pet.image}
                />
              ))
            ) : (
              <p className="text-center w-full">Loading...</p>
            )}
          </div>
        </div>

        <button
          onClick={next}
          className="rounded-full bg-slate-500 text-white text-lg right-arrow absolute z-10 top-1/2 w-10 h-10 -translate-y-1/2 -right-5"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
