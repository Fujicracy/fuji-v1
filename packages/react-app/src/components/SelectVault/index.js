import React, { useState, useEffect } from 'react';
import { Image, Box } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import Collapse from '@material-ui/core/Collapse';
import { VAULTS, VAULTS_ADDRESS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
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
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  useEffect(() => defaultOption && setSelectedVault(defaultOption), [defaultOption]);
  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedVault(value);
    setIsOpen(false);
    onChangeVault(value);
  };

  return (
    <DropDownContainer>
      <SectionTitle fontSize={isMobile ? '16px' : isTablet ? '18px' : '16px'} mb={3}>
        Borrow
      </SectionTitle>
      <Box mb={isMobile ? 4 : 4}>
        <DropDownHeader isOpened={isOpen} onClick={toggling}>
          <Box width={isMobile ? 1 / 2 : 2 / 5} display="flex" alignItems="center">
            <Box
              width={2 / 3}
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Image
                src={selectedVault.borrowAsset.icon}
                width={isMobile ? 20 : isTablet ? 28 : 26}
              />
              <SectionTitle ml={isMobile ? 2 : 3} fontWeight="500">
                {selectedVault.borrowAsset.name}
              </SectionTitle>
            </Box>
            <Box
              width={1 / 3}
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <SectionTitle fontWeight="normal" color={isMobile && 'rgba(255, 255, 255, 0.5)'}>
                with
              </SectionTitle>
            </Box>
          </Box>

          <Box
            width={isMobile ? 1 / 2 : 3 / 5}
            display="flex"
            alignItems="center"
            ml={isMobile ? 2 : 3}
          >
            <Box width={6 / 7} display="flex" alignItems="center">
              <Image src={selectedVault.collateralAsset.icon} width={isMobile ? 20 : 26} />

              <SectionTitle ml={isMobile ? 2 : 3} fontWeight="500">
                {`${selectedVault.collateralAsset.name} `} {isMobile ? '' : 'collateral'}
              </SectionTitle>
            </Box>

            <Box
              width={1 / 7}
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="flex-end"
            >
              <Image src={barIcon} height={isMobile ? 18 : 26} mr={2} />
              <Image src={isOpen ? upArrowIcon : downArrowIcon} width={isMobile ? 10 : 13} />
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
                      <Box width={isMobile ? 1 / 2 : 2 / 5} display="flex" alignItems="center">
                        <Box
                          width={2 / 3}
                          display="flex"
                          flexDirection="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Image src={VAULTS[key].borrowAsset.icon} width={isMobile ? 20 : 26} />

                          <SectionTitle ml={isMobile ? 2 : 3} fontWeight="500">
                            {`${VAULTS[key].borrowAsset.name}`}
                          </SectionTitle>
                        </Box>
                        <Box
                          width={1 / 3}
                          display="flex"
                          flexDirection="row"
                          justifyContent="flex-end"
                          alignItems="center"
                          ml={1}
                        >
                          <SectionTitle
                            fontWeight="normal"
                            color={isMobile && 'rgba(255, 255, 255, 0.5)'}
                          >
                            with
                          </SectionTitle>
                        </Box>
                      </Box>

                      <Box
                        width={isMobile ? 1 / 2 : 3 / 5}
                        display="flex"
                        alignItems="center"
                        ml={isMobile ? 2 : 3}
                      >
                        <Image src={VAULTS[key].collateralAsset.icon} width={isMobile ? 20 : 26} />
                        <SectionTitle ml={isMobile ? 2 : 3} fontWeight="500">
                          {`${VAULTS[key].collateralAsset.name} `} {isMobile ? '' : 'collateral'}
                        </SectionTitle>
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
