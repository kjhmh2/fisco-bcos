const http = require("http");
const url = require("url");
const path = require('path');
const querystring = require("querystring");
const utils = require('../../api/common/utils');
const Configuration = require('../../api/common/configuration').Configuration;
const { CNSService, PermissionService, Web3jService } = require('../../api');

Configuration.setConfig(path.join(__dirname, '../conf/config.json'));

let cnsService = new CNSService();
let permissionService = new PermissionService();
let web3jService = new Web3jService();

let server = http.createServer((req, res) => {
    var pathname = url.parse(req.url).pathname;
    switch(pathname)
    {
        case '/sign':
            var data = '';
            req.on('data', function (chunk) {
                data += chunk;
            });
            req.on('end', function () {
                var dataObj = JSON.parse(data.toString());
                changeConfig(dataObj.name);
                var to = dataObj.to;
                var amount = dataObj.amount;
                deploy("signReceipt(address,uint256)", [to, amount], res);
            });
            break;

        case '/finance':
            var data = '';
            req.on('data', function (chunk) {
                data += chunk;
            });
            req.on('end', function () {
                var dataObj = JSON.parse(data.toString());
                changeConfig(dataObj.name);
                var amount = dataObj.amount;
                deploy("financing(uint256)", [amount], res);
            });
            break;

        case '/receipt':
            search("receipt()", [], res);
            break;

        default:
            var data = '';
            req.on('data', function (chunk) {
                data += chunk;
            });
            req.on('end', function () {
                var dataObj = JSON.parse(data.toString());
                search2("balance(address)", [dataObj.addr], "credit(address)", [dataObj.addr], res);
            });
            break;
    }
})

server.listen(8888);
console.log("listening at 8888");


function changeConfig(name)
{
    Configuration.reset();
    switch(name)
    {
        case "车企公司":
            Configuration.setConfig(path.join(__dirname, '../conf/config1.json'));
            break;

        case "轮胎公司":
            Configuration.setConfig(path.join(__dirname, '../conf/config2.json'));
            break;

        case "轮毂公司":
            Configuration.setConfig(path.join(__dirname, '../conf/config3.json'));
            break;
        
        case "铝锭公司":
            Configuration.setConfig(path.join(__dirname, '../conf/config4.json'));
            break;

        default:
            Configuration.setConfig(path.join(__dirname, '../conf/config5.json'));
            break;
    }
    cnsService.resetConfig();
    permissionService.resetConfig();
    web3jService.resetConfig();
}

function findItem(abi, name)
{
    for (var obj of abi)
    {
        if (obj.name == name)
        {
            return obj;
        }
    }
}

function deploy(functionName, parameters, res)
{
    cnsService.queryCnsByNameAndVersion("SupplyChain", "0.9").then(queryResult => {
        var contractAddress = queryResult[0].address;
        var abi = JSON.parse(queryResult[0].abi);
        var index = functionName.indexOf('(');
        var name = functionName.substr(0, index);
        var item = findItem(abi, name);
        web3jService.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
            console.log(result);
            let output = result.output;
            if (output !== '0x') {
                output = utils.decodeMethod(item, output);
            }
            console.log(output);
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            if (result.status == '0x0') {
                res.write('{"err":0,"msg":"success"}');
            } else {
                res.write('{"err":1,"msg":"failed"}');
            }
            res.end();
        });
    });
}

function search(functionName, parameters, res)
{
    cnsService.queryCnsByNameAndVersion("SupplyChain", "0.9").then(queryResult => {
        var contractAddress = queryResult[0].address;
        var abi = JSON.parse(queryResult[0].abi);
        var index = functionName.indexOf('(');
        var name = functionName.substr(0, index);
        var item = findItem(abi, name);
        web3jService.sendRawTransaction(contractAddress, functionName, parameters).then(result => {
            // console.log(result);
            let output = result.output;
            if (output !== '0x') {
                output = utils.decodeMethod(item, output);
            }
            console.log(output);
            var data = {
                fromCompany: '',
                toCompany: '',
                money: '',
                status: '',
                isPayed: '',
                msg: ''
            };
            data.fromCompany = output.fromCompany;
            data.toCompany = output.toCompany;
            data.money = output.money;
            data.status = output.status;
            data.isPayed = output.isPayed;
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            if (result.status == '0x0') {
                data.msg = "success";
                res.write(JSON.stringify(data));
            } else {
                data.msg = "failed";
                res.write(JSON.stringify(data));
            }
            res.end();
        });
    });
}

function search2(functionName1, parameters1, functionName2, parameters2, res)
{
    cnsService.queryCnsByNameAndVersion("SupplyChain", "0.9").then(queryResult => {
        var contractAddress = queryResult[0].address;
        var abi = JSON.parse(queryResult[0].abi);
        var index1 = functionName1.indexOf('(');
        var name1 = functionName1.substr(0, index1);
        var index2 = functionName2.indexOf('(');
        var name2 = functionName2.substr(0, index2);
        var item1 = findItem(abi, name1);
        var item2 = findItem(abi, name2);
        web3jService.sendRawTransaction(contractAddress, functionName1, parameters1).then(result => {
            // console.log(result);
            let output = result.output;
            if (output !== '0x') {
                output = utils.decodeMethod(item1, output);
            }
            console.log(output);
            var data = {
                balance: '',
                credit: ''
            };
            data.balance = output[0];
            web3jService.sendRawTransaction(contractAddress, functionName2, parameters2).then(result2 => {
                let output2 = result2.output;
                if (output2 !== '0x') {
                    output2 = utils.decodeMethod(item2, output2);
                }
                console.log(output2[0]);
                data.credit = output2[0];
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
                if (result.status == '0x0') {
                    data.msg = "success";
                    res.write(JSON.stringify(data));
                } else {
                    data.msg = "failed";
                    res.write(JSON.stringify(data));
                }
                res.end();
            });
        });
    });
}


// { abi: '[{"constant":false,"inputs":[{"name":"receiver","type":"address"}],"name":"pay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"signReceipt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"financing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"credit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"companys","outputs":[{"name":"name","type":"string"},{"name":"addr","type":"string"},{"name":"receiptNum","type":"uint256"},{"name":"isCore","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferReceipt","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"showMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"},{"indexed":false,"name":"number","type":"uint256"}],"name":"showAmount","type":"event"}]'
// [ { constant: false,
//     inputs: [ [Object] ],
//     name: 'pay',
//     outputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function' },
//   { constant: false,
//     inputs: [ [Object], [Object] ],
//     name: 'signReceipt',
//     outputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function' },
//   { constant: false,
//     inputs: [ [Object] ],
//     name: 'financing',
//     outputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function' },
//   { constant: true,
//     inputs: [ [Object] ],
//     name: 'credit',
//     outputs: [ [Object] ],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function' },
//   { constant: true,
//     inputs: [ [Object] ],
//     name: 'companys',
//     outputs: [ [Object], [Object], [Object], [Object] ],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function' },
//   { constant: true,
//     inputs: [],
//     name: 'receipt',
//     outputs: [ [Object], [Object], [Object], [Object], [Object] ],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function' },
//   { constant: true,
//     inputs: [ [Object] ],
//     name: 'balance',
//     outputs: [ [Object] ],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function' },
//   { constant: false,
//     inputs: [ [Object], [Object] ],
//     name: 'transferReceipt',
//     outputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function' },
//   { inputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'constructor' },
//   { anonymous: false,
//     inputs: [ [Object] ],
//     name: 'showMessage',
//     type: 'event' },
//   { anonymous: false,
//     inputs: [ [Object], [Object] ],
//     name: 'showAmount',
//     type: 'event' } ]

