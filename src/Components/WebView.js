import { Spinner } from "@ui-kitten/components";
import React, { useState } from "react";
import { View, Platform } from "react-native";
import { WebView as NativeWebView } from "react-native-webview";

export const WebView = ({ url, ...props }) => {
  const [tryCount, setTryCount] = useState(0);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {Platform.OS === "android" ? (
        <NativeWebView
          startInLoadingState={true}
          key={tryCount}
          source={{ uri: url }}
          scalesPageToFit={false}
          onError={() => setTryCount((count) => count++)}
          renderLoading={Spinner}
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
    </View>
  );
};
