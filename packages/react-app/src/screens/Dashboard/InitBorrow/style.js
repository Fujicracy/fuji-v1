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
