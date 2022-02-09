import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { space } from 'styled-system';

export const Container = styled.fieldset`
  border: 0.15rem solid var(--text64);
  border-radius: 0.5rem;
  margin: -0.5rem 0rem 2.5rem;
  background-color: var(--blocks56);
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  padding: 0.75rem 28px 2rem;

  color: ${themeGet('colors.text100')};
  ${space}
`;

export const TitleContainer = styled.legend`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0rem 0.5rem;

  margin-left: 3rem;
  text-shadow: 0rem 0rem 0.125rem var(--text);
`;

export const ContentContainer = styled.p`
  margin-top: 0.375px;
  font-size: 0.8rem;
  font-weight: 400;
`;
