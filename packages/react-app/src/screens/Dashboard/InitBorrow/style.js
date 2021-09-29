import styled from 'styled-components';
// import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { fujiMedia } from 'consts';

export const Container = styled(Box)`
  margin-top: 72px !important;
  min-height: calc(100vh - 13.125rem);
  display: flex;
  // align-items: center;
  justify-content: center;
  line-height: 150%;
  padding-bottom: 24px 0px 64px;
  position: relative;

  ${fujiMedia.lessThan('medium')`
    margin-top: 0px !important;
  `}
`;

export const Helper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: var(--bg64);
  border-radius: 0.5rem;
  color: white;
  margin: -4px -8px 28px -8px !important;
  span {
    margin-left: 4px;
    color: var(--green);
  }
  font-size: 10px;
  padding: 8px;

  ${fujiMedia.lessThan('medium')`
    margin: -8px -12px 16px -12px !important;
  `}

  ${fujiMedia.between('medium', 'large')`
    font-size: 12px;
    margin-top: -4px;
  `}
`;
