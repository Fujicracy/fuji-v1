import React, { useState, useEffect } from 'react';
// import { useSpring, animated, config } from 'react-spring';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import { find } from 'lodash';
import { VAULTS } from 'consts/vaults';
import { Image, Box, Text, Flex } from 'rebass';
// import { useSpring, animated, config } from 'react-spring';
import { useContractReader, useRates } from '../../hooks';
import { DropDown } from '../UI';
import { SectionTitle, BlackBoxContainer } from '../Blocks';
import './styles.css';
import { ProviderContainer, AssetContainer } from './styles';

// function AnimatedCounter({ countTo }) {
//   const { number } = useSpring({
//     from: { number: 0 },
//     number: Number(countTo || 0),
//     config: config.stiff,
//   });

//   return (
//     <animated.span>
//       {countTo
//         ? number.to(n => {
//             return n.toFixed(2);
//           })
//         : '...'}
//     </animated.span>
//   );
// }

const Provider = ({ contracts, market, rates, isDropDown = true, isSelectable }) => {
  const vault = find(VAULTS, v => v.borrowAsset.name === market);
  const activeProvider = useContractReader(contracts, vault.name, 'activeProvider');
  const [defaultOption, setDefaultOption] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
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
  }, [rates, activeProvider, vault.providers, vault.borrowAsset.id, contracts]);

  return (
    <ProviderContainer>
      {isDropDown ? (
        <>
          <Box width={1 / 3} alignItems="center">
            <AssetContainer>
              <Image
                alt={vault.borrowAsset.name}
                src={vault.borrowAsset.icon}
                width="32px"
                height="32px"
              />
              <Text fontSize={2} fontWeight="bold" ml={2}>
                {vault.borrowAsset.name}
              </Text>
            </AssetContainer>
          </Box>
          <Box width={2 / 3} ml={2}>
            <DropDown options={options} defaultOption={defaultOption} isSelectable={isSelectable} />
          </Box>
        </>
      ) : (
        <Flex flexDirection="column" width={1}>
          <AssetContainer hasBottomBorder>
            <Image
              alt={vault.borrowAsset.name}
              src={vault.borrowAsset.icon}
              width="32px"
              height="32px"
            />
            <Text fontSize={2} fontWeight="bold" ml={2}>
              {vault.borrowAsset.name}
            </Text>
          </AssetContainer>
          {options?.map(option => (
            <AssetContainer flexDirection="row" ml={4} mt={3} hasBottomBorder key={Math.random()}>
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

function ProvidersList({
  contracts,
  markets,
  title = 'Providers',
  isDropDown = true,
  hasBlackContainer = true,
  isSelectable = true,
}) {
  const rates = useRates(contracts);
  return (
    <BlackBoxContainer mt={4} zIndex={1} hasBlackContainer={hasBlackContainer}>
      <SectionTitle mb={1}>
        <Typography variant="h3">{title}</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            Live fetching borrow rates from underlying protocols that provide liquidity.
          </span>
        </div>
      </SectionTitle>

      {markets &&
        markets.map(market => (
          <Provider
            key={market}
            contracts={contracts}
            market={market}
            rates={rates}
            isDropDown={isDropDown}
            isSelectable={isSelectable}
          />
        ))}
    </BlackBoxContainer>
  );
}
export default ProvidersList;
