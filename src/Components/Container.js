import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Layout } from "@ui-kitten/components";
import { useItem, usePostContent } from "../Hook";
import { useNavigation } from "@react-navigation/native";

const TouchableContainer = ({ style, navigateTo, children, ...restProps }) => {
  const navigation = useNavigation();
  const item = useItem();
  const handleOnPress = () => {
    if (navigateTo) {
      if (item) {
        navigation.push(navigateTo, { item });
      } else {
        navigation.push(navigateTo);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={style} {...restProps}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ScrollViewWrapper = ({ children, ...props }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      {...props}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
};

export const Container = ({ children, onPressAction, ...props }) => {
  const dynamicBackgroundColor = usePostContent(
    props.style?.dynamicBackgroundColor
  );

  const { style, ...restProps } = props;
  const custStyle = { ...style };
  if (dynamicBackgroundColor) {
    custStyle.backgroundColor = dynamicBackgroundColor;
    delete custStyle.dynamicBackgroundColor;
  }

  if (Array.isArray(onPressAction) && onPressAction.length) {
    return (
      <TouchableContainer
        style={custStyle}
        onPressAction={onPressAction}
        {...restProps}
      >
        {children}
      </TouchableContainer>
    );
  }

  const isHorizontal = style?.flexDirection === "row";

  if (props.scrollable) {
    return (
      <Layout style={custStyle} {...restProps}>
        <ScrollView
          horizontal={isHorizontal}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {children}
        </ScrollView>
      </Layout>
    );
  }

  return (
    <Layout style={custStyle} {...restProps}>
      {children}
    </Layout>
  );
};
