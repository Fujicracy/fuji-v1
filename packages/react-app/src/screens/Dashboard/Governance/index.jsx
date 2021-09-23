/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { utils } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
// import { Grid } from '@material-ui/core';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Grid } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useExternalContractLoader, useAuth } from 'hooks';

import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Button } from 'components/UI';

import { BREAKPOINTS, BREAKPOINT_NAMES, MERKLE_DROP_ABI } from 'consts';
import { nftAnimation } from 'assets/images';
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

  const userIndex = ELIGIBLE_USERS.indexOf(address.toLowerCase());
  const isEligible = userIndex !== -1;

  const merkle = useExternalContractLoader(
    provider,
    '0x646977B16aF256E81288b329B7838aA77f30fd1A', // will be replaced with the real address
    MERKLE_DROP_ABI,
  );

  const claimNFT = async () => {
    const proof = mtree.getHexProof(leaves[userIndex]);
    const tx = await merkle.claim(address, proof);
    const res = await tx.wait();
    console.log(res);
  };

  const notification = isClaimed
    ? 'You have already claimed the NFT'
    : isEligible
    ? 'You are eligible to claim the NFT'
    : 'Address has no available claim';

  console.log({ isMobile, isTablet, userIndex });

  useEffect(() => {
    async function check() {
      if (address && merkle) {
        const claimed = await merkle.isClaimed(address);
        setIsClaimed(claimed);
      }
    }

    check();
  }, [merkle, address]);

  /*
  const handleNftButton = () => {
    if (isClaimed) {
      window.open(`https://opensea.io/${address}`, '_blank');
    } else {
      window.open(`https://opensea.io/${address}`, '_blank');
    }
  };
  */
  return (
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
        <SectionTitle fontSize="16px">Governance</SectionTitle>
        <SectionTitle fontSize="16px" marginTop="20px" fontWeight="normal" lineHeight="24px">
          As the first step of transitioning to a fully decentralized DAO, we released a model of
          pre-governance for users to submit and vote on governance proposals.
        </SectionTitle>
        <SectionTitle fontSize="16px" marginTop="20px" fontWeight="normal" lineHeight="24px">
          <div>
            The first 96 brave climbers who interacted with the protocol can claim the
            <span>Genesis FujiFlops NFT.</span>
          </div>
        </SectionTitle>
        <SectionTitle fontSize="16px" marginTop="20px" fontWeight="normal" lineHeight="24px">
          Prior to release of the Fuji token, the NFT acts as governance token for the protocol, as
          well as the best gift you can make to your toes on the quest of absolute comfiness.
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
                  window.open('https://snapshop.org', '_blank');
                }}
              >
                Snapshot
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
        <Flex justifyContent="center" alignItems="center">
          <Image alt="NFT animation" src={nftAnimation} />
        </Flex>
        <SectionTitle
          fontSize="12px"
          color={isEligible ? '#50FE34' : 'rgb(255, 16, 85)'}
          justifyContent="center"
          fontWeight="normal"
        >
          {notification}
          {isEligible && <CheckCircleIcon color="green" style={{ fontSize: 14, marginLeft: 4 }} />}
        </SectionTitle>
        <Button block mt={4} fontSize={16} onClick={claimNFT} disabled={!isEligible}>
          {isClaimed ? 'View on OpenSea' : 'Claim NFT'}
        </Button>
      </BlackBoxContainer>
    </Flex>
  );
};

export default Governance;
