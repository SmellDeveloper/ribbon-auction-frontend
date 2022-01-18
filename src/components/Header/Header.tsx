import React, { useState } from "react";
import styled from "styled-components";

import HeaderLogo from "./HeaderLogo";
import colors from "../../design/colors";
import sizes from "../../design/sizes";
import AccountStatus from "../Wallet/AccountStatus";
import theme from "../../design/theme";
import NetworkSwitcherButton from "../NetworkSwitcher/NetworkSwitcherButton";

export interface NavItemProps {
  isSelected: boolean;
}

export interface MobileMenuOpenProps {
  isMenuOpen: boolean;
}


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

const HeaderButtonContainer = styled.div`
  display: flex;
  margin-right: 8px;
  margin-left: auto;
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeaderContainer
      isMenuOpen={isMenuOpen}
      className="d-flex align-items-center"
    >
      {/* LOGO */}
      <LogoContainer>
        <HeaderLogo />
      </LogoContainer>

      <HeaderButtonContainer>
          <NetworkSwitcherButton />
      </HeaderButtonContainer>
      
      <AccountStatus variant="desktop" />
      
    </HeaderContainer>
  );
};

export default Header;
