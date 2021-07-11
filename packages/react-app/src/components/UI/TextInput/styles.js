import styled from 'styled-components';
import { mapToTheme } from 'styled-map';
import { themeGet } from '@styled-system/theme-get';

export const InputContainer = styled.div`
  height: 3.5rem;
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
`;

export const SubTitleContainer = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SubTitleInfo = styled.span`
  display: contents;
  font-size: 0.75rem;
  color: ${themeGet('colors.text64')};
`;

export const Description = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
  color: white;
`;

export const AdornmentAvatar = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
  src: ${props => props.src};
`;

export const AdornmentText = styled.label`
  color: ${themeGet('colors.text64')};
  font-size: 0.875rem;
  font-weight: 400;
`;

export const StyledInput = styled.input`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  font-size: 1rem;
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
