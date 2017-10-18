pragma solidity ^0.4.11;

// 募捐合约
contract Donation {
    // 募捐计划结构
    struct DonatePlan {
        address recipient; // 收款者地址
        uint256 collectMoney; // 已收集金额，uint256应该是不够的

        bytes32 md5; // 根据填写信息生成的md5校验码
        // 到底哪些需要存blockchain，哪些存中心数据库？
        // 以下信息直接存入中心数据库，并生成md5码存入状态变量
        // string planName; // 计划名
        // string information; // 信息
        // uint256 targetMoney; // 目标金额
        // uint startTime; // 募捐开始时间
        // uint endTime; // 募捐结束时间
    }
    // 募捐者地址数组
    address[] public recipients;
    // 募捐计划mapping
    mapping(address => DonatePlan) public donatePlans;
    // 合约创建者
    address creator;
    // 构造函数
    function Donation() payable {
        creator = msg.sender;
    }
    // 发布自己的募捐计划
    function publishMyDonatePlan(bytes32 md5) {
        // 暂时认为md5为0，代表未曾发布过募捐
        require(donatePlans[msg.sender].md5==0);
        donatePlans[msg.sender].md5 = md5;
        recipients.push(msg.sender);
    }
    // 对某人捐款
    function donate(address receiver) payable {
        // 暂时认为md5为0，代表未曾发布过募捐
        require(donatePlans[receiver].md5!=0);
        donatePlans[receiver].collectMoney += msg.value; // 由于collectMoney是bytes32，这里很可能会超出最大值
        receiver.transfer(msg.value);
    }
    // 获取募捐计划列表
    function getDonatePlanList() returns (bytes32[] md5List, uint256[] collectMoneyList) {
        md5List = new bytes32[](recipients.length);
        collectMoneyList = new uint256[](recipients.length);
        for (uint i = 0; i < md5List.length; i++) {
            md5List[i] = donatePlans[recipients[i]].md5;
            collectMoneyList[i] = donatePlans[recipients[i]].collectMoney;
        }
        return (md5List, collectMoneyList); // 这个return到底要怎么获取？
    }
}