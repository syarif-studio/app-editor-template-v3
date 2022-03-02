import WPAPI from "wpapi";
import { config } from "../../config";

export const wpapi = new WPAPI({
  endpoint: config.baseUrl + "/wp-json",
});
