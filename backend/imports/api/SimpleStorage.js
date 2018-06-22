import { Meteor } from 'meteor/meteor'
import Web3 from 'web3';
import SimpleStorageArtifact from '../ethereum/build/contracts/SimpleStorage.json'

let listener = null;

function setListener(cb) {
    listener = cb;
}

if (Meteor.isServer) {
    // This code only runs on the server
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
    }

    const sc = new web3.eth.Contract(SimpleStorageArtifact.abi);
    sc.options.address = SimpleStorageArtifact.networks[5777].address;

    sc.events.StorageSet({fromBlock:0}, (error, event) => { if(error) console.error(event) })
      .on('data', function(event) {
        sc.methods.storedData().call().then(result => { 
          if(listener) {
            listener(result)
          }
        });
      })
}

export default setListener