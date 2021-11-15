import React from 'react';
import { useSpring, config } from 'react-spring';
import { Button } from 'components/UI';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BlackBoxContainer, Label } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES, APP_URL } from 'consts';

import { HomeContainer, VerticalLine } from './styles';

function Home() {
  const props = useSpring({
    from: {
      factor: 1,
      opacity: 0,
    },
    to: { factor: 150, opacity: 1 },
    config: { duration: 800, ...config.molasses },
  });

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const handleLearnClick = () => {
    window.open('https://docs.fujidao.org/', '_blank');
  };
  console.log({ isMobile, isTablet });

  return (
    <HomeContainer style={props}>
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        height="100%"
        marginTop="-50px"
      >
        <BlackBoxContainer hasBlackContainer width="424px" height="240px">
          <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
            <Label color="textLabel" fontSize={4} ml={6} mr={6} lineHeight="26px">
              Learn more about the protocol with the full documentation.
            </Label>
            <Button
              onClick={handleLearnClick}
              outline
              fontSize="18px"
              width={168}
              height={48}
              mt={3}
            >
              Learn +
            </Button>
          </Flex>
        </BlackBoxContainer>

        <Flex height="240px" alignItems="center" justifyContent="center">
          <VerticalLine />
        </Flex>

        <BlackBoxContainer hasBlackContainer width="424px" height="240px">
          <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
            <Label color="textLabel" fontSize={4} ml={6} mr={6} lineHeight="26px">
              Time to meet the dashboard and it’s borrowing tools.
            </Label>

            <Button
              color="white"
              fontSize="18px"
              width={168}
              height={48}
              mt={3}
              onClick={() => {
                window.location = `${APP_URL}/#/dashboard`;
              }}
            >
              App
            </Button>
          </Flex>
        </BlackBoxContainer>
      </Flex>
    </HomeContainer>
  );
}

export default Home;
