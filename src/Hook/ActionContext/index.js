import React from "react";
import { useCart } from "../Cart";
import { useForm } from "../Form";
import { useItem } from "../PostContent";
import { useNavigation } from "@react-navigation/native";
import { config } from "../../../config";

const ActionContext = React.createContext();

function ActionProvider({ value, children }) {
  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
}

const pages = config.pages;

function useAction({ navigateTo = "" }) {
  const navigation = useNavigation();
  const form = useForm();
  const item = useItem();
  const { addCart, addQty, reduceQty } = useCart();

  const handleAction = (action) => {
    switch (action) {
      case "navigate":
        if (navigateTo) {
          const isBottomNavPage = pages?.find(
            (item) => item.slug === navigateTo
          )?.addToBottomNav;

          if (item) {
            if (isBottomNavPage) {
              navigation.navigate("BottomTab", {
                screen: `tab-${navigateTo}`,
                item,
              });
            } else {
              navigation.push(navigateTo, { item });
            }
          } else {
            if (isBottomNavPage) {
              navigation.navigate("BottomTab", { screen: `tab-${navigateTo}` });
            } else {
              navigation.push(navigateTo);
            }
          }
        }
        break;

      case "goBack":
        navigation.goBack();
        break;

      case "addToCart":
        addCart(item, 1);
        break;

      case "addQty":
        addQty(item?.id);
        break;

      case "reduceQty":
        reduceQty(item?.id);
        break;

      case "submit":
        if (form) form.handleSubmit();
        break;

      default:
        break;
    }
  };

  return handleAction;
}

export { ActionProvider, useAction };
