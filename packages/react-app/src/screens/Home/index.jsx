/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import ReactPageScroller from 'react-page-scroller';
import { useMediaQuery } from 'react-responsive';

import { LandingHeader, CirclePagination, Loader } from 'components';

import { BREAKPOINTS, BREAKPOINT_NAMES, DESKTOP_MINIMUM_HEIGHT } from 'consts';

import { useWindowSize } from 'hooks';
import { Flex } from 'rebass';
import { calcResponsiveSize } from 'helpers';

import FirstComponent from './FirstPage';
import SecondComponent from './SecondPage';
import ThirdComponent from './ThirdPage';
import FourthComponent from './FourthPage';
import FifthComponent from './FifthPage';

import { Title, ErrorBrand, ErrorText, ErrorContainer } from '../Error/styles';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const windowDimensions = useWindowSize();

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });
  const isDesktop = !isMobile && !isTablet;

  const designDimension = {
    width: isMobile ? 375 : isTablet ? 768 : 1440,
    height: isMobile ? 812 : isTablet ? 1024 : 1024,
  };

  const ratio = {
    xAxios: Math.min(windowDimensions.width / designDimension.width, 1),
    yAxios: Math.min(windowDimensions.height / designDimension.height, 1),
  };

  const titleFontSize = isMobile || isTablet ? calcResponsiveSize(ratio, isMobile ? 44 : 48) : 48;

  const descriptionFontSize =
    isMobile || isTablet ? calcResponsiveSize(ratio, isMobile ? 20 : 23) : 23;

  if (!windowDimensions.width || !windowDimensions.height) {
    return <Loader />;
  }
  if (isDesktop && windowDimensions.height < DESKTOP_MINIMUM_HEIGHT) {
    return (
      <Flex justifyContent="center" alignItems="center" width="100%">
        <ErrorContainer>
          <Title>
            <ErrorBrand>The height of window is too small</ErrorBrand>
            <ErrorText>&gt; Please, increase the height!</ErrorText>
          </Title>
        </ErrorContainer>
      </Flex>
    );
  }

  if (isDesktop) {
    return (
      <>
        <LandingHeader isShowLogo={currentPage > 0} height={calcResponsiveSize(ratio, 100)} />

        {currentPage > 0 && (
          <CirclePagination
            count={isMobile || isTablet ? 4 : 5}
            index={currentPage}
            onDotClick={number => setCurrentPage(number)}
          />
        )}

        <ReactPageScroller
          onBeforePageScroll={number => setCurrentPage(number)}
          customPageNumber={currentPage}
          containerWidth={windowDimensions.width}
          containerHeight={windowDimensions.height - calcResponsiveSize(ratio, 100)}
          renderAllPagesOnFirstRender
        >
          <FirstComponent
            onClickAnimation={() => setCurrentPage(currentPage + 1)}
            titleFontSize={titleFontSize}
          />
          <SecondComponent
            titleFontSize={titleFontSize}
            descriptionFontSize={descriptionFontSize}
          />
          <ThirdComponent titleFontSize={titleFontSize} descriptionFontSize={descriptionFontSize} />
          <FourthComponent
            titleFontSize={titleFontSize}
            descriptionFontSize={descriptionFontSize}
          />
          <FifthComponent />
        </ReactPageScroller>
      </>
    );
  }

  return (
    <>
      <FirstComponent
        onClickAnimation={() => setCurrentPage(currentPage + 1)}
        titleFontSize={titleFontSize}
      />
      <SecondComponent titleFontSize={titleFontSize} descriptionFontSize={descriptionFontSize} />
      <ThirdComponent titleFontSize={titleFontSize} descriptionFontSize={descriptionFontSize} />
      <FourthComponent titleFontSize={titleFontSize} descriptionFontSize={descriptionFontSize} />
    </>
  );
};

export default HomePage;
