import React, { useState } from 'react';

import ReactPageScroller from 'react-page-scroller';

import FirstComponent from './FirstComponent';
import SecondComponent from './SecondComponent';
import ThirdComponent from './ThirdComponent';
import FourthComponent from './FourthComponent';

import './index.css';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(null);

  const handlePageChange = number => {
    setCurrentPage(number);
  };

  const handleBeforePageChange = number => {
    console.log(number);
  };

  return (
    <>
      <ReactPageScroller
        pageOnChange={handlePageChange}
        onBeforePageScroll={handleBeforePageChange}
        customPageNumber={currentPage}
      >
        <FirstComponent />
        <SecondComponent />
        <ThirdComponent />
        <FourthComponent />
      </ReactPageScroller>
    </>
  );
};

export default HomePage;
