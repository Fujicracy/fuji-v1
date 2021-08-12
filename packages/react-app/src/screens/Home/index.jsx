import React, { useState, useEffect } from 'react';
import { useSpring, config } from 'react-spring';
import { Button } from 'components/UI';
import { NavLink } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import { fujiLanding, fujiLandingMobile } from '../../assets/images';
import { HomeContainer, HomeContent, HomeCta } from './styles';

function Home() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [landingImage, setLandingImage] = useState(null);

  useEffect(() => {
    if (isMobile) setLandingImage(fujiLandingMobile);
    else setLandingImage(fujiLanding);
  }, [isMobile]);

  const props = useSpring({
    from: {
      factor: 1,
      opacity: 0,
      background: `url(${landingImage}) no-repeat center center`,
    },
    to: { factor: 150, opacity: 1 },
    config: { duration: 800, ...config.molasses },
  });

  const handleLearnClick = () => {
    window.open('https://docs.fujidao.org/', '_blank');
  };

  return (
    <HomeContainer style={props}>
      <HomeContent isMobile={isMobile}>
        <HomeCta container isMobile={isMobile} spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Button onClick={handleLearnClick} block outline>
              Learn
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <NavLink to="/dashboard">
              <Button block color="white">
                App
              </Button>
            </NavLink>
          </Grid>
        </HomeCta>
      </HomeContent>
    </HomeContainer>
  );
}

export default Home;
