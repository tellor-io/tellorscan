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
