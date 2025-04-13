import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import useDebounce from "@/services/useDebounce";

const SearchScreen = () => {
  const [searchQuerry, setsearchQuerry] = useState("");
  const debouncedQuery = useDebounce(searchQuerry, 500); // <== SỬ DỤNG NÀY

  const {
    data: movies,
    loading,
    error,
    reFetch,
  } = useFetch(() => fetchMovies({ query: debouncedQuery }), false);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      reFetch();
    }
  }, [debouncedQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row items-center justify-between mt-20 mb-5 px-5">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuerry}
                onChangeText={(text: string) => setsearchQuerry(text)}
              />
            </View>
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 my-3"
              />
            )}
            {error && (
              <Text className="text-white text-center mt-10">
                Error: {error.message}
              </Text>
            )}
            {!loading &&
              !error &&
              debouncedQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-lg text-white font-bold mt-3 mb-5 px-5">
                  Search results for{" "}
                  <Text className="text-accent">{debouncedQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error && debouncedQuery.trim() ? (
            <View className=" mt-10 px-5">
              <Text className="text-gray-500 text-center ">
                {searchQuerry.trim() ? "No movies found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default SearchScreen;
