import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

import BasicModal from "../../components/Common/BasicModal";
import { getAssetColor, getAssetLogo } from "../../utils/asset";
import { Title, Subtitle, BaseIndicator } from "../../design";
import { CHAINID, ENABLED_CHAINID } from "../../utils/env";
import {
  CHAINID_TO_NATIVE_TOKENS,
  READABLE_NETWORK_NAMES,
} from "../../constants/constants";
import { switchChains } from "../../utils/chainSwitching";
import useScreenSize from "../../hooks/useScreenSize";
import sizes from "../../design/sizes";

interface NetworkSwitcherModalProps {
  show: boolean;
  onClose: () => void;
  currentChainId: typeof ENABLED_CHAINID[number];
}

const ModalContainer = styled.div`
  padding: 10px 16px;
`;

const NetworkContainer = styled.div<{
  borderColor: string;
  active?: boolean;
}>`
  display: flex;
  border-radius: 8px;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  background: #212127;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? `border: 1px solid ${props.borderColor};`
      : "border: 1px solid #212127;"}
`;
const NetworkNameContainer = styled.div`
  display: flex;
  align-items: center;
`;
const TitleContainer = styled.div`
  margin-bottom: 20px;
`;
const NetworkName = styled(Subtitle)`
  font-size: 16px;
  text-transform: uppercase;
  line-height: 24px;
  margin-left: 10px;
  color: #FFFFFF;
`;
const AssetCircle = styled(BaseIndicator)<{
  size: number;
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 5px;
`;

const NetworkSwitcherModal: React.FC<NetworkSwitcherModalProps> = ({
  show,
  onClose,
  currentChainId,
}) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const { library } = useWeb3React();
  const isMobile = useScreenSize().width <= sizes.md;

  const handleSwitchChain = useCallback(
    async (chainId: number) => {
      if (library && currentChainId !== chainId) {
        await switchChains(library, chainId);

        // Give it a delay before closing, if not it will show a flash
        setTimeout(() => {
          handleClose();
          // Mobile wallets normally need to do a hard refresh
          if (isMobile) {
            window.location.replace("/");
          }
        }, 300);
      }
    },
    [library, currentChainId, handleClose, isMobile]
  );

  return (
    <BasicModal show={show} onClose={handleClose} maxWidth={400} height={228} backgroundColor="#464646">
      <ModalContainer>
        <TitleContainer>
          <Title>Select a network</Title>
        </TitleContainer>

        {ENABLED_CHAINID.map((chainId: CHAINID) => {
          const Logo = getAssetLogo(CHAINID_TO_NATIVE_TOKENS[chainId]);
          const color = getAssetColor(CHAINID_TO_NATIVE_TOKENS[chainId]);
          const active = currentChainId === chainId;

          return (
            <NetworkContainer
              key={chainId}
              onClick={() => handleSwitchChain(chainId)}
              borderColor={color}
              active={active}
            >
              <NetworkNameContainer>
                
                <Logo height={28} width={28}></Logo>
                
                <NetworkName>{READABLE_NETWORK_NAMES[chainId]}</NetworkName>
              </NetworkNameContainer>

              {active && <BaseIndicator size={8} color={color}></BaseIndicator>}
            </NetworkContainer>
          );
        })}
      </ModalContainer>
    </BasicModal>
  );
};

export default NetworkSwitcherModal;
