import styled from 'styled-components';
import { Grid } from '@material-ui/core';
// import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

export const GridContainer = styled(Grid)`
  margin: 64px 112px;
  min-width: 71rem;
  width: 71rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  line-height: 150%;
  padding-bottom: 4rem;
  position: relative;
  ${fujiMedia.lessThan('small')`
    margin: 40px 28px;
    min-width: 320px;
    width: 320px;
  `}
  ${fujiMedia.between('small', 'medium')`
    margin: 40px 28px;
    min-width: 470px;
    width: 470px;
  `}
`;

export const GridNewPosition = styled(Grid)`
  cursor: pointer;
  width: auto;
  height: 80px; /* height size of a regular position */
  padding: 0rem 1rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  background: transparent;
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--fujiColor);
  color: var(--fujiColor);
  transition: all 250ms ease;

  > span {
    display: flex;
    margin-right: 0.5rem;
  }
  &:hover {
    border-color: var(--text32);
    color: var(--text);
  }

  ${fujiMedia.lessThan('small')`
    height: 64px;
  `}
  ${fujiMedia.between('small', 'medium')`
    height: 80px;
  `}
`;

export const PositionsBoard = styled.div`
  margin-top: 2rem;

  > span {
    display: flex;
    margin-right: 0.5rem;
  }
  &:hover {
    border-color: var(--text32);
    color: var(--text);
  }

  ${fujiMedia.lessThan('small')`
    height: 64px;
  `}
  ${fujiMedia.between('small', 'medium')`
    height: 80px;
  `}
`;

export const GridOnePosition = styled.div`
  padding: 16px 28px;
  background: var(--blocks56);
  border: 0.1rem solid var(--text05);
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  position: relative;
  height: 80px;

  &:first-child {
    margin-top: 40px;
  }

  ${fujiMedia.lessThan('small')`
    padding: 16px 0px 16px 28px;
    height: 64px;
  `}
  ${fujiMedia.between('small', 'medium')`
    padding: 16px 0px 16px 28px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 80px;
    margin-bottom: 24px;
    cursor: pointer;
  `}
`;
