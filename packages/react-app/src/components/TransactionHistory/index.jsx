import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
// import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';
import {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  EXPLORER_INFOS,
  TRANSACTION_TYPES,
  // CHAIN_NAME,
  // ASSETS,
} from 'consts';
import { Grid, CircularProgress } from '@material-ui/core';
import { useTransactionHistory, useAuth } from 'hooks';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { fixDecimal } from 'helpers';

import SectionTitle from '../Blocks/SectionTitle';
import BlackBoxContainer from '../Blocks/BlackBoxContainer';
import { GridItem, LinkItem } from './styles';
import DropDown from '../UI/DropDown';

const TransactionHistory = ({ vaultName }) => {
  const { networkId } = useAuth();

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

  const { transactionHistories } = useTransactionHistory(vaultName, selectedAction.title);

  // const assetOptions = Object.keys(ASSETS[CHAIN_NAME]).map(asset => ({ title: asset }));

  const handleViewDetail = hash => {
    if (isMobile) window.open(`${EXPLORER_INFOS[networkId].url}${hash}`, '_blank');
  };

  const onActionChange = option => {
    setSelectedAction(option);
  };

  return (
    <BlackBoxContainer
      p={isMobile ? '32px 28px 16px' : isTablet ? '44px 36px 40px' : '16px 32px 24px'}
      mt="40px"
      mb="50px"
    >
      <SectionTitle fontSize={isMobile ? '16px' : isTablet ? '20px' : '16px'}>History</SectionTitle>
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

        <SectionTitle mr={3} ml={3}>
          Action:
        </SectionTitle>
        <DropDown
          options={actionOptions}
          defaultOption={selectedAction}
          width={200}
          isOptionSelectable
          onOptionClicked={option => onActionChange(option)}
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
              <GridItem item xs={4} sm={3} md={3} fontWeight={700}>
                Date
              </GridItem>
              <GridItem item xs={4} sm={3} md={3} fontWeight={700}>
                Action
              </GridItem>
              <GridItem item xs={4} sm={3} md={3} fontWeight={700}>
                Amount
              </GridItem>
              {!isMobile && (
                <GridItem item sm={3} md={3} fontWeight={700}>
                  Details
                </GridItem>
              )}
            </Grid>
          </BlackBoxContainer>
        </Grid>
        {!transactionHistories ? (
          <GridItem item xs={12}>
            {/* <Flex justifyContent="center" alignItems="center"> */}
            <CircularProgress
              style={{
                width: 25,
                height: 25,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            />
            {/* </Flex> */}
          </GridItem>
        ) : (
          transactionHistories.map((history, index) => {
            return (
              <Grid container item xs={12} key={`${index.toString()}`}>
                <GridItem
                  item
                  xs={4}
                  sm={3}
                  md={3}
                  onClick={() => handleViewDetail(history.txHash)}
                >
                  {`${history.Date.toLocaleDateString()} ${history.Date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
                </GridItem>
                <GridItem
                  item
                  xs={4}
                  sm={3}
                  md={3}
                  onClick={() => handleViewDetail(history.txHash)}
                >
                  {history.Action}
                </GridItem>
                <GridItem
                  item
                  xs={4}
                  sm={3}
                  md={3}
                  onClick={() => handleViewDetail(history.txHash)}
                >
                  {`${fixDecimal(history.Amount, 6)} ${history.Asset || 'ETH'}`}
                </GridItem>
                {!isMobile && (
                  <GridItem item xs={3} sm={3} cursor="pointer">
                    <LinkItem
                      onClick={() =>
                        window.open(`${EXPLORER_INFOS[networkId].url}${history.txHash}`, '_blank')
                      }
                    >
                      Explorer&nbsp;
                      <OpenInNew />
                    </LinkItem>
                  </GridItem>
                )}
              </Grid>
            );
          })
        )}
      </Grid>
    </BlackBoxContainer>
  );
};

export default TransactionHistory;
