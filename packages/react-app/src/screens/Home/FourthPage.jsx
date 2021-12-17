import React from 'react';
import { HomepageTitle, SectionTitle, Button } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, APP_URL } from 'consts';
import { fujiAlice2, fujiAliceMobile } from 'assets/images';

import { HomeContainer, PageContainter } from './styles';

function FourthPage() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const handleLearnClick = () => {
    window.open('https://docs.fujidao.org/', '_blank');
  };

  return (
    <PageContainter>
      <HomeContainer>
        <Flex
          flexDirection={isMobile || isTablet ? 'column' : 'row'}
          width="100%"
          height="100%"
          alignItems={isMobile || isTablet ? 'center' : 'left'}
        >
          <Image
            src={isMobile || isTablet ? fujiAliceMobile : fujiAlice2}
            minWidth="auto"
            width={isMobile ? '328px' : isTablet ? '512px' : 'auto'}
          />

          <Flex
            flexDirection="column"
            width="100%"
            justifyContent="center"
            alignItems={isTablet ? 'center' : 'left'}
            padding={isMobile || isTablet ? '40px 30px 16px' : '0px'}
            marginLeft={!isMobile && !isTablet && '-360px'}
          >
            <HomepageTitle firstWord="All-in-One" secondWord="Smart" thirdWord="Borrow" />

            <SectionTitle
              fontWeight="normal"
              fontSize={isMobile ? '20px' : '24px'}
              textAlign="left"
              lineHeight={isMobile ? '160%' : '190%'}
              fontFamily="Nexa Regular"
            >
              <br />
              &bull; Aggregated Borrow APR <br />
              &bull; Automatic Loan Refinancing
              <br />
              &bull; Non-Custodial Loan Routing <br />
              &bull; Rebates On Gas Costs
            </SectionTitle>
          </Flex>

          {(isMobile || isTablet) && (
            <Flex
              flexDirection={isMobile ? 'column' : 'row'}
              width="100%"
              justifyContent="center"
              padding="0px 30px"
            >
              <Button
                block={isMobile}
                onClick={handleLearnClick}
                outline
                width={224}
                fontSize="18px"
                height={48}
                mt={3}
              >
                Learn +
              </Button>

              <Button
                block={isMobile}
                color="white"
                fontSize="18px"
                width={224}
                height={48}
                mt={3}
                ml={isTablet && '32px'}
                onClick={() => {
                  window.location = `${APP_URL}/#/dashboard`;
                }}
              >
                Go to App
              </Button>
            </Flex>
          )}
        </Flex>
      </HomeContainer>
    </PageContainter>
  );
}

export default FourthPage;
