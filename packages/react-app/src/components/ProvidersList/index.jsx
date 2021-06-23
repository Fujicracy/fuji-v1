import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';

import { useContractReader, useRates } from '../../hooks';

import './styles.css';

// TODO: Mark - refactor to support multi chains

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

function ProvidersList({ contracts, markets }) {
  const activeProviderDai = useContractReader(contracts, 'VaultETHDAI', 'activeProvider');
  const activeProviderUsdc = useContractReader(contracts, 'VaultETHUSDC', 'activeProvider');
  const activeProviderUsdt = useContractReader(contracts, 'VaultETHUSDT', 'activeProvider');

  const providerAave = contracts && contracts.ProviderAave;
  const providerCompound = contracts && contracts.ProviderCompound;
  const providerDYDX = contracts && contracts.ProviderDYDX;
  const providerIronBank = contracts && contracts.ProviderIronBank;

  const rates = useRates(contracts);

  return (
    <div className="dark-block providers-block">
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
        {markets && markets.includes('DAI') && (
          <div className="provider">
            <div className="title">
              <img alt="dai" src="/DAI.png" />
              <Typography variant="h3">DAI</Typography>
            </div>
            <div className="stats">
              <div className={providerAave?.address === activeProviderDai ? 'stat best' : 'stat'}>
                <span className="name">Aave</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.aave.dai} /> %
                </span>
              </div>

              <div
                className={providerCompound?.address === activeProviderDai ? 'stat best' : 'stat'}
              >
                <span className="name">Compound</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.compound.dai} /> %
                </span>
              </div>

              <div className={providerDYDX?.address === activeProviderDai ? 'stat best' : 'stat'}>
                <span className="name">dYdX</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.dydx.dai} /> %
                </span>
              </div>

              <div
                className={providerIronBank?.address === activeProviderDai ? 'stat best' : 'stat'}
              >
                <span className="name">Iron Bank</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.ironbank.dai} /> %
                </span>
              </div>
            </div>
          </div>
        )}

        {markets && markets.includes('USDC') && (
          <div className="provider">
            <div className="title">
              <img alt="usdc" src="/USDC.png" />
              <Typography variant="h3">USDC</Typography>
            </div>
            <div className="stats">
              <div className={providerAave?.address === activeProviderUsdc ? 'stat best' : 'stat'}>
                <span className="name">Aave</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.aave.usdc} /> %
                </span>
              </div>

              <div
                className={providerCompound?.address === activeProviderUsdc ? 'stat best' : 'stat'}
              >
                <span className="name">Compound</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.compound.usdc} /> %
                </span>
              </div>

              <div className={providerDYDX?.address === activeProviderUsdc ? 'stat best' : 'stat'}>
                <span className="name">dYdX</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.dydx.usdc} /> %
                </span>
              </div>

              <div
                className={providerIronBank?.address === activeProviderUsdc ? 'stat best' : 'stat'}
              >
                <span className="name">Iron Bank</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.ironbank.usdc} /> %
                </span>
              </div>
            </div>
          </div>
        )}

        {markets && markets.includes('USDT') && (
          <div className="provider">
            <div className="title">
              <img alt="usdt" src="/USDT.png" />
              <Typography variant="h3">USDT</Typography>
            </div>
            <div className="stats">
              <div className={providerAave?.address === activeProviderUsdt ? 'stat best' : 'stat'}>
                <span className="name">Aave</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.aave.usdt} /> %
                </span>
              </div>

              <div
                className={providerCompound?.address === activeProviderUsdt ? 'stat best' : 'stat'}
              >
                <span className="name">Compound</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.compound.usdt} /> %
                </span>
              </div>

              {/* <div className={providerDYDX?.address === activeProviderUsdt ? 'stat best' : 'stat'}>
                <span className="name">dYdX</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.dydx.usdt} /> %
                </span>
              </div> */}

              <div
                className={providerIronBank?.address === activeProviderUsdt ? 'stat best' : 'stat'}
              >
                <span className="name">Iron Bank</span>
                <span className="number">
                  <AnimatedCounter countTo={rates.ironbank.usdt} /> %
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProvidersList;
