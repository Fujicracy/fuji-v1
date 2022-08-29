import React from 'react';
import { Box, Flex, Text } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, NFT_GAME_MARKETPLACE_BOND_LINK } from 'consts';
import { BuyButton } from './NftItemPanel/styles';
import { useBondBalance } from 'hooks';
import { ExternalLink } from './UI';

function BondBalance({ bg = 'white', color = 'black', width, height = '180px', months }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const balances = useBondBalance();

  return (
    <Box width={width}>
      <Box
        backgroundColor={bg}
        sx={{ borderRadius: '8px' }}
        p={3}
        m={2}
        textAlign="center"
        height={height}
      >
        <Flex flexDirection="column" justifyContent="space-around" height="100%">
          <Text color={color} fontSize="1.5rem" lineHeight="1.5rem" fontWeight="bold">
            You own
          </Text>
          <Text color={color} fontSize="4rem" lineHeight="4rem" fontWeight="bold">
            {balances[months * 30] ?? 0}
          </Text>
          <ExternalLink href={NFT_GAME_MARKETPLACE_BOND_LINK}>
            <BuyButton mt={isMobile ? '12px' : '16px'} theme={{ foreColor: color }}>
              Trade
            </BuyButton>
          </ExternalLink>
        </Flex>
      </Box>
    </Box>
  );
}
export default BondBalance;
