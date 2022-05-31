import styled, { keyframes } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';
import { Link } from 'react-router-dom';
import { margin } from 'styled-system';

export const NavImageLink = styled.a.attrs(props => ({
  href: props.contact.url || '',
  target: props.target || '_blank',
  rel: props.rel || 'noopener noreferrer',
}))`
  display: inline-block;
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
  ${fujiMedia.between('small', 'medium')`
    height: 28px;
    width: 28px;
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

const animationBack = keyframes`
  0% {
    opacity: 0.8;
    transform: translateX(0px);
  }
  100% {
    opacity: 0;
    transform: translateX(5px);
  }
`;

export const NavBackLink = styled(Link)`
  color: var(--text);
  cursor: pointer;
  width: auto;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  width: max-content;
  &:hover {
    > svg {
      animation: ${animationBack} 1s ease-in-out alternate infinite;
    }
  }

  ${margin};
`;
