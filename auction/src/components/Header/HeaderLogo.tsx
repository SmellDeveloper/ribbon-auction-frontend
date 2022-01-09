import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Logo from "../../assets/icons/logo";

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
`;

const HeaderLogo = () => {
  return (
    <>
      <LogoContainer>
        <Link to="/">
          <Logo height="60px" width="60px" />
        </Link>
      </LogoContainer>
    </>
  );
};

export default HeaderLogo;
