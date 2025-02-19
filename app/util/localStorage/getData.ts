import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getData<T>(key: string): Promise<T | null | undefined> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as T;
  } catch (e) {
    console.error(e);
  }
}
