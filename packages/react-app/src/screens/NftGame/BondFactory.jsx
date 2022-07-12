import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Box, Flex, Text } from 'rebass';
import { useProfileInfo } from 'hooks';
import { CircularProgress } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { CountButton } from '../../components/UI';
import { BlackBoxContainer, SectionTitle, Description } from 'components';
import { AmountInput, BuyButton } from 'components/NftItemPanel/styles';

function Bond({ bg = 'white', color = 'black', width, months }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  return (
    <Box width={width}>
      <Box backgroundColor={bg} sx={{ borderRadius: '8px' }} p={3} m={1} textAlign="center">
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
            <CountButton
              backgroundColor={bg}
              foreColor={color}
              onClick={() => setAmount(amount - 1)}
            >
              -
            </CountButton>
            <AmountInput
              value={amount}
              theme={{ buttonColor: color, foreColor: color }}
              type="number"
              onChange={e => setAmount(parseInt(e.target.value, 10))}
            />
            <CountButton
              foreColor={color}
              backgroundColor={bg}
              onClick={() => setAmount(amount + 1)}
            >
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

function BondFactory() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const { points, isLoading } = useProfileInfo();

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <Flex alignItems="bottom">
        <SectionTitle primary fontSize="32px">
          {points.toLocaleString()}
        </SectionTitle>
        <SectionTitle fontSize="14px" fontWeight="light" ml={2} mt={2} spanFontSize="12px">
          Locked Meter points
        </SectionTitle>
      </Flex>

      <Description
        mt={4}
        title="What is a token bond ?"
        description="A bond is redeemable against token. The longer the bond, the higher the amont of tokens redeemable."
      />

      <Flex mt={4} flexWrap="wrap">
        <Bond months="3" width={[1, 1 / 3]} />
        <Bond bg="#735CDD" color="white" months="6" width={[1, 1 / 3]} />
        <Bond bg="#A5243D" color="white" months="12" width={[1, 1 / 3]} />
      </Flex>
    </BlackBoxContainer>
  );
}

export default BondFactory;
