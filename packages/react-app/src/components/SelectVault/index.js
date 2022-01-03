import React, { useState, useEffect } from 'react';
import { Image, Box } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import Collapse from '@material-ui/core/Collapse';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import map from 'lodash/map';
import { SectionTitle } from 'components/Blocks';
import { downArrowIcon, upArrowIcon, barIcon } from 'assets/images';
import {
  DropDownContainer,
  DropDownHeader,
  DropDownListContainer,
  DropDownList,
  ListItem,
} from './styles';

const SelectVault = ({ defaultVault, onChangeVault, vaults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState(defaultVault || vaults[0]);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  useEffect(() => defaultVault && setSelectedVault(defaultVault), [defaultVault]);
  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedVault(value);
    setIsOpen(false);
    onChangeVault(value);
  };

  return (
    <DropDownContainer>
      <SectionTitle
        fontSize={isTablet ? '20px' : '16px'}
        mb={isMobile ? '16px' : isTablet ? '24px' : '20px'}
      >
        Borrow
      </SectionTitle>
      <Box mb={isMobile ? 4 : 4}>
        <DropDownHeader isOpened={isOpen} onClick={toggling}>
          <Box width={isTablet ? 4 / 7 : 1 / 2} display="flex" alignItems="center">
            <Box
              width={2 / 3}
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Image
                src={selectedVault.borrowAsset.icon}
                width={isMobile ? '20px' : isTablet ? '28px' : '24px'}
              />
              <SectionTitle
                ml={isTablet ? 3 : 2}
                fontWeight="500"
                fontSize={isTablet ? '18px' : '12px'}
              >
                {selectedVault.borrowAsset.name}
              </SectionTitle>
            </Box>
            <Box
              width={1 / 3}
              display="flex"
              flexDirection="row"
              justifyContent={!isMobile && !isTablet ? 'flex-start' : 'flex-end'}
              alignItems="center"
            >
              <SectionTitle
                fontWeight="normal"
                fontSize={isTablet ? '18px' : '12px'}
                color={isMobile && 'rgba(255, 255, 255, 0.5)'}
              >
                with
              </SectionTitle>
            </Box>
          </Box>

          <Box
            width={isTablet ? 3 / 7 : 1 / 2}
            display="flex"
            alignItems="center"
            ml={isTablet ? 3 : 2}
          >
            <Box width={6 / 7} display="flex" alignItems="center">
              <Image
                src={selectedVault.collateralAsset.icon}
                width={isMobile ? '20px' : isTablet ? '28px' : '24px'}
              />

              <SectionTitle
                ml={isTablet ? 3 : 2}
                fontWeight="500"
                fontSize={isTablet ? '18px' : '12px'}
              >
                {`${selectedVault.collateralAsset.name} `}
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
                vaults,
                v =>
                  v.name !== selectedVault.name && (
                    <ListItem onClick={onOptionClicked(v)} key={Math.random()}>
                      <Box width={isTablet ? 4 / 7 : 1 / 2} display="flex" alignItems="center">
                        <Box
                          width={2 / 3}
                          display="flex"
                          flexDirection="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Image
                            src={v.borrowAsset.icon}
                            width={isMobile ? '20px' : isTablet ? '28px' : '24px'}
                          />

                          <SectionTitle
                            ml={isTablet ? 3 : 2}
                            fontWeight="500"
                            fontSize={isTablet ? '18px' : '12px'}
                          >
                            {`${v.borrowAsset.name}`}
                          </SectionTitle>
                        </Box>
                        <Box
                          width={1 / 3}
                          display="flex"
                          flexDirection="row"
                          justifyContent={!isMobile && !isTablet ? 'flex-start' : 'flex-end'}
                          alignItems="center"
                          ml={1}
                        >
                          <SectionTitle
                            fontWeight="normal"
                            fontSize={isTablet ? '18px' : '12px'}
                            color={isMobile && 'rgba(255, 255, 255, 0.5)'}
                          >
                            with
                          </SectionTitle>
                        </Box>
                      </Box>

                      <Box
                        width={isTablet ? 3 / 7 : 1 / 2}
                        display="flex"
                        alignItems="center"
                        ml={isTablet ? 3 : 2}
                      >
                        <Image
                          src={v.collateralAsset.icon}
                          width={isMobile ? '20px' : isTablet ? '28px' : '24px'}
                        />
                        <SectionTitle
                          ml={isTablet ? 3 : 2}
                          fontWeight="500"
                          fontSize={isTablet ? '18px' : '12px'}
                        >
                          {`${v.collateralAsset.name} `}
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
