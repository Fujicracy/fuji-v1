import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Image, Box } from 'rebass';
import { useAuth } from 'hooks';

import { flow } from 'lodash';
import { BREAKPOINTS, BREAKPOINT_NAMES, CHAINS } from 'consts';
import { Label } from 'components/UI';
import { downArrowIcon, upArrowIcon } from 'assets/images';

import {
  DropDownItemContainer,
  DropDownHeader,
  DropDownItem,
  DropDownBackContainer,
} from './styles';

const NetworkDropdown = ({ onChangeNetwork }) => {
  const chains = flow([
    Object.entries,
    arr => arr.filter(([key]) => CHAINS[key].isDeployed),
    Object.fromEntries,
  ])(CHAINS);

  const { changeNetwork, networkId, networkName } = useAuth();
  const [selectedChain, setSelectedChain] = useState(chains[networkName]);

  const isMobile = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
  });

  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const [isOpenNetworkDropDown, setIsOpenNetworkDropDown] = useState(false);

  useEffect(() => {
    if (Object.values(chains).find(chain => chain.id === networkId)) {
      setSelectedChain(chains[networkName]);
      if (onChangeNetwork) onChangeNetwork(chains[networkName]);
    } else {
      setSelectedChain(null);
      if (onChangeNetwork) onChangeNetwork(null);
    }
  }, [chains, networkName, networkId, onChangeNetwork]);

  const onChangeChain = async chain => {
    await changeNetwork(chain.id);
    setSelectedChain(chain);
    console.log({ chain });
    if (onChangeNetwork) {
      console.log('calling chain');
      onChangeNetwork(chains);
    }
  };
  console.log({ onChangeNetwork });

  return (
    <Box
      ml={2}
      sx={{ position: 'relative' }}
      tabIndex="0"
      onBlur={() => setIsOpenNetworkDropDown(false)}
    >
      <DropDownHeader
        onClick={() => setIsOpenNetworkDropDown(!isOpenNetworkDropDown)}
        isClicked={isOpenNetworkDropDown}
        hasBorder
        width={!isMobile ? '160px' : '80px'}
      >
        <Image src={selectedChain?.icon} width={20} />
        {isMobile ? (
          <Label ml={2}>{!selectedChain ? 'Switch' : ''}</Label>
        ) : (
          <Label ml={2} color="#f5f5f5">
            {selectedChain?.title ?? 'Switch network'}
          </Label>
        )}
        <Image src={isOpenNetworkDropDown ? upArrowIcon : downArrowIcon} ml={2} width={11} />
      </DropDownHeader>
      {isOpenNetworkDropDown && (
        <DropDownBackContainer onClick={() => setIsOpenNetworkDropDown(false)}>
          <DropDownItemContainer width={!isMobile && !isTablet ? '128px' : '100%'}>
            {Object.keys(chains)
              .filter(key => key !== selectedChain?.name)
              .map(key => (
                <DropDownItem key={key} onClick={() => onChangeChain(chains[key])}>
                  <Image src={chains[key].icon} width={16} />
                  <Label color="#f5f5f5" ml="8px">
                    {chains[key].title}
                  </Label>
                </DropDownItem>
              ))}
          </DropDownItemContainer>
        </DropDownBackContainer>
      )}
    </Box>
  );
};

export default NetworkDropdown;
