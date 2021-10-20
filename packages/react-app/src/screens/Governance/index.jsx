import React, { useState, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { utils } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Grid, CircularProgress } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useExternalContractLoader, useAuth } from 'hooks';
import { Transactor } from 'helpers';

import { BlackBoxContainer, SectionTitle, Header, Button } from 'components';

import {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  MERKLE_DIST_ABI,
  MERKLE_DIST_ADDR,
  ERC721_ABI,
  FUJIFLOPS_NFT_ADDR,
} from 'consts';
import { fujiFlopsGiftbox } from 'assets/images';
import { ELIGIBLE_USERS } from 'consts/eligible';

import { NftButton } from './style';

const leaves = ELIGIBLE_USERS.map(addr =>
  Buffer.from(utils.solidityKeccak256(['address'], [addr]).slice(2), 'hex'),
);
const mtree = new MerkleTree(leaves, keccak256, { sortPairs: true });

const Governance = () => {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const { address, provider } = useAuth();
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [tokenId, setTokenId] = useState(0);

  const userIndex = ELIGIBLE_USERS.indexOf(address.toLowerCase());
  const isEligible = userIndex !== -1;

  const merkle = useExternalContractLoader(provider, MERKLE_DIST_ADDR, MERKLE_DIST_ABI);
  const nft = useExternalContractLoader(provider, FUJIFLOPS_NFT_ADDR, ERC721_ABI);
  const tx = Transactor(provider);
  const location = useLocation();

  const claimNFT = async () => {
    try {
      setIsClaiming(true);
      const proof = mtree.getHexProof(leaves[userIndex]);
      const res = await tx(merkle.claim(address, proof, 1));
      if (res && res.hash) {
        const receipt = await res.wait();
        if (receipt) {
          setIsClaimed(true);
        }
      }
      setIsClaiming(false);
    } catch (error) {
      // when user rejected transaction on Metamask
      console.error({ error });
      setIsClaiming(false);
    }
  };

  const notification = isClaimed
    ? 'You have already claimed your FujiFlops'
    : isEligible
    ? 'You are eligible to claim FujiFlops'
    : 'Address has no available claim';

  useEffect(() => {
    async function check() {
      if (address && merkle) {
        const claimed = await merkle.isClaimed(address);
        setIsClaimed(claimed);
      }
      if (address && nft && isClaimed) {
        const id = await nft.tokenOfOwnerByIndex(address, 0);
        setTokenId(id);
      }
    }

    check();
  }, [merkle, nft, address, isClaimed]);

  const handleNftButton = async () => {
    if (isClaimed) {
      window.open(
        `https://opensea.io/assets/${FUJIFLOPS_NFT_ADDR.toLowerCase()}/${tokenId}`,
        '_blank',
      );
    } else if (isEligible) {
      await claimNFT();
    } else {
      window.open(`https://opensea.io/collection/fuji-dao`, '_blank');
    }
  };

  if (!address) {
    return (
      <Redirect
        to={{
          pathname: '/dashboard/not-connected',
          state: { from: location },
        }}
      />
    );
  }

  return (
    <>
      <Header provider={provider} address={address} />
      <Flex
        flex
        flexDirection={isMobile || isTablet ? 'column' : 'row'}
        justifyContent={!isMobile && !isTablet && 'center'}
        alignItems={(isMobile || isTablet) && 'center'}
        margin={isMobile ? '28px' : isTablet ? '36px 176px' : '56px'}
      >
        <BlackBoxContainer
          padding="32px 28px 36px"
          minWidth={isMobile ? '320px' : '448px'}
          width={isMobile ? '320px' : '448px'}
        >
          <SectionTitle fontSize="16px">Hey Fuji Hikers,</SectionTitle>
          <SectionTitle fontSize="16px" marginTop="20px" fontWeight="normal" lineHeight="24px">
            Back in May, we started together the first DeFi hiking and promised to provide all the
            necessary equipment for this honorous endeavor. Finally, the time has come!
          </SectionTitle>
          <SectionTitle fontSize="16px" marginTop="20px" fontWeight="normal" lineHeight="24px">
            <div>
              The first 96 brave climbers who interacted with the protocol can claim now their
              FujiFlops:<span> Genesis Hiking Edition</span> NFT. This is an unique piece of art and
              the best gift you can make to your toes on the quest to an absolute comfiness.
            </div>
          </SectionTitle>
          <SectionTitle fontSize="16px" marginTop="20px" fontWeight="normal" lineHeight="24px">
            <div>
              A pair of <span>FujiFlops</span> will play another important role, it will empower its
              owner to participate in our pre-governance system. We aim to build a great community
              and this NFT is the first step to make it grow into a DAO.
            </div>
          </SectionTitle>
          <Flex marginTop="28px">
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={6} md={6} sm={6}>
                <NftButton
                  onClick={() => {
                    window.open('https://forum.fujidao.org', '_blank');
                  }}
                >
                  Forum
                </NftButton>
              </Grid>
              <Grid item xs={6} md={6} sm={6}>
                <NftButton
                  onClick={() => {
                    window.open('https://snapshot.org/#/fuji-dao.eth', '_blank');
                  }}
                >
                  Vote
                </NftButton>
              </Grid>
            </Grid>
          </Flex>
        </BlackBoxContainer>

        <BlackBoxContainer
          padding="32px 28px 36px"
          marginLeft={!isMobile && !isTablet && '48px'}
          marginTop={(isMobile || isTablet) && '28px'}
          minWidth={isMobile ? '320px' : isTablet ? '448px' : '320px'}
          width={isMobile ? '320px' : isTablet ? '448px' : '320px'}
          height="100%"
        >
          <SectionTitle fontSize="16px">Claim NFT</SectionTitle>
          <Flex justifyContent="center" alignItems="center" mt={4} mb={4}>
            <Image alt="NFT animation" src={fujiFlopsGiftbox} />
          </Flex>
          <SectionTitle
            fontSize="12px"
            color={isEligible ? '#50FE34' : 'rgb(255, 16, 85)'}
            justifyContent="center"
            fontWeight="normal"
          >
            {notification}
            {isEligible && (
              <CheckCircleIcon style={{ color: 'green', fontSize: 14, marginLeft: 4 }} />
            )}
          </SectionTitle>

          <Button
            block
            marginTop={28}
            onClick={handleNftButton}
            disabled={isClaiming}
            fontSize={16}
            borderRadius={6}
          >
            <Flex flexDirection="row" justifyContent="center" alignItems="center">
              {isClaiming ? <CircularProgress size={25} color="white" thickness={5} /> : ''}
              <Flex ml={3}>
                {isClaimed || !isEligible
                  ? 'View on OpenSea'
                  : isClaiming
                  ? 'Claiming NFT'
                  : 'Claim NFT'}
              </Flex>
            </Flex>
          </Button>
        </BlackBoxContainer>
      </Flex>
    </>
  );
};

export default Governance;
