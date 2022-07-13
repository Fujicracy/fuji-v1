import React from 'react';
import { Box, Flex, Text } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { BuyButton } from './NftItemPanel/styles';

function BondBalance({ bg = 'white', color = 'black', width, height = '180px', months }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

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
            12
          </Text>
          {/* TODO: Change button to link */}
          <BuyButton
            mt={isMobile ? '12px' : '16px'}
            theme={{ foreColor: color }}
            onClick={() => alert('not implemented')}
          >
            Trade
          </BuyButton>
        </Flex>
      </Box>
    </Box>
  );
}
export default BondBalance;
