import React from 'react';
import { useSpring, config } from 'react-spring';
import { Button } from 'components/UI';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BlackBoxContainer, Label } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES, APP_URL } from 'consts';

import { HomeContainer, VerticalLine } from './styles';

function FifthPage() {
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
    <Flex flexDirection="column" justifyContent="center" alignItems="center" marginTop="104px">
      <HomeContainer style={props}>
        <Flex flexDirection="row" alignItems="center">
          <BlackBoxContainer hasBlackContainer width="424px" height="240px">
            <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
              <Label color="textLabel" fontSize={4} ml={6} mr={6} lineHeight="26px">
                Learn more about Fuji with our extensive documentation
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
                All clear? Time to up your borrow game to the next level
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
    </Flex>
  );
}

export default FifthPage;
