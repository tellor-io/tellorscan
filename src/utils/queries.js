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


export function GET_LATEST_EVENTS_BY_ID(id) {
  return gql`
  query {
    miningEvents(first: 50, orderBy: timestamp, orderDirection: desc, where: { requestIds_contains: [${id}] }) {
      ${eventFields}
    }
  }
`;
}

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
  active
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

export const GET_OPEN_DISPUTES = gql`
  query {
    disputes(where : { active: null, requestId_gt: 0}) {
      ${disputeFields}
    }
  }
`;

export const GET_VOTING = gql`
  query {
    disputes(first: 50, orderBy: disputeId, orderDirection: desc) {
      ${disputeFields}
    }
  }
`;

const voteFields = `
  disputeId
  timestamp
  voter
  voteWeight
  position
`;

export const GET_VOTES = gql`
query {
  votes {
    ${voteFields}
  }
}
`;