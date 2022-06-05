import React, { useState } from "react";
import { Platform, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useCartReset } from "../Hook";
import { Spinner } from "@ui-kitten/components";

export default function WooPayOrder({ route }) {
  const resetCart = useCartReset();
  const { getItem, setItem } = useAsyncStorage("userOrders");
  const [tryCount, setTryCount] = useState(0);

  const url = route?.params?.url;

  const updateOrders = async (orderId) => {
    const item = await getItem();
    const orders = JSON.parse(item);
    if (!orders || orders.indexOf(orderId) === -1) {
      const newOrders = orders ? [...orders, orderId] : [orders];
      await setItem(JSON.stringify(newOrders));
    }
  };

  const handleMessage = (event) => {
    const orderId = event.nativeEvent.data;
    resetCart();
    updateOrders(orderId);
  };

  console.log({ url });

  return Platform.OS === "android" ? (
    <WebView
      key={tryCount}
      startInLoadingState={true}
      renderLoading={() => <LoadingSpinner />}
      source={{ uri: url }}
      scalesPageToFit={false}
      onMessage={handleMessage}
      onError={() => setTryCount((count) => (count < 3 ? count + 1 : count))}
    />
  ) : (
    <iframe title="Checkout" src={url} height="100%" width="100%" />
  );
}

function LoadingSpinner() {
  return (
    <View
      style={{
        position: "absolute",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Spinner size="large" />
    </View>
  );
}
