<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="mod-schedule">
                    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(true)">
                        <el-form-item>
                            <el-input v-model="dataForm.beanName" placeholder="bean名称" clearable />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getDataList(true)">
                                查询
                            </el-button>
                            <el-button v-if="isAuth('sys:schedule:save')" type="primary" @click="addOrUpdateHandle()">
                                新增
                            </el-button>
                            <el-button v-if="isAuth('sys:schedule:delete')" type="danger" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">
                                批量删除
                            </el-button>
                            <el-button v-if="isAuth('sys:schedule:pause')" type="danger" :disabled="dataListSelections.length <= 0" @click="pauseHandle()">
                                批量暂停
                            </el-button>
                            <el-button v-if="isAuth('sys:schedule:resume')" type="danger" :disabled="dataListSelections.length <= 0" @click="resumeHandle()">
                                批量恢复
                            </el-button>
                            <el-button v-if="isAuth('sys:schedule:run')" type="danger" :disabled="dataListSelections.length <= 0" @click="runHandle()">
                                批量立即执行
                            </el-button>
                            <el-button v-if="isAuth('sys:schedule:log')" type="success" @click="logHandle()">
                                日志列表
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table headerRowClassName="tableHead" :data="dataList" tooltipEffect="dark" border style="width: 100%;" @selection-change="selectionChangeHandle">
                        <el-table-column type="selection" width="34" />
                        <el-table-column prop="jobId" width="55" label="ID" />
                        <el-table-column prop="beanName" :showOverflowTooltip="true" label="bean名称" />
                        <el-table-column prop="methodName" :showOverflowTooltip="true" label="方法名称" />
                        <el-table-column prop="params" width="80" :showOverflowTooltip="true" label="参数" />
                        <el-table-column prop="cronExpression" width="100" :showOverflowTooltip="true" label="cron表达式" />
                        <el-table-column prop="remark" width="100" :showOverflowTooltip="true" label="备注" />
                        <el-table-column prop="status" width="63" headerAlign="left" align="center" label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status === 0" size="small">
                                    正常
                                </el-tag>
                                <el-tag v-else size="small" type="danger">
                                    暂停
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" :showOverflowTooltip="true" width="232" label="操作">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('sys:schedule:update')" style="padding: 1px 0;" type="text" size="small" @click="addOrUpdateHandle(scope.row.jobId)">
                                    修改
                                </el-button>
                                <el-button v-if="isAuth('sys:schedule:delete')" style="padding: 1px 0;" type="text" size="small" @click="deleteHandle(scope.row.jobId)">
                                    删除
                                </el-button>
                                <el-button v-if="isAuth('sys:schedule:pause')" style="padding: 1px 0;" type="text" size="small" @click="pauseHandle(scope.row.jobId)">
                                    暂停
                                </el-button>
                                <el-button v-if="isAuth('sys:schedule:resume')" style="padding: 1px 0;" type="text" size="small" @click="resumeHandle(scope.row.jobId)">
                                    恢复
                                </el-button>
                                <el-button v-if="isAuth('sys:schedule:run')" style="padding: 1px 0;" type="text" size="small" @click="runHandle(scope.row.jobId)">
                                    立即执行
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination :currentPage="pageIndex" :pageSizes="[10, 20, 50, 100]" :pageSize="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
                    <!-- 弹窗, 新增 / 修改 -->
                    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
                    <!-- 弹窗, 日志列表 -->
                    <log v-if="logVisible" ref="log" />
                </div>
            </el-card>
        </div>
    </el-col>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api';
import AddOrUpdate from './ScheduleAddOrUpdate';
import Log from './ScheduleLog';
export default {
    name: 'Schedule',
    components: {
        AddOrUpdate,
        Log
    },
    data() {
        return {
            dataForm: {
                beanName: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            logVisible: false
        };
    },
    computed: {},
    mounted() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList(st) {
            if (st) {
                this.pageIndex = 1;
            }
            this.dataListLoading = true;
            this.$http(`${SYSTEMSETUP_API.SCHEDULELIST_API}`, 'GET', {
                page: this.pageIndex,
                limit: this.pageSize,
                beanName: this.dataForm.beanName
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
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 删除
        deleteHandle(id) {
            const ids = id
                ? [id]
                : this.dataListSelections.map(item => { return item.jobId; });
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${SYSTEMSETUP_API.SCHEDULEDEL_API}`, 'POST', ids).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$success_SHINHO('操作成功');
                            this.getDataList();
                        } else {
                            this.$error_SHINHO(data.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 暂停
        pauseHandle(id) {
            const ids = id
                ? [id]
                : this.dataListSelections.map(item => { return item.jobId; });
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${SYSTEMSETUP_API.SCHEDULEPAUSE_API}`, 'POST', ids).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$success_SHINHO('操作成功');
                            this.getDataList();
                        } else {
                            this.$error_SHINHO(data.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 恢复
        resumeHandle(id) {
            const ids = id
                ? [id]
                : this.dataListSelections.map(item => { return item.jobId; });
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${SYSTEMSETUP_API.SCHEDULERESUME_API}`, 'POST', ids).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$success_SHINHO('操作成功');
                            this.getDataList();
                        } else {
                            this.$error_SHINHO(data.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 立即执行
        runHandle(id) {
            const ids = id
                ? [id]
                : this.dataListSelections.map(item => { return item.jobId; });
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${SYSTEMSETUP_API.SCHEDULERUN_API}`, 'POST', ids).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$success_SHINHO('操作成功');
                            this.getDataList();
                        } else {
                            this.$error_SHINHO(data.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 日志列表
        logHandle() {
            this.logVisible = true;
            this.$nextTick(() => {
                this.$refs.log.init();
            });
        }
    }
};
</script>

<style scoped></style>
