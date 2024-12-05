import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { usePetContext } from "../context/PetContext";
import { Pet } from "../types";
import PetPhotoPicker from "../components/PetPhotoPicker";

type PetFormProps = {
  name: string;
  age: string;
  description?: string;
  image?: string;
  setName: (name: string) => void;
  setAge: (age: string) => void;
  setDescription: (description: string) => void;
  setImage: (image: string) => void;
  editingPet?: Pet;
  setEditingPet: (pet?: Pet) => void;
  clearForm: () => void;
};

/**
 * Main Pet List Form
 */
const PetForm: React.FC<PetFormProps> = (props) => {
  const {
    addPet,
    addError,
    updatePet,
    clearSuccess,
    clearErrors,
    errors,
    successMessage,
  } = usePetContext();

  const {
    age,
    name,
    setAge,
    setDescription,
    setImage,
    setName,
    description,
    image,
    editingPet,
    setEditingPet,
    clearForm,
  } = props;

  const handleSubmit = useCallback(() => {
    clearSuccess();
    clearErrors();

    if (!name || !age) {
      addError("Name and Age fields are required");
      return;
    }

    const petData: Pet = {
      id: editingPet?.id || Date.now().toString(),
      name,
      age,
      description,
      image: image,
    };

    if (editingPet) {
      updatePet(petData);
    } else {
      addPet(petData);
    }
  }, [
    name,
    age,
    image,
    description,
    editingPet,
    addPet,
    updatePet,
    clearErrors,
    setEditingPet,
  ]);

  useEffect(() => {
    if (successMessage && successMessage.length && clearForm) {
      clearForm();
    }
  }, [successMessage, clearForm]);

  return (
    <View style={styles.formContainer}>
      <View style={styles.errorContainer}>
        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : (
          <></>
        )}
      </View>
      {errors && errors.length ? (
        <View style={styles.errorContainer}>
          {errors.map((error) => (
            <Text style={styles.error} key={error}>
              {error}
            </Text>
          ))}
        </View>
      ) : (
        <></>
      )}
      <TextInput
        style={styles.input}
        value={name}
        onFocus={clearSuccess}
        onChangeText={setName}
        placeholder="Pet Name"
      />
      <TextInput
        onFocus={clearSuccess}
        style={styles.input}
        value={age}
        onChangeText={(age) => {
          setAge(age.replace(/[^0-9]/g, ""));
        }}
        placeholder="Pet Age"
        keyboardType="numeric"
      />
      <TextInput
        onFocus={clearSuccess}
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Pet Description"
        multiline
        numberOfLines={4}
      />

      <View style={styles.photoPickerContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <PetPhotoPicker onSelect={setImage} />
      </View>

      <TouchableOpacity
        style={editingPet ? styles.editButton : styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {editingPet ? "Update Pet" : "Add Pet"}
        </Text>
      </TouchableOpacity>

      {editingPet ? (
        <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  photoPickerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  image: {
    width: 50,
    height: 50,
  },
  errorContainer: {
    paddingBottom: 16,
  },
  error: {
    color: "red",
    width: "100%",
    backgroundColor: "#f9c2ff",
    padding: 8,
  },
  success: {
    color: "green",
    width: "100%",
    backgroundColor: "#98FF98",
    padding: 8,
  },
  formContainer: {
    padding: 16,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#CCC",
    padding: 16,
    marginTop: 8,
    borderRadius: 5,
  },
});

export default PetForm;
