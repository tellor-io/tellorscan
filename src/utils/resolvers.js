export const resolvers = (() => {
  return {
    MiningEvent: {
      requestSymbol: async (miningEvent, _args) => {
        return miningEvent.request.querySymbol;
      },
      status: async (miningEvent, _args) => {
        return 'temp';
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
      requestSymbol: async (miningEvent, _args) => {
        // return miningEvent.request.querySymbol;
        return 'temp';
      },
      status: async (minerValue, _args) => {
        return 'temp';
      },
    },
  };
})();
