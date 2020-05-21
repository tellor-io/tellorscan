import { gql } from 'apollo-boost';

export const GET_LATEST_EVENTS = gql`
  query {
    miningEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      requestId
      time
      minedValue
      currentChallenge
      request {
        id
        querySymbol
      }
    }
  }
`;

export const GET_LATEST_DISPUTES = gql`
  query {
    disputes(first: 3, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      reportedMiner
      miner
      result
      reportingParty
      active
      votes {
        id
        position
        voter
        timestamp
      }
    }
  }
`;
