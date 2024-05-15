import { createContext, useEffect, useContext, useReducer, useCallback } from "react";
import { getLocalStorage } from "../helpers/helper";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknow action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      if (localStorage.hasOwnProperty("cities")) {
        const cities = getLocalStorage("cities");
        dispatch({ type: "cities/loaded", payload: cities });
      } else {
        dispatch({ type: "rejected", payload: "There was an error loading cities..." });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const cities = getLocalStorage("cities") || [];
        const city = cities.find((city) => city.id === id);

        if (city) {
          dispatch({ type: "city/loaded", payload: city });
        } else {
          dispatch({ type: "rejected", payload: "City not found in localStorage" });
        }
      } catch (err) {
        dispatch({ type: "rejected", payload: "There was an error loading the city..." });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    console.log(newCity);
    dispatch({ type: "loading" });

    try {
      if (localStorage.hasOwnProperty("cities")) {
        const cities = getLocalStorage("cities");
        if (cities) localStorage.setItem("cities", JSON.stringify([...cities, newCity]));
        dispatch({ type: "city/created", payload: newCity });
      } else {
        localStorage.setItem("cities", JSON.stringify([newCity]));
        dispatch({ type: "city/created", payload: newCity });
      }
    } catch (err) {
      dispatch({ type: "rejected", payload: "There was an error creating the city..." });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      if (localStorage.hasOwnProperty("cities")) {
        const cities = getLocalStorage("cities");
        if (cities) {
          const updatedCities = cities.filter((city) => city.id !== id);
          localStorage.setItem("cities", JSON.stringify(updatedCities));
          dispatch({ type: "city/deleted", payload: id });
        }
      }
    } catch (err) {
      dispatch({ type: "rejected", payload: "There was an error deleting the city..." });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}{" "}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
