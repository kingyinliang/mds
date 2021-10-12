<template>
    <div class="header_main">
        <el-card class="box-card">
            <el-form inline :model="formModel" size="small" label-suffix="：">
                <el-form-item label="业务类型" prop="businessType">
                    <el-select v-model="formModel.businessType" clearable>
                        <el-option v-for="item in dropObj.businessTypeList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="失败类型" prop="failType">
                    <el-select v-model="formModel.failType" clearable>
                        <el-option v-for="item in dropObj.failTypeList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="消息类型" prop="msgType">
                    <el-select v-model="formModel.msgType" clearable>
                        <el-option v-for="item in dropObj.msgTypeList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="处理结果" prop="msgType">
                    <el-select v-model="formModel.operationFlag" clearable>
                        <el-option v-for="item in dropObj.operationList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="msgType">
                    <el-input v-model="formModel.remark" size="small" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchHandler()">
                        搜索
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="内容标题" name="message" :pack-up="false" style=" margin-top: 10px; background: #fff;">
            <el-table ref="table1" class="newTable" border header-row-class-name="tableHead" :data="messageList" tooltip-effect="dark" height="400px">
                <el-table-column type="index" label="序号" :index="(index) => index + 1 + (Number(pageOption.current) - 1) * (Number(pageOption.size))" width="55" fixed />
                <!-- 操作类型（消息类型） -->
                <el-table-column label="消息类型" prop="msgType" :show-overflow-tooltip="true" />
                <el-table-column label="业务类型" prop="businessType" :show-overflow-tooltip="true" />
                <el-table-column label="失败类型" prop="failType" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.failType === ''? '正常' : scope.row.failType }}
                    </template>
                </el-table-column>
                <el-table-column label="处理结果" prop="operationFlag" :show-overflow-tooltip="true" />
                <el-table-column label="操作时间" prop="created" :show-overflow-tooltip="true" />
                <el-table-column label="备注" prop="remark" />
                <el-table-column label="操作" width="80px" :show-overflow-tooltip="true">
                    <template v-slot="scope">
                        <el-button type="text" size="small" icon="el-icon-d-arrow-left" @click="detailHandler(scope.row)">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 30, 50]"
                :current-page="pageOption.current"
                :page-size="pageOption.size"
                :total="pageOption.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </mds-card>
        <el-dialog
            :visible.sync="dialogVisible"
            title="详情描述"
            width="600px"
            :close-on-click-modal="false"
        >
            <div class="dialog-body" style="height: 600px; overflow: scroll;">
                <pre>{{ messageData }}</pre>
            </div>
            <template #footer class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="retryHandler()">
                    重试
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { BASIC_API, COMMON_API } from 'common/api/api';

    interface FormModelType {
        factory?: string;
        workShop?: string;
        orderNo?: string;
    }

    interface PageOptionType {
        current: number;
        size: number;
        total: number;
    }

    interface MessageType {
        id?: string;
        msgId?: string;
        workShop?: string;
        type?: string;
    }

    @Component({
        components: {
        }
    })
    export default class Message extends Vue {
        messageStr = ''
        messageData = {}
        dialogVisible = false
        currentRow: MessageType | null = null
        formModel = {
            businessType: '',
            failType: '',
            msgType: '',
            operationFlag: '',
            remark: ''
        }

        messageList: FormModelType[] = []
        dropObj = {
            businessTypeList: [],
            msgTypeList: [],
            failTypeList: [],
            operationList: []
        }

        pageOption: PageOptionType = {
            current: 1,
            size: 10,
            total: 0
        }

        mounted() {
            this.factoryChangeHandler()
        }

        factoryChangeHandler() {
            this.getDrop('MSG_BUSINESS_TYPE', 'businessTypeList')
            this.getDrop('MSG_TYPE', 'msgTypeList')
            this.getDrop('MSG_FAIL_TYPE', 'failTypeList')
            this.getDrop('MSG_OPERATION_FLAG', 'operationList')
        }

        async getDrop(dictType: string, dropObj: string) {
            const res = await COMMON_API.DICTQUERY_API({ dictType: dictType })
            this.dropObj[dropObj] = res.data.data
        }

        async getData() {
            const res = await BASIC_API.MSG_INFO_PAGE_QUERY({ ...this.formModel, ...this.pageOption })
            this.messageList = res.data.data.records
            this.pageOption.total = res.data.data.total
            if (res.data.data.records.length === 0) {
                this.$successToast('暂无数据')
            }
        }

        async getDetail(id: string) {
            const res = await BASIC_API.MSG_INFO_GET_BY_ID({ id })
            this.messageStr = res.data.data.message
            this.messageData = JSON.parse(res.data.data.message)
        }

        searchHandler() {
            this.pageOption.current = 1
            this.getData()
        }

        detailHandler(row: MessageType) {
            this.currentRow = row
            // eslint-disable-next-line
            this.getDetail(row.msgId!)
            this.dialogVisible = true
        }

        async retryHandler() {
            const res = await BASIC_API.MSG_INFO_RETRY({ id: this.currentRow?.msgId })
            if (res.data.code) {
                this.$successToast(res.data.msg)
                this.dialogVisible = false
            }
        }

        handleSizeChange(val: number) {
            this.pageOption.size = val
            this.getData()
        }

        handleCurrentChange(val: number) {
            this.pageOption.current = val
            this.getData()
        }
    }
</script>

<style scoped>

</style>
