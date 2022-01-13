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
  const [isShowLogo, setIsShowLogo] = useState(false);

  const handlePageChange = number => {
    setCurrentPage(number);
    setIsShowLogo(number !== 0);
  };

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  if (!windowDimensions.width || !windowDimensions.height) return <Loader />;

  const designDimension = {
    width: isMobile ? 375 : 768,
    height: isMobile ? 812 : 1024,
  };

  const ratio = {
    xAxios: Math.min(windowDimensions.width / designDimension.width, 1),
    yAxios: Math.min(windowDimensions.height / designDimension.height, 1),
  };

  const titleFontSize = isMobile || isTablet ? calcResponsiveSize(ratio, isMobile ? 44 : 48) : 48;

  const descriptionFontSize =
    isMobile || isTablet ? calcResponsiveSize(ratio, isMobile ? 20 : 23) : 23;

  return windowDimensions.height < DESKTOP_MINIMUM_HEIGHT && !isMobile && !isTablet ? (
    <Flex justifyContent="center" alignItems="center" width="100%">
      <ErrorContainer>
        <Title>
          <ErrorBrand>The height of window is too small</ErrorBrand>
          <ErrorText>&gt; Please, increase the height!</ErrorText>
        </Title>
      </ErrorContainer>
    </Flex>
  ) : (
    <>
      {!isMobile && !isTablet && <LandingHeader isShowLogo={isShowLogo} />}

      {currentPage !== null && currentPage !== 0 && !isMobile && !isTablet && (
        <CirclePagination
          count={isMobile || isTablet ? 4 : 5}
          index={currentPage}
          onDotClick={handlePageChange}
        />
      )}

      <ReactPageScroller
        onBeforePageScroll={handlePageChange}
        customPageNumber={currentPage}
        containerWidth={windowDimensions.width}
        containerHeight={
          isMobile || isTablet ? windowDimensions.height : windowDimensions.height - 100
        }
        renderAllPagesOnFirstRender
      >
        <FirstComponent
          onClickAnimation={() => setCurrentPage(currentPage + 1)}
          titleFontSize={titleFontSize}
        />
        <SecondComponent titleFontSize={titleFontSize} descriptionFontSize={descriptionFontSize} />
        <ThirdComponent titleFontSize={titleFontSize} descriptionFontSize={descriptionFontSize} />
        <FourthComponent titleFontSize={titleFontSize} descriptionFontSize={descriptionFontSize} />
        {!isMobile && !isTablet && <FifthComponent />}
      </ReactPageScroller>
    </>
  );
};

export default HomePage;
