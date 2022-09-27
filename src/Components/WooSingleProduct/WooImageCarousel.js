import React from "react";
import { Image } from "react-native";
import { useSingleProduct } from "../../Hook";
import { Carousel } from "../Carousel";

export const WooImageCarousel = (props) => {
  const { images } = useSingleProduct();
  const { carouselWidth, carouselHeight, style, children, dot, ...restProps } =
    props;

  return (
    <Carousel
      style={{ padding: 0, width: carouselWidth, height: carouselHeight }}
      dot={images?.length > 1 ? dot : false}
      {...restProps}
    >
      {!!images?.length &&
        images.map(({ src }, index) => {
          return <Image key={index} source={{ uri: src }} style={style} />;
        })}
    </Carousel>
  );
};
