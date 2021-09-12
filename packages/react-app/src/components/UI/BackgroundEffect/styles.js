import styled from 'styled-components';

export const SunEffect = styled.div`
  z-index: -1;
  position: fixed;
  top: 35rem;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  width: 800px;
  height: 800px;
  background: linear-gradient(180deg, #f0014f 0%, #111111 100%);
  opacity: 0.52;
  box-shadow: 0px -90px 50px rgba(238, 2, 70, 0.08);
  filter: blur(16px);
  display: ${props => (props.isShow ? 'block' : 'none')};
`;
