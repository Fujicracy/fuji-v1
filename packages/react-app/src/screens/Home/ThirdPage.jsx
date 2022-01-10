import React from 'react';
import { HomepageTitle, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Grid } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiLanding2, fujiLandingMobile } from '../../assets/images';

import { HomeContainer, PageContainter } from './styles';

function ThirdPage() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  return (
    <PageContainter>
      <HomeContainer>
        <Grid container spacing={isTablet ? 10 : 6}>
          {isMobile || isTablet ? (
            <>
              <Grid item xs={12} md={6}>
                <Image src={isMobile ? fujiLandingMobile : fujiLanding2} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Flex
                  flexDirection="column"
                  width="100%"
                  justifyContent="center"
                  alignItems={isMobile || isTablet ? 'center' : 'left'}
                  height="100%"
                  marginTop={isTablet && '-24px'}
                  padding={isMobile ? '0px 30px' : isTablet ? '0px 64px' : '0px'}
                >
                  <Flex flexDirection="column">
                    <HomepageTitle
                      firstWord="Fuji Constantly"
                      secondWord="Scans"
                      thirdWord={isMobile ? 'Borrow' : 'Borrow Markets'}
                      fourthWord={isMobile ? 'Markets' : undefined}
                    />

                    <SectionTitle
                      fontWeight="normal"
                      fontSize={isMobile ? '20px' : '23px'}
                      textAlign="left"
                      lineHeight="130%"
                      fontFamily="Nexa Regular"
                    >
                      <p>
                        <br />
                        Routing your loan through Fuji {isMobile && <br />} ensures you get
                        {!isMobile && <br />} the best borrow {isMobile && <br />} rate, aggregated
                        across all
                        {isMobile && <br />} providers.
                        <br />
                        <br />
                        Better opportunity?{isMobile && <br />} The protocol automatically
                        <br /> refinances the whole pool of {isMobile && <br />} loans to the new
                        lowest APR.
                      </p>
                    </SectionTitle>
                  </Flex>
                </Flex>
              </Grid>
            </>
          ) : (
            <>
              <Grid
                item
                xs={12}
                md={6}
                container
                direction="row"
                justifyContent={isMobile || isTablet ? 'center' : 'flex-end'}
                alignItems="center"
              >
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="left"
                  height="100%"
                >
                  <HomepageTitle
                    firstWord="Fuji Constantly"
                    secondWord="Scans"
                    thirdWord="Borrow Markets"
                  />

                  <SectionTitle
                    fontWeight="normal"
                    fontSize="23px"
                    textAlign="left"
                    lineHeight="130%"
                    fontFamily="Nexa Regular"
                  >
                    <p>
                      <br />
                      Routing your loan through Fuji ensures you get
                      <br /> the best borrow rate, aggregated across all providers.
                      <br />
                      <br />
                      Better opportunity? The protocol automatically
                      <br /> refinances the whole pool of loans to the new lowest APR.
                    </p>
                  </SectionTitle>
                </Flex>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                container
                direction="row"
                justifyContent={isMobile || isTablet ? 'center' : 'flex-start'}
                alignItems="center"
              >
                <Image src={fujiLanding2} />
              </Grid>
            </>
          )}
        </Grid>
      </HomeContainer>
    </PageContainter>
  );
}

export default ThirdPage;