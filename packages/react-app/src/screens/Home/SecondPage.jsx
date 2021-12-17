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

  return (
    <PageContainter>
      <HomeContainer>
        <Grid container spacing={6} m={6}>
          <Grid
            item
            container
            xs={12}
            md={6}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Image src={fujiAlice1} width={isMobile ? '328px' : 'auto'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Flex
              flexDirection="column"
              width="100%"
              justifyContent="center"
              alignItems="left"
              height="100%"
              padding={isMobile ? '0px 30px' : isTablet ? '16px 64px' : '0px'}
            >
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
                Ever borrowed in DeFi? Taking out a loan at 5%
                <br /> and paying 15% shortly after is an everyday reality. <br />
                <br />
                Manually comparing loan providers is a tedious task, refinancing as rates change is
                expensive in gas and time.
              </SectionTitle>
            </Flex>
          </Grid>
        </Grid>
      </HomeContainer>
    </PageContainter>
  );
}

export default SecondPage;
