import styled from 'styled-components';
import { size } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import media from 'styled-media-query';

export const Container = styled(Box).attrs({
  px: 4,
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100px;

  backdrop-filter: blur(0.25rem);
  -webkit-backdrop-filter: blur(0.25rem);
  ${size}

  ${media.lessThan('medium')`
    height:50px;
    background-color:  rgba(255, 255, 255, 0.05);
  `}
`;

export const Logo = styled.img`
  transition: all 250ms ease;
  &:hover {
    opacity: 0.8;
  }
  ${size}
`;

export const Navigation = styled.ul`
  display: flex;
  justify-content: flex-end;

  li {
    margin-left: 2em;
    font-size: 0.875rem;

    &.nav-item {
      font-size: 1rem;
    }

    a {
      height: 40px;
      line-height: 40px;
      color: ${themeGet('colors.text.primary')};
      font-weight: 500;
      transition: all 250ms ease;
      text-shadow: 0rem 0rem 0.125rem ${themeGet('colors.text.primary')};

      &:hover {
        color: ${themeGet('colors.primary')};
        text-shadow: 0rem 0rem 0.125rem ${themeGet('colors.primary')};
      }

      &.current {
        color: ${themeGet('colors.primary')};
        text-shadow: 0rem 0rem 0.125rem ${themeGet('colors.primary')};
      }

      &.button-nav {
        display: block;
        width: 146px;
        text-align: center;
        cursor: pointer;
        line-height: 36px;
        border: 0.125rem solid ${themeGet('colors.primary')};
        border-radius: 2rem;
        transition: all 250ms ease;

        &.connected {
          border-color: ${themeGet('colors.text.link')};
          color: ${themeGet('colors.text.secondary')};
          text-shadow: 0rem 0rem 0rem transparent;
        }

        &:hover {
          color: ${themeGet('colors.text.primary')};
          border-color: ${themeGet('colors.text.secondary')};
        }
      }
    }
  }
  ${media.lessThan('medium')`
    display:none
  `}
  ${media.greaterThan('medium')`
  `}
`;

export const BallanceContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 36px;
  cursor: default;
  padding-left: ${props => (props.leftPadding !== undefined ? props.leftPadding : 16)}px;
  padding-right: ${props => (props.rightPadding !== undefined ? props.rightPadding : 16)}px;

  background: rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  border-radius: 19px;

  font-size: 12px;
  color: #f5f5f5;

  ${size}
`;

export const WalletHeader = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 36px;
  color: #f5f5f5;
  box-sizing: border-box;
  border-radius: 19px;
  cursor: pointer;
  padding-left: ${props => (props.leftPadding !== undefined ? props.leftPadding : 16)}px;
  padding-right: ${props => (props.rightPadding !== undefined ? props.rightPadding : 16)}px;

  background: ${props =>
    props.isClicked
      ? 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.07) 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => (props.isClicked ? themeGet('colors.primary') : 'transparent')};

  &:hover {
    background: ${props =>
      props.isClicked
        ? 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.07) 100%)'
        : 'rgba(255, 255, 255, 0.15)'};
    border: 1px solid
      ${props => (props.isClicked ? themeGet('colors.primary') : 'rgba(255, 255, 255, 0.1)')};
  }
  ${size}
`;

export const WalletItemContainer = styled(Box)`
  position: absolute;
  width: max-content;
  left: 50%;
  transform: translateX(-50%);
  border: none;
  box-sizing: border-box;
  color: #3faffa;
`;

export const WalletItem = styled(Box)`
  height: 28px;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 0px 16px 0px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${themeGet('colors.text64')};
  &:hover {
    color: #f5f5f5;
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:last-child {
    border-bottom: none;
  }
  cursor: pointer;
`;
