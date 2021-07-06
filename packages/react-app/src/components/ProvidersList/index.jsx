import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import { find } from 'lodash';
import { VAULTS } from 'constants/vaults';
import { useContractReader, useRates } from '../../hooks';

import { SectionTitle, BlackBoxContainer } from '../Blocks';
import './styles.css';

function AnimatedCounter({ countTo }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: Number(countTo || 0),
    config: config.stiff,
  });

  return (
    <animated.span>
      {countTo
        ? number.to(n => {
            return n.toFixed(2);
          })
        : '...'}
    </animated.span>
  );
}

const Provider = ({ contracts, market, rates }) => {
  const vault = find(VAULTS, v => v.borrowAsset.name === market);

  const activeProvider = useContractReader(contracts, vault.name, 'activeProvider');
  return (
    <div className="provider">
      <div className="title">
        <img alt={vault.borrowAsset.name} src={vault.borrowAsset.image} />
        <Typography variant="h3">{vault.borrowAsset.name}</Typography>
      </div>
      <div className="stats">
        {vault.providers.map(provider => (
          <div
            key={`${vault.name}-${provider.id}`}
            className={
              contracts?.[provider.name]?.address === activeProvider ? 'stat best' : 'stat'
            }
          >
            <span className="name">{provider.title}</span>
            <span className="number">
              <AnimatedCounter countTo={rates?.[provider.id]?.[vault.borrowAsset.id]} /> %
            </span>
          </div>
        ))}
      </div>
    </div>
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

      <div className="providers">
        {markets &&
          markets.map(market => (
            <Provider key={market} contracts={contracts} market={market} rates={rates} />
          ))}
      </div>
    </BlackBoxContainer>
  );
}
export default ProvidersList;
