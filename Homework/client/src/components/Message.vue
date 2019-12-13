<template>
    <div class="main">
        <!-- 边表 -->
        <el-col :span="3" >
            <el-menu default-active="1" class="menu" @select="handleSelect">
                <el-menu-item index="1">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">公司</span>
                </el-menu-item>
                <!-- <el-menu-item index="2">
                    <i class="el-icon-money"></i>
                    <span slot="title">单据</span>
                </el-menu-item> -->
            </el-menu>
        </el-col>
        <!-- 公司信息 -->
        <div>
            <el-main>
                <el-table :data="companyData">
                    <el-table-column prop="name" label="公司名" width="300"></el-table-column>
                    <el-table-column prop="addr" label="公司地址" width="300"></el-table-column>
                    <el-table-column prop="key" label="公钥地址信息" width="300"></el-table-column>
                    <el-table-column prop="core" label="是否为核心企业" width="200"></el-table-column>
                </el-table>
            </el-main>
        </div>
    </div>
</template>

<script>
export default 
{
    name: 'Message',
    data () 
    {
        return {
            companyData: [
                {
                    name: '银行',
                    addr: 'xx省xx市xx区xx号',
                    key: '0x902252c74d3d055a21dfbd01e445a5a0c4303f9d',
                    core: '/'
                },
                {
                    name: '车企公司',
                    addr: 'xx省xx市xx区xx号',
                    key: '0x643d8fbbd51e55643717ff33d1d03300c82d50e4',
                    core: '是'
                },
                {
                    name: '轮胎公司',
                    addr: 'xx省xx市xx区xx号',
                    key: '0x282d5aa434fb0affd8abd0d6fcba7e6cca2945e3',
                    core: '否'
                },
                {
                    name: '轮毂公司',
                    addr: 'xx省xx市xx区xx号',
                    key: '0x0f3583935ca11f9242b08b8d38126a004818f7a0',
                    core: '否'
                },
                {
                    name: '铝锭公司',
                    addr: 'xx省xx市xx区xx号',
                    key: '0x0ce4f533d65e58df054f060e07c4175c1d16256d',
                    core: '否'
                },
                {
                    name: '铝矿公司',
                    addr: 'xx省xx市xx区xx号',
                    key: '0x00a140694153c5d172140e859a555febeb0656e8',
                    core: '否'
                }
            ],
            showCompany: true,
            to: '',
            name: '轮胎公司',
            amount: ''
        }
    },
    methods: 
    {

    }
}
</script>

<style scoped>
#menu
{
    height: 650px;
}
</style>

