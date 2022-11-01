import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

export const cacheProvider = (cache) => {
  const swrCache = {
    get: (key) => {
      const valueFromMap = cache.get(key);

      if (valueFromMap) {
        return valueFromMap;
      }

      if (typeof key === "string" && mmkv.contains(key)) {
        const value = mmkv.getString(key);
        return value ? JSON.parse(value) : undefined;
      }

      return undefined;
    },
    set: (key, value) => {
      cache.set(key, value);

      if (typeof key === "string") {
        mmkv.set(key, JSON.stringify(value));
      }
    },
    delete: (key) => {
      cache.delete(key);

      if (typeof key === "string" && mmkv.contains(key)) {
        mmkv.delete(key);
      }
    },
  };

  return swrCache;
};
