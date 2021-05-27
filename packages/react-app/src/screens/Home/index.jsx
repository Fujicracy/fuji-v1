import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import { Link } from 'react-router-dom';

import './styles.css';

function Home() {
  const props = useSpring({
    from: { factor: 1, opacity: 0 },
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
          <Link to="/dashboard" className="main-action">
            App
          </Link>
        </div>
      </div>
    </animated.div>
  );
}

export default Home;
