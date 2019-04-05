import * as types from './';

export default function(data) {
  
  let Type = types[data.event];
  if(Type) {
    return new Type(data);
  }
}
