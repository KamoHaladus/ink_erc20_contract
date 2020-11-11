import meta from './metadata.json';
import { Abi, ContractPromise } from '@polkadot/api-contract';

const ctr_address = '5EE6CoDXBtkfu9f1ce3zuJpwKBfjTtV44M88hPCE485jmG9G';

const gasLimit = 100000000000;

export const getContract = (api) => (new ContractPromise(api, new Abi(meta), ctr_address));

export const ctr_transfer = async (contract,fromAcct, transferTo, amount) => {
    const value = 0;

    await contract.tx
        .transfer(value, gasLimit, transferTo, amount)
        .signAndSend(fromAcct, (result) => {
            if (result.status.isInBlock) {
                console.log('in block');
            } else if (result.status.isError) {
                console.log(result);
                console.log('err');
            } else if (result.status.isFinalized) {
                console.log('finalized');
            }
        });
}