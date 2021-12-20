import React from 'react';
import { HomepageTitle, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Grid } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiAlice1 } from '../../assets/images';

import { HomeContainer, PageContainter } from './styles';

function SecondPage() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  console.log({ isMobile, isTablet });
  return (
    <PageContainter>
      <HomeContainer>
        <Grid container spacing={isTablet ? 10 : 6} m={6}>
          <Grid
            item
            container
            xs={12}
            md={6}
            direction="row"
            justifyContent={isMobile || isTablet ? 'center' : 'flex-end'}
            alignItems="center"
          >
            <Image src={fujiAlice1} width={isMobile ? '328px' : 'auto'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Flex
              flexDirection="column"
              width="100%"
              justifyContent="center"
              alignItems={isMobile || isTablet ? 'center' : 'left'}
              height="100%"
              padding={isMobile ? '0px 30px' : isTablet ? '16px 64px' : '0px'}
            >
              <Flex flexDirection="column">
                <HomepageTitle
                  firstWord="Borrow Rates"
                  secondWord="Fluctuate"
                  thirdWord={isMobile ? '' : 'All The Time'}
                  fourthWord={isMobile ? 'All The Time' : undefined}
                />

                <SectionTitle
                  fontWeight="normal"
                  fontSize={isMobile ? '20px' : '23px'}
                  textAlign="left"
                  lineHeight="130%"
                  fontFamily="Nexa Regular"
                >
                  <br />
                  Ever borrowed in DeFi?{isMobile && <br />}Taking out a loan at 5%
                  {!isMobile && <br />}and {isMobile && <br />} paying 15% shortly after is
                  {isMobile && <br />} an everyday reality. <br />
                  <br />
                  Manually comparing loan{isMobile && <br />} providers is a tedious task,
                  <br /> refinancing as rates change{isMobile && <br />} is expensive in gas and
                  time.
                </SectionTitle>
              </Flex>
            </Flex>
          </Grid>
        </Grid>
      </HomeContainer>
    </PageContainter>
  );
}

export default SecondPage;
