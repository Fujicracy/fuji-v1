/* eslint-disable no-unused-vars */
import React from 'react';
import { HomepageTitle, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Trans, useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiAlice1 } from '../../assets/images';

import { HomeContainer, PageContainter } from './styles';

function SecondPage({ titleFontSize, descriptionFontSize }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const { t } = useTranslation();

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
            <Image src={fujiAlice1} height={isMobile || isTablet ? '35vh' : '60vh'} />
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
                  firstWord={t('homepage.secondPage.title_borrowRates')}
                  secondWord={t('homepage.secondPage.title_fluctuate')}
                  thirdWord={isMobile ? '' : t('homepage.secondPage.title_allTheTime')}
                  fourthWord={isMobile ? t('homepage.secondPage.title_allTheTime') : undefined}
                  fontSize={`${titleFontSize}px`}
                />

                <SectionTitle
                  fontWeight="normal"
                  fontSize={descriptionFontSize}
                  textAlign="left"
                  lineHeight="130%"
                  fontFamily="Nexa Regular"
                >
                  <br />

                  <Trans
                    t={t}
                    i18nKey={
                      isMobile
                        ? 'homepage.secondPage.descriptionMobile'
                        : 'homepage.secondPage.description'
                    }
                  >
                    Ever borrowed in DeFi?{isMobile && <br />} Taking out a loan at 5%
                    {!isMobile && <br />} and {isMobile && <br />} paying 15% shortly after is
                    {isMobile && <br />} an everyday reality. <br />
                    <br />
                    Manually comparing loan{isMobile && <br />} providers is a tedious task,
                    <br /> refinancing as rates change{isMobile && <br />} is expensive in gas and
                    time.`
                  </Trans>
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
