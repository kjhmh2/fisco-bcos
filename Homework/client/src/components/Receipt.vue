<template>
    <div class="main">
        <el-main>
            <el-table :data="data">
            <el-table-column prop="from" label="欠款人" width="300"></el-table-column>
            <el-table-column prop="to" label="收款人" width="300"></el-table-column>
            <el-table-column prop="amount" label="金额(万元)" width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="200"></el-table-column>
            <el-table-column prop="ispaid" label="是否已还" width="200"></el-table-column>
            </el-table>
            <el-button type="primary" @click="update()">更新</el-button>
        </el-main>
    </div>
</template>

<script>
export default 
{
    name: 'Receipt',
    data () 
    {
        return {
            data: [],
        }
    },
    activated() {
        this.update();
    },
    methods: 
    {
        update: function () 
        {
            this.$confirm('确认更新？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var that = this;
                this.$axios.request({
                    url: '/receipt',
                    method: 'Get',
                    responseType: 'json'
                }).then(function (res) {
                    console.log(res.data);
                    that.data.push({
                        from: res.data.fromCompany,
                        to: res.data.toCompany,
                        amount: parseInt(res.data.money, 16),
                        status: (res.data.status == 'ok' ? '已认证' : '未认证'),
                        ispaid: (res.data.isPayed == false ? '否' : '是') 
                    })
                    if (res.data.msg == "success") {
                        that.data.from = res.data.fromCompany;
                        that.$message({
                            message: '更新成功',
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
</style>

