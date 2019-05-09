import * as types from './';

export default function(data) {
  if(!data.returnValues) {
    return null;
  }
  
  let Type = types[data.event];
  if(Type) {
    return new Type(data);
  }
}
