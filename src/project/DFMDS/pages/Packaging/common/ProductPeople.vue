<template>
    <div>
        <mds-card title="人员统计" :name="'productPeople'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="addRow(dataList)">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="dataList" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column prop="status" width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        {{ status? scope.row.status : (scope.row.status === 'noPass' ? '不通过' : scope.row.status === 'checked' ? '通过' : scope.row.status === 'submit' ? '反审' : '') }}
                    </template>
                </el-table-column>
                <el-table-column prop="memo" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班组/工序
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[memo] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_man" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>人员属性
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[verifyMan] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>人员
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>开始时间
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>用餐时间
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>结束时间
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row[verifyDate] }}
                    </template>
                </el-table-column>
                <el-table-column prop="verify_date" label="时长(H)" :show-overflow-tooltip="true">
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
                    标准作业人数：
                </div>
                <div class="input_bottom">
                    123
                </div>
                <div>
                    实际作业人数：
                </div>
                <div class="input_bottom">
                    456
                </div>
            </el-row>
        </mds-card>
        <audit-log :table-data="readAudit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
    name: 'ProductPeople',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    }
    })

export default class ProductPeople extends Vue {

    mdsCardButton= [
        {
            type: 'add',
            returnFunction: 'addRowline'
        }
    ]

    dataList= []
    readAudit= []

    addRow() {
        console.log('新增')
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
