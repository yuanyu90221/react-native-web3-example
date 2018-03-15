import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const Web3 = require('web3');
const web3 = new Web3();
const testNet = 'http://10.0.0.123:8540';
const bluebird = require('bluebird');
web3.setProvider(new web3.providers.HttpProvider(`${testNet}`));

export default class mobile extends Component {

  state = {
    balance: null,
    coinbase: null,
    gas: null
  };

  getBalance() {
    web3.eth.getCoinbase((err, coinbase) => {
      const balance = web3.eth.getBalance(coinbase, (err2, balance) => {
        console.log('coinbase: ' + coinbase);
        console.log('balance ' + balance);
        this.setState({balance,coinbase});
      });
    });
  }

  getEstimateGas() {
    let estimateGas = web3AsynWrapper(web3.eth.estimateGas);
    // estimateGas({
    //   from: '0x0002cC6A7ceC1276E76a76385ad78a76e619dC49',
    //   data: '0x0002cC6A7ceC'
    // }).then((gas)=>{
    //   console.log(gas);
    //   this.setState({gas});
    // })
    let {coinbase} = this.state;
    let PromiseEstimateGas = bluebird.promisify(web3.eth.estimateGas);
    PromiseEstimateGas({
      from: coinbase,
      data: '0x'
    }).then((gas)=>{
      console.log(gas.toString(10));
      this.setState({gas: gas.toString(10)});
    })
  }

  sendTransaction() {
    let signTransaction = web3AsynWrapper(web3.eth.signTransaction);
    let gasPrice = bluebird.promisify(web3.eth.getGasPrice);
    let estimateGas = web3AsynWrapper(web3.eth.estimateGas);
    gasPrice().then((gasPrice) => {
      console.log(gasPrice);
      estimateGas({
        from: '0x0002cC6A7ceC1276E76a76385ad78a76e619dC49',
        data: "0x"
      }).then((gas)=> {
        console.log(`estimate gas: ${gas}`);
        signTransaction({
          from: '0x0002cC6A7ceC1276E76a76385ad78a76e619dC49',
          gasPrice: gasPrice,
          gas: gas,
          to: '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
          value: "300000000000000000",
          data: "0x"
        }).then((result)=>{
          console.log(result.tx);
          console.log(result.raw);
          web3.eth.sendRawTransaction(result.raw, (err, hash) => {
            if(err) {
              console.log(err);
              return;
            }
            console.log(`test send raw transaction tx:${hash}`);
            console.log(`final transaction`);  
          })
        })
      })
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.balanceButton} onPress={this.getBalance.bind(this)}>
          <Text style={styles.balanceText}>Get Balance</Text>
        </TouchableOpacity>
        {this.state.balance && <Text style={styles.balance}>
          {`balance: ${this.state.balance}`}
        </Text>}
        {this.state.coinbase && <Text style={styles.balance}>
          {`${this.state.coinbase}`}
        </Text>}
        <TouchableOpacity style={styles.balanceButton} onPress={this.getEstimateGas.bind(this)}>
          <Text style={styles.balanceText}>Get EstimateGas</Text>
        </TouchableOpacity>
        {this.state.gas && <Text style={styles.balance}>
          {`${this.state.gas}`}
        </Text>}
        <TouchableOpacity style={styles.balanceButton} onPress={this.sendTransaction.bind(this)}>
          <Text style={styles.balanceText}>sendTransaction</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
function web3AsynWrapper(web3Fun) {
  return function(arg) {
    return new Promise((resolve, reject) => {
      web3Fun(arg, (e, data) => e ? reject(e): resolve(data))
    })
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  balanceButton: {
    backgroundColor: '#0dab7f',
    padding: 10,
    width: 200,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  balanceText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16
  },
});

AppRegistry.registerComponent('mobile', () => mobile);
