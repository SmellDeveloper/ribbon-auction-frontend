import { useState } from "react";
import styled from "styled-components";
import { useRouteMatch } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import HeaderLogo from "./HeaderLogo";
import colors from "../../design/colors";
import sizes from "../../design/sizes";
import { Title, BaseLink } from "../../design";
import MenuButton from "../Common/MenuButton";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import AccountStatus from "../Wallet/AccountStatus";
import theme from "../../design/theme";
import MobileOverlayMenu from "../Common/MobileOverlayMenu";
import NetworkSwitcherButton from "../NetworkSwitcher/NetworkSwitcherButton";
// import NotificationButton from "../Notification/NotificationButton";
import { AnimatePresence, motion } from "framer";
import {
  WETHLogo,
  WAVAXLogo
} from "../../assets/icons/tokens"

const HeaderContainer = styled.div<MobileMenuOpenProps>`
  height: ${theme.header.height}px;
  top: 0;
  // border-bottom: 1px solid ${colors.border};

  z-index: -1000;

  @media (max-width: ${sizes.lg}px) {
    padding: 16px 24px;
    border-bottom: none;
  }
`;

const LogoContainer = styled.div`

  @media (max-width: ${sizes.lg}px) {
    padding-left: 0;
  }
`;

const LogoDescription = styled.div`
  font-family: VCR, sans-serif;
  font-size: 30px;
  padding-left: 25px;
`;

const HeaderButtonContainer = styled.div`
  display: flex;
  margin-right: 8px;
  margin-left: auto;
`;

const HeaderAbsoluteContainer = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
`;

const LinksContainer = styled.div`
  display: flex;
`;

const NavItem = styled.div<NavItemProps>`
  display: flex;
  align-items: center;
  padding: 0px 28px;
  height: 100%;
  opacity: ${(props) => (props.isSelected ? "1" : "0.48")};

  &:hover {
    opacity: ${(props) => (props.isSelected ? theme.hover.opacity : "1")};
  }

  @media (max-width: ${sizes.lg}px) {
    padding: 0px 0px 40px 48px;
  }
`;

const NavLinkText = styled(Title)`
  letter-spacing: 1.5px;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.lg}px) {
    font-size: 24px;
  }
`;

const SecondaryMobileNavItem = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
    padding: 0px 0px 24px 48px;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${sizes.lg}px) {
    display: flex;
  }
`;

const WalletButton = styled.button`
  font-family: VCR;
  font-size: 15px;
  width: 200px;
  color: #FFFFFF;
  background-color: #424242;
  border-radius: 5px;
  border: none;
  padding: 9px 20px 10px 20px;
  line-height: 20px;
  vertical-align: text-top;
  height: 40px;
`

const ChainButton = styled.button`
  height: 40px;
  width: 40px;
  background-color: #FFFFFF;
  border-radius: 5px;
  border: solid 2px #424242;
`
const ChainContainer = styled.div`
  margin-right: 10px;
  margin-left: auto;
  position: relative;
  display: inline-block;
`

const ChainModal = styled.div`
  font-family: VCR;
  position: absolute;
  width: 200px;
  color: #FFFFFF;
  background-color: #424242;
  border-radius: 5px;
  padding: 10px 10px 0px 10px;
  margin-top: 10px;
`

const ChainSelectorButton = styled.div`
  font-family: VCR;
  display: flex;
  height: 40px;
  color: #424242;
  background-color: #FFFFFF;
  border-radius: 5px;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
`

const IndicatorContainer = styled.div`
  margin-left: auto;
  margin-right: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #00FF47;
`

const ChainText = styled.div`
  margin-left: 10px;
`

const Header = () => {
  const { active } = useWeb3React();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const product = useRouteMatch({ path: "/", exact: true });
  const portfolio = useRouteMatch({ path: "/portfolio", exact: true });
  const treasury = useRouteMatch({ path: "/treasury", exact: false });

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderLinkItem = (
    title: string,
    to: string,
    isSelected: boolean,
    primary: boolean = true,
    external: boolean = false
  ) => {
    return (
      <BaseLink
        to={to}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        onClick={() => {
          if (!external) setIsMenuOpen(false);
        }}
      >
        {primary ? (
          <NavItem isSelected={isSelected}>
            <NavLinkText>{title}</NavLinkText>
          </NavItem>
        ) : (
          <SecondaryMobileNavItem>
            <Title fontSize={18} color={`${colors.primaryText}7A`}>
              {title}
            </Title>
          </SecondaryMobileNavItem>
        )}
      </BaseLink>
    );
  };

  return (
    <HeaderContainer
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center"
    >
      {/* LOGO */}
      <LogoContainer>
        <HeaderLogo />
      </LogoContainer>
      <LogoDescription>
        RIBBON AUCTION
      </LogoDescription>

      
      {/* <ChainContainer>
      <ChainButton>
        <WETHLogo height="25px" width="25px"></WETHLogo>
      </ChainButton>
      <ChainModal>
        <ChainSelectorButton><WETHLogo height="25px" width="25px"></WETHLogo><ChainText>ETHEREUM</ChainText><IndicatorContainer></IndicatorContainer></ChainSelectorButton>
        <ChainSelectorButton><WAVAXLogo height="25px" width="25px"></WAVAXLogo><ChainText>AVALANCHE</ChainText></ChainSelectorButton>
      </ChainModal>
      </ChainContainer> */}
      <HeaderButtonContainer>
          <NetworkSwitcherButton />
      </HeaderButtonContainer>
      
      <AccountStatus variant="desktop" />
      
      

      {/* MOBILE MENU */}
      <MobileOnly>
        <MenuButton onToggle={onToggleMenu} isOpen={isMenuOpen} />
        <MobileOverlayMenu
          className="flex-column align-items-center justify-content-center"
          isMenuOpen={isMenuOpen}
          onClick={onToggleMenu}
          boundingDivProps={{
            style: {
              marginRight: "auto",
            },
          }}
        >
          {renderLinkItem(
            "TREASURY",
            "/",
            Boolean(useRouteMatch({ path: "/", exact: true }))
          )}
          {renderLinkItem(
            "PORTFOLIO",
            "/portfolio",
            Boolean(useRouteMatch({ path: "/portfolio", exact: true }))
          )}
          {renderLinkItem(
            "DISCORD",
            "http://tiny.cc/ribbon-discord",
            false,
            false,
            true
          )}
          {renderLinkItem(
            "TWITTER",
            "https://twitter.com/ribbonfinance",
            false,
            false,
            true
          )}
          {renderLinkItem(
            "GITHUB",
            "https://github.com/ribbon-finance",
            false,
            false,
            true
          )}
          {renderLinkItem(
            "FAQS",
            "https://ribbon.finance/faq",
            false,
            false,
            true
          )}
          {renderLinkItem(
            "BLOG",
            "https://medium.com/@ribbonfinance",
            false,
            false,
            true
          )}
          {renderLinkItem(
            "TERMS",
            "https://ribbon.finance/terms",
            false,
            false,
            true
          )}
          {renderLinkItem(
            "POLICY",
            "https://ribbon.finance/policy",
            false,
            false,
            true
          )}
        </MobileOverlayMenu>
      </MobileOnly>
    </HeaderContainer>
  );
};

export default Header;
