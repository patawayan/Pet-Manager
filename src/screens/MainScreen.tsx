import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { usePetContext } from "../context/PetContext";
import { Pet } from "../types";
import PetListItem from "../components/PetListItem";
import SearchComponent from "../components/SearchComponent";
import PetForm from "../components/PetForm";

/**
 * Main Pet List screen
 */
const MainScreen: React.FC = () => {
  const { deletePet, clearSuccess, clearErrors, pets, successMessage } =
    usePetContext();
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [editingPet, setEditingPet] = useState<Pet>();

  /**
   * Clear form data
   */
  const clearForm = () => {
    setName("");
    setAge("");
    setDescription("");
    setImage("");
    setEditingPet(undefined);
  };

  /**
   * Wrap renderItem in a callback to prevent unecessary renders
   */
  const renderPetItem = useCallback(
    ({ item }: { item: Pet }) => (
      <PetListItem
        pet={item}
        onDelete={() => deletePet(item.id)}
        onUpdate={() => {
          clearSuccess();
          clearErrors();
          setEditingPet(item);
          setName(item.name ?? "");
          setAge(item.age ?? "");
          setDescription(item.description || "");
          setImage(item.image || "");
        }}
      />
    ),
    [deletePet, setEditingPet, setName, setAge, setDescription, clearErrors]
  );

  useEffect(() => {
    if (successMessage && successMessage.length) {
      clearForm();
    }
  }, [successMessage]);

  return (
    <View style={styles.container}>
      <PetForm
        age={age}
        name={name}
        description={description}
        image={image}
        clearForm={clearForm}
        setAge={setAge}
        setDescription={setDescription}
        setEditingPet={setEditingPet}
        setImage={setImage}
        setName={setName}
        editingPet={editingPet}
      />

      <View style={styles.listContainer}>
        <FlatList
          ListHeaderComponent={<SearchComponent />}
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPetItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
});

export default MainScreen;
