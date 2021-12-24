import React, { useState, useEffect } from 'react';
// import { useSpring, animated, config } from 'react-spring';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { find } from 'lodash';
import { Image, Box, Text, Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { useContractLoader, useContractReader, useResources } from 'hooks';
import { CallContractFunction } from 'helpers';
import { DropDown, AnimatedCounter, Tooltip } from '../UI';
import { SectionTitle, BlackBoxContainer } from '../Blocks';

import { ProviderContainer, AssetContainer } from './styles';

const Provider = ({ contracts, vaults, market, rates, isDropDown = true }) => {
  const vault = find(vaults, v => v.borrowAsset.name === market);
  const activeProvider = useContractReader(contracts, vault?.name, 'activeProvider');
  const [defaultOption, setDefaultOption] = useState({});
  const [options, setOptions] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  useEffect(() => {
    if (vault) {
      let tmpDefaultOption;
      const tmpOptions = vault.providers.map(provider => {
        const option = {
          title: provider.title,
          rate: Number(rates?.[provider.id]?.[vault.borrowAsset.id] || 0).toFixed(2),
        };
        if (contracts?.[provider.name]?.address === activeProvider) tmpDefaultOption = option;
        return option;
      });
      setOptions(tmpOptions);
      setDefaultOption(tmpDefaultOption);
    }
  }, [rates, activeProvider, vault, contracts]);

  return (
    <ProviderContainer isMobile={isMobile}>
      {isMobile || isTablet ? (
        <Box
          width={1 / 1}
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          color="#42FF00"
          fontSize="28px"
          fontWeight="700"
        >
          <AnimatedCounter countTo={defaultOption?.rate} /> %
        </Box>
      ) : isDropDown ? (
        <Flex flexDirection="column" width={1}>
          <Flex alignItems="center" mb={3}>
            <AssetContainer hasBottomBorder>
              <Image
                alt={vault?.borrowAsset.name}
                src={vault?.borrowAsset.icon}
                width="24px"
                height="24px"
              />
              <Text fontSize={2} fontWeight="bold" ml={2}>
                {vault?.borrowAsset.name}
              </Text>
            </AssetContainer>
          </Flex>
          <Flex>
            <DropDown options={options} defaultOption={defaultOption} />
          </Flex>
        </Flex>
      ) : (
        <Flex flexDirection="column" width={1}>
          <AssetContainer hasBottomBorder>
            <Image
              alt={vault?.borrowAsset.name}
              src={vault?.borrowAsset.icon}
              width="32px"
              height="32px"
            />
            <Text fontSize={2} fontWeight="bold" ml={2}>
              {vault?.borrowAsset.name}
            </Text>
          </AssetContainer>
          {options?.map(option => (
            <AssetContainer flexDirection="row" hasBottomBorder key={Math.random()}>
              <Box width={5 / 7} cursor="pointer">
                {option.title}
              </Box>
              <Box
                width={2 / 7}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                color={option.title === defaultOption?.title && '#42FF00'}
              >{`${option.rate} %`}</Box>
            </AssetContainer>
          ))}
        </Flex>
      )}
    </ProviderContainer>
  );
};

function formatRate(rate) {
  const r = (parseFloat(`${rate}`) / 1e27) * 100;
  return rate ? r : undefined;
}

function ProvidersList({
  markets,
  title = 'Borrow APR',
  isDropDown = true,
  hasBlackContainer = true,
}) {
  const contracts = useContractLoader();

  const { vaults } = useResources();

  const [rates, setRates] = useState({});

  useEffect(() => {
    async function setup() {
      const tmpRates = {};
      for (let i = 0; i < vaults.length; i += 1) {
        const vault = vaults[i];
        for (let p = 0; p < vault.providers.length; p += 1) {
          const provider = vault.providers[p];
          // eslint-disable-next-line no-await-in-loop
          const rate = await CallContractFunction(contracts, provider.name, 'getBorrowRateFor', [
            vault.borrowAsset.address,
          ]);
          tmpRates[provider.id] = {
            ...tmpRates[provider.id],
            [vault.borrowAsset.id]: formatRate(rate),
          };
        }
      }
      setRates(tmpRates);
    }
    if (vaults && contracts) setup();
  }, [contracts, vaults]);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  return (
    <BlackBoxContainer
      zIndex={1}
      hasBlackContainer={hasBlackContainer}
      padding={hasBlackContainer && '32px 28px'}
    >
      <SectionTitle
        fontSize={isMobile ? '16px' : isTablet ? '18px' : '16px'}
        mb={isMobile ? '16px' : isTablet ? '20px' : '-12px'}
      >
        {title}
        {!isMobile && !isTablet && (
          <Tooltip>
            <InfoOutlinedIcon />
            <span>
              Live fetching borrow rates from underlying protocols that provide liquidity.
            </span>
          </Tooltip>
        )}
      </SectionTitle>

      {markets &&
        markets.map(market => (
          <Provider
            key={market}
            contracts={contracts}
            vaults={vaults}
            market={market}
            rates={rates}
            isDropDown={isDropDown}
          />
        ))}
    </BlackBoxContainer>
  );
}
export default ProvidersList;
