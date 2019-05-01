import EthProcessor from './EthProcessor'
import BlockSource from './BlockSource';
import ABI from './ABIParser';
import Enrichment from './enrich/Enrichment';
import ContractEmit from './ContractEmit';

//default configuration for event flow is to start from block puller
//decode ABI
//enrichment Redux store with processed transactions/logs
//and emit any events out of contract as needed
const procs = new EthProcessor()
                        .source(new BlockSource())
                        .add(new ABI())
                        .add(new Enrichment())
                        .add(new ContractEmit());

export default procs;
