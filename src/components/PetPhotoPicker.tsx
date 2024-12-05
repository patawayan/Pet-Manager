import { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

type ImageURI = string;
type PhotoPickerProps = {
  onSelect: (image: ImageURI) => void;
};

/**
 * Component for picking pet profile pictures
 */
const PetPhotoPicker = (props: PhotoPickerProps) => {
  const { onSelect } = props;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onSelect(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={styles.button}>
        <Text>Profile Picture (Optional)</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ddd",
    padding: 4,
    borderRadius: 10,
  },
});

export default PetPhotoPicker;
