<template>
  <div id="app">
    <el-menu
      :router="true"
      :default-active="this.$route.path"
      class="menu"
      mode="horizontal"
      background-color="#000000"
      text-color="#ffffff"
      active-text-color="#0000ff">
      <h1 id="front">金融平台</h1>
      <el-menu-item index="/" >信息概览</el-menu-item>
      <el-menu-item index="/balance" >金额查询</el-menu-item>
      <el-menu-item index="/sign">单据签署</el-menu-item>
      <el-menu-item index="/receipt">单据查看</el-menu-item>
      <el-menu-item index="/finance">融资申请</el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body 
{
    margin: 0;
}

.log 
{
    height: 60px;
}

#front
{
    line-height: 1.2;
    height: 36.8px;
    width: 120px;
    float: left;
    font-size: 30px;
    margin-block-start: 10px;
    margin-block-end: 10px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    color: #FFFFFF;
}

#app 
{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>

