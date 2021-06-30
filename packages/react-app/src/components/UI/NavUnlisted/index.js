import styled from 'styled-components';
import { Box } from 'rebass';
import { themeGet } from '@styled-system/theme-get';

export const NavUnlisted = styled(Box).attrs(props => ({
  pt: 4,
  pb: 4,
  justifyContent: props.justifyContent,
}))`
  position: fixed;
  bottom: 0rem;
  display: flex;
  justify-content: space-between;
  align-content: center;
  left: ${props => props.position === 'left' && '0px'};
  right: ${props => props.position === 'right' && '0px'};
  margin-left: ${props => props.position === 'left' && '320px'};
  margin-right: ${props => props.position === 'right' && '32px'};
`;

export const NavImageLink = styled.a.attrs(props => ({
  href: props.contact.url || '',
  target: '_blank',
  rel: 'noopener noreferrer',
}))`
  background: ${props => `url(${props.contact.image}) no-repeat top center`};
  height: 20px;
  width: 20px;
  margin-right: 16px;
  background-size: contain;
  &:hover {
    height: 20px;
    width: 20px;
    background: ${props => `url(${props.contact.imageHover}) no-repeat top center`};
    background-size: contain;
  }
`;

export const NavTextLink = styled.a.attrs(props => ({
  href: props.url || '',
  target: '_blank',
  rel: 'noopener noreferrer',
}))`
  margin-right: 16px;

  &:link,
  &:visited {
    color: ${themeGet('colors.text64')};
  }

  &:hover {
    color: ${themeGet('colors.primary')};
  }
`;
