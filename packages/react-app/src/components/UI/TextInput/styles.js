import styled from 'styled-components';
import { mapToTheme } from 'styled-map';
import { themeGet } from '@styled-system/theme-get';
import media from 'styled-media-query';

export const InputContainer = styled.div`
  height: 56px;
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

  ${media.lessThan('medium')`
    height: 40px;
    border-radius: 4px;
  `}

  ${media.between('medium', 'large')`
    height: 56px;
    border-radius: 4px;
  `}
`;

export const SubTitleContainer = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
  color: white;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  ${media.between('medium', 'large')`
    font-size: 18px;
  `}
`;

export const SubTitleInfo = styled.span`
  display: contents;
  font-size: 0.75rem;
  color: ${themeGet('colors.text64')};
  ${media.lessThan('medium')`
    font-size: 10px;
    line-height: 15px;
    display: flex;
    position:absolute;
    align-items: flex-end;
    text-align: right;
    right:0px;
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

  ${media.lessThan('medium')`
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
  ${media.lessThan('medium')`
    font-size: 12px;
  `}
  ${media.between('medium', 'large')`
    font-size: 16px;
  `}
`;

export const StyledInput = styled.input`
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
