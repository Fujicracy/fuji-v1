import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Box, Flex, Text } from 'rebass';
import { CircularProgress } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { CountButton } from 'components/UI';
import { AmountInput, BuyButton } from 'components/NftItemPanel/styles';

function Bond({ bg = 'white', color = 'black', width, months }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  return (
    <Box width={width}>
      <Box backgroundColor={bg} sx={{ borderRadius: '8px' }} p={3} m={2} textAlign="center">
        <Text color={color} fontSize="1.5rem" fontWeight="bold">
          {months} month bond
        </Text>
        <Box color={color} mt={3}>
          <Text fontSize="1.5rem" fontWeight="bold" display="inline">
            10000
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
            <CountButton foreColor={color} onClick={() => setAmount(amount - 1)}>
              -
            </CountButton>
            <AmountInput
              value={amount}
              theme={{ foreColor: color }}
              type="number"
              onChange={e => setAmount(parseInt(e.target.value, 10))}
            />
            <CountButton foreColor={color} onClick={() => setAmount(amount + 1)}>
              +
            </CountButton>
          </Flex>
          <BuyButton
            mt={isMobile ? '12px' : '16px'}
            theme={{ foreColor: color }}
            onClick={() => alert('not implemented')}
          >
            {isBuying && (
              <CircularProgress
                style={{
                  width: 20,
                  height: 20,
                  marginRight: '16px',
                  color,
                }}
              />
            )}
            Buy
          </BuyButton>
        </Flex>
      </Box>
    </Box>
  );
}

export default Bond;
