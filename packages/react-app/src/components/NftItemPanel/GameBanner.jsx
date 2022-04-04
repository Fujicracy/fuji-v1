import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import axios from 'axios';
import { Flex } from 'rebass';
import { fujiMedia } from 'consts';
import { useAuth, useContractLoader, useProfileInfo } from 'hooks';
import { Transactor } from 'helpers';
import { happyIcon } from 'assets/images';
import { ResultPopup } from 'components';
import { useHistory } from 'react-router-dom';

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

  :not([disabled]):hover {
    border: 3px solid black;
  }

  &[disabled] {
    cursor: wait;
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
    'claimable-points': 'Claim your points',
  },
};

const useBannerStatus = () => {
  const baseUri = 'https://fuji-api-dot-fuji-306908.ey.r.appspot.com/';
  // 'no-points', 'claimable-points', 'claimed-points'
  const [status, setStatus] = useState('claimed-points');
  const { address } = useAuth();
  const { points, isLoading } = useProfileInfo();

  useEffect(() => {
    async function fetchStatus() {
      try {
        await axios.get(`${baseUri}/rankings/${address}`, {
          params: {
            networkId: 2,
            stage: 'initial',
          },
        });
        if (points > 0) {
          setStatus('claimed-points');
        } else {
          setStatus('claimable-points');
        }
      } catch (e) {
        console.log(e);
        setStatus('no-points');
      }
    }
    if (!isLoading) {
      fetchStatus();
    }
  }, [address, points, isLoading]);

  return status;
};

const ACTION_RESULT = {
  NONE: 'none',
  SUCCESS: 'success',
  ERROR: 'error',
};

const ACTION_DESCRIPTIONS = {
  [ACTION_RESULT.SUCCESS]: {
    value: ACTION_RESULT.SUCCESS,
    title: 'Congratulation!',
    description: 'Your points have been claimed successfully.',
    submitText: 'Go to Store',
    emotionIcon: happyIcon,
  },
  [ACTION_RESULT.ERROR]: {
    value: ACTION_RESULT.ERROR,
    title: 'Something is wrong',
    description:
      'An error occured during the transaction, it can be your credits number or a problem on our side.',
    submitText: 'Try again',
    emotionIcon: '',
  },
};

const GameBanner = () => {
  const status = useBannerStatus();
  const { address, provider } = useAuth();
  const tx = Transactor(provider);

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [actionResult, setActionResult] = useState(ACTION_RESULT.NONE);

  const contracts = useContractLoader();

  const handleCta = async () => {
    setIsLoading(true);
    if (status === 'claimable-points') {
      const baseUri = 'https://fuji-api-dot-fuji-306908.ey.r.appspot.com';
      const { data } = await axios.get(`${baseUri}/rankings/merkle-proofs`, {
        params: {
          networkId: 2,
          address,
        },
      });
      try {
        const txRes = await tx(contracts.NFTGame.claimBonusPoints(data.pointsToClaim, data.proofs));
        console.log(txRes);

        if (txRes && txRes.hash) {
          await txRes.wait();
          setActionResult(ACTION_RESULT.SUCCESS);
        }
      } catch (error) {
        console.error('minting inventory error:', { error });
        setActionResult(ACTION_RESULT.ERROR);
      }
    } else if (status === 'no-points') {
      alert('not implemented');
    }
    setIsLoading(false);
  };

  if (status === 'claimed-points' && actionResult === ACTION_RESULT.NONE) {
    return <></>;
  }

  return (
    <Container>
      <Flex>
        <Icon />
        <ContentContainer>
          <Title>The Fuji Climbing Campaing is Live !</Title>
          <Text>{content.text[status]}</Text>
        </ContentContainer>
      </Flex>
      <Cta onClick={handleCta} disabled={isLoading}>
        {content.cta[status]}
        {isLoading ? '...' : ''}
      </Cta>
      <ResultPopup
        isOpen={actionResult !== ACTION_RESULT.NONE}
        content={ACTION_DESCRIPTIONS[actionResult] ?? {}}
        onSubmit={() => {
          setActionResult(ACTION_RESULT.NONE);
          history.push('/nft-game/store');
        }}
        onClose={() => setActionResult(ACTION_RESULT.NONE)}
      />
    </Container>
  );
};

export default GameBanner;
