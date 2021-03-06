import { Web3Provider } from "@ethersproject/providers";

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider, "any");
  library.pollingInterval = 5000;
  return library;
}
