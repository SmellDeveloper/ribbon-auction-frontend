import React from "react";
import useEagerConnect from "../hooks/useEagerConnect";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import Header from "./Header/Header";
import { Container } from "react-bootstrap";
import Homepage from "../pages/Home/Homepage";
import AuctionPage from "../pages/Auction/AuctionPage";
import ConcludedPage from "../pages/Auction/ConcludedPage";
// import DepositPage from "../pages/DepositPage/DepositPage";
// import useEagerConnect from "../hooks/useEagerConnect";
// import PortfolioPage from "../pages/Portfolio/PortfolioPage";
// import Footer from "./Footer/Footer";
import useScreenSize from "../hooks/useScreenSize";
// import { TxStatusToast, WithdrawReminderToast } from "./Common/toasts";
import WalletConnectModal from "../components/Wallet/WalletConnectModal";
import NotFound from "../pages/NotFound";
import colors from "../design/colors";
// import YourPositionModal from "./Vault/Modal/YourPositionModal";

const Root = styled(Container)<{ screenHeight: number}>`
  background-color: ${colors.background.one};
  min-height: ${(props) =>
    props.screenHeight ? `${props.screenHeight}px` : `100vh`};
`;

const RootApp = () => {
  useEagerConnect();
  const { height: screenHeight } = useScreenSize();

  return (
    <Root id="appRoot" screenHeight={screenHeight}>
      <WalletConnectModal />
      {/* <YourPositionModal />
      <WithdrawReminderToast /> */}

      <Router>
        <Header />
        {/* <TxStatusToast /> */}
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/auction/:auctionTitle">
            <AuctionPage />
          </Route>
          {/* <Route path="/portfolio">
            <PortfolioPage />
          </Route>
          */}
          <Route>
            <NotFound />
          </Route> 
        </Switch>
        {/* <Footer /> */}
      </Router>
    </Root>
  );
};

export default RootApp;
