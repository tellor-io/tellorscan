export const schema = {
  type: "object",
  required: ['tip'],
  properties: {
    tip: {
      type: 'number',
      title: 'Tip',
      minimum: 0

    }
  }
}
