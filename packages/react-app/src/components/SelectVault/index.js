import React, { useState, useEffect } from 'react';
import { Image, Box } from 'rebass';
import Collapse from '@material-ui/core/Collapse';
import { VAULTS, VAULTS_ADDRESS } from 'consts';
import map from 'lodash/map';
import { SectionTitle } from 'components/Blocks';
import { downArrowIcon, upArrowIcon, barIcon } from 'assets/images';
import {
  DropDownContainer,
  DropDownHeader,
  DropDownListContainer,
  DropDownList,
  ListItem,
} from './style';

const SelectVault = ({ defaultOption, onChangeVault }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState(
    defaultOption || VAULTS[VAULTS_ADDRESS.VaultETHDAI],
  );

  useEffect(() => defaultOption && setSelectedVault(defaultOption), [defaultOption]);
  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedVault(value);
    setIsOpen(false);
    onChangeVault(value);
  };

  return (
    <DropDownContainer>
      <SectionTitle fontSize={2} mb={2}>
        Borrow
      </SectionTitle>
      <Box mb={4}>
        <DropDownHeader isOpened={isOpen} onClick={toggling}>
          <Box width={2 / 5} display="flex" alignItems="center">
            <Box
              width={2 / 3}
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Image src={selectedVault.borrowAsset.icon} width={26} height={26} />
              <Box ml={3}>{selectedVault.borrowAsset.name}</Box>
            </Box>
            <Box
              width={1 / 3}
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              with
            </Box>
          </Box>

          <Box width={3 / 5} display="flex" alignItems="center" ml={3}>
            <Box width={6 / 7} display="flex" alignItems="center">
              <Image src={selectedVault.collateralAsset.icon} width={26} height={26} />
              <Box ml={3}>{`${selectedVault.collateralAsset.name} collateral`}</Box>
            </Box>

            <Box
              width={1 / 7}
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="flex-end"
            >
              <Image src={barIcon} mr={2} />
              <Image src={isOpen ? upArrowIcon : downArrowIcon} width={17} height={17} />
            </Box>
          </Box>
        </DropDownHeader>
        <Collapse in={isOpen}>
          <DropDownListContainer open={isOpen}>
            <DropDownList>
              {map(
                Object.keys(VAULTS),
                key =>
                  VAULTS[key].name !== selectedVault.name && (
                    <ListItem onClick={onOptionClicked(VAULTS[key])} key={Math.random()}>
                      <Box width={2 / 5} display="flex" alignItems="center">
                        <Box
                          width={2 / 3}
                          display="flex"
                          flexDirection="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Image src={VAULTS[key].borrowAsset.icon} width={26} height={26} />
                          <Box cursor="pointer" ml={3}>
                            {`${VAULTS[key].borrowAsset.name}`}
                          </Box>
                        </Box>
                        <Box
                          width={1 / 3}
                          display="flex"
                          flexDirection="row"
                          justifyContent="flex-end"
                          alignItems="center"
                          ml={1}
                        >
                          with
                        </Box>
                      </Box>

                      <Box width={3 / 5} display="flex" alignItems="center" ml={3}>
                        <Image src={VAULTS[key].collateralAsset.icon} width={26} height={26} />
                        <Box cursor="pointer" ml={3}>
                          {`${VAULTS[key].collateralAsset.name} collateral`}
                        </Box>
                      </Box>
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
