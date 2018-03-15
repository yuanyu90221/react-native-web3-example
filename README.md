# react-native-web3-example

## 說明
  在react-native中加入web3的library
  參考<https://hackernoon.com/bringing-the-blockchain-to-react-native-98b76e15d44d>
  提到的方式
  透過在android project下的build.gradle
  以及在ios project下的project.pbxproj 
  內加入react-native-randombytes的相依性

## 關於react-native-randombytes
  https://www.npmjs.com/package/react-native-randombytes

## web3.js 相關
  版本為0.19.1所以
  需要把原本是callback的部分利用promise自己作轉換

```code
function web3AsynWrapper(web3Fun) {
  return function(arg) {
    return new Promise((resolve, reject) => {
      web3Fun(arg, (e, data) => e ? reject(e): resolve(data))
    })
  }
}
```