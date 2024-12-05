import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pet } from "../types";
import { memo } from "react";

type PetListItemProps = {
  pet: Pet;
  onUpdate: () => void;
  onDelete: () => void;
};

/**
 * List Item for Main Pet List
 */
const PetListItem = memo(
  ({ pet, onUpdate, onDelete }: PetListItemProps) => (
    <View style={styles.petItem}>
      <View style={styles.petDetailsContainer}>
        {pet.image ? (
          <Image source={{ uri: pet.image }} style={styles.image} />
        ) : (
          <></>
        )}
        <View>
          <Text>Name: {pet.name}</Text>
          <Text>Age: {pet.age}</Text>
          {pet.description && <Text>Description: {pet.description}</Text>}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onUpdate} style={styles.editButton}>
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.pet) === JSON.stringify(nextProps.pet) &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onUpdate === nextProps.onUpdate
);

const styles = StyleSheet.create({
  petDetailsContainer: {
    display: "flex",
    gap: 12,
    flexDirection: "row",
  },
  image: {
    width: 50,
    height: 50,
  },
  petItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
  },
});

export default PetListItem;
