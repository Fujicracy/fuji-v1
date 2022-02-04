import React from 'react';
import { HomepageTitle, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Trans, useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiLanding2, fujiLandingMobile } from '../../assets/images';

import { HomeContainer, PageContainter } from './styles';

function ThirdPage({ titleFontSize, descriptionFontSize }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const { t } = useTranslation();

  return (
    <PageContainter>
      <HomeContainer>
        <Grid
          container
          spacing={isTablet ? 10 : 6}
          direction={isMobile || isTablet ? 'column-reverse' : 'row'}
        >
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
              alignItems={isMobile || isTablet ? 'center' : 'left'}
              height="100%"
              marginTop={isTablet && '-24px'}
              padding={isMobile ? '0px 30px' : isTablet ? '0px 64px' : '0px'}
            >
              <Flex flexDirection="column">
                <HomepageTitle
                  firstWord={t('homepage.thirdPage.title_fujiConstantly')}
                  secondWord={t('homepage.thirdPage.title_scans')}
                  thirdWord={
                    isMobile
                      ? t('homepage.thirdPage.title_borrow')
                      : `${t('homepage.thirdPage.title_borrow')} ${t(
                          'homepage.thirdPage.title_markets',
                        )}`
                  }
                  fourthWord={isMobile ? t('homepage.thirdPage.title_markets') : undefined}
                  fontSize={titleFontSize}
                />

                <SectionTitle
                  fontWeight="normal"
                  fontSize={descriptionFontSize}
                  textAlign="left"
                  lineHeight="130%"
                  fontFamily="Nexa Regular"
                >
                  <p>
                    <br />
                    <Trans
                      i18nKey={
                        isMobile
                          ? 'homepage.thirdPage.descriptionMobile'
                          : 'homepage.thirdPage.description'
                      }
                      t={t}
                    >
                      Routing your loan through Fuji {isMobile && <br />} ensures you get
                      {!isMobile && <br />} the best borrow {isMobile && <br />} rate, aggregated
                      across all
                      {isMobile && <br />} providers.
                      <br />
                      <br />
                      Better opportunity?{isMobile && <br />} The protocol automatically
                      <br /> refinances the whole pool of {isMobile && <br />} loans to the new
                      lowest APR.
                    </Trans>
                  </p>
                </SectionTitle>
              </Flex>
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
            <Image
              src={isMobile ? fujiLandingMobile : fujiLanding2}
              width="auto"
              height={isMobile || isTablet ? '35vh' : '60vh'}
            />
          </Grid>
        </Grid>
      </HomeContainer>
    </PageContainter>
  );
}

export default ThirdPage;
