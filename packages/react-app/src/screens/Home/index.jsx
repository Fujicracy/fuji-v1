import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import { APP_URL } from '../../constants';
import { fujiLanding } from '../../assets/images';

import './styles.css';

function Home() {
  const props = useSpring({
    from: { factor: 1, opacity: 0, background: `url(${fujiLanding}) no-repeat center center` },
    to: { factor: 150, opacity: 1 },
    config: { duration: 800, ...config.molasses },
  });

  return (
    <animated.div style={props} className="home-container">
      <div className="home-content">
        <div className="home-cta">
          <a
            href="https://docs.fujidao.org/"
            className="second-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn
          </a>
          <a href={`${APP_URL}dashboard`} className="main-action">
            App
          </a>
        </div>
      </div>
    </animated.div>
  );
}

export default Home;
