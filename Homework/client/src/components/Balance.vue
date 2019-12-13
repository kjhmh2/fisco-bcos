<template>
    <div class="main">
        <div>
            <el-input v-model="addr" placeholder="公司账户公钥地址" class='inputClass'></el-input>
        </div>
        <br>
        <div>
            <el-button type="primary" @click="search()">查询</el-button>
        </div>
        <br>
        <el-main>
            <el-table :data="data">
            <el-table-column prop="balance" label="金额" width="175"></el-table-column>
            <el-table-column prop="credit" label="信用度" width="175"></el-table-column>
            </el-table>
        </el-main>
    </div>
</template>

<script>
export default 
{
    name: 'Balance',
    data () 
    {
        return {
            data: [],
            addr: ''
        }
    },
    methods: 
    {
        search: function () 
        {
            this.$confirm('确认查询？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var that = this;
                this.$axios.request({
                    url: '/balance',
                    method: 'Post',
                    data: JSON.stringify({
                        addr: this.addr
                    }),
                    responseType: 'json'
                }).then(function (res) {
                    console.log(res.data);
                    that.data = [];
                    that.data.push({
                        balance: parseInt(res.data.balance, 16),
                        credit: parseInt(res.data.credit, 16)
                    })
                    if (res.data.msg == "success") {
                        that.$message({
                            message: '查询成功',
                            type: 'success'
                        })
                    } else {
                        that.$message.error('失败')
                    }
                })
            })
        }
    }
}
</script>

<style scoped>
#menu
{
    height: 650px;
}

.main 
{
    width: 350px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 20px;
    margin-bottom: 100px;
}

.inputClass
{
    margin-top: 30px;
    width:300px
}
</style>

