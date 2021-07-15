import React, { useState } from 'react';
import { Image, Box } from 'rebass';
import Collapse from '@material-ui/core/Collapse';
import { VAULTS, VAULTS_ADDRESS } from 'consts';
import map from 'lodash/map';
import { SectionTitle } from 'components/Blocks';
import { dropdownIcon } from 'assets/images';
import {
  DropDownContainer,
  DropDownHeader,
  DropDownListContainer,
  DropDownList,
  ListItem,
  TextBox,
} from './style';

const SelectVault = ({ defaultOption, onChangeVault }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVault, setselectedVault] = useState(
    defaultOption || VAULTS[VAULTS_ADDRESS.VaultETHDAI],
  );

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setselectedVault(value);
    setIsOpen(false);
    onChangeVault(value);
  };

  return (
    <DropDownContainer>
      <SectionTitle fontSize={2} mb={2}>
        Markets
      </SectionTitle>
      <Box mb={4}>
        <DropDownHeader isOpened={isOpen} onClick={toggling}>
          <TextBox width={6 / 7} display="flex" alignItems="center" justifyContent="flex-start">
            <Image src={selectedVault.borrowAsset.icon} width={26} height={26} />
            <Image src={selectedVault.collateralAsset.icon} width={26} height={26} ml={-2} />
            <TextBox ml={3}>{selectedVault.title}</TextBox>
          </TextBox>
          <TextBox width={1 / 7} display="flex" alignItems="center" justifyContent="flex-end">
            <Image src={dropdownIcon} width={17} height={17} />
          </TextBox>
        </DropDownHeader>
        <Collapse in={isOpen}>
          <DropDownListContainer open={isOpen}>
            <DropDownList>
              {map(
                Object.keys(VAULTS),
                key =>
                  VAULTS[key].name !== selectedVault.name && (
                    <ListItem onClick={onOptionClicked(VAULTS[key])} key={Math.random()}>
                      <Image src={VAULTS[key].borrowAsset.icon} width={20} height={20} ml={2} />
                      <Image
                        src={VAULTS[key].collateralAsset.icon}
                        width={20}
                        height={20}
                        ml={-2}
                      />
                      <TextBox cursor="pointer" ml={3}>
                        {VAULTS[key].title}
                      </TextBox>
                    </ListItem>
                  ),
              )}
            </DropDownList>
          </DropDownListContainer>
        </Collapse>
      </Box>
    </DropDownContainer>
  );
};

export default SelectVault;
