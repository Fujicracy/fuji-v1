import styled from 'styled-components';
import { Box } from 'rebass';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

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
  ${fujiMedia.lessThan('large')`
    justify-content: space-between;
  `}
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
  ${fujiMedia.between('medium', 'large')`
    height: 28px;
    width: 28px;
  `}
  ${fujiMedia.lessThan('large')`
  `}
`;

export const NavTextLink = styled.a.attrs(props => ({
  href: props.url || '',
  target: props.target || '_blank',
  rel: props.rel || 'noopener noreferrer',
}))`
  margin-right: ${props => (props.marginRight ? props.marginRight : '10px')};
  font-size: ${props => (props.fontSize ? props.fontSize : '12px')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : '400')};
  &:link,
  &:visited {
    color: ${props => (props.color ? props.color : themeGet('colors.text64'))};
  }

  &:hover {
    color: ${themeGet('colors.primary')};
  }
`;
