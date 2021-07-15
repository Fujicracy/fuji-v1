import React, { useState, useEffect } from 'react';
// import { useSpring, animated, config } from 'react-spring';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import { find } from 'lodash';
import { VAULTS } from 'consts/vaults';
import { Image, Box, Text } from 'rebass';
import { useContractReader, useRates } from '../../hooks';
import { DropDown } from '../UI';
import { SectionTitle, BlackBoxContainer } from '../Blocks';
import './styles.css';
import { ProviderContainer, AssetContainer } from './styles';

const Provider = ({ contracts, market, rates }) => {
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
      <Box width={1 / 3} alignItems="center">
        <AssetContainer>
          <Image
            alt={vault.borrowAsset.name}
            src={vault.borrowAsset.image}
            width="32px"
            height="32px"
          />
          <Text fontSize={2} fontWeight="bold" ml={2}>
            {vault.borrowAsset.name}
          </Text>
        </AssetContainer>
      </Box>
      <Box width={2 / 3} ml={2}>
        <DropDown options={options} defaultOption={defaultOption} />
      </Box>
    </ProviderContainer>
  );
};

function ProvidersList({ contracts, markets }) {
  const rates = useRates(contracts);
  return (
    <BlackBoxContainer mt={4} zIndex={1}>
      <SectionTitle mb={4}>
        <Typography variant="h3">Borrow APR</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            Live fetching borrow rates from underlying protocols that provide liquidity.
          </span>
        </div>
      </SectionTitle>

      {markets &&
        markets.map(market => (
          <Provider key={market} contracts={contracts} market={market} rates={rates} />
        ))}
    </BlackBoxContainer>
  );
}
export default ProvidersList;
