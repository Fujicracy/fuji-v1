import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { BlackBoxContainer, Label } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { Flex, Link } from 'rebass';

function LockingCeremony() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <Flex flexDirection="column" alignItems="flex-start">
        <Label color="white" fontSize={5} fontWeight={500}>
          Congratulations!
        </Label>
        <Label
          color="white"
          fontSize="14px"
          fontWeight={500}
          mt="8px"
          textAlign="left"
          lineHeight="20px"
        >
          You are about to summit.
        </Label>

        <Label color="white" fontSize="1rem" mt="5">
          You can still trade Climbing Gears on the
          <Link color="#fa266c" href="#not-yet">
            {' '}
            marketplace
          </Link>
        </Label>
      </Flex>
    </BlackBoxContainer>
  );
}
export default LockingCeremony;
