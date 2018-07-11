import Web3 from 'web3';
import contract from 'truffle-contract';
import { Tracker } from 'meteor/tracker'

import SimpleStorageArtifact from './build/contracts/SimpleStorage.json'

const contractDep = new Tracker.Dependency;

class SimpleStorage {
    constructor() {

        this.instance = undefined;
        this.data = undefined;

        if (typeof web3 !== 'undefined') {
            console.log('SimpleStorage: web3 is injected')
            this.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(this.web3Provider);

        this.contract = contract(SimpleStorageArtifact);
        this.contract.setProvider(web3.currentProvider);

        const that = this;

        this.contract.deployed().then(function(instance) {
            console.log('SimpleStorage: instance is ready')
            that._setInstance(instance)
            that._refreshData()
            instance.StorageSet().watch((err, responce) => {
                if(err) {
                    console.error(err)
                }
                else {
                    that._refreshData()
                    console.log(responce.args._message)
                }
            });
        });
    }
    getData() {
        contractDep.depend();
        return this.data;
    }
    _setData(data) {
        if(this.data !== data) {
            this.data = data;
            contractDep.changed();
        }
    }
    _getInstance() {
        contractDep.depend();
        return this.instance;
    }
    _setInstance(instance) {
        if(this.instance !== instance) {
            this.instance = instance;
            contractDep.changed();
        }
    }
    _refreshData() {
        const that = this;

        if(this.instance === undefined) return;

        this.instance.storedData.call()
            .then(result => that._setData(result))
            .catch(error => concole.error(error));
    }
};

export default SimpleStorage;
