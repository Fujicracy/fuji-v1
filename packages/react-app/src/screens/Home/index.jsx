import React, { useState, useEffect } from 'react';

import ReactPageScroller from 'react-page-scroller';

import { LandingHeader } from 'components';
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

  const handleBeforePageChange = number => {
    console.log(number);
  };

  return (
    <>
      <LandingHeader isShowLogo={isShowLogo} />
      <ReactPageScroller
        pageOnChange={handlePageChange}
        onBeforePageScroll={handleBeforePageChange}
        customPageNumber={currentPage}
        containerWidth={windowDimensions.width}
        containerHeight={windowDimensions.height - 100}
      >
        <FirstComponent />
        <SecondComponent />
        <ThirdComponent />
        <FourthComponent />
        <FifthComponent />
      </ReactPageScroller>
    </>
  );
};

export default HomePage;
