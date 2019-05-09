export const normalizeRequest = req => {
  let toJS = req.toJSON;
  if(!toJS) {
    toJS = () => req
  }
  return {
    ...req,
    challenges: {
      ...req.challenges
    },
    disputes: {
      ...req.disputes
    },
    tips: [],
    currentTip: req.currentTip || 0,
    toJSON: toJS
  }
}
