import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { space } from 'styled-system';
import { fujiMedia } from 'consts';
import { Flex } from 'rebass';
import { SectionTitle } from '../Blocks';

export const Container = styled.div`
  border: ${props => (props.type === 'legendary' ? 'none' : '2px solid')};
  border-color: ${props => (props.themeColor ? props.themeColor : 'rgba(0, 194, 255, 1)')};

  background: ${props =>
    props.type === 'legendary'
      ? 'radial-gradient(471.87% 2659.72% at 2.99% -164.06%, #C49210 0%, #FCDD99 19.39%, #F8BB17 36.38%, #DB9F00 62.46%, #FAD27A 75.35%, #F8BB17 87.44%, #C49210 100%)'
      : 'transparent'};

  box-sizing: border-box;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;

  color: ${props => (props.type === 'legendary' ? 'black' : themeGet('colors.text100'))};

  ${fujiMedia.lessThan('small')`
    padding: 24px;
  `}
`;

export const ItemPanel = styled.div`
  width: 124px;
  height: 132px;

  background-color: rgb(32, 32, 32);
  border-radius: 8px;

  ${space}
`;

export const CountButton = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.32);

  ${space}
`;

export const BuyButton = styled.div`
  width: 100px;
  height: 30px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background: rgba(255, 255, 255, 0.32);
  border-radius: 30px;

  ${space}
`;

export const LegendaryItemsContainter = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;

  ${fujiMedia.lessThan('small')`
    width: 100%;
    flex-direction: row;
    margin-top: 12px !important;
    justify-content: ${props => (props.position === 'right' ? 'flex-end' : 'flex-start')};
  `}
`;

export const LegendarySection = styled(SectionTitle)`
  margin-top: 8px !important;
  font-size: 14px;

  ${fujiMedia.lessThan('small')`
    margin-left: 8px !important;
  `}
`;
