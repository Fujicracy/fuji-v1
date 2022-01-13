import React from 'react';
import { HomepageTitle, SectionTitle, Button } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, APP_URL } from 'consts';
import { fujiAlice2, fujiAliceMobile } from 'assets/images';

import { HomeContainer, PageContainter } from './styles';

function FourthPage({ titleFontSize, descriptionFontSize }) {
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
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={isMobile || isTablet ? fujiAliceMobile : fujiAlice2}
            minWidth="auto"
            height={isMobile || isTablet ? '35vh' : '100%'}
          />

          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems={isTablet ? 'center' : 'left'}
            padding={isMobile || isTablet ? '5vh 0px 2vh' : '0px'}
            marginLeft={!isMobile && !isTablet && '-360px'}
          >
            <HomepageTitle
              firstWord="All-in-One"
              secondWord="Smart"
              thirdWord="Borrow"
              fontSize={titleFontSize}
            />

            <SectionTitle
              fontWeight="normal"
              fontSize={descriptionFontSize}
              textAlign="left"
              lineHeight={isMobile ? '160%' : '190%'}
              fontFamily="Nexa Regular"
            >
              <p>
                <br />
                &bull; Aggregated Borrow APR <br />
                &bull; Automatic Loan Refinancing
                <br />
                &bull; Non-Custodial Loan Routing <br />
                &bull; Rebates On Gas Costs
              </p>
            </SectionTitle>
            {(isMobile || isTablet) && (
              <Flex
                flexDirection={isMobile ? 'column' : 'row'}
                // width="100%"
                justifyContent="center"
                padding={!isMobile && '0px 4vh'}
              >
                <Button
                  block={isMobile}
                  onClick={handleLearnClick}
                  outline
                  width="24vh"
                  fontSize="2vh"
                  height="6vh"
                  mt="3vh"
                  noResizeOnResponsive
                >
                  Learn +
                </Button>

                <Button
                  block={isMobile}
                  color="white"
                  fontSize="2vh"
                  width="24vh"
                  height="6vh"
                  ml={isTablet && '32px'}
                  mt="3vh"
                  onClick={() => {
                    window.location = `${APP_URL}/#/dashboard`;
                  }}
                  noResizeOnResponsive
                >
                  Go to App
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </HomeContainer>
    </PageContainter>
  );
}

export default FourthPage;
