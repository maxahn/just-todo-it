import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeData<T>(key: string, value: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}
