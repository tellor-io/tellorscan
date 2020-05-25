import { gql } from 'apollo-boost';

const eventFields = `
  id
  timestamp
  requestId
  time
  minedValue
  totalTips
  requestSymbol @client
  status @client
  request {
    id
    querySymbol
  }
  minerValues {
    id
    miner
    value
    status @client
  }
`;

export const GET_LATEST_EVENTS = gql`
  query {
    miningEvents(first: 7, orderBy: timestamp, orderDirection: desc) {
      ${eventFields}
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query {
    miningEvents(first: 100, orderBy: timestamp, orderDirection: desc) {
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
  relatedMiningEventData
  value @client
  requestSymbol @client
  status @client
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
    disputes(first: 100, orderBy: timestamp, orderDirection: desc) {
      ${disputeFields}
    }
  }
`;
