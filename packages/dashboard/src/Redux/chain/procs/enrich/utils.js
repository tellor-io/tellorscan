export const normalizeRequest = req => {
  let disp = req.disputes || {};
  let dById = disp.byId || {};
  let dByHash = disp.byHash || {};

  return {
    ...req,
    challenges: {
      ...req.challenges
    },
    disputes: {
      byId: {
        ...dById
      },
      byHash: {
        ...dByHash
      }
    },
    tips: [],
    currentTip: req.currentTip || 0
  }
}

export const normalizeChallenge = (req,ch) => {
  let miners = ch.minerOrder || [];
  return {
    ...ch,
    symbol: req.symbol,
    nonces: {
      ...ch.nonces
    },
    finalValue: ch.finalValue?{
      ...ch.finalValuel
    }:undefined,
    minerOrder: [...miners]
  }
}

export const normalizeDispute  = (req, d) => {
  return {
    ...d,
    value: d.value || 0,
    voteCount: d.voteCount || 0,
    finalTally: d.finalTally || 0
  }
}
