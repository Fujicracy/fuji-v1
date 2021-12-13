import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
// import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';
import {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  EXPLORER_INFO,
  TRANSACTION_TYPES,
  // CHAIN_NAME,
  // ASSETS,
} from 'consts';
import { Grid } from '@material-ui/core';
import { useTransactionHistory } from 'hooks';
import OpenInNew from '@material-ui/icons/OpenInNew';

import SectionTitle from '../Blocks/SectionTitle';
import BlackBoxContainer from '../Blocks/BlackBoxContainer';
import { GridItem, LinkItem } from './styles';
import DropDown from '../UI/DropDown';

const TransactionHistory = ({ vaultName }) => {
  // const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  // const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  // const [selectedAsset, setSelectedAsset] = useState(null);
  const actionOptions = TRANSACTION_TYPES.map(type => ({ title: type }));

  const [selectedAction, setSelectedAction] = useState(actionOptions[0]);

  const isMobile = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
  });

  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const transactionHistories = useTransactionHistory(vaultName, selectedAction.title);

  // const assetOptions = Object.keys(ASSETS[CHAIN_NAME]).map(asset => ({ title: asset }));

  return (
    <BlackBoxContainer p="16px 32px 24px" mt="40px" mb="50px">
      <SectionTitle fontSize={isMobile ? '14px' : isTablet ? '24px' : '16px'}>History</SectionTitle>
      <Flex flexDirection="row" mt={16} mb={24} alignItems="center" justifyContent="flex-end">
        {/* <SectionTitle mr={2}>Start Date:</SectionTitle>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            value={selectedStartDate}
            onChange={newValue => setSelectedStartDate(newValue)}
          />
        </MuiPickersUtilsProvider>

        <SectionTitle mr={2} ml={3}>
          End Date:
        </SectionTitle>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker value={selectedEndDate} onChange={newValue => setSelectedEndDate(newValue)} />
        </MuiPickersUtilsProvider> */}

        <SectionTitle mr={2} ml={3}>
          Action:
        </SectionTitle>
        <DropDown
          options={actionOptions}
          defaultOption={selectedAction}
          width={200}
          isOptionSelectable
          onOptionClicked={option => setSelectedAction(option)}
        />
        {/* <SectionTitle mr={2} ml={3}>
          Asset:
        </SectionTitle>
        <DropDown
          options={assetOptions}
          defaultOption={selectedAsset}
          width={150}
          isOptionSelectable
          onOptionClicked={option => setSelectedAsset(option)}
        /> */}
      </Flex>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <BlackBoxContainer hasBlackContainer={false} p="16px 4px 0px">
            <Grid container>
              <GridItem item xs={3} fontWeight={700}>
                Date
              </GridItem>
              <GridItem item xs={2} fontWeight={700}>
                Action
              </GridItem>
              <GridItem item xs={2} fontWeight={700}>
                Asset
              </GridItem>
              <GridItem item xs={2} fontWeight={700}>
                Amount
              </GridItem>
              <GridItem item xs={3} fontWeight={700}>
                Details
              </GridItem>
            </Grid>
          </BlackBoxContainer>
        </Grid>
        {transactionHistories.map((history, index) => {
          return (
            <Grid item xs={12} key={`${index.toString()}`}>
              <BlackBoxContainer hasBlackContainer={false} p="4px">
                <Grid container>
                  <GridItem item xs={3}>
                    {`${history.Date.toLocaleDateString()} ${history.Date.toLocaleTimeString()}`}
                  </GridItem>
                  <GridItem item xs={2}>
                    {history.Action}
                  </GridItem>
                  <GridItem item xs={2}>
                    {history.Asset || 'ETH'}
                  </GridItem>
                  <GridItem item xs={2}>
                    {history.Amount}
                  </GridItem>
                  <GridItem item xs={3}>
                    <LinkItem
                      onClick={() => window.open(`${EXPLORER_INFO.url}${history.txHash}`, '_blank')}
                    >
                      Explorer
                      <OpenInNew />
                    </LinkItem>
                  </GridItem>
                </Grid>
              </BlackBoxContainer>
            </Grid>
          );
        })}
      </Grid>
    </BlackBoxContainer>
  );
};

export default TransactionHistory;
