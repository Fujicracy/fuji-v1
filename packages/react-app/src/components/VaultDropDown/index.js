import React, { useState } from 'react';
import { Image, Box } from 'rebass';
import Collapse from '@material-ui/core/Collapse';
import { VAULTS, VAULTS_ADDRESS } from 'consts';
import map from 'lodash/map';
import { SectionTitle } from 'components/Blocks';
import {
  DropDownContainer,
  DropDownHeader,
  DropDownListContainer,
  DropDownList,
  ListItem,
  TextBox,
} from './style';

const SelectVault = ({ defaultOption }) => {
  console.log({ VAULTS, VAULTS_ADDRESS });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultOption || VAULTS[VAULTS_ADDRESS.VaultETHDAI],
  );

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
    <DropDownContainer>
      <SectionTitle fontSize={2} mb={2}>
        Markets
      </SectionTitle>
      <Box mb={4}>
        <DropDownHeader isOpened={isOpen} onClick={toggling}>
          <Image src={selectedOption.borrowAsset.icon} width={26} height={26} />
          <Image src={selectedOption.collateralAsset.icon} width={26} height={26} ml={-2} />
          <TextBox cursor="pointer" ml={3}>
            {selectedOption.title}
          </TextBox>
        </DropDownHeader>
        <Collapse in={isOpen}>
          <DropDownListContainer open={isOpen}>
            <DropDownList>
              {map(Object.keys(VAULTS), key => (
                <ListItem onClick={onOptionClicked(VAULTS[key])} key={Math.random()}>
                  <Image src={VAULTS[key].borrowAsset.icon} width={20} height={20} ml={2} />
                  <Image src={VAULTS[key].collateralAsset.icon} width={20} height={20} ml={-2} />
                  <TextBox cursor="pointer" ml={3}>
                    {VAULTS[key].title}
                  </TextBox>
                </ListItem>
              ))}
            </DropDownList>
          </DropDownListContainer>
        </Collapse>
      </Box>
    </DropDownContainer>
  );
};

export default SelectVault;
