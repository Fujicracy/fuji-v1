import styled from 'styled-components';
import { mapToTheme } from 'styled-map';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

export const InputContainer = styled.div`
  height: 44px;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  border: 1px solid transparent;
  align-items: center;
  margin: 8px auto;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: ${themeGet('colors.text05')};
  &:focus,
  &:focus-within {
    border: 1px solid ${themeGet('colors.primary')};
  }

  ${fujiMedia.lessThan('medium')`
    height: 40px;
    border-radius: 4px;
  `}

  ${fujiMedia.between('medium', 'large')`
    height: 56px;
    border-radius: 4px;
  `}
`;

export const SubTitleContainer = styled.div`
  font-size: 12px;
  margin-bottom: 20px;
  color: white;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  ${fujiMedia.lessThan('medium')`
    font-size: 12px;
    margin-bottom: 16px;
  `}
  ${fujiMedia.between('medium', 'large')`
    font-size: 20px;
    margin-bottom: 24px;
  `}
`;

export const SubTitleInfo = styled.span`
  display: flex;
  position: absolute;
  align-items: flex-end;
  text-align: right;
  right: 0px;
  font-size: 10px;
  line-height: 15px;
  color: ${themeGet('colors.text64')};
  margin-top: 24px;

  ${fujiMedia.between('medium', 'large')`
    font-size: 12px;
    line-height: 18px;
    margin-top: 24px;
  `}
`;

export const Description = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
  color: white;

  ${fujiMedia.lessThan('medium')`
    font-size: 0.5rem;
  `}
`;

export const AdornmentAvatar = styled.img`
  width: ${props => (props.width ? props.width : '1.5rem')};
  height: ${props => (props.width ? props.width : '1.5rem')};
  margin-right: ${props => (props.marginRight ? props.marginRight : '1rem')};
  src: ${props => props.src};
`;

export const AdornmentText = styled.label`
  color: ${themeGet('colors.text64')};
  font-size: 14px;
  font-weight: 400;
  ${fujiMedia.lessThan('medium')`
    font-size: 12px;
  `}
  ${fujiMedia.between('medium', 'large')`
    font-size: 16px;
  `}
`;

export const StyledInput = styled.input`
  background: none;
  border: none;
  font-size: ${props => (props.fontSize ? props.fontSize : '1rem')};
  font-weight: 600;
  border-color: ${props => (props.error ? 'red' : 'black')};
  margin: 0;
  outline: none;
  width: 100%;
  color: ${mapToTheme('buttons.color')};
  &:hover {
    border: none;
    outline: none;
  }
`;
