<template>
    <div>
        <mds-card title="待处理数量(单位：KG)" :name="'productPeople'" :mds-card-button="mdsCardButton" @add-button-click="addRow">
            <el-table class="newTable" :data="DataList" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column prop="status" width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        {{ status? scope.row.status : (scope.row.status === 'noPass' ? '不通过' : scope.row.status === 'checked' ? '通过' : scope.row.status === 'submit' ? '反审' : '') }}
                    </template>
                </el-table-column>
                <el-table-column label="线上不良" prop="memo" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[memo] }}
                    </template>
                </el-table-column>
                <el-table-column label="挤料" prop="verify_man" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyMan] }}
                    </template>
                </el-table-column>
                <el-table-column label="测密封堵" prop="verify_date" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column label="废酱" prop="verify_date" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column label="设备残留" prop="verify_date" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column label="其他" prop="verify_date" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" label="备注" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" label="操作人" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" label="操作时间" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" prop="verify_date" label="操作" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="solerow">
                <div>
                    带杀菌酱小计：
                </div>
                <div class="input_bottom">
                    123
                </div>
                <div>
                    报废酱小计：
                </div>
                <div class="input_bottom">
                    456
                </div>
                <div>
                    总计：
                </div>
                <div class="input_bottom">
                    456
                </div>
            </el-row>
        </mds-card>
    </div>
</template>

<script>
export default {
    name: 'PendingNum',
    components: {
    },
    props: {},
    data() {
        return {
            mdsCardButton: [
                {
                    type: 'add',
                    returnFunction: 'addRowline'
                }
            ],
            DataList: [],
            ReadAudit: []
        }
    },
    methods: {
        addRow() {
            console.log('新增')
        }
    }
}
</script>

<style lang="scss" scoped>
.solerow {
    margin-top: 5px;
    line-height: 33px;
    div {
        float: left;
    }
    .input_bottom {
        margin-right: 50px;
    }
}
</style>
