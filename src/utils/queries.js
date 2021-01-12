import { gql } from '@apollo/client';

export const GET_LATEST_MINER_VALUES = gql`
  query {
    minerValues(first: 6, orderBy: timestamp, orderDirection: desc) {
      id
      miningEventId
      currentChallenge
      miner
      values
      requestIds
      requestSymbols @client
      granPrices @client
    }
  }
`;

const eventFields = `
  id
  timestamp
  requestIds
  time
  minedValues
  totalTips
  blockNumber
  requestSymbols @client
  status @client
  inDisputeWindow @client
  granPrices @client
  minerValues {
    id
    miner
    values
  }
`;

export const GET_LATEST_EVENTS = gql`
  query {
    miningEvents(first: 6, orderBy: timestamp, orderDirection: desc) {
      ${eventFields}
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query {
    miningEvents(first: 50, orderBy: timestamp, orderDirection: desc) {
      ${eventFields}
    }
  }
`;

const disputeFields = `
  id
  timestamp
  reportedMiner
  miner
  result
  reportingParty
  active
  requestId
  disputeId
  relatedMiningEventData
  tally
  result
  disputeVotePassed
  value @client
  requestSymbol @client
  status @client
  inVoteWindow @client
  votes {
    id
    position
    voter
    timestamp
  }
`;

export const GET_LATEST_DISPUTES = gql`
  query {
    disputes(first: 3, orderBy: timestamp, orderDirection: desc) {
      ${disputeFields}
    }
  }
`;

export const GET_ALL_DISPUTES = gql`
  query {
    disputes(first: 10, orderBy: timestamp, orderDirection: desc) {
      ${disputeFields}
    }
  }
`;
