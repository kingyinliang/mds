<template>
    <el-col>
        <div class="main">
            <el-card>
                <el-row class="textAlignR">
                    <el-form :inline="true" :model="formHeader" size="small">
                        <el-form-item>
                            <el-input v-model="formHeader.orderNo" placeholder="订单号" suffix-icon="el-icon-search" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" @click="GetDataList(true)">
                                查询
                            </el-button>
                            <el-button type="primary" size="small" @click="visible = true">
                                高级查询
                            </el-button>
                            <el-button type="primary" size="small" @click="SapOrderUpdate('7100')">
                                欣和企业同步
                            </el-button>
                            <el-button type="primary" size="small" @click="SapOrderUpdate('6010')">
                                味达美同步
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row>
                    <el-table :data="dataList" header-row-class-name="tableHead" border tooltip-effect="dark">
                        <el-table-column type="index" label="序号" width="50" />
                        <el-table-column prop="date" label="生产订单" width="180" show-overflow-tooltip />
                        <el-table-column prop="date1" label="订单类型" width="180" show-overflow-tooltip />
                        <el-table-column prop="date2" label="工厂" width="180" show-overflow-tooltip />
                        <el-table-column prop="date3" label="基本完成日期" width="180" show-overflow-tooltip />
                        <el-table-column prop="date3" label="物料" width="180" show-overflow-tooltip />
                        <el-table-column prop="date3" label="订单数量" width="180" show-overflow-tooltip />
                        <el-table-column prop="date3" label="订单单位" width="180" show-overflow-tooltip />
                        <el-table-column prop="date3" label="生产调度员" width="180" show-overflow-tooltip />
                        <el-table-column prop="date3" label="同步日期" width="180" show-overflow-tooltip />
                    </el-table>
                    <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
            <el-dialog title="高级查询" width="500px" :close-on-click-modal="false" :visible.sync="visible">
                <el-form :model="formHeader" size="small" label-width="110px" class="orderMangedialog">
                    <el-form-item label="生产订单：">
                        <el-input v-model="formHeader.orderNo" placeholder="手工录入" style="width: 325px;" />
                    </el-form-item>
                    <el-form-item label="生产物料：">
                        <el-input v-model="formHeader.materialCode" placeholder="手工录入" style="width: 325px;" />
                    </el-form-item>
                    <el-form-item label="生产调度员：">
                        <el-input v-model="formHeader.dispatchMan" placeholder="手工录入" style="width: 325px;" />
                    </el-form-item>
                    <el-form-item label="基本开始日期：" class="times">
                        <el-row>
                            <el-col :span="12">
                                <el-date-picker v-model="formHeader.startDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                                <span class="marginL10px">-</span>
                            </el-col>
                            <el-col :span="12">
                                <el-date-picker v-model="formHeader.startDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="基本完成日期：" class="times">
                        <el-row>
                            <el-col :span="12">
                                <el-date-picker v-model="formHeader.commitDateOne" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                                <span class="marginL10px">-</span>
                            </el-col>
                            <el-col :span="12">
                                <el-date-picker v-model="formHeader.commitDateTwo" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" />
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="visible = false">取消</el-button>
                    <el-button type="primary" size="small" @click="GetDataList(true)">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </el-col>
</template>

<script>
// import { COMMON_API } from 'common/api/api';
export default {
    name: 'OrderManage',
    data() {
        return {
            formHeader: {
                orderNo: '',
                factory: '',
                materialCode: '',
                dispatchMan: '',
                startDateOne: '',
                startDateTwo: '',
                commitDateOne: '',
                commitDateTwo: ''
            },
            factory: [],
            dataList: [],
            visible: false,
            currentPage: 2,
            pageSize: 10,
            totalCount: 20
        };
    },
    methods: {
        GetDataList() {
            console.log('12');
        },
        SapOrderUpdate() {
            console.log('12');
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    }
}
</script>

<style lang="scss">
</style>
