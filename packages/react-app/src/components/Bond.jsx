import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Box, Flex, Text } from 'rebass';
import { CircularProgress } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES, NFT_GAME_BOND_PRICE } from 'consts';
import { CountButton } from 'components/UI';
import { AmountInput, BuyButton } from 'components/NftItemPanel/styles';
import { useAuth, useContractLoader } from 'hooks';
import { Transactor } from 'helpers';

function Bond({ bg = 'white', color = 'black', width, months, points }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const [amount, setAmount] = useState(0);
  useEffect(() => {
    if (amount * NFT_GAME_BOND_PRICE > points) {
      setError(`You don't have enought points.`);
    } else {
      setError('');
    }
  }, [amount, points]);

  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState('');

  const { provider } = useAuth();
  const contracts = useContractLoader();
  const tx = Transactor(provider);

  const onChangeAmount = value => {
    if (value * NFT_GAME_BOND_PRICE > points) {
      setError(`You don't have enought points.`);
    }
    setAmount(value);
  };

  const buy = async () => {
    if (amount < 1) {
      return;
    }

    if (points < amount * NFT_GAME_BOND_PRICE) {
      return;
    }

    setIsBuying(true);
    try {
      const days = months * 30; // We consider each month is 30 days
      await tx(contracts.NFTInteractions.mintBonds(days, amount));
    } catch (error) {
      console.error(error);
    } finally {
      setIsBuying(false);
      setAmount(0);
    }
  };

  return (
    <Box width={width}>
      <Box backgroundColor={bg} sx={{ borderRadius: '8px' }} p={3} m={2} textAlign="center">
        <Text color={color} fontSize="1.5rem" fontWeight="bold">
          {months} month bond
        </Text>
        <Box color={color} mt={3}>
          <Text fontSize="1.5rem" fontWeight="bold" display="inline">
            {NFT_GAME_BOND_PRICE}
          </Text>
          <Text fontSize=".8rem" display="inline">
            {' '}
            Meter points
          </Text>
        </Box>

        <Flex
          mt={isMobile ? '10px' : '16px'}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            <CountButton
              foreColor={color}
              onClick={() => onChangeAmount(amount - 1)}
              disabled={amount < 1}
            >
              -
            </CountButton>
            <AmountInput
              value={amount}
              theme={{ foreColor: color }}
              type="number"
              onChange={e => onChangeAmount(+e.target.value)}
            />
            <CountButton foreColor={color} onClick={() => onChangeAmount(amount + 1)}>
              +
            </CountButton>
          </Flex>
          {error && (
            <Text fontSize=".8rem" color={color}>
              ⚠️ {error}
            </Text>
          )}
          <BuyButton mt={isMobile ? '12px' : '16px'} theme={{ foreColor: color }} onClick={buy}>
            {isBuying && (
              <CircularProgress size={16} value={15} style={{ marginRight: '8px', color }} />
            )}
            Buy
          </BuyButton>
        </Flex>
      </Box>
    </Box>
  );
}

export default Bond;
