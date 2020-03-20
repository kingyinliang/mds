<template>
    <el-dialog title="日志列表" :closeOnClickModal="false" :visible.sync="visible" width="75%">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.id" placeholder="任务ID" clearable />
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border height="460" style="width: 100%;">
            <el-table-column prop="logId" headerAlign="left" align="left" width="80" label="日志ID" />
            <el-table-column prop="jobId" headerAlign="left" align="left" width="80" :showOverflowTooltip="true" label="任务ID" />
            <el-table-column prop="beanName" :showOverflowTooltip="true" headerAlign="left" align="left" label="bean名称" />
            <el-table-column prop="methodName" :showOverflowTooltip="true" headerAlign="left" align="left" label="方法名称" />
            <el-table-column prop="params" :showOverflowTooltip="true" headerAlign="left" align="left" label="参数" />
            <el-table-column prop="status" :showOverflowTooltip="true" headerAlign="left" align="left" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" size="small">
                        成功
                    </el-tag>
                    <el-tag v-else size="small" type="danger" style="cursor: pointer;" @click.native="showErrorInfo(scope.row.logId)">
                        失败
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="times" width="150" :showOverflowTooltip="true" headerAlign="left" align="left" label="耗时(单位: 毫秒)" />
            <el-table-column prop="createTime" width="180" :showOverflowTooltip="true" headerAlign="left" align="left" label="执行时间" />
        </el-table>
        <el-pagination :currentPage="pageIndex" :pageSizes="[10, 20, 50, 100]" :pageSize="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
    </el-dialog>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'ScheduleLog',
    components: {},
    data() {
        return {
            visible: false,
            dataForm: {
                id: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false
        };
    },
    computed: {},
    mounted() {
        //    mounted
    },
    methods: {
        init() {
            this.visible = true;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http(`${SYSTEMSETUP_API.LOGLIST_API}`, 'GET', {
                page: this.pageIndex,
                limit: this.pageSize,
                jobId: this.dataForm.id
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.dataList = data.page.list;
                    this.totalPage = data.page.totalCount;
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        // 失败信息
        showErrorInfo(id) {
            this.$http(`${SYSTEMSETUP_API.LOGINFO_API}/${id}`, 'GET').then(({ data }) => {
                if (data && data.code === 0) {
                    this.$alert(data.log.error);
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        }
    }
};
</script>

<style scoped></style>
