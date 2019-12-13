- 前端启动（8080端口）

  进入client文件夹：

  ```bash
  # install dependencies
  npm install
  
  # serve with hot reload at localhost:8080
  npm run dev
  ```

- 服务端启动（8888端口）

  进入nodejs-sdk/packages/server/src路径

  ```bash
  # serve at localhost:8888
  nodejs server.js
  ```

- 链端启动

  进入fisco/nodes/127.0.0.1路径

  ```bash
  # start
  bash start_all.sh
  ```


- 合约部署

  进入nodejs-sdk/packages/cli路径

  ```bash
  # deploy 1.0 version
  ./cli.js deployByCNS SupplyChain 1.0
  ```

  需要注意，服务器中调用的是0.9版本的合约，如果需要重新部署，服务器中的合约版本也需要随之改变。