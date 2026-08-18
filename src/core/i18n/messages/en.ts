import common from "./en/common.json";
import home from "./en/home.json";
import capabilities from "./en/capabilities.json";
import industries from "./en/industries.json";
import solutions from "./en/solutions.json";
import technology from "./en/technology.json";
import company from "./en/company.json";
import legal from "./en/legal.json";
import resources from "./en/resources.json";
import customers from "./en/customers.json";
import requestDemo from "./en/request-demo.json";
import salesverse from "./en/products/salesverse.json";
import brokerverse from "./en/products/brokerverse.json";
import agentverse from "./en/products/agentverse.json";
import customerverse from "./en/products/customerverse.json";
import merchantverse from "./en/products/merchantverse.json";
import claimverse from "./en/products/claimverse.json";

/**
 * The English bundle, assembled from per-area files.
 *
 * This is the single source of truth for message *shape*: `types/global.d.ts`
 * derives `IntlMessages` from it, so a key that is not reachable from here does
 * not exist as far as TypeScript is concerned.
 *
 * It is split because the site's content spans roughly sixty pages; one file
 * would be unreadable. `common.json` holds everything shared across pages (nav,
 * footer, CTAs, forms); each page area gets its own file and is nested under a
 * namespace here so `getTranslations({ namespace: "products.salesverse" })`
 * resolves.
 *
 * Add a new area by importing its JSON and nesting it below — nothing else in
 * the i18n layer needs to change.
 */
const messages = {
  ...common,
  home,
  // Key order matches PRODUCTS in site.config.ts.
  products: { salesverse, brokerverse, agentverse, customerverse, merchantverse, claimverse },
  solutions,
  industries,
  capabilities,
  technology,
  company,
  legal,
  resources,
  customers,
  // Namespace matches the URL segment, so the route reads `"request-demo"`.
  "request-demo": requestDemo,
};

export default messages;
