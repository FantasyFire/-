// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
// import { default as $ } from 'jquery';
// import '../javascripts/jquery.min.js';
// import { default as $ } from '../javascripts/jquery.min.js';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import tjipcontract_artifacts from '../../build/contracts/TJIPContract.json'

var TJIPContract = contract(tjipcontract_artifacts);
// 这个是改为资源组逻辑前的合约地址
// var TJIPContractAddress_rinkeby = "0x385f1d491b3bf2dffa3d1f16710403c9f4e0f1fa";

// 这个是更改为资源组逻辑后的合约地址
var TJIPContractAddress_rinkeby = "0xf7d4d22fc8390cfae0207675004a925c093ab64b";

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var default_account = "0x6484a4b1baacb294c17a6bc777ab6ccb1c69acd8";
var default_resource = "0x123";
var cur_index = 1;

// 一些常量
const BYTE32_EMPTY = '0x0000000000000000000000000000000000000000000000000000000000000000';

window.App = {
  start: function () {
    var self = this;

    TJIPContract.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      self.accounts = accounts = accs;
      self.account = account = accounts[0];

      // self.refreshBalance();
    });

    self.instance = TJIPContract.at(TJIPContractAddress_rinkeby);
    // .then(function(instance) {
    //   self.instance = instance;
    // });
  },

  setStatus: function (message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  // 选择一个页面
  showPage: function(selection) {
    var index = selection.getAttribute('i');
    cur_index = index;
    // 调整样式
    var btns = document.getElementsByClassName('div_tab');
    for (var i=0; i<btns.length; i++) {
      var btn = btns[i];
      if(btn.getAttribute('i') == index) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    }
    // 切换显示block
    var blocks = document.getElementsByClassName('block');
    for (var i=0; i<blocks.length; i++) {
      var block = blocks[i];
      var thisone = block.getAttribute('i') == index;
      block.classList.add(thisone ? 'show':'hide');
      block.classList.remove(thisone ? 'hide':'show');
    }
  },

  // 显示output
  printOutput: function(act, result) {
    var status = result.receipt.status;
    var output = document.querySelector('.block.show').querySelector('.block_output');
    if (result instanceof Array) { // 这种情况认为是call调用得到的结果
      // 未实现（需要每个接口定义对应自身的结果解析格式）
    } else {
      output.innerText += "\n"+act+(status==1?"成功":"失败")+"，status:"+status;
    }
    console.log('$1', result);
  },

  // 公共接口
  joinCommunity: function() {
    var self = this;
    self.instance.joinCommunity({from: account}).then(function(result) {
      self.printOutput("加入天姬会员", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error joinCommunity; see log.");
    });
  },

  showOriginatorInfo: function () {
    var self = this;
    var originatorAddress = document.getElementById("showOriginatorInfo_originatorAddress").value || default_account;
    self.instance.queryOriginator(originatorAddress, {from: account}).then(function(result) {
      console.log('$1', result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error query originator; see log.");
    });
  },

  showBrokerInfo: function () {
    var self = this;
    var brokerAddress = document.getElementById("showBrokerInfo_brokerAddress").value || default_account;
    self.instance.queryBroker(brokerAddress, {from: account}).then(function(result) {
      console.log('$1', result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error query broker; see log.");
    });
  },

  showResourceInfo: function () {
    var self = this;
    var fileMD5 = document.getElementById("showResourceInfo_fileMD5").value || default_resource;
    self.instance.queryStakers(fileMD5, {from: account}).then(function(result) {
      console.log('$1', result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error query stakers; see log.");
    });
  },

  // 审核方接口
  setRights: function () {
    var self = this;
    var user = document.getElementById("setRights_user").value || default_account;
    var rights = parseInt(document.getElementById("setRights_rights").value) || 0;
    self.instance.setRights(user, rights, {from: account}).then(function(result) {
      self.printOutput("设置权限", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error setRights; see log.");
    });
  },

  publishInvention: function () {
    var self = this;
    var originatorAddress = document.getElementById("publishInvention_originatorAddress").value || default_account;
    var fileMD5 = document.getElementById("publishInvention_fileMD5").value || default_resource;
    self.instance.publishInvention(originatorAddress, fileMD5, {from: account}).then(function(result) {
      self.printOutput("发布", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error publishInvention; see log.");
    });
  },

  // 原创者接口
  inventPricing: function () {
    var self = this;
    var fileMD5 = document.getElementById("inventPricing_fileMD5").value || default_resource;
    var basePrice = parseInt(document.getElementById("inventPricing_basePrice").value) || 3;
    basePrice *= 10**17;
    var profitRatio = parseInt(document.getElementById("inventPricing_profitRatio").value) || 20;
    self.instance.inventPricing(fileMD5, basePrice, profitRatio, {from: account}).then(function(result) {
      self.printOutput("原创资源定价", result);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sale; see log.");
    });
  },

  // 上传方接口
  sale: function () {
    console.log('暂时废用');
    // var self = this;
    // var fileMD5 = document.getElementById("sale_fileMD5").value || default_resource;
    // var price = parseInt(document.getElementById("sale_price").value) || 13;
    // price *= 10**17;
    // self.instance.sale(fileMD5, price, {from: account}).then(function(result) {
    //   self.printOutput("资源上架", result);
    // }).catch(function(e) {
    //   console.log(e);
    //   self.setStatus("Error sale; see log.");
    // });
  },

  // 购买方接口
  buy: function (fileMD5, brokerAddress) {
    console.log('暂时废用');
    // var self = this;
    // var value = document.getElementById("buy_value").value || 13;
    // value *= 10**17;
    // var fileMD5 = document.getElementById("buy_fileMD5").value || default_resource;
    // var brokerAddress = document.getElementById("buy_brokerAddress").value || default_account;
    // self.instance.buy(fileMD5, brokerAddress, {from: account, value: value}).then(function(result) {
    //   self.printOutput("购买资源", result);
    // }).catch(function(e) {
    //   console.log(e);
    //   self.setStatus("Error buy; see log.");
    // });
  },

  // 以下接口供天姬调用
  /**
   * 查询本人是否可以上传
   */
  canUpload: function () {
    return new Promise((resolve, reject) => {
      Promise.all([
        App.instance.TJUserGroup(account, {from: account}),
        App.instance.brokerGroup(account, {from: account})
      ]).then(values => {
        resolve({success:true, value:values.every(v => v.toNumber()==1)});
      }).catch(e => {
        resolve({success:false, value:e});
      });
    });
  },

  /**
   * 查询资源是否存在
   */
  checkIfResExist: function (md5) {
    return new Promise((resolve, reject) => {
      App.instance.resources(md5, {from: account}).then(function (res) {
        resolve({success:true, value:res[0]!=BYTE32_EMPTY});
      }).catch(e => {
        resolve({success:false, value:e});
      });
    });
  },

  /**
   * 上架资源
   */
  putOnSale: function (zMD5, price, gMD5, fileMD5s, zUrl) {
    return new Promise((resolve, reject) => {
      price *= 10**17;
      App.instance.sale(zMD5, price, gMD5, fileMD5s, zUrl, {from: account}).then(function (res) {
        resolve({success:true, value:0});
      }).catch(e => {
        resolve({success:false, value:e});
      });
    });
  },

  /**
   * 购买资源组
   */
  buyResGroup: function (zMD5, brokerAddress, price) {
    return new Promise((resolve, reject) => {
      price *= 10**17;
      App.instance.buy(zMD5, brokerAddress, {from: account, value: price}).then(function (res) {
        resolve({success:true, value:0});
      }).catch(e => {
        resolve({success:false, value:e});
      });
    });
  }
};

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});

/**
 * 用于监听message，响应天姬页面的请求
 */
// window.addEventListener('message', function (event) {
//   let data = event.data || {};
//   if (data.msg) { // 仅当data.msg不为空时处理
//     switch (data.msg) {
//       case 'canUpload':
//         Promise.all([
//           App.instance.TJUserGroup(account, {from: account}),
//           App.instance.brokerGroup(account, {from: account})
//         ]).then(values => {
//           parent.postMessage({msg:'onCanUpload', res:values.every(v => v.toNumber()==1)});
//         });
//         break;
//       default:
//         console.log('未支持消息:$1的响应', data.msg);
//     }
//   }
// });