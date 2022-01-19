import { isStaging } from "./env";

/**
 * Only change this line
 */
const addressToImpersonate = process.env.REACT_APP_IMPERSONATE || undefined

/**
 * Do not change this line
 * This ensure only development get impersonate account
 */
export const impersonateAddress: string | undefined = isStaging()
  ? addressToImpersonate
  : undefined;
