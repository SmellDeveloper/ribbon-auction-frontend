import { isProduction } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = undefined //"0x3396c5ade0266f1bd93911f9acb9413333a735da";

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = !isProduction()
  ? addressToImpersonate
  : undefined;
