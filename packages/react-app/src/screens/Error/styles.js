import styled, { keyframes } from 'styled-components';
// import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

const blinker = keyframes`
  0% {
    opacity: 0.2;
  }
  19% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  21% {
    opacity: 1;
  }
  22% {
    opacity: 0.2;
  }
  23% {
    opacity: 0.2;
  }
  36% {
    opacity: 0.2;
  }
  40% {
    opacity: 1;
  }
  41% {
    opacity: 0;
  }
  42% {
    opacity: 1;
  }
  43% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;

export const ErrorContainer = styled.div`
  position: relative;
  padding: 32px;
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  ${fujiMedia.lessThan('small')`
    width: 320px;
  `}

  ${fujiMedia.between('small', 'medium')`
    width: 470px;
  `}
`;

export const Title = styled.div`
  font-size: 28px;
  color: var(--text);
  font-family: Poppins, sans-serif;
  padding-top: 16px;
  padding-bottom: 16px;
  border-top: 1px dashed var(--brand);
  border-bottom: 1px dashed var(--brand);
  text-align: center;
  font-weight: 600;
  width: auto;
  display: inline-block;
  margin: 0 auto;
  margin-bottom: 32px;
  margin-top: -56px;
  display: flex;
  flex-direction: row;
  line-height: 200%;
  ${fujiMedia.lessThan('small')`
    flex-direction: column;
    font-size: 16px;
    margin-top: 0;
  `}

  ${fujiMedia.between('small', 'medium')`
    flex-direction: column;
    font-size: 24px;
    margin-top: 0;
  `}
`;

export const ErrorImage = styled.img`
  animation: ${blinker} 6s ease-in-out;
  animation-iteration-count: infinite;
  margin-top: -32px;

  ${fujiMedia.lessThan('small')`
    width: 360px;
  `}

  ${fujiMedia.between('small', 'medium')`
    width: 480px;
  `}
`;

export const ErrorBrand = styled.div`
  filter: drop-shadow(0px 0px 2px var(--brand)) !important;
`;

export const ErrorText = styled.div`
  filter: drop-shadow(0px 0px 2px var(--text)) !important;
`;

export const BackButton = styled.button`
  color: var(--text);
  width: 256px;
`;
