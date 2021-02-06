import {
  getEventStatus,
  getDisputeStatus,
  inDisputeWindow,
  inVoteWindow,
  VOTING_OPEN,
  CONTRACT_UPGRADE,
} from './helpers';
import { InMemoryCache } from '@apollo/client';
import { psrLookup } from './psrLookup';

export const cache = new InMemoryCache({
  typePolicies: {
    Request: {
      fields: {
        requestSymbol: {
          read(_, { readField, }) {
            const request = readField("request")
            return psrLookup[request.requestId].name;
          },
        },
      },
    },
    MiningEvent: {
      fields: {
        requestSymbols: {
          read(_, { readField, }) {
            const requestIds = readField("requestIds")
            return requestIds.map(
              (requestId) => psrLookup[requestId].name,
            );
          },
        },
        status: {
          read(_, { readField, }) {
            const minedValues = readField("minedValues")
            return getEventStatus(minedValues);
          },
        },
        inDisputeWindow: {
          read(_, { readField, }) {
            const timestamp = readField("timestamp")
            return inDisputeWindow(timestamp);
          },
        },
        granPrices: {
          read(_, { readField, }) {
            const minedValues = readField("minedValues")
            const requestIds = readField("requestIds")
            return minedValues.map((minedValue, i) => {
              return (
                +minedValue / +psrLookup[requestIds[i]].granularity
              );
            });
          },
        },
      },
    },
    MinerValue: {
      fields: {
        requestSymbols: {
          read(_, { readField, }) {
            const requestIds = readField("requestIds")
            return requestIds.map(
              (requestId) => psrLookup[requestId].name,
            );
          },
        },
        granPrices: {
          read(_, { readField, }) {
            const values = readField("values")
            const requestIds = readField("requestIds")
            return values.map((minedValue, i) => {
              return +minedValue / +psrLookup[requestIds[i]].granularity;
            });
          },
        }
      },
    },
    Dispute: {
      fields: {
        value: {
          read(_, { readField, }) {
            return readField("relatedMiningEventData")[2]
          },
        },
        requestSymbol: {
          read(_, { readField, }) {
            const requestId = readField("requestId")
            if (requestId == 0) {
              return CONTRACT_UPGRADE
            }
            const psr = psrLookup[requestId];
            return psr ? psr.name : 'unknown';
          },
        },
        status: {
          read(_, { readField, }) {
            return getDisputeStatus(readField("active"));
          },
        },
        inVoteWindow: {
          read(_, { readField, }) {
            const status = readField("active")
            const timestamp = readField("timestamp")
            return getDisputeStatus(status) === VOTING_OPEN &&
              inVoteWindow(timestamp)
          },
        },
      },
    },
  },
})
