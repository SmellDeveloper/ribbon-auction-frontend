import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { setTimeout } from "timers";
import { AnimatePresence, motion } from "framer";

import Indicator from "../../components/Indicator/Indicator";
import sizes from "../../design/sizes";
import { Title, BaseButton } from "../../design";
import colors from "../../design/colors";
import {
  WalletStatusProps,
  AccountStatusVariantProps,
  WalletButtonProps,
  MenuStateProps,
  WalletCopyIconProps,
} from "./types";
import theme from "../../design/theme";
import MobileOverlayMenu from "../../components/Common/MobileOverlayMenu";
import MenuButton from "../../components/Common/MenuButton";
import { copyTextToClipboard } from "../../utils/text";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { ActionButton } from "../../components/Common/buttons";
import useConnectWalletModal from "../../hooks/useConnectWalletModal";
import ButtonArrow from "../../components/Common/ButtonArrow";
import {
  BLOCKCHAIN_EXPLORER_NAME,
  BLOCKCHAIN_EXPLORER_URI,
} from "../../constants/constants";
import { truncateAddress } from "../../utils/address";

const walletButtonMarginLeft = 5;
const walletButtonWidth = 55;
const investButtonWidth = 30;
const investButtonMarginLeft =
  100 - walletButtonMarginLeft * 2 - walletButtonWidth - investButtonWidth;

const AccountStatusContainer = styled.div<AccountStatusVariantProps>`
  flex-wrap: wrap;
  flex-direction: column;

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
          display: none;

          @media (max-width: ${sizes.md}px) {
            display: flex;
            width: 100%;
          }
        `;
      case "desktop":
        return `
          display: flex;
        `;
    }
  }}
`;

const WalletContainer = styled.div<AccountStatusVariantProps>`
  justify-content: center;
  align-items: center;

  ${(props) => {
    switch (props.variant) {
      case "desktop":
        return `
        display: flex;
        z-index: 1000;
        position: relative;

        @media (max-width: ${sizes.md}px) {
          display: none;
        }
        `;
      case "mobile":
        return `
          display: none;

          @media (max-width: ${sizes.md}px) {
            display: flex;
            align-items: unset;
            padding-top: 16px;
            width: 100%;
          }
        `;
    }
  }}
`;

const WalletButton = styled(BaseButton)<WalletButtonProps>`
  background-color: #424242;
  justify-content: center;
  align-items: center;
  height: fit-content;
  width: 200px;
  height: 40px;
  border-radius: 5px;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
        height: 48px;
        justify-content: center;
        padding: 14px 16px;
        width: ${props.showInvestButton ? `${walletButtonWidth}%` : "90%"};
      `;
      case "desktop":
        return ``;
    }
  }}
`;

const WalletButtonText = styled(Title)<WalletStatusProps>`
  font-size: 15px;

  @media (max-width: ${sizes.md}px) {
    font-size: 16px;
  }

  @media (max-width: 350px) {
    font-size: 13px;
  }

  color: #FFFFFF;
`;

const InvestButton = styled(ActionButton)`
  margin-left: ${investButtonMarginLeft}%;
  width: ${investButtonWidth}%;
  height: 48px;
  border-radius: ${theme.border.radius};
`;

const WalletDesktopMenu = styled(motion.div)<MenuStateProps>`
  ${(props) =>
    props.isMenuOpen
      ? `
          position: absolute;
          right: 40px;
          top: 64px;
          width: fit-content;
          background-color: ${colors.background.two};
          border-radius: ${theme.border.radius};
        `
      : `
          display: none;
        `}

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const WalletMobileOverlayMenu = styled(
  MobileOverlayMenu
)<AccountStatusVariantProps>`
  display: none;

  ${(props) => {
    switch (props.variant) {
      case "mobile":
        return `
          @media (max-width: ${sizes.md}px) {
            display: flex;
            z-index: ${props.isMenuOpen ? 50 : -1};
          }
        `;
      case "desktop":
        return ``;
    }
  }}
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  padding-right: 38px;
  opacity: 1;
  display: flex;
  align-items: center;

  &:first-child {
    padding-top: 16px;
  }

  &:last-child {
    padding-bottom: 16px;
  }

  &:hover {
    span {
      color: ${colors.primaryText};
    }
  }

  @media (max-width: ${sizes.md}px) {
    margin: unset;
    && {
      padding: 28px;
    }
  }
`;

const MenuItemText = styled(Title)`
  color: ${colors.primaryText}A3;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;

  @media (max-width: ${sizes.md}px) {
    font-size: 24px;
  }
`;

const WalletCopyIcon = styled.i<WalletCopyIconProps>`
  color: white;
  margin-left: 8px;
  transition: 0.1s all ease-out;

  ${(props) => {
    switch (props.state) {
      case "visible":
        return `
          opacity: 1;
        `;
      case "hiding":
        return `
          opacity: 0;
        `;
      case "hidden":
        return `
          visibility: hidden;
          height: 0;
          width: 0;
          opacity: 0;
        `;
    }
  }}
`;

const MenuCloseItem = styled(MenuItem)`
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

interface AccountStatusProps {
  variant: "desktop" | "mobile";
  showVaultPositionHook?: (show: boolean) => void;
}

