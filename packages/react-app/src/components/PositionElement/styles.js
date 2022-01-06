import styled from 'styled-components';
import { Button } from '@material-ui/core';
// import { themeGet } from '@styled-system/theme-get';
// import { fujiMedia } from 'consts';

export const ManageButton = styled(Button)`
  cursor: pointer;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 400;
  height: 2.5rem;
  color: var(--text);
  border: 0.063rem solid var(--text);
  border-radius: 2rem;
  box-sizing: border-box;
  background: transparent;
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  transition: all 250ms ease;

  &:hover {
    color: var(--text);
    border-color: var(--brand);
    background: var(--brand);
    box-shadow: 0rem 0rem 0.25rem var(--brand);
  }
`;
