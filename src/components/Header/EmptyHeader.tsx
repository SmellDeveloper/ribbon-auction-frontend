import React from "react";
import styled, { keyframes } from "styled-components";

import Logo from "../../assets/icons/logo";
import { Title } from "../../design";
import sizes from "../../design/sizes";
import theme from "../../design/theme";
import useScreenSize from "../../hooks/useScreenSize";

const FloatingContainer = styled.div<{ height: number }>`
  width: 100%;
  height: calc(
    ${(props) => (props.height ? `${props.height}px` : `100vh`)} -
      ${theme.header.height + theme.footer.desktop.height * 2}px
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;

const rotate = keyframes`
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
`;

const RotatingLogo = styled(Logo)`
  margin-right: 32px;
  animation: ${rotate} 2.5s linear infinite;

  @media (max-width: ${sizes.md}px) {
    margin-right: unset;
    margin-bottom: 32px;
  }
`;

const LogoContainer = styled.div`
  display: block
`

const NotAvailable = () => {
  const { height } = useScreenSize();
  return (
    <FloatingContainer height={height}>

      <LogoContainer><RotatingLogo height={120} width={120} /></LogoContainer>
      <Title fontSize={20} lineHeight={30}>
        Ribbon Auction is currently only available on larger screens
      </Title>
    </FloatingContainer>
  );
};

export default NotAvailable;
