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
  const navigation = useNavigation();
  const [isThankYouPage, setIsThankYouPage] = React.useState(false);
  const { getItem, setItem } = useAsyncStorage("userOrders");
  const { resetCart } = useCart();

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

  const handleThankYouPage = React.useCallback(() => {
    setIsThankYouPage(true);
  }, []);

  const updateCartOrderData = React.useCallback(async (orderId) => {
    const item = await getItem();
    const orders = JSON.parse(item);
    if (!orders || orders.indexOf(orderId) === -1) {
      const newOrders = orders ? [...orders, orderId] : [orders];
      await setItem(JSON.stringify(newOrders));
    }
    resetCart();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "android" ? (
        <MemoizedWebView
          checkoutUrl={checkoutUrl}
          onThankYouPage={handleThankYouPage}
          onUpdateOrder={updateCartOrderData}
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

const MemoizedWebView = React.memo(function WebViewComponent({
  checkoutUrl,
  onThankYouPage,
  onUpdateOrder,
}) {
  const {
    cart: { items },
  } = useCart();

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

  const urlRef = React.useRef(url);

  const handleMessage = (event) => {
    const orderId = event.nativeEvent.data;
    onUpdateOrder(orderId);
  };

  const handleNavigationChange = ({ url }) => {
    if (url?.includes("order-received")) {
      urlRef.current = url;
      onThankYouPage();
    }
  };

  return (
    <WebView
      source={{ uri: urlRef.current }}
      scalesPageToFit={false}
      onMessage={handleMessage}
      startInLoadingState={true}
      onNavigationStateChange={handleNavigationChange}
      renderLoading={() => <LoadingSpinner />}
    />
  );
});

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
