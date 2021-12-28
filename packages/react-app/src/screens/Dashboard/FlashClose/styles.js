import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

export const FlashCloseContainer = styled.div`
  margin-top: 2.5rem;
  width: auto;
  padding: 1rem 2rem;
  border: 0.1rem solid ${themeGet('colors.text05')};
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  background: ${themeGet('colors.dark09')};
  border-radius: 1rem;
  color: ${themeGet('colors.text100')};
`;

export const Description = styled.div`
  margin-right: 2rem;
  font-size: 0.875rem;
  color: ${themeGet('colors.text100')};
`;

export const RepayButton = styled.button`
  cursor: pointer;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 400;
  color: ${themeGet('colors.text100')};
  border: 0.063rem solid ${themeGet('colors.text100')};
  border-radius: 2rem;
  box-sizing: border-box;
  background: transparent;
  transition: all 250ms ease;
  width: auto;
  height: 2.5rem;
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  &: hover {
    color: ${themeGet('colors.bg16')};
    border-color: ${themeGet('colors.bg16')};
    background: ${themeGet('colors.text100')};
  }
`;
