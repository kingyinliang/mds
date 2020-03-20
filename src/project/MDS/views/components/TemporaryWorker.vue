<template>
    <el-dialog ref="dayLaborer" width="450px" title="新增临时工" :closeOnClickModal="false" :visible.sync="visible">
        <el-form :model="form" size="small" labelWidth="120px" class="dialogform">
            <el-row>
                <el-button type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="addDayLaborer(dayLaborerArr)">
                    新增
                </el-button>
            </el-row>
            <el-form-item v-for="(item, index) in dayLaborerArr" :key="index" label="临时工姓名：">
                <el-col :span="20">
                    <el-input v-model="dayLaborerArr[index]" />
                </el-col>
                <el-col :span="4">
                    <el-button type="danger" icon="el-icon-delete" circle @click="delDayLaborer(item)" />
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">
                取消
            </el-button>
            <el-button type="primary" @click="updataDayLaborer">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'TemporaryWorker',
    components: {},
    data() {
        return {
            form: {},
            visible: false,
            dayLaborerArr: []
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        init(row) {
            this.visible = true;
            this.dayLaborerArr = [];
            if (typeof row.userId === 'undefined') {
                return;
            }
            row.userId.forEach(item => {
                this.dayLaborerArr.push(item);
            });
        },
        // 临时工确认
        updataDayLaborer() {
            this.visible = false;
            this.$emit('changeUser', this.dayLaborerArr);
        },
        // 临时工添加
        addDayLaborer(row) {
            row.push('');
        },
        // 临时工删除
        delDayLaborer(item) {
            this.dayLaborerArr.splice(this.dayLaborerArr.indexOf(item), 1);
        }
    }
};
</script>

<style scoped></style>
