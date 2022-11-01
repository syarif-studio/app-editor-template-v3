import React from "react";
import useSWR from "swr";
import { PostTypeProvider } from "../PostTypeContext";
import { wooapi } from "../../Api";
import { useItem } from "../PostContent";

async function fetchProduct(query) {
  if (query?.related) {
    delete query.related;
    query = { ...query, category: product.categories?.[0]?.id };
  }

  //remove query with false value
  Object.keys(query).forEach((key) => {
    if (query[key] === false) {
      delete query[key];
    }
  });
  const response = await wooapi.get("products", query);
  return response?.data;
}

async function fetchData(json) {
  const param = JSON.parse(json);
  let { postType, ...query } = param;

  let products = [];
  if (query?.bestSeller) {
    let response = await wooapi.get("reports/top_sellers", { period: "year" });
    let { bestSeller, ...bestSellerQuery } = query;
    if (response?.data?.length) {
      const include = response?.data?.map((item) => item.product_id).join();
      bestSellerQuery = { ...bestSellerQuery, include };
    }
    products = await fetchProduct(bestSellerQuery);
  } else {
    products = await fetchProduct(query);
  }

  return products;
}

function useGetProductData(query = {}) {
  const product = useItem();
  if (query?.related) {
    delete query.related;
    query = { ...query, category: product.categories?.[0]?.id };
  }

  const json = JSON.stringify({ postType: "product", ...query });
  const { data, isValidating } = useSWR(json, fetchData);
  return { data, isLoading: isValidating };
}

function ProductRoot({ children }) {
  return <PostTypeProvider value="product">{children}</PostTypeProvider>;
}

export { ProductRoot, useGetProductData };
