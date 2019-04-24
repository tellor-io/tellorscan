import EthProcessor from './EthProcessor'
import BlockSource from './BlockSource';
import ABI from './ABIParser';
import Enrichment from './enrich/Enrichment';
import ContractEmit from './ContractEmit';

const procs = new EthProcessor()
                        .source(new BlockSource())
                        .add(new ABI())
                        .add(new Enrichment())
                        .add(new ContractEmit());

export default procs;
