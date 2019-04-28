import Tellor from './Tellor.json';
import TellorLibrary from './TellorLibrary.json';
import TellorGetters from './TellorGetters.json';
import TellorGettersLibrary from './TellorGettersLibrary.json';
import TellorMaster from './TellorMaster.json';
import Utilities from './Utilities.json';

export default [
  ...Tellor.abi,
  ...TellorLibrary.abi,
  ...TellorGetters.abi,
  ...TellorGettersLibrary.abi,
  ...TellorMaster.abi,
  ...Utilities.abi
]
