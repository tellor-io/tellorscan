import Tellor from './Tellor.json';
import TellorLibrary from './TellorLibrary.json';
import TellorGetters from './TellorGetters.json';
import TellorGettersLibrary from './TellorGettersLibrary.json';
import TellorMaster from './TellorMaster.json';
import Utilities from './Utilities.json';
import TellorStake from './TellorStake.json';
import TellorTransfer from './TellorTransfer.json';
import TellorDispute from './TellorDispute.json';

export default [
  ...Tellor.abi,
  ...TellorLibrary.abi,
  ...TellorGetters.abi,
  ...TellorGettersLibrary.abi,
  ...TellorMaster.abi,
  ...Utilities.abi,
  ...TellorStake.abi,
  ...TellorTransfer.abi,
  ...TellorDispute.abi
]
