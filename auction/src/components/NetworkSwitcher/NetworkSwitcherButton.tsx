import React, { useState, useRef } from "react";
import styled from "styled-components";

import colors from "../../design/colors";
import theme from "../../design/theme";
import { getAssetLogo } from "../../utils/asset";
import { CHAINID } from "../../utils/env";
import { CHAINID_TO_NATIVE_TOKENS } from "../../constants/constants";
import NetworkSwitcherModal from "./NetworkSwitcherModal";
import { useWeb3React } from "@web3-react/core";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 2px #424242;
  height: 40px;
  width: 40px;
  padding: 8px 8px;

  &:hover {
    svg {
      path {
        opacity: ${theme.hover.opacity};
      }
    }
  }
`;

const NetworkSwitcherButton = () => {
  const desktopMenuRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const { chainId } = useWeb3React();

  const Logo = chainId
    ? getAssetLogo(CHAINID_TO_NATIVE_TOKENS[chainId as CHAINID])
    : () => null;

  return (
    <div className="d-flex position-relative" ref={desktopMenuRef}>
      {chainId && (
        <ButtonContainer role="button" onClick={() => setShowModal(true)}>
          <Logo height={26} width={26}></Logo>
        </ButtonContainer>
      )}

      {/* Since the modal is only shown when button is clicked we just pass in currentChainId=1 */}
      <NetworkSwitcherModal
        show={showModal}
        onClose={() => setShowModal(false)}
        currentChainId={chainId || 1}
      ></NetworkSwitcherModal>
    </div>
  );
};

export default NetworkSwitcherButton;
