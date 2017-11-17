pragma solidity ^0.4.11;

contract TJIPContract {
    // 各用户组群mapping
    // 天姬用户
    mapping(address => uint) public TJUserGroup;
    // 审核方
    mapping(address => uint) public auditorGroup;
    // 上传方
    mapping(address => uint) public brokerGroup;
    // 原创者
    mapping(address => uint) public originatorGroup;
    // 资源采购者
    // mapping(address => uint) public buyerGroup;

    // 资源结构体
    struct Resource {
        bytes32 fileMD5;
        address originatorAddress;
        uint basePrice;
        uint profitRatio; // 加入资源组后，该值实际上已弃用
        address[] brokers; // 加入资源组后，该值实际上已弃用
    }
    // 资源组结构体
    struct ResGroup {
        bytes32 zMD5; // 资源md5
        bytes32[] fileMD5s; // 文件md5数组
    }
    // 贩卖结构体（用于存储在区块链中）
    struct Sale {
        address brokerAddress;
        bytes32 zMD5;
        uint price;
        bytes32 gMD5; // 解压密钥
        string zUrl; // 资源地址
    }
    // 资源映射（fileMD5 => 资源结构体）
    mapping(bytes32 => Resource) public resources;
    // 资源组映射（zMD5 => 资源组结构体）
    mapping(bytes32 => ResGroup) public resGroups;
    // 贩卖映射（上传人地址 => 贩卖结构体数组）
    mapping(address => Sale[]) public sales;
    // 原创映射（原创者地址 => 资源结构体数组）
    mapping(address => Resource[]) public originals;
    // 合约创建者
    address creator;

    // 用于返回一个address
    event ReturnAddress(address addr);
    // 用于返回资源信息
    // event ShowResourceInfo(address originatorAddress, uint basePrice, uint profitRatio, address[] brokers);
    // 用于返回上传人的上传资源信息列表
    // event ShowBrokerInfo(bytes32[] fileMD5, uint[] price, address[] originatorAddress, uint[] basePrice, uint[] profitRatio);
    // 用于返回原创者的原创资源信息列表
    // event ShowOriginatorInfo(bytes32[] fileMD5, uint[] basePrice, uint[] profitRatio); // , address[][] brokers
    // 购买资源组成功，返回下载链接以及解压密码等信息
    event BuySuccess(bytes32 zMD5, string zUrl, bytes32 gMD5);
    
    // 自定义modifier
    modifier onlyTJUser() {
        require(TJUserGroup[msg.sender]==1);
        _;
    }

    modifier onlyAuditor() {
        require(auditorGroup[msg.sender]==1);
        _;
    }

    modifier onlyOriginator() {
        require(originatorGroup[msg.sender]==1);
        _;
    }

    modifier onlyBroker() {
        require(brokerGroup[msg.sender]==1);
        _;
    }
    
    // 构造函数
    function TJIPContract() public {
        creator = msg.sender;
        TJUserGroup[creator] = 1;
        auditorGroup[creator] = 1;
        brokerGroup[creator] = 1;
        originatorGroup[creator] = 1;
    }

    // 公共接口
    // 加入天姬会员名单
    function joinCommunity() public {
        TJUserGroup[msg.sender] = 1;
    }

    // 查阅资源的上传列表
    function queryStakers(bytes32 fileMD5) public constant onlyTJUser returns(
        bytes32 _fileMD5,
        address originatorAddress,
        uint basePrice,
        uint profitRatio,
        address[] brokers)
    {
        Resource storage res = resources[fileMD5];
        // ShowResourceInfo(res.originatorAddress, res.basePrice, res.profitRatio, res.brokers);
        return (fileMD5, res.originatorAddress, res.basePrice, res.profitRatio, res.brokers);
    }

    // 查阅某人上传的资源信息
    function queryBroker(address brokerAddress) public constant onlyTJUser returns(
        bytes32[] zMD5, // 这些都是memory数组，memory数组只能在初始化时指定大小，以后不能再改变。这意味着不能使用push方法
        uint[] price,
        address[] originatorAddress)
    {
        Sale[] storage saleArray = sales[brokerAddress];
        zMD5 = new bytes32[](saleArray.length);
        price = new uint[](saleArray.length);
        // fileMD5s = new string[](saleArray.length);
        originatorAddress = new address[](saleArray.length);
        // basePrice = new uint[](saleArray.length);
        // profitRatio = new uint[](saleArray.length);
        for (uint i = 0; i < saleArray.length; i++) {
            Sale storage _sale = saleArray[i];
            zMD5[i] = _sale.zMD5;
            price[i] = _sale.price;
            // 想把fileMD5合成一串字符串，但是找不到把bytes32转字符串的方法
            // string sfileMD5s = ""; 
            // fileMD5s[i] = sfileMD5s;
            // ResGroup storage resGroup = resGroups[_sale.zMD5];
            // for (uint j = 0; j < resGroup.fileMD5s.length; j++) {
            //     sfileMD5s += resGroup.fileMD5s[j] + ";"; // 会报错
            // }
            // fileMD5s[i] = sfileMD5s;

            // Resource storage res = resources[_sale.fileMD5];
            // basePrice[i] = res.basePrice;
            // profitRatio[i] = res.profitRatio;
        }
        // ShowBrokerInfo(fileMD5, price, originatorAddress, basePrice, profitRatio);
    }

    // 查阅某原创者的资源信息
    function queryOriginator(address originatorAddress) public constant onlyTJUser returns(
        bytes32[] fileMD5,
        uint[] basePrice,
        uint[] profitRatio)
    {
        Resource[] storage resArray = originals[originatorAddress];
        fileMD5 = new bytes32[](resArray.length);
        basePrice = new uint[](resArray.length);
        profitRatio = new uint[](resArray.length);
        for (uint i = 0; i < resArray.length; i++) {
            Resource storage res = resArray[i];
            fileMD5[i] = res.fileMD5;
            basePrice[i] = res.basePrice;
            profitRatio[i] = res.profitRatio;
            // brokers.push(res.brokers);
        }
        // ShowOriginatorInfo(fileMD5, basePrice, profitRatio); //, brokers
    }

    // 原创者方接口
    // 对资源定价
    function inventPricing(bytes32 fileMD5, uint basePrice, uint profitRatio) public onlyOriginator {
        Resource storage res = resources[fileMD5];
        require(res.originatorAddress==msg.sender);
        require(0<=profitRatio && profitRatio<=100);
        res.basePrice = basePrice;
        res.profitRatio = profitRatio;
        // 同时认为原创方以原价发布一个销售信息（改为资源组后，不能这样发布单品的贩卖了）
        // Sale storage _sale;
        // Sale[] storage mySales = sales[msg.sender];
    }

    // 审核方接口
    // 设置某人的权限（不能取消权限？取消权限另开一个接口？）
    // @param <uint> rights - 设置权限类型(1：审核方，2：上传方，3：原创者，4：资源采购者（已舍弃）)
    function setRights(address user, uint rights) public onlyAuditor onlyTJUser {
        require(TJUserGroup[user] == 1);
        if (rights==1) {
            auditorGroup[user] = 1;
        } else if (rights==2) {
            brokerGroup[user] = 1;
        } else if (rights==3) { // 成为originator的同时，成为一个broker
            originatorGroup[user] = 1;
            brokerGroup[user] = 1;
        }
        // 其他情况不处理
    }

    // 发布一个资源
    function publishInvention(address originatorAddress, bytes32 fileMD5) public onlyAuditor {
        require(originatorGroup[originatorAddress] == 1); // 确保originator的权限
        Resource storage res = resources[fileMD5];
        if (res.originatorAddress==0) { // 该资源尚无原创者
            res.originatorAddress = originatorAddress;
            res.fileMD5 = fileMD5;
            originals[originatorAddress].push(res);
        }
        ReturnAddress(res.originatorAddress);
    }

    // 上传方接口
    function sale(bytes32 zMD5, uint price, bytes32 gMD5, bytes32[] fileMD5s, string zUrl) public onlyBroker {
        ResGroup storage resGroup = resGroups[zMD5];
        if (resGroup.zMD5 == 0) { // 若未有该资源，则初始化一个
            resGroup.zMD5 = zMD5;
            resGroup.fileMD5s = fileMD5s;
        }
        uint i = 0;
        uint totalBasePrice = 0; // 统计总基价
        for (i = 0; i < resGroup.fileMD5s.length; i++) {
            Resource storage res = resources[resGroup.fileMD5s[i]];
            totalBasePrice += res.basePrice;
        }
        require(price >= totalBasePrice); // 售价需不小于总基价
        // 尝试查找是否已有上传信息
        Sale[] storage mySales = sales[msg.sender];
        bool exist = false;
        for (i = 0; i < mySales.length; i++) {
            if (mySales[i].zMD5 == zMD5) {
                exist = true;
                break;
            }
        }
        if (exist) {
            mySales[i].price = price;
            mySales[i].gMD5 = gMD5;
            mySales[i].zUrl = zUrl;
        } else {
            mySales.push(Sale({
                brokerAddress: msg.sender,
                zMD5: zMD5,
                price: price,
                gMD5: gMD5,
                zUrl: zUrl
            }));
            // res.brokers.push(msg.sender);
        }
    }

    // 购买方接口
    function buy(bytes32 zMD5, address brokerAddress) public onlyTJUser payable {
        Sale storage _sale;
        Sale[] storage brokerSales = sales[brokerAddress];
        uint i = 0;
        Resource storage res;
        for (i = 0; i < brokerSales.length; i++) { // 尝试找到贩卖信息
            if (brokerSales[i].zMD5 == zMD5) {
                _sale = brokerSales[i];
                break;
            }
        }
        require(_sale.zMD5!=0); // 保证贩卖信息存在
        ResGroup storage resGroup = resGroups[zMD5]; // 获取资源组，逐一转账
        // 重新统计基价（因为原创者任何时候都有可能重新定价）
        uint totalBasePrice = 0; // 统计总基价
        for (i = 0; i < resGroup.fileMD5s.length; i++) {
            res = resources[resGroup.fileMD5s[i]];
            totalBasePrice += res.basePrice;
        }
        require(_sale.price>=totalBasePrice && msg.value>=_sale.price); // 保证买家给够了钱
        uint profit = _sale.price;
        for (i = 0; i < resGroup.fileMD5s.length; i++) {
            res = resources[resGroup.fileMD5s[i]];
            if (res.originatorAddress != 0 && res.basePrice > 0) {
                res.originatorAddress.transfer(res.basePrice);
                profit -= res.basePrice;
            }
        }
        _sale.brokerAddress.transfer(profit);
        BuySuccess(_sale.zMD5, _sale.zUrl, _sale.gMD5);
    }
}