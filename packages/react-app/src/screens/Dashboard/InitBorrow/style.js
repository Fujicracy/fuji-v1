import styled from 'styled-components';
// import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import media from 'styled-media-query';

export const Container = styled(Box)`
  margin-top: 7.75rem !important;
  min-height: calc(100vh - 13.125rem);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 150%;
  padding-bottom: 4rem;
  position: relative;

  ${media.lessThan('medium')`
    margin-top: 0px !important;
  `}
`;

export const Helper = styled(Box)`
  background-color: var(--bg64);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 10px;
  color: white;

  span {
    color: var(--green);
  }

  ${media.lessThan('medium')`
    margin-bottom: 8px;
    padding: 4px;
    font-size: 10px;
  `}

  ${media.greaterThan('medium')`
    margin-bottom: 12px;
    font-size: 14px;
  `}
`;
