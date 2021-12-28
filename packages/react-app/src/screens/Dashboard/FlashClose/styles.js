import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

export const FlashCloseContainer = styled.div`
  margin-top: 2.5rem;
  width: auto;
  padding: 1rem 2rem;
  border: 0.1rem solid ${themeGet('colors.text05')};
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  background: ${themeGet('colors.dark56')};
  border-radius: 1rem;
  color: ${themeGet('colors.text100')};

  ${fujiMedia.lessThan('small')`
    margin-top: 0px;
    border-radius: 14px;
  `}
  ${fujiMedia.between('small', 'medium')`
    margin-top: 0px;
    padding: 44px 36px 40px;
    border-radius: 14px;
  `}
`;

export const Description = styled.div`
  font-size: 0.875rem;
  color: ${themeGet('colors.text100')};

  ${fujiMedia.lessThan('small')`
    font-weight: 600;
    font-size: 8px;
    line-height: 12px;
    display: flex;
    align-items: center;
    color: rgba(245, 245, 253, 0.5);
    width: 60%;
  `}
  ${fujiMedia.between('small', 'medium')`
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: rgba(245, 245, 253, 0.5);
    width: 60%;
  `}
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

  ${fujiMedia.lessThan('small')`
    border: 1px solid rgb(63, 60, 60);
    color: ${themeGet('colors.fujiWhite')};
    width: 96px;
    height: 24px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(9, 9, 9, 0.15) 100%);
    border-radius: 3.25rem;

    font-weight: 600;
    font-size: 12px;
    padding: 0;
  `}
  ${fujiMedia.between('small', 'medium')`
    border: 1px solid rgb(63, 60, 60);
    color: ${themeGet('colors.fujiWhite')};
    width: 112px;
    height: 40px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(9, 9, 9, 0.15) 100%);
    border-radius: 3.25rem;

    font-weight: 600;
    font-size: 16px;
  `}
`;
