import React from "react";
import { View, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useCart } from "../Hook";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Spinner, Button } from "@ui-kitten/components";
import { StackActions, useNavigation } from "@react-navigation/native";
import { config } from "../../config";

const pages = config.pages;

export const WebViewCheckout = ({ checkoutUrl, goToHomeTitle, ...props }) => {
  const {
    cart: { items },
    resetCart,
  } = useCart();

  const navigation = useNavigation();

  const { getItem, setItem } = useAsyncStorage("userOrders");
  const [orders, setOrders] = React.useState([]);
  const [isThankYouPage, setIsThankYouPage] = React.useState(false);

  let url =
    checkoutUrl.replace(/\/$/, "") +
    "/?mobile-app-view=checkout&app-add-to-cart=";

  items.forEach((item, index) => {
    if (item?.id) {
      const id = item?.variation ? `${item.id}-${item.variation}` : item.id;
      if (index === items?.length - 1) {
        url += `${id}:${item?.qty}`;
      } else {
        url += `${id}:${item?.qty},`;
      }
    }
  });

  const readItemFromStorage = React.useCallback(async () => {
    const item = await getItem();
    const items = JSON.parse(item);
    setOrders(items || []);
  }, []);

  const writeItemToStorage = async (newValue) => {
    await setItem(JSON.stringify(newValue));
    setOrders(newValue);
  };

  React.useEffect(() => {
    readItemFromStorage();
  }, [readItemFromStorage]);

  const handleMessage = (event) => {
    const order_id = event.nativeEvent.data;
    if (orders.indexOf(order_id) === -1) {
      writeItemToStorage([...orders, order_id]);
      resetCart();
    }
  };

  const handleNavigationChange = ({ url }) => {
    if (url?.includes("order-received")) {
      setIsThankYouPage(true);
    }
  };

  const handleGoHome = () => {
    setIsThankYouPage(false);
    const firstBottomNav = pages?.find((page) => page?.addToBottomNav);
    if (firstBottomNav?.slug) {
      navigation.navigate("BottomTab", {
        screen: `tab-${firstBottomNav.slug}`,
      });
    } else {
      navigation.dispatch(StackActions.popToTop());
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "android" ? (
        <WebView
          source={{ uri: url }}
          scalesPageToFit={false}
          onMessage={handleMessage}
          startInLoadingState={true}
          onNavigationStateChange={handleNavigationChange}
          renderLoading={() => <LoadingSpinner />}
        />
      ) : (
        <iframe
          id="checkout"
          title="Checkout"
          type="text/html"
          width={props.style?.width}
          height={props.style?.height}
          src={url}
          frameBorder={0}
        />
      )}
      {isThankYouPage ? (
        <Button
          style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}
          onPress={handleGoHome}
        >
          {goToHomeTitle ?? "Continue Shopping"}
        </Button>
      ) : null}
    </View>
  );
};

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
