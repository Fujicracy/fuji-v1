import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';

import { ASSETS } from 'constants/assets';
import { useContractReader, useRates } from '../../hooks';

import { Container } from './styles';
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
  const asset = ASSETS[market];
  const activeProvider = useContractReader(contracts, asset.vault, 'activeProvider');

  return (
    <div className="provider">
      <div className="title">
        <img alt={asset.name} src={asset.image} />
        <Typography variant="h3">{asset.name}</Typography>
      </div>
      <div className="stats">
        {asset.providers.map(provider => (
          <div
            key={`${asset.id}-${provider.id}`}
            className={
              contracts?.[provider.name]?.address === activeProvider ? 'stat best' : 'stat'
            }
          >
            <span className="name">{provider.title}</span>
            <span className="number">
              <AnimatedCounter countTo={rates?.[provider.id]?.[asset.id]} /> %
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
    <Container>
      <div className="section-title">
        <Typography variant="h3">Borrow APR</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            Live fetching borrow rates from underlying protocols that provide liquidity.
          </span>
        </div>
      </div>

      <div className="providers">
        {markets &&
          markets.map(market => (
            <Provider key={market} contracts={contracts} market={market} rates={rates} />
          ))}
      </div>
    </Container>
  );
}
export default ProvidersList;
