import {
  getEventStatus,
  getDisputeStatus,
  inDisputeWindow,
  inVoteWindow,
} from './helpers';
import { psrLookup } from './psrLookup';

export const resolvers = (() => {
  return {
    Request: {
      requestSymbol: async (request, _args) => {
        return psrLookup[request.requestId].name;
      },
    },
    MiningEvent: {
      requestSymbols: async (miningEvent, _args) => {
        return miningEvent.requestIds.map(
          (requestId) => psrLookup[requestId].name,
        );
      },
      status: async (miningEvent, _args) => {
        return getEventStatus(miningEvent);
      },
      inDisputeWindow: async (miningEvent, _args) => {
        return inDisputeWindow(miningEvent.timestamp);
      },
      granPrices: (miningEvent, _args) => {
        return miningEvent.minedValues.map((minedValue, i) => {
          return (
            +minedValue / +psrLookup[miningEvent.requestIds[i]].granularity
          );
        });
      },
    },
    MinerValue: {
      requestSymbols: async (minerValue, _args) => {
        return minerValue.requestIds.map(
          (requestId) => psrLookup[requestId].name,
        );
      },
      granPrices: (minerValue, _args) => {
        return minerValue.values.map((minedValue, i) => {
          return +minedValue / +psrLookup[minerValue.requestIds[i]].granularity;
        });
      },
    },
    Dispute: {
      value: async (dispute, _args) => {
        return dispute.relatedMiningEventData[2];
      },
      requestSymbol: async (dispute, _args) => {
        return psrLookup[dispute.requestId].name;
      },
      status: async (dispute, _args) => {
        return getDisputeStatus(dispute);
      },
      inVoteWindow: async (dispute, _args) => {
        return (
          getDisputeStatus(dispute) === 'Open Dispute' &&
          inVoteWindow(dispute.timestamp)
        );
      },
    },
  };
})();
