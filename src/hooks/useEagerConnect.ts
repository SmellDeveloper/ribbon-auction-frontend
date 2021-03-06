import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injectedConnector } from "../utils/connectors";

const useEagerConnect = () => {
  const { activate, active, account } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    if(tried) {
      return
    }

    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injectedConnector, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate, tried]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active, activate, account]);

  return tried;
};
export default useEagerConnect;
