import styled from "styled-components";

const Signal = styled.div`
  background: #16CEB9;
	border-radius: 50%;
  margin: auto;
	height: 15px;
	width: 15px;

  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
	transform: scale(0.4);
	animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 #16CEB970;
    }
  
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px #16CEB900;
    }
  
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 #16CEB900;
    }
  }
`
export const LiveIndicator = () => {
    return <Signal></Signal>
}

export default LiveIndicator

