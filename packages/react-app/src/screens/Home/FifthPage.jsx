import React from 'react';
import { Button } from 'components/UI';
import { Flex } from 'rebass';

import { BlackBoxContainer, Label } from 'components';
import { APP_URL } from 'consts';

import { HomeContainer, VerticalLine, PageContainter } from './styles';

function FifthPage() {
  const handleLearnClick = () => {
    window.open('https://docs.fujidao.org/', '_blank');
  };

  return (
    <PageContainter>
      <HomeContainer>
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
    </PageContainter>
  );
}

export default FifthPage;
