import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import axios from 'axios';
import { Flex } from 'rebass';
import { fujiMedia } from 'consts';
import { useAuth } from 'hooks';

const Container = styled.div`
  // Hard coded with to match container width on borrow & my positions
  width: calc(1136px - 2 * 24px);
  margin: 0 auto;
  background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  box-shadow: 0px 0px 8px #f0014f;
  backdrop-filter: blur(6px);
  border-radius: 8px;
  color: white;
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${fujiMedia.lessThan('medium')`
    padding: 1rem .5rem;
    display: block;
  `}
`;

const ContentContainer = styled.div`
  margin: 0 16px;

  ${fujiMedia.lessThan('medium')`
    width: 100%;
    margin: 0;
  `}
`;

const Title = styled.p`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
`;

const Text = styled.p`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  margin-top: 0.5rem;
  font-size: 14px;
  line-height: 120%;
`;

const Cta = styled.button`
  background: linear-gradient(287.45deg, rgba(0, 0, 0, 0) 6.81%, #000000 120.29%);
  border-radius: 6px;
  border: 1px solid black;
  padding: 0.5rem 2rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  width: 260px;

  transition: 0.3s all;
  :hover {
    border: 3px solid black;
  }

  ${fujiMedia.lessThan('medium')`
    width: 100%;
    margin-top: 1rem;
    width: 200px;
  `}
`;

const Icon = styled(FilterHdrIcon)`
  ${fujiMedia.lessThan('medium')`
    display: none;  
  `}
`;

const content = {
  text: {
    'no-points': 'You are now rewarded for using Fuji, the more you Borrow the higher you will go.',
    'claimable-points':
      'You are already climbing Mt. Fuji by having a loan with Fuji. Go to the Store and buy a crate for the chance to win prices. You can win Climbing Gear NFTs or Extra Boost for your Meter Points.',
  },
  cta: {
    'no-points': 'Start climbing',
    'claimable-points': 'Claim you points.',
  },
};

const useBannerStatus = () => {
  const baseUri = 'https://fuji-api-dot-fuji-306908.ey.r.appspot.com/#/';
  const address = '';
  const [status, setStatus] = useState('no-points');
  const auth = useAuth();
  console.log(auth);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await axios.get(`${baseUri}/rankings/${address}`, {
          params: {
            networkId: 2,
            stage: 'initial',
          },
        });
        console.log(res);
        setStatus('claimable-points');
      } catch (e) {
        console.log(e);
        // if (res.totalPoints > 0) {
        //   setStatus('claimed-points')
        // } else if (res.totalPoints === 0) {
        //   setStatus('no-points')
        // }
      }
    }
    fetchStatus();
  }, [status]);

  return status;
};

const GameBanner = () => {
  /* eslint-disable spaced-comment */
  /**
   * call /rankings/:address?networkId=2&stage=iniitial
   * if 404 call useProfileInfo()
   *   if res > 0 -> 'claimed-points'
   *   else if res == 0 -> 'no-points'
   * else -> 'claimable-points'
   **/

  // 'no-points', 'claimable-points', claimed-points'
  const status = useBannerStatus();

  if (status === 'claimed-points') {
    return <></>;
  }

  return (
    <Container>
      <Flex>
        <Icon />
        <ContentContainer>
          <Title>The Fuji Climbing Campaing is Live!!</Title>
          <Text>{content.text[status]}</Text>
        </ContentContainer>
      </Flex>
      <Cta onClick={() => alert('not implemented')}>{content.cta[status]}</Cta>
    </Container>
  );
};

export default GameBanner;
