import React from "react";
import { View } from "react-native";
import { BillingTab } from "./NativeCheckout/BillingTab";
import { ShippingTab } from "./NativeCheckout/ShippingTab";

export const NativeCheckout = ({
  style,
  fields,
  checkoutUrl,
  placeOrderTitle,
}) => {
  return (
    <View style={style}>
      <BillingTab fields={fields} />
      <ShippingTab
        checkoutUrl={checkoutUrl}
        placeOrderTitle={placeOrderTitle}
      />
    </View>
  );
};
