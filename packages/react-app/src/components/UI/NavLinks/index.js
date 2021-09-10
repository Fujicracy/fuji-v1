import styled from 'styled-components';
import { Box } from 'rebass';
import { themeGet } from '@styled-system/theme-get';
import media from 'styled-media-query';

export const NavUnlisted = styled(Box).attrs(props => ({
  pt: 4,
  pb: 4,
  justifyContent: props.justifyContent,
}))`
  position: ${props => (props.navPosition ? props.navPosition : 'fixed')};
  bottom: 0rem;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  left: ${props => props.position === 'left' && '32px'};
  right: ${props => props.position === 'right' && '32px'};
`;

export const NavImageLink = styled.a.attrs(props => ({
  href: props.contact.url || '',
  target: props.target || '_blank',
  rel: props.rel || 'noopener noreferrer',
}))`
  background: ${props => `url(${props.contact.image}) no-repeat top center`};
  height: 20px;
  width: 20px;
  margin: 0px 16px 0px 0px;
  background-size: contain;
  &:hover {
    height: 20px;
    width: 20px;
    background: ${props => `url(${props.contact.imageHover}) no-repeat top center`};
    background-size: contain;
  }
  ${media.between('medium', 'large')`
    height: 28px;
    width: 28px;
  `}
`;

export const NavTextLink = styled.a.attrs(props => ({
  href: props.url || '',
  target: props.target || '_blank',
  rel: props.rel || 'noopener noreferrer',
}))`
  margin-right: 10px;
  font-size: 12px;

  &:link,
  &:visited {
    color: ${themeGet('colors.text64')};
  }

  &:hover {
    color: ${themeGet('colors.primary')};
  }
`;
