import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { usePetContext } from "../context/PetContext";
import { SEARCH_FILTERS } from "../types";

/**
 * Search component for main Pet List
 */
const SearchComponent = () => {
  const { setSearchFilter, setSearchValue, searchValue, searchFilter } =
    usePetContext();

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Search"
      />
      <SelectDropdown
        data={SEARCH_FILTERS}
        renderItem={(item) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(searchFilter === item && { backgroundColor: "#D2D9DF" }),
              }}
            >
              <Text>{item}</Text>
            </View>
          );
        }}
        onSelect={setSearchFilter}
        renderButton={() => (
          <TouchableOpacity>
            <View style={styles.searchFilterButton}>
              <Text>Filter by {searchFilter}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchFilterButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    flexGrow: 1,
  },
  dropdownItemStyle: {
    padding: 12,
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
});

export default SearchComponent;
