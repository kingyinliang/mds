<template>
    <el-dialog ref="dayLaborer" width="450px" :title="userTypeName" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="form" size="small" label-width="120px" class="dialogform">
            <el-row>
                <el-button type="primary" size="small" style="float: right; margin-bottom: 10px;" @click="addDayLaborer()">
                    新增
                </el-button>
            </el-row>
            <el-table class="newTable" :data="dayLaborerArr" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column prop="status" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>姓名
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="60" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" circle size="small" @click="delDayLaborer(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 10px;">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button type="primary" size="small" @click="updataDayLaborer">
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
            dayLaborerArr: [],
            userTypeName: ''
        };
    },
    computed: {},
    methods: {
        init(row, userTypeName) {
            this.userTypeName = userTypeName;
            this.visible = true;
            this.dayLaborerArr = [];
            if (typeof row.userList === 'undefined') {
                return;
            }
            row.userList.forEach(item => {
                this.dayLaborerArr.push({
                    name: item
                });
            });
        },
        // 临时工确认
        updataDayLaborer() {
            this.visible = false;
            const arr = this.dayLaborerArr.map(item => item.name)
            this.$emit('changeUser', arr);
        },
        // 临时工添加
        addDayLaborer() {
            this.dayLaborerArr.push({
                name: ''
            });
        },
        // 临时工删除
        delDayLaborer(row) {
            this.dayLaborerArr.splice(this.dayLaborerArr.indexOf(row), 1);
        }
    }
};
</script>

<style scoped></style>
