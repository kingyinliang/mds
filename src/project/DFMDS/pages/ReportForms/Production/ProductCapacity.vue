<!-- 生产线产能利用率 -->
<template>
    <report :form-header="formHeader" :query-form-data="queryFormData" :rules="rules" :columns="columns" class="outputSummary">
        <template> 生产线产能利用率 </template>
    </report>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Report from '../components/report.vue';
const months = [
    {
        name: '一月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '二月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '三月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '四月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '五月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '六月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '七月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '八月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '九月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '十月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '十一月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '十二月份',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    },
    {
        name: '汇总',
        children: [
            { label: '有效产能', prop: 'aaaaaaa' },
            { label: '实际产量', prop: 'aaaaaaa' },
            { label: '实际产量利用率', prop: 'aaaaaaa' }
        ]
    }
];
@Component({
    components: {
        report: Report
    }
})
export default class ProductCapacity extends Vue {
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
            label: '生产线',
            prop: 'workShop'
        },
        {
            label: '生产物料',
            prop: 'workShop'
        },
        {
            label: '单位',
            prop: 'unit'
        },
        ...months.map(item => {
            const cs = item.children.map(row => {
                return {
                    label: row.label,
                    prop: row.prop
                };
            });
            return {
                label: item.name,
                columns: cs
            };
        })
    ];
}
</script>

<style lang="scss" scoped>
</style>
