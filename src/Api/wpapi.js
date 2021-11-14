import WPAPI from "wpapi";
import { config } from "../../config";

export const wpapi = new WPAPI({
  endpoint: config.baseUrl + "/wp-json",
  username: "admin",
  password: "123456",
});

//wpapi.product = wpapi.registerRoute( 'wp/v2', '/product/(?P<id>\\d+)' );
