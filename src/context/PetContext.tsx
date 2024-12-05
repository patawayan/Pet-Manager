import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Pet, SEARCH_FILTERS, SearchFilters } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_STORAGE_PETS_KEY = "@pet-manager-pets";

type PetContextType = {
  pets: Pet[];
  errors: string[];
  searchFilter: string;
  searchValue: string;
  successMessage: string;
  setSearchValue: (val: string) => void;
  addError: (newError: string) => void;
  setSearchFilter: (searchFilter: SearchFilters) => void;
  clearErrors: () => void;
  clearSuccess: () => void;
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
};

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pets, setPets] = useState<Pet[]>([]);

  /**
   * Errors to display on the main form
   */
  const [errors, setErrors] = useState<string[]>([]);

  /**
   * Success messages to display
   */
  const [successMessage, setSuccessMessage] = useState<string>("");

  /**
   * Which property to filter pet list by
   */
  const [searchFilter, setSearchFilter] = useState<SearchFilters>(
    SEARCH_FILTERS[0]
  );

  /**
   * Value to search for
   */
  const [searchValue, setSearchValue] = useState("");

  /**
   * True if app has been initialized
   */
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * If searchValue is not empty, filter the existing pet list accordingly
   */
  const filteredPets = useMemo(
    () =>
      searchValue && searchFilter
        ? pets.filter((pet) =>
            pet[searchFilter] ? pet[searchFilter].includes(searchValue) : false
          )
        : pets,
    [pets, searchValue, searchFilter]
  );

  /**
   * Adds errors to the main screen
   */
  const addError = (newError: string) => {
    setErrors((errors) =>
      // Only allow unique errors
      errors.some((err) => err === newError) ? errors : [...errors, newError]
    );
  };

  /**
   * Clears all errors
   */
  const clearErrors = () => {
    setErrors([]);
  };

  /**
   * Clears success messages
   */
  const clearSuccess = () => {
    setSuccessMessage("");
  };

  /**
   * Add pet to the pets list
   */
  const addPet = (pet: Pet) => {
    setPets((pets) => {
      /**
       * Check if the pet already exists in the list
       */
      if (
        pets.some((p) => p?.name?.toLowerCase() === pet?.name?.toLowerCase())
      ) {
        addError("Duplicate names not allowed");
        return pets;
      } else {
        setSuccessMessage("Successfully added new pet!");
      }
      return [...pets, pet];
    });
  };

  /**
   * Update existing pet
   */
  const updatePet = (updatedPet: Pet) => {
    setPets((pets) =>
      pets.map((pet) => {
        if (pet.id === updatedPet.id) {
          if (JSON.stringify(pet) === JSON.stringify(updatedPet)) {
            addError("No changes detected");
            return pet;
          }
          setSuccessMessage("Successfully updated pet!");
          return updatedPet;
        } else if (
          pet?.name?.toLowerCase() === updatedPet?.name?.toLowerCase()
        ) {
          addError("Duplicate names not allowed");
        }
        return pet;
      })
    );
  };

  /**
   * Delete existing pet
   */
  const deletePet = (id: string) => {
    setPets((pets) =>
      pets.filter((pet) => {
        if (pet.id === id) {
          setSuccessMessage("Successfully deleted pet!");
        }
        return pet.id !== id;
      })
    );
  };

  /**
   * Loads in data from Async Storage
   */
  const loadLocalStorage = async () => {
    const localPets = await AsyncStorage.getItem(LOCAL_STORAGE_PETS_KEY);

    if (localPets) {
      setPets(JSON.parse(localPets) as Pet[]);
    }

    setIsInitialized(true);
  };

  /**
   * Load in local storage pets on mount
   */
  useEffect(() => {
    loadLocalStorage();
  }, []);

  /**
   * Update local storage pets on update of pets and app is initialized
   */
  useEffect(() => {
    if (isInitialized) {
      AsyncStorage.setItem(LOCAL_STORAGE_PETS_KEY, JSON.stringify(pets));
    }
  }, [pets, isInitialized]);

  return (
    <PetContext.Provider
      value={{
        errors,
        successMessage,
        pets: filteredPets,
        searchFilter,
        searchValue,
        setSearchValue,
        addError,
        addPet,
        updatePet,
        deletePet,
        setSearchFilter,
        clearErrors,
        clearSuccess,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used within a PetProvider");
  }
  return context;
};
