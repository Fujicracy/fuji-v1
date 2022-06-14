import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Flex, Image } from 'rebass';
import { themeGet } from '@styled-system/theme-get';

import { editIcon } from 'assets/images';
import { useAuth } from 'hooks';
import { SectionTitle } from 'components';

export const Input = styled.input`
  margin: 0;
  border: none;
  border-radius: 8px;
  background: none;
  color: white;
  font-size: 24px;
  font-weight: bold;
  line-height: 36px;
  height: 54px;
  text-align: center;
  max-width: 100%;

  border-color: ${props => (props.error ? 'red' : 'black')};
  outline: none;
  &:hover {
    border: none;
    outline: none;
  }

  &:focus,
  &:focus-within {
    border: 1px solid ${themeGet('colors.primary')};
  }
`;

function PseudoInput() {
  const { address, provider } = useAuth();
  const formattedAddress = address ? address.substr(0, 6) + '...' + address.substr(-4, 4) : '';
  const [customPseudo, setCustomPseudo] = useState(localStorage.getItem('customPseudo') || '');
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    async function updatePseudo() {
      // call api then localstorage.
      const signer = provider.getSigner(address);
      const message = `Hey, please sign to update your climber name to "${customPseudo}"`;
      const signedMessage = await signer.signMessage(message);
      console.debug({ signedMessage });
      // then make request to backend
      // then in backend ethers.utils.verifyMessage('Destroyer123', signedMessage)
      localStorage.setItem('customPseudo', customPseudo);
    }
    const pseudoHaveChanged = customPseudo !== localStorage.getItem('customPseudo');
    if (!isEditable && customPseudo && pseudoHaveChanged) {
      updatePseudo();
    } else if (!isEditable && pseudoHaveChanged) {
      // TODO: Reset pseudo to address
      alert('reset pseudo to address, not implemented');
    }
  }, [isEditable, customPseudo, address, provider]);

  return (
    <Flex alignItems="center" justifyContent="center">
      {isEditable ? (
        <Input
          autoFocus
          onFocus={e => e.currentTarget.select()}
          value={customPseudo}
          onChange={e => {
            setCustomPseudo(e?.target?.value);
          }}
          onKeyUp={e => e.key === 'Enter' && setIsEditable(false)}
          onBlur={() => setIsEditable(false)}
        />
      ) : (
        <Flex height="54px" justifyContent="center" alignItems="center">
          <SectionTitle fontSize="24px" lineHeight="36px" onClick={() => setIsEditable(true)}>
            {customPseudo || formattedAddress}
          </SectionTitle>
          <Image
            src={editIcon}
            alt="edit username"
            marginLeft={2}
            onClick={() => setIsEditable(true)}
            height="24px"
          />
        </Flex>
      )}
    </Flex>
  );
}

export default PseudoInput;
