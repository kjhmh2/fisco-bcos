pragma solidity ^0.4.21;

contract SupplyChain
{
    struct Company
    {
        string name;                    // name
        string addr;                    // address
        Receipt[] receipts;             // receipts
        uint receiptNum;                // number of receipts
        bool isCore;                    // whether is core company
    }
    
    struct Receipt
    {
        address fromCompany;            // debt side
        address toCompany;              // receiving side
        uint money;                     // amount of money
        string status;                  // status
        bool isPayed;                   // whether the receipt is payed
    }
    
    mapping (address => Company) public companys;
    mapping (address => uint) public balance;
    mapping (address => uint) public credit;
    Receipt public receipt;
    address private coreCompany;
    address private bank;

    // show messages
    event showMessage(string message);
    event showAmount(string message, uint number);
    
    constructor() public
    {
        coreCompany = msg.sender;
        bank = 0x902252c74d3d055a21dfbd01e445a5a0c4303f9d;  // set the address of bank
        balance[bank] = 99999;                              // init the amount of bank

        companys[0x643d8fbbd51e55643717ff33d1d03300c82d50e4].name = "车企公司";
        companys[0x643d8fbbd51e55643717ff33d1d03300c82d50e4].addr = "xx省xx市xx区xx号";
        companys[0x643d8fbbd51e55643717ff33d1d03300c82d50e4].isCore = true;
        credit[0x643d8fbbd51e55643717ff33d1d03300c82d50e4] = 2000;
        balance[0x643d8fbbd51e55643717ff33d1d03300c82d50e4] = 2000;

        companys[0x282d5aa434fb0affd8abd0d6fcba7e6cca2945e3].name = "轮胎公司";
        companys[0x282d5aa434fb0affd8abd0d6fcba7e6cca2945e3].addr = "xx省xx市xx区xx号";
        companys[0x282d5aa434fb0affd8abd0d6fcba7e6cca2945e3].isCore = false;
        credit[0x282d5aa434fb0affd8abd0d6fcba7e6cca2945e3] = 1000;
        balance[0x282d5aa434fb0affd8abd0d6fcba7e6cca2945e3] = 1000;

        companys[0x0f3583935ca11f9242b08b8d38126a004818f7a0].name = "轮毂公司";
        companys[0x0f3583935ca11f9242b08b8d38126a004818f7a0].addr = "xx省xx市xx区xx号";
        companys[0x0f3583935ca11f9242b08b8d38126a004818f7a0].isCore = false;
        credit[0x0f3583935ca11f9242b08b8d38126a004818f7a0] = 1000;
        balance[0x0f3583935ca11f9242b08b8d38126a004818f7a0] = 1000;

        companys[0x0ce4f533d65e58df054f060e07c4175c1d16256d].name = "铝锭公司";
        companys[0x0ce4f533d65e58df054f060e07c4175c1d16256d].addr = "xx省xx市xx区xx号";
        companys[0x0ce4f533d65e58df054f060e07c4175c1d16256d].isCore = false;
        credit[0x0ce4f533d65e58df054f060e07c4175c1d16256d] = 500;
        balance[0x0ce4f533d65e58df054f060e07c4175c1d16256d] = 500;

        companys[0x00a140694153c5d172140e859a555febeb0656e8].name = "铝矿公司";
        companys[0x00a140694153c5d172140e859a555febeb0656e8].addr = "xx省xx市xx区xx号";
        companys[0x00a140694153c5d172140e859a555febeb0656e8].isCore = false;
        credit[0x00a140694153c5d172140e859a555febeb0656e8] = 500;
        balance[0x00a140694153c5d172140e859a555febeb0656e8] = 500;
    }
    
    // function 1
    function signReceipt(address receiver, uint amount) public
    {
        // whether it has the money
        if (credit[msg.sender] < amount)
            revert("Your credit is not enough");
        companys[receiver].receipts.push(Receipt({
            fromCompany:msg.sender,
            toCompany:receiver,
            money:amount,
            status:"ok",
            isPayed:false
        }));
        receipt.fromCompany = msg.sender;
        receipt.toCompany = receiver;
        receipt.money = amount;
        receipt.status = "ok";
        receipt.isPayed = false;
        companys[receiver].receiptNum ++;
        // whether it is bank
        if (receiver == bank)
        {
            balance[msg.sender] += amount;
            balance[receiver] -= amount;
        }
        else
        {
            credit[msg.sender] -= amount;
            credit[receiver] += amount;
        }
        // emit showAmount("Sign Receipt Successed", amount);
    }
    
    // function 2
    function transferReceipt(address receiver, uint amount) public
    {
        uint length = companys[msg.sender].receiptNum;
        bool haveReceipt = false;
        // traverse the receipt
        for (uint i = 0; i < length; ++ i)
        {
            if (companys[msg.sender].receipts[i].money >= amount)
            {
                haveReceipt = true;
                companys[msg.sender].receipts[i].money -= amount;
                signReceipt(receiver, amount);
                break;
            }
        }
        // whether it has receipt
        if (!haveReceipt)
            revert("You don't have such receipt");
        // emit showAmount("Transfer Receipt Successed", amount);
    }
    
    // function 3
    function financing(uint amount) public
    {
        uint length = companys[msg.sender].receiptNum;
        bool haveReceipt = false;
        // traverse the receipt
        for (uint i = 0; i < length; ++ i)
        {
            if (companys[msg.sender].receipts[i].money >= amount)
            {
                haveReceipt = true;
                companys[msg.sender].receipts[i].money -= amount;
                signReceipt(bank, amount);
                break;
            }
        }
        // whether it has receipt
        if (!haveReceipt)
            revert("You don't have such receipt");
        // emit showAmount("Financing Successed", amount);
    }
    
    // function 4
    function pay(address receiver) public
    {
        // whether it is core company
        if (!companys[msg.sender].isCore)
            revert("You are not core company");
        uint length = companys[receiver].receiptNum;
        // traverse the receipt
        for (uint i = 0; i < length; ++ i)
        {
            if (companys[receiver].receipts[i].fromCompany == msg.sender && !companys[receiver].receipts[i].isPayed)
            {
                uint amount = companys[receiver].receipts[i].money;
                // whether it can afford the money
                if (balance[msg.sender] < amount)
                    revert("Your balance is not enough");
                companys[receiver].receipts[i].isPayed = true;
                // pay the money
                balance[msg.sender] -= amount;
                balance[receiver] += amount;
                // recovery the credit
                credit[msg.sender] += amount;
                credit[receiver] -= amount;
            }
        }
        // emit showMessage("Pay Successed");
    }

    // // function 5
    // function getReceipts
    // {

    // }

    //     return 
}
