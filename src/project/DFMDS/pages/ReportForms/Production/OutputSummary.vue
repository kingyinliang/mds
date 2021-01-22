<!-- 产量汇总数据 -->
<template>
    <report :form-header="formHeader" :table-data="tableData" :query-form-data="queryFormData" :rules="rules" :columns="columns" class="outputSummary" @searchHandler="searchHandler">
        <template>
            <el-table class="newTable" :data="tableData" header-row-class-name="tableHead" border style="width: 100%;" :max-height="height">
                <el-table-column label="序号" type="index" width="60" fixed />
                <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row['memo'] }}
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </report>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Report from '../components/report.vue';

@Component({
    components: {
        report: Report
    }
})
export default class OutputSummary extends Vue {
    formHeader = {};

    queryFormData = [
        {
            label: '',
            type: 'radio',
            prop: 'radioprop',
            propName: 'label',
            propValue: 'value',
            options: [
                {
                    label: '月报',
                    value: '1'
                },
                {
                    label: '季报',
                    value: '2'
                }
            ]
        },
        {
            label: '生产车间',
            type: 'select',
            prop: 'workShop',
            propName: 'label',
            propValue: 'value',
            options: [
                {
                    label: '车间一',
                    value: 'value1'
                }
            ]
        },
        {
            label: '年度',
            type: 'year',
            prop: 'yearprop'
        }
    ];

    rules = {
        yearprop: [{ required: true, message: '请选择年度' }],
        workShop: [{ required: true, message: '请选择车间' }]
    };

    columns = [
        {
            label: '生产车间',
            prop: 'workShop'
        },
        {
            label: '单位',
            prop: 'unit'
        },
        {
            label: '年度',
            prop: 'workShop'
        },
        {
            label: '月季',
            prop: 'workShop'
        },
        {
            label: '有效产能',
            prop: 'workShop'
        },
        {
            label: '实际产能',
            prop: 'workShop'
        },
        {
            label: '产能利用率',
            prop: 'workShop'
        }
    ];

    tableData = [
        { workShop: '车间一', unit: '单位名称' },
        { workShop: '车间一', unit: '单位名称' },
        { workShop: '车间一', unit: '单位名称' }
    ]

    searchHandler() {
        this.tableData.push({ workShop: '车间三', unit: '啊啊啊啊' })
    }
}
</script>

<style lang="scss" scoped>
</style>
