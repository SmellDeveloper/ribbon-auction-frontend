import React, { ReactNode, useCallback, useRef } from "react";
import styled from "styled-components";
import theme from "../../design/theme";

const InternalButtonLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

const StyledButton = styled.button`
  font-family: VCR;
  font-size: 20px; 
  color: #FFFFFF;
  background-color: #424242;
  border-radius: 5px;
  border: none;
  padding: 9px 20px 10px 20px;
  line-height: 20px;
  vertical-align: text-top;
  &:hover {
    opacity: ${theme.hover.opacity};
  }
`

export const ActionButton: React.FC<{
    link: string
    children: string
  }> = ({
    link = "",
    children,
  }) => {
    const hasLink = link !== "";
    const linkRef = useRef<HTMLAnchorElement | null>(null);
  
    return (
      <StyledButton>
        {hasLink ? (
          <InternalButtonLink
            ref={linkRef}
            href={link}
            target="_blank"
            rel="noreferrer noopener"
          >
            {children}
          </InternalButtonLink>
        ) : (
          children
        )}
      </StyledButton>
    );
  };