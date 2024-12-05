export const SEARCH_FILTERS = ["name", "age", "description"];

export type SearchFilters = (typeof SEARCH_FILTERS)[number];

type SearchPetbase = Partial<Record<SearchFilters, string>>;

export type Pet = SearchPetbase & {
  id: string;
  image?: string;
};

export type RootStackParamList = {
  Main: undefined;
};
