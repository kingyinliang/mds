<template>
    <div class="header_main">
        <mds-card title="订单列表" :name="'role'" :pack-up="false" style="background: #fff;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model.trim="formHeader.orderNo" size="small" placeholder="订单号" suffix-icon="el-icon-search" style="width: 180px; margin-right: 16px;" />
                    <el-button type="primary" size="small" @click="getDataList(true)">
                        查询
                    </el-button>
                    <el-button type="primary" size="small" @click="visible = true">
                        高级查询
                    </el-button>
                    <el-button type="primary" size="small" @click="sapOrderUpdate()">
                        订单同步
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="dataList" :height="documentClientHeight - 32 - 40 - 75 - 92 - 47" header-row-class-name="tableHead" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50" align="center" fixed />
                <el-table-column prop="orderNo" label="生产订单" width="140" show-overflow-tooltip />
                <el-table-column prop="orderType" label="订单类型" width="80" show-overflow-tooltip />
                <el-table-column prop="factoryCode" label="工厂" width="80" show-overflow-tooltip />
                <el-table-column prop="orderEndDate" label="基本完成日期" width="120" show-overflow-tooltip />
                <el-table-column prop="orderStartDate" label="基本开始日期" width="120" show-overflow-tooltip />
                <el-table-column label="物料" show-overflow-tooltip min-width="340">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode }} {{ scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column prop="planOutput" label="订单数量" width="80" show-overflow-tooltip />
                <el-table-column prop="outputUnit" label="订单单位" width="80" show-overflow-tooltip />
                <el-table-column prop="dispatchMan" label="生产调度员" width="100" show-overflow-tooltip />
                <el-table-column prop="changed" label="同步日期" width="180" show-overflow-tooltip />
            </el-table>
            <el-pagination :current-page="formHeader.current" :page-sizes="[10, 20, 50]" :page-size="formHeader.size" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
        <el-dialog title="高级查询" width="500px" :close-on-click-modal="false" :visible.sync="visible">
            <el-form :model="formHeader" size="small" label-width="110px" class="orderMangedialog">
                <el-form-item label="生产订单：">
                    <el-input v-model.trim="formHeader.orderNo" placeholder="手工录入" clearable style="width: 325px;" />
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-input v-model.trim="formHeader.material" placeholder="手工录入" clearable style="width: 325px;" />
                </el-form-item>
                <el-form-item label="生产调度员：">
                    <el-input v-model.trim="formHeader.dispatchMan" placeholder="手工录入" clearable style="width: 325px;" />
                </el-form-item>
                <el-form-item label="基本开始日期：" class="times">
                    <el-row>
                        <el-col :span="12">
                            <el-date-picker v-model="formHeader.orderStartDateBegin" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" clearable />
                            <span class="marginL10px">-</span>
                        </el-col>
                        <el-col :span="12">
                            <el-date-picker v-model="formHeader.orderStartDateEnd" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" clearable />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="基本完成日期：" class="times">
                    <el-row>
                        <el-col :span="12">
                            <el-date-picker v-model="formHeader.orderEndDateBegin" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" clearable />
                            <span class="marginL10px">-</span>
                        </el-col>
                        <el-col :span="12">
                            <el-date-picker v-model="formHeader.orderEndDateEnd" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 150px;" clearable />
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="getDataList(true)">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';

@Component({})

export default class OrderManage extends Vue {
    formHeader: ValueObject = {
        orderNo: '',
        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        material: '',
        dispatchMan: '',
        orderStartDateBegin: '',
        orderStartDateEnd: '',
        orderEndDateBegin: '',
        orderEndDateEnd: '',
        current: 1,
        size: 10
    };

    totalCount = 0;
    factory = [];
    dataList = [];
    visible = false;

    mounted() {
        this.getDataList()
    }

    get documentClientHeight() {
        return this.$store.state.common.documentClientHeight;
    }

    getDataList(st?) {
        if (st === true) {
            this.formHeader.current = 1;
        }
        COMMON_API.ORDER_QUERY_API(this.formHeader).then(({ data }) => {
            this.visible = false;
            if (data.code === 200) {
                this.dataList = data.data.records;
                this.totalCount = data.data.total;
                if (data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
            }
        });
    }

    sapOrderUpdate() {
        COMMON_API.OREDER_SYNC_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            incremental: true
        }).then(({ data }) => {
            if (data.code === 200) {
                this.$successToast('同步成功');
                this.getDataList(true);
            }
        })
    }

    handleSizeChange(val) {
        this.formHeader.size = val;
        this.getDataList();
    }

    handleCurrentChange(val) {
        this.formHeader.current = val;
        this.getDataList();
    }
}

interface ValueObject {
    orderNo?: string;
    factory?: string;
    material?: string;
    dispatchMan?: string;
    orderStartDateBegin?: string;
    orderStartDateEnd?: string;
    orderEndDateBegin?: string;
    orderEndDateEnd?: string;
    current?: number;
    size?: number;
}
</script>

<style lang="scss">
</style>
