import React from 'react';
import { useSpring, animated, config } from 'react-spring';
import { Button } from 'components/UI';

import { APP_URL } from '../../constants/providers';
import { fujiLanding } from '../../assets/images';

import './styles.css';

function Home() {
  const props = useSpring({
    from: { factor: 1, opacity: 0, background: `url(${fujiLanding}) no-repeat center center` },
    to: { factor: 150, opacity: 1 },
    config: { duration: 800, ...config.molasses },
  });

  const handleLearnClick = () => {
    window.open('https://docs.fujidao.org/', '_blank');
  };

  const handleAppClick = () => {
    window.open(`${APP_URL}/dashboard`, '_self');
  };

  return (
    <animated.div style={props} className="home-container">
      <div className="home-content">
        <div className="home-cta">
          <Button onClick={handleLearnClick} block outline>
            Learn
          </Button>

          <Button onClick={handleAppClick} ml={4} block>
            App
          </Button>
        </div>
      </div>
    </animated.div>
  );
}

export default Home;
