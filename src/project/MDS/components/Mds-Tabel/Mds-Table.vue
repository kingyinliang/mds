<template>
    <el-table :data="tableData" border tooltipEffect="dark" headerRowClassName="tableHead" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
        <el-table-column v-if="showSelectColumn" :selectable="selectableFn" type="selection" width="50px" />
        <el-table-column v-if="showIndexColumn" type="index" :index="indexMethod" label="序号" width="50px" />
        <template v-for="item in column">
            <el-table-column v-if="!item.hide" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :showOverflowTooltip="true">
                <template v-for="chind in item.child">
                    <el-table-column v-if="item.child" :key="chind.prop" :prop="chind.prop" :label="chind.label" :formatter="chind.formatter" />
                </template>
            </el-table-column>
        </template>
        <el-table-column v-if="showOperationColumn" label="操作" fixed="right">
            <template slot-scope="scope">
                <slot :scope="scope" name="operation_column" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'MdsTable',
    components: {},
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {}
};
</script>

<style scoped></style>
