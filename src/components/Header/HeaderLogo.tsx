import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../assets/icons/logo";

const LogoDescription = styled.div`
  font-family: VCR, sans-serif;
  font-size: 30px;
  padding-left: 25px;
`;

const LogoContainer = styled.div`
  display: flex;
  border-radius: 48px;
  justify-content: center;
  align-items: center;
`;

const InternalButtonLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

const HeaderLogo = () => {
  return (
    <>
      <LogoContainer>
        <InternalButtonLink href="/">
          <Logo height="60px" width="60px" />
          <LogoDescription>RIBBON AUCTION</LogoDescription>
        </InternalButtonLink>
      </LogoContainer>
    </>
  );
};

export default HeaderLogo;
