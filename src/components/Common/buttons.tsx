import React, { ReactNode, useCallback, useRef } from "react";
import styled from "styled-components";
import colors from "../../design/colors";
import theme from "../../design/theme";

const InternalButtonLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

export const Button = styled.button`
  font-family: VCR, sans-serif;
  width: 100%;
  border-radius: 4px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  outline: none;

  &:active,
  &:focus {
    outline: none;
    box-shadow: none;
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

export const LinkButton: React.FC<{
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

  interface ActionButtonProps {
    className?: string;
    disabled?: boolean;
    link?: string;
    onClick?: () => void;
    color?: string;
    error?: boolean;
    children: ReactNode;
    variant?: "primary" | "secondary";
  }


export const BaseActionButton = styled(Button)<{
  error?: boolean;
  color?: string;
  variant: "primary" | "secondary";
}>`
  ${(props) => {
    if (props.error) {
      return `
        background: ${colors.red}14;
        color: ${colors.red};
        
        && {
          opacity: 1;
        }

        &:hover {
          background: ${colors.red}14;
          color: ${colors.red};
        }
      `;
    }

    switch (props.variant) {
      case "primary":
        return props.color
          ? `
            background: ${props.color}14;
            color: ${props.color};
            box-shadow: 8px 16px 64px ${props.color}14;
    
            &:hover {
              background: ${props.color}${props.disabled ? 14 : 29};
              color: ${props.color};
            }
          `
          : `
            background: ${colors.buttons.primary}${props.disabled ? 29 : ""};
            color: ${colors.primaryText};
    
            &:hover {
              color: ${colors.primaryText};
            }
          `;
      case "secondary":
        return props.color
          ? `
            color: ${props.color};
            border: 1px solid ${props.color};
            border-radius: ${theme.border.radiusSmall}; 
          `
          : `
            color: ${colors.primaryText};
            border: 1px solid ${colors.primaryText};
            border-radius: ${theme.border.radiusSmall}; 

            &:hover {
              color: ${colors.primaryText};
              opacity: ${theme.hover.opacity};
            }
          `;
    }
  }}
`;
  
  export const ActionButton: React.FC<ActionButtonProps> = ({
    onClick = () => {},
    link = "",
    className = "",
    children,
    color,
    error,
    disabled = false,
    variant = "primary",
  }) => {
    const hasLink = link !== "";
    const linkRef = useRef<HTMLAnchorElement | null>(null);
  
    const openLink = useCallback(() => {
      if (linkRef !== null && linkRef.current !== null) {
        linkRef.current.click();
      }
    }, []);
  
    const handleClick = hasLink ? openLink : onClick;
  
    return (
      <BaseActionButton
        disabled={disabled}
        onClick={handleClick}
        type="button"
        color={color}
        error={error}
        className={`btn ${className}`}
        variant={variant}
      >
        {link !== "" ? (
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
      </BaseActionButton>
    );
  };