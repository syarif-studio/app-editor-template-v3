import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { config } from "./config";
import Route from "./src/Route";
import { RecoilRoot } from "recoil";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { SWRConfig } from "swr";
import { default as mappingFont } from "./mapping.json";
import { useFonts } from "expo-font";
import fontRegular from "./assets/fonts/font-regular.ttf";
import fontBold from "./assets/fonts/font-bold.ttf";
import fontSemibold from "./assets/fonts/font-semibold.ttf";
import Init from "./src/Init";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import { cacheProvider } from "./src/Cache";

const { colorMode, colorTheme } = config;

const fetcher = (key) =>
  fetch(config.baseUrl + "wp-json/wprne/v1/" + key).then((r) => r.json());

function AppProvider({ children }) {
  const theme =
    colorMode === "dark"
      ? { ...eva.dark, ...colorTheme }
      : {
          ...eva.light,
          ...colorTheme,
          "background-basic-color-1": "transparent",
        };

  return (
    <ApplicationProvider {...eva} theme={theme} customMapping={mappingFont}>
      {children}
    </ApplicationProvider>
  );
}

export default function App() {
  const [loaded] = useFonts({
    "Font-Regular": fontRegular,
    "Font-Bold": fontBold,
    "Font-SemiBold": fontSemibold,
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Init />
      <RecoilRoot>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            refreshInterval: 0,
            fetcher,
            provider: cacheProvider,
          }}
        >
          <SafeAreaProvider>
            <AppProvider>
              <Route />
            </AppProvider>
          </SafeAreaProvider>
        </SWRConfig>
      </RecoilRoot>
      <StatusBar
        translucent={false}
        // style={colorMode === "dark" ? "light" : "dark"}
        style="light"
        backgroundColor="#000"
      />
    </View>
  );
}
