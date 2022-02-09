import React from 'react';
import { BlackBoxContainer, Description, NftItemPanel, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { nftGameStorDecoration } from 'assets/images';

function Store() {
  return (
    <BlackBoxContainer width="860px" p="40px">
      <Flex justifyContent="space-between">
        <Flex flexDirection="column">
          <Flex alignItems="bottom">
            <SectionTitle primary fontSize="32px">
              23,459
            </SectionTitle>
            <SectionTitle fontWeight="light" ml={2} mt={2}>
              Energy points
            </SectionTitle>
          </Flex>

          <SectionTitle mt={2} fontWeight="500" lineHeight="24px">
            Burn energy points and buy a crate.
            <br /> When you open a crate you can get nothing, free points or booster cardss
          </SectionTitle>
        </Flex>
        <Image src={nftGameStorDecoration} alt="flask" />
      </Flex>

      <Description
        mt={4}
        title="How to earn Energy points"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
      />
      <Flex flexDirection="row" justifyContent="space-between">
        <NftItemPanel type="common" title="Common" points={1000} description="Energy points" />
        <NftItemPanel type="epic" title="Epic" points={2500} description="Energy points" />
        <NftItemPanel
          type="legendary"
          title="Legendary"
          points={2500}
          description="Energy points"
        />
      </Flex>
    </BlackBoxContainer>
  );
}

export default Store;
