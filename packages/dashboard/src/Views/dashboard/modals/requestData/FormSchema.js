export const schema = {
  type: "object",
  required: ['queryString','multiplier','tip'],
  properties: {
    queryString: {
      type: 'string',
      title: 'Query URL',
      maxLength: 200
    },
    multiplier: {
      type: 'number',
      title: 'Multiplier',

    },
    tip: {
      type: 'number',
      title: 'Tip',

    },
    symbol: {
      type: "string",
      title: "Symbol",
      maxLength: 16
    }
  },
  validation: (data, errs) => {
    let m = data.multiplier;
    if(m % 10 !==0 ) {
      errs.multiplier.addError("Multiplier must be multiple of 10");
    }
    if(!(""+m).startsWith("1")) {
      errs.multiplier.addError("Multiplier must be an increment of 10 (10, 100, 1000)");
    }
    return errs;
  }
}

export const uiSchema = {
  queryString: {
    "ui:placeholder": "https://..."
  },
  multiplier: {
    "ui:placeholder": "10,100,1000"
  },
  symbol: {
    "ui:placeholder": "ETH-USD"
  }
}
