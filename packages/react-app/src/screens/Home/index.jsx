import React, { useState, useEffect } from 'react';

import ReactPageScroller from 'react-page-scroller';
import { useMediaQuery } from 'react-responsive';

import { LandingHeader, CirclePagination } from 'components';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import FirstComponent from './FirstPage';
import SecondComponent from './SecondPage';
import ThirdComponent from './ThirdPage';
import FourthComponent from './FourthPage';
import FifthComponent from './FifthPage';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [isShowLogo, setIsShowLogo] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = number => {
    setCurrentPage(number);
    setIsShowLogo(number !== 0);
  };

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  return (
    <>
      {!isMobile && !isTablet && <LandingHeader isShowLogo={isShowLogo} />}

      {currentPage !== 0 && !isMobile && !isTablet && (
        <CirclePagination
          count={isMobile || isTablet ? 4 : 5}
          index={currentPage}
          onDotClick={handlePageChange}
        />
      )}

      <ReactPageScroller
        pageOnChange={handlePageChange}
        customPageNumber={currentPage}
        containerWidth={windowDimensions.width}
        containerHeight={
          isMobile || isTablet ? windowDimensions.height : windowDimensions.height - 100
        }
        renderAllPagesOnFirstRender={false}
      >
        <FirstComponent onClickAnimation={() => setCurrentPage(currentPage + 1)} />
        <SecondComponent />
        <ThirdComponent />
        <FourthComponent />
        {!isMobile && !isTablet && <FifthComponent />}
      </ReactPageScroller>
    </>
  );
};

export default HomePage;
