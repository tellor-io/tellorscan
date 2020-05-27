import { getEventStatus } from './helpers';
import psrLookup from './psrLookup';

export const resolvers = (() => {
  return {
    MiningEvent: {
      requestSymbol: async (miningEvent, _args) => {
        return psrLookup[miningEvent.requestId - 1];
      },
      status: async (miningEvent, _args) => {
        return getEventStatus(miningEvent);
      },
    },
    MinerValue: {
      status: async (minerValue, _args) => {
        return 'temp';
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
        return 'temp';
      },
    },
  };
})();
