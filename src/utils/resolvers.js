import {
  getEventStatus,
  getMinerValueStatus,
  getDisputeStatus,
  inDisputeWindow,
  inVoteWindow,
} from './helpers';
import psrLookup from './psrLookup';

export const resolvers = (() => {
  return {
    Request: {
      requestSymbol: async (request, _args) => {
        return psrLookup[request.requestId - 1];
      },
    },
    MiningEvent: {
      requestSymbol: async (miningEvent, _args) => {
        return psrLookup[miningEvent.requestId - 1];
      },
      status: async (miningEvent, _args) => {
        return getEventStatus(miningEvent);
      },
      inDisputeWindow: async (miningEvent, _args) => {
        return inDisputeWindow(miningEvent.timestamp);
      },
      granPrice: (miningEvent, _args) => {
        return (
          +miningEvent.minedValue / +miningEvent.request.granularity
        ).toFixed(2);
      },
    },
    MinerValue: {
      status: async (minerValue, _args) => {
        return getMinerValueStatus(minerValue);
      },
    },
    Dispute: {
      value: async (dispute, _args) => {
        return dispute.relatedMiningEventData[2];
      },
      requestSymbol: async (dispute, _args) => {
        return psrLookup[dispute.requestId - 1];
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
      granPrice: (dispute, _args) => {
        return (
          +dispute.relatedMiningEventData[2] / +dispute.request.granularity
        ).toFixed(2);
      },
    },
  };
})();
