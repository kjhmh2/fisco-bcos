<template>
    <div class="main">
        <div>
            <el-input v-model="name" placeholder="发送者公司名" class='inputClass'></el-input>
        </div>
        <div>
            <el-input v-model="amount" placeholder="金额(万元)" class='inputClass'></el-input>
        </div>
        <br>
        <div>
            <el-button type="primary" @click="doFinance()">确认</el-button>
        </div>
        <br>
    </div>
</template>

<script>
export default 
{
    name: 'Finance',
    data () 
    {
        return {
            name: '',
            amount: ''
        }
    },
    methods: 
    {
        doFinance: function () 
        {
            this.$confirm('确认进行融资？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var that = this
                this.$axios.request({
                    url: '/finance',
                    method: 'Post',
                    data: JSON.stringify({
                        name: this.name,
                        amount: this.amount
                    }),
                    responseType: 'json'
                }).then(function (res) {
                    console.log(res.data.msg);
                    if (res.data.msg == "success") {
                        that.$message({
                            message: '融资成功',
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

