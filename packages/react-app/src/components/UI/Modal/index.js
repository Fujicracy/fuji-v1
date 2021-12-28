import Modal from 'styled-react-modal';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

const StyledModal = Modal.styled`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  width: 450px;
  border-radius: 12px;
  background: linear-gradient(180deg, #292929 0%, #191919 100%);  
  box-shadow: 0px 0px 20px 3px rgba(240, 1, 79, 0.6);
  opacity: ${props => props.opacity};
  transition : all 0.3s ease-in-out;
  color: ${themeGet('colors.text64')};

  ${fujiMedia.lessThan('small')`
    max-width: 340px;
    margin-left: 28px;
    margin-right: 28px;
    box-shadow: none;
    background: rgb(21,21,21);
    padding: 0px;
    border-radius: 14px;
    border: 2px solid rgb(44, 44, 44);
  `}
  ${fujiMedia.between('small', 'medium')`
    max-width: 470px;
    box-shadow: none;
    background: rgb(21,21,21);
    padding: 0px;
    border-radius: 14px;
    border: 2px solid rgb(44, 44, 44);
  `}
`;

export default StyledModal;
