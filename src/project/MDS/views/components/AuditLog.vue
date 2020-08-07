<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-07-16 11:33:16
 * @LastEditors: Telliex
 * @LastEditTime: 2020-08-07 16:50:39
-->
<template>
    <mds-card :title="'审核日志'" :name="name" :icon-bg="'#f05c4a'">
        <el-table class="newTable" max-height="200" :data="tableData" header-row-class-name="tableHead" border style="width: 100%;">
            <el-table-column label="序号" type="index" width="60" fixed align="center" />
            <el-table-column prop="status" label="审核动作" width="180">
                <template slot-scope="scope">
                    {{ scope.row.status === 'noPass' ? '不通过' : scope.row.status === 'checked' ? '通过' : scope.row.status === 'submit' ? '反审' : '' }}
                </template>
            </el-table-column>
            <el-table-column prop="memo" label="审核意见" />
            <el-table-column prop="verify_man" label="审核人" />
            <el-table-column prop="verify_date" label="审核时间" />
        </el-table>
    </mds-card>
</template>

<script>
import { ShowHiddenNameBox } from '@/utils/index';
export default {
    name: 'AuditLog',
    components: {},
    props: {
        tableData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        name: {
            type: String,
            default: 'audit'
        }
    },
    data() {
        return {};
    },
    computed: {},
    mounted() {
        ShowHiddenNameBox(this.$);
    },
    methods: {}
};
</script>

<style lang="scss" scoped></style>
