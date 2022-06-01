import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { space } from 'styled-system';

export const Container = styled.fieldset`
  border: 0.15rem solid ${themeGet('colors.text64')};
  border-radius: 0.5rem;
  background-color: ${themeGet('colors.block56')};
  padding: 15px 30px 16px;

  color: ${themeGet('colors.text100')};
  ${space}
`;

export const TitleContainer = styled.legend`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0rem 0.5rem;

  margin-left: 3rem;
  text-shadow: 0rem 0rem 0.125rem ${themeGet('colors.text100')};
`;

export const ContentContainer = styled.p`
  font-size: 14px;
  font-weight: 400;
`;
