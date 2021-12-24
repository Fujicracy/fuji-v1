import styled from 'styled-components';
import { fontSize, space } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';

const Tooltip = styled.div`
  margin-left: 0.5rem;
  color: ${props => (props.color ? themeGet(props.color) : themeGet('colors.text32'))};
  display: flex;
  cursor: pointer;
  position: relative;

  span {
    visibility: hidden;
    min-width: 12.5rem;
    max-width: 15.375rem;
    width: auto;
    background-color: var(--blocks);
    backdrop-filter: blur(0.375rem);
    -webkit-backdrop-filter: blur(0.375rem);
    color: ${props => (props.color ? themeGet(props.color) : themeGet('colors.text100'))};
    text-align: left;
    border-radius: 0.25rem;
    border: 1px solid var(--brand);
    font-size: 0.75rem;
    font-weight: 400;
    padding: 0.75rem;
    position: absolute;
    top: 1.75rem;
    z-index: 25;
  }

  &:hover {
    span {
      visibility: visible;
    }
    animation: span 250ms ease forwards !important;
  }

  ${fontSize} ${space};
`;

export default Tooltip;
