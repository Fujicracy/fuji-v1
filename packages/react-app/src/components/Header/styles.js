import styled from 'styled-components';
import { size } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';

export const Container = styled(Box).attrs({
  px: 5,
})`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 80px;

  backdrop-filter: blur(0.25rem);
  -webkit-backdrop-filter: blur(0.25rem);
  ${size}
`;

export const Logo = styled.img`
  transition: all 250ms ease;
  &:hover {
    opacity: 0.8;
  }
`;

export const Navigation = styled.ul`
  display: flex;
  justify-content: flex-end;

  li {
    margin-left: 2em;
    font-size: 0.875rem;

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
        width: 110px;
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
`;