const AccountStatus: React.FC<AccountStatusProps> = ({
  variant,
  showVaultPositionHook,
}) => {
  const {
    connector,
    library,
    active,
    account,
    chainId,
  } = useWeb3React();
  const [, setShowConnectModal] = useConnectWalletModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copyState, setCopyState] = useState<"visible" | "hiding" | "hidden">(
    "hidden"
  );
  console.log(connector)

  // Track clicked area outside of desktop menu
  const desktopMenuRef = useRef(null);
  useOutsideAlerter(desktopMenuRef, () => {
    if (variant === "desktop" && isMenuOpen) onCloseMenu();
  });

  useEffect(() => {
    let timer;

    switch (copyState) {
      case "visible":
        timer = setTimeout(() => {
          setCopyState("hiding");
        }, 800);
        break;
      case "hiding":
        timer = setTimeout(() => {
          setCopyState("hidden");
        }, 200);
    }

    if (timer) clearTimeout(timer);
  }, [copyState]);

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  const handleButtonClick = useCallback(async () => {
    setShowConnectModal(true);
  }, [active, onToggleMenu, setShowConnectModal]);

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleChangeWallet = useCallback(() => {
    setShowConnectModal(true);
    onCloseMenu();
  }, [onCloseMenu, setShowConnectModal]);

  const handleCopyAddress = useCallback(() => {
    if (account) {
      copyTextToClipboard(account);
      setCopyState("visible");
    }
  }, [account]);

  const handleOpenEtherscan = useCallback(() => {
    if (account && chainId) {
      window.open(`${BLOCKCHAIN_EXPLORER_URI[chainId]}/address/${account}`);
    }
  }, [account, chainId]);

  // const handleDisconnect = useCallback(async () => {
  //   if (connector instanceof WalletConnectConnector) {
  //     connector.close();
  //   }
  //   deactivateWeb3();
  //   onCloseMenu();
  // }, [deactivateWeb3, onCloseMenu, connector]);

  const renderButtonContent = () =>
    active && account ? (
      <>
        <Indicator connected={active} />
        <WalletButtonText connected={active}>
          {truncateAddress(account)}{" "}
          <ButtonArrow isOpen={isMenuOpen} />
        </WalletButtonText>
      </>
    ) : (
      <WalletButtonText connected={active}>CONNECT WALLET</WalletButtonText>
    );

  const renderMenuItem = (
    title: string,
    onClick?: () => void,
    extra?: React.ReactNode
  ) => {
    return (
      <MenuItem onClick={onClick} role="button">
        <MenuItemText>{title}</MenuItemText>
        {extra}
      </MenuItem>
    );
  };

  const renderCopiedButton = () => {
    return <WalletCopyIcon className="far fa-clone" state={copyState} />;
  };

  return (
    <AccountStatusContainer variant={variant}>
      {/* Main Button and Desktop Menu */}
      <WalletContainer variant={variant} ref={desktopMenuRef}>
        <WalletButton
          variant={variant}
          showInvestButton={false}
          connected={active}
          role="button"
          onClick={handleButtonClick}
        >
          {renderButtonContent()}
        </WalletButton>
        {/* <AnimatePresence>
          <WalletDesktopMenu
            key={isMenuOpen.toString()}
            isMenuOpen={isMenuOpen}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 20,
            }}
            transition={{
              type: "keyframes",
              duration: 0.2,
            }}
          >
            {renderMenuItem("CHANGE WALLET", handleChangeWallet)}
            {renderMenuItem(
              copyState === "hidden" ? "COPY ADDRESS" : "ADDRESS COPIED",
              handleCopyAddress,
              renderCopiedButton()
            )}
            {chainId &&
              renderMenuItem(
                `OPEN IN ${BLOCKCHAIN_EXPLORER_NAME[chainId]}`,
                handleOpenEtherscan
              )}
            {renderMenuItem("DISCONNECT", handleDisconnect)}
          </WalletDesktopMenu>
        </AnimatePresence> */}
      </WalletContainer>

      {/* Mobile Menu */}
      {/* <WalletMobileOverlayMenu
        className="flex-column align-items-center justify-content-center"
        isMenuOpen={isMenuOpen}
        onClick={onCloseMenu}
        variant={variant}
        mountRoot="div#root"
        overflowOnOpen={false}
      >
        {renderMenuItem("CHANGE WALLET", handleChangeWallet)}
        {renderMenuItem(
          copyState === "hidden" ? "COPY ADDRESS" : "ADDRESS COPIED",
          handleCopyAddress,
          renderCopiedButton()
        )}
        {chainId &&
          renderMenuItem(
            `OPEN IN ${BLOCKCHAIN_EXPLORER_NAME[chainId]}`,
            handleOpenEtherscan
          )}
        {renderMenuItem("DISCONNECT", handleDisconnect)}
        <MenuCloseItem role="button" onClick={onCloseMenu}>
          <MenuButton isOpen={true} onToggle={onCloseMenu} />
        </MenuCloseItem>
      </WalletMobileOverlayMenu> */}
    </AccountStatusContainer>
  );
};
export default AccountStatus;
