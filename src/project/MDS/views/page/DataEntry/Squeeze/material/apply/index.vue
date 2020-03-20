<template>
    <el-row>
        <el-col>
            <div class="header_main">
                <el-card class="newCard">
                    <el-row type="flex">
                        <el-col>
                            <el-form :model="params" size="small" :inline="true" labelPosition="right" labelWidth="70px" class="sole_row">
                                <el-form-item label="生产工厂：">
                                    <el-select v-model="params.factoryId" style="width: 150px;" @change="changeOptions('factory')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产车间：">
                                    <el-select v-model="params.workshopId" style="width: 150px;" @change="changeOptions('workshop')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in workshopList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="布浆线：">
                                    <el-select v-model="params.productLineId" style="width: 150px;" @change="changeOptions('productline')">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="sole in productlineList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="领用日期：">
                                    <el-date-picker v-model="params.applyDate" type="date" valueFormat="yyyy-MM-dd" style="width: 150px;" />
                                </el-form-item>
                                <el-form-item class="floatr" style="width: 270px; text-align: right;">
                                    <el-button v-if="isAuth('prs:material:list')" type="primary" size="small" @click="getOrderList()">
                                        查询
                                    </el-button>
                                    <el-button v-if="isAuth('prs:material:mySaveOrUpdate') && searched && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="setDisabled(!disabled)">
                                        {{ disabled ? '编辑' : '返回' }}
                                    </el-button>
                                    <el-button v-if="isAuth('prs:material:mySaveOrUpdate') && searched && !disabled && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="save()">
                                        保存
                                    </el-button>
                                    <el-button v-if="isAuth('prs:material:mySaveOrUpdate') && searched && !disabled && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="submit()">
                                        提交
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-card>
                <el-row v-if="searched" style="margin-top: 5px; background-color: #fff;">
                    <el-col :span="24">
                        <el-row type="flex" justify="center" style="margin-top: 20px;">
                            <div v-for="(item, index) in sdList" :key="index" class="pot-box">
                                <div class="pot-box-header">
                                    <span class="pot-box-title" style="margin-left: 5px;">{{ item.deviceName }}</span>
                                    <span class="pot-box-title" style="float: right; margin-right: 5px;">{{ availableMap.get(item.deviceId) === '0' ? '待领用' : availableMap.get(item.deviceId) === '1' ? '领用中' : '不可用' }}</span>
                                </div>
                                <div class="pot-box-container img" />
                                <div class="pot-box-footer">
                                    <div v-if="!disabled && availableMap.get(item.deviceId) === '0' && orderStatus !== 'submit' && orderStatus !== 'checked'" class="pot-box-button" @click="inPotStart(item.deviceId, item.deviceName)">
                                        <span class="pot-box-button-title">入罐开始</span>
                                    </div>
                                    <div v-else class="pot-box-button-disabled">
                                        <span class="pot-box-button-title-disabled">入罐开始</span>
                                    </div>
                                    <div v-if="!disabled && availableMap.get(item.deviceId) === '1' && orderStatus !== 'submit' && orderStatus !== 'checked'" class="pot-box-button" @click="inPotEnd(item.deviceId, item.deviceName)">
                                        <span class="pot-box-button-title">入罐结束</span>
                                    </div>
                                    <div v-else class="pot-box-button-disabled">
                                        <span class="pot-box-button-title-disabled">入罐结束</span>
                                    </div>
                                </div>
                            </div>
                        </el-row>
                        <el-row>
                            <el-table headerRowClassName="tableHead" :data="dataList" border tooltipEffect="dark" :rowClassName="rowDelFlag" @row-dblclick="modifyRecord">
                                <el-table-column type="index" label="序号" width="55" />
                                <el-table-column label="布浆线" :showOverflowTooltip="true">
                                    <template slot-scope="scope" width="120">
                                        {{ scope.row.productLineName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="暂存罐" :showOverflowTooltip="true" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.storagePotName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="发酵罐号" :showOverflowTooltip="true" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.fermentPotName }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="批次" :showOverflowTooltip="true" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.batch }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="发酵剩余量" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.remainAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="起始数">
                                    <template slot-scope="scope">
                                        {{ scope.row.startAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="终止数">
                                    <template slot-scope="scope">
                                        {{ scope.row.endAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="打料数">
                                    <template slot-scope="scope">
                                        {{ scope.row.amount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="暂存剩余量" width="100">
                                    <template slot-scope="scope">
                                        {{ scope.row.storageAmount }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="单位">
                                    <template slot-scope="scope">
                                        {{ scope.row.unit }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注">
                                    <template slot-scope="scope">
                                        {{ scope.row.remark }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作时间" width="160">
                                    <template slot-scope="scope">
                                        {{ scope.row.changed }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作人" width="140">
                                    <template slot-scope="scope">
                                        {{ scope.row.changer }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="70" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!(!disabled && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delRow(scope.row)">
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <el-dialog :closeOnClickModal="false" :visible.sync="dialogFormVisible" width="500px" customClass="dialog__class">
                <div slot="title" class="title">
                    <span>{{ startForm.deviceName }}开始</span>
                </div>
                <div>
                    <el-form ref="startForm" :model="startForm" :labelWidth="formLabelWidth" size="small">
                        <el-form-item label="领用发酵罐：" required>
                            <el-select v-model="startForm.fermentPotNo" valueKey="holderId" placeholder="请选择" filterable style="width: 220px;" @change="changeOptions('fermentPotStart')">
                                <el-option v-for="(item, index) in fermentPotList" :key="index" :label="item.holderName" :value="item.holderId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="批次：" required>
                            <el-input v-model.trim="startForm.batch" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="发酵罐剩余量：">
                            <el-input v-model.number="startForm.remainAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="起始数(方)：" required>
                            <el-input v-model.number="startForm.startAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="暂存量(L)：">
                            <el-input v-model.number="startForm.storageAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="单位：" required>
                            {{ (startForm.unit = 'L') }}
                        </el-form-item>
                        <el-form-item label="对应布浆线：">
                            <label>{{ startForm.productLineName }}</label>
                        </el-form-item>
                        <el-form-item label="操作时间：">
                            <label>{{ startForm.changed }}</label>
                        </el-form-item>
                        <el-form-item label="操作人：">
                            <label>{{ startForm.changer }}</label>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="dialogFormVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" style="background-color: #1890ff; color: #fff; border-color: #1890ff;" @click="saveStart()">
                        保存
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :closeOnClickModal="false" :visible.sync="dialogFormVisible2" width="500px" customClass="dialog__class">
                <div slot="title" class="title">
                    <span>{{ endForm.deviceName }}结束</span>
                </div>
                <div>
                    <el-form ref="endForm" :model="endForm" :labelWidth="formLabelWidth" size="small">
                        <el-form-item label="领用发酵罐：" required>
                            {{ endForm.fermentPotName }}
                        </el-form-item>
                        <el-form-item label="批次：" required>
                            {{ endForm.batch }}
                        </el-form-item>
                        <el-form-item label="发酵罐剩余量：">
                            {{ endForm.remainAmount }}
                        </el-form-item>
                        <el-form-item label="打料结束数(L)：" required>
                            <el-input v-model.number="endForm.endAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="对应布浆线：">
                            <label>{{ endForm.productLineName }}</label>
                        </el-form-item>
                        <el-form-item label="单位：" required>
                            {{ (endForm.unit = 'L') }}
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input v-model.trim="endForm.remark" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="操作时间：">
                            <label>{{ endForm.changed }}</label>
                        </el-form-item>
                        <el-form-item label="操作人：">
                            <label>{{ endForm.changer }}</label>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="dialogFormVisible2 = false">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" style="background-color: #1890ff; color: #fff; border-color: #1890ff;" @click="saveEnd()">
                        保存
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog :closeOnClickModal="false" :visible.sync="dialogFormVisible3" width="500px" customClass="dialog__class">
                <div slot="title" class="title">
                    <span>入罐修改</span>
                </div>
                <div>
                    <el-form ref="modifyForm" :model="modifyForm" :labelWidth="formLabelWidth" size="small">
                        <el-form-item label="领用发酵罐：" required>
                            <el-select v-model="modifyForm.fermentPotNo" valueKey="holderId" placeholder="请选择" filterable style="width: 220px;" @change="changeOptions('fermentPotModify')">
                                <el-option v-for="(item, index) in fermentPotList" :key="index" :label="item.holderName" :value="item.holderId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="批次：" required>
                            <el-input v-model.trim="modifyForm.batch" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="发酵罐剩余量：">
                            <el-input v-model.number="modifyForm.remainAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="起始数(方)：" required>
                            <el-input v-model.number="modifyForm.startAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="打料结束数(L)：" required>
                            <el-input v-model.number="modifyForm.endAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="暂存量(L)：">
                            <el-input v-model.number="modifyForm.storageAmount" type="number" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input v-model.trim="modifyForm.remark" style="width: 220px;" />
                        </el-form-item>
                        <el-form-item label="对应布浆线：">
                            <label>{{ modifyForm.productLineName }}</label>
                        </el-form-item>
                        <el-form-item label="操作时间：">
                            <label>{{ modifyForm.changed }}</label>
                        </el-form-item>
                        <el-form-item label="操作人：">
                            <label>{{ modifyForm.changer }}</label>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="dialogFormVisible3 = false">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" style="background-color: #1890ff; color: #fff; border-color: #1890ff;" @click="saveModify()">
                        保存
                    </el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script lang="ts">
import { BASICDATA_API, SQU_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
    components: {}
})
export default class Index extends Vue {
    // 将common中的参数复制一份到本地
    // NEEDTODO
    /* eslint-disable no-invalid-this */
    params = JSON.parse(JSON.stringify(this.$store.state.common.SqueezeWorkshop));
    factoryList = [];
    workshopList = [];
    productlineList = [];
    dataList: object[] = [];
    // 暂存罐
    sdList = [];
    availableMap = new Map();
    matchedMap = new Map();
    // 发酵罐
    fermentPotList = [];
    searched = false;
    disabled = true;
    dialogFormVisible = false;
    dialogFormVisible2 = false;
    dialogFormVisible3 = false;
    formLabelWidth = '130px';
    startForm = {
        deviceId: '',
        deviceName: '',
        fermentPotNo: '',
        fermentPotName: '',
        orderId: '',
        batch: '',
        unit: 'L',
        remainAmount: 0,
        remainAmountUnit: 'L',
        startAmount: 0,
        storageAmount: 0,
        productLine: '',
        productLineName: '',
        changed: '',
        changer: ''
    };

    endForm = {
        deviceId: '',
        deviceName: '',
        fermentPotNo: '',
        fermentPotName: '',
        orderId: '',
        batch: '',
        unit: 'L',
        remainAmount: 0,
        endAmount: 0,
        productLine: '',
        productLineName: '',
        remark: '',
        changed: '',
        changer: ''
    };

    modifyForm = {
        id: '',
        recordId: '',
        deviceId: '',
        deviceName: '',
        fermentPotNo: '',
        fermentPotName: '',
        orderId: '',
        batch: '',
        remainAmount: 0,
        remainAmountUnit: 'L',
        startAmount: 0,
        storageAmount: 0,
        endAmount: 0,
        remark: '',
        productLine: '',
        productLineName: '',
        changed: '',
        changer: ''
    };

    // dataRule = {
    //   fermentPotNo: [
    //     {required: true, message: '必填', trigger: 'blur'}
    //   ],
    //   batch: [
    //     {required: true, message: '必填', trigger: 'blur'},
    //     {max: 10, message: '长度不能超过10', trigger: 'blur'}
    //   ],
    //   startAmount: [
    //     {required: true, message: '必填', trigger: 'blur'}
    //   ]
    // }
    // dataRule2 = {
    //   fermentPotNo: [
    //     {required: true, message: '必填', trigger: 'blur'}
    //   ],
    //   batch: [
    //     {required: true, message: '必填', trigger: 'blur'},
    //     {max: 10, message: '长度不能超过10', trigger: 'blur'}
    //   ],
    //   endAmount: [
    //     {required: true, message: '必填', trigger: 'blur'}
    //   ]
    // }
    mounted() {
        this.params.applyDate = dateFormat(new Date(), 'yyyy-MM-dd');
        this.getFactory();
        this.getWorkshop(this.params.factoryId);
        this.getProductLine(this.params.workshopId);
        this.getFermentPot(this.params.factoryId);
    }

    isAuth(key) {
        return Vue.prototype.isAuth(key);
    }

    delRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            row.delFlag = '1';
        });
    }

    rowDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
            return '';

    }

    get mainTabs() {
        return this.$store.state.common.mainTabs;
    }

    set mainTabs(val) {
        this.$store.commit('common/updateMainTabs', val);
    }

    get orderStatus() {
        if (this.dataList && this.dataList.length > 0) {
            return this.dataList[0]['status'];
        }
        return '';
    }

    modifyRecord(row) {
        if (this.disabled || row.status === 'submit' || row.status === 'checked') {
            return;
        }
        this.modifyForm = {
            id: row.id ? row.id : 'id',
            recordId: row.recordId ? row.recordId : 'record',
            deviceId: row.storagePotNo,
            deviceName: row.storagePotName,
            fermentPotNo: row.fermentPotNo ? row.fermentPotNo : '',
            fermentPotName: row.fermentPotName ? row.fermentPotName : '',
            orderId: row.orderId ? row.orderId : '',
            batch: row.batch ? row.batch : '',
            remainAmount: row.remainAmount ? row.remainAmount : 0,
            remainAmountUnit: row.remainAmountUnit ? row.remainAmountUnit : 'L',
            startAmount: row.startAmount ? row.startAmount : 0,
            storageAmount: row.storageAmount ? row.storageAmount : 0,
            endAmount: row.endAmount ? row.endAmount : 0,
            remark: row.remark ? row.remark : '',
            productLine: row.productLine,
            productLineName: row.productLineName,
            changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
            changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
        };
        this.dialogFormVisible3 = true;
    }

    saveModify() {
        if (this.modifyValidate()) {
            let record = this.dataList.find(item => item['id'] === this.modifyForm.id);
            if (!record) {
                record = this.dataList.find(item => item['recordId'] === this.modifyForm.recordId);
            }
            if (record) {
                Object.assign(record, {
                    fermentPotNo: this.modifyForm.fermentPotNo,
                    fermentPotName: this.modifyForm.fermentPotName,
                    orderId: this.modifyForm.orderId,
                    batch: this.modifyForm.batch,
                    remainAmount: this.modifyForm.remainAmount,
                    remainAmountUnit: this.modifyForm.remainAmountUnit,
                    startAmount: this.modifyForm.startAmount,
                    storageAmount: this.modifyForm.storageAmount,
                    endAmount: this.modifyForm.endAmount,
                    amount: this.modifyForm.endAmount - this.modifyForm.startAmount,
                    remark: this.modifyForm.remark,
                    changed: this.modifyForm.changed,
                    changer: this.modifyForm.changer
                });
            }
            this.save();
            this.dialogFormVisible3 = false;
        }
    }

    inPotStart(deviceId: string, deviceName: string) {
        this.startForm = {
            deviceId,
            deviceName,
            fermentPotNo: '',
            fermentPotName: '',
            orderId: '',
            batch: '',
            unit: '',
            remainAmount: 0,
            remainAmountUnit: 'L',
            startAmount: 0,
            storageAmount: 0,
            productLine: this.params.productLineId,
            productLineName: this.params.productLineName,
            changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
            changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
        };
        this.dialogFormVisible = true;
    }

    saveStart() {
        if (this.startValidate()) {
            const uuid = Vue.prototype.uuid();
            this.availableMap.set(this.startForm.deviceId, '1');
            this.matchedMap.set(this.startForm.deviceId, uuid);
            const resultData = {
                // "id": "1",
                // "status": "saved",
                acqDate: this.params.applyDate + ' 00:00:00',
                recordId: uuid,
                factory: this.params.factoryId,
                workShop: this.params.workshopId,
                productLine: this.params.productLineId,
                storagePotNo: this.startForm.deviceId,
                fermentPotNo: this.startForm.fermentPotNo,
                // 额外信息
                orderId: this.startForm.orderId,
                unit: this.startForm.unit,
                batch: this.startForm.batch,
                remainAmount: this.startForm.remainAmount,
                // 额外信息
                remainAmountUnit: this.startForm.remainAmountUnit,
                startAmount: this.startForm.startAmount,
                endAmount: null,
                amount: 0,
                storageAmount: this.startForm.storageAmount,
                // operated: null,
                // operator: null,
                remark: null,
                delFlag: 0,
                changed: this.startForm.changed,
                changer: this.startForm.changer,
                productLineName: this.params.productLineName,
                storagePotName: this.startForm.deviceName,
                fermentPotName: this.startForm.fermentPotName
            };
            this.dataList.push(resultData);
            this.dialogFormVisible = false;
        }
    }

    inPotEnd(deviceId: string, deviceName: string) {
        const recordId = this.matchedMap.get(deviceId);
        const startData: any = this.dataList.find(item => item['recordId'] === recordId);// eslint-disable-line
        if (startData) {
            this.endForm = {
                deviceId,
                deviceName,
                fermentPotNo: startData.fermentPotNo,
                fermentPotName: startData.fermentPotName,
                orderId: startData.orderId,
                batch: startData.batch,
                unit: startData.unit,
                remainAmount: startData.remainAmount,
                endAmount: startData.endAmount ? startData.endAmount : 0,
                productLine: startData.productLine,
                productLineName: startData.productLineName,
                remark: startData.remark ? startData.remark : '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
            };
        }
        this.dialogFormVisible2 = true;
    }

    saveEnd() {
        if (this.endForm.endAmount.toString() === '') {
            Vue.prototype.$warningTost('结束数不能为空');
            return false;
        }
        this.availableMap.set(this.endForm.deviceId, '0');
        const recordId = this.matchedMap.get(this.endForm.deviceId);
        const startData: any = this.dataList.find(item => item['recordId'] === recordId);// eslint-disable-line
        // let startData = this.dataList.find(item => item.storagePotNo === this.endForm.deviceId)
        if (startData) {
            Object.assign(startData, {
                endAmount: this.endForm.endAmount,
                amount: this.endForm.endAmount - startData.startAmount,
                remark: this.endForm.remark,
                changed: this.endForm.changed,
                changer: this.endForm.changer
            });
        }
        this.save();
        this.dialogFormVisible2 = false;
    }

    startValidate() {
        if (this.startForm.fermentPotNo === '') {
            Vue.prototype.$warningTost('领用发酵罐不能为空');
            return false;
        } else if (this.startForm.batch.length !== 10) {
            Vue.prototype.$warningTost('批次长度必须为10');
            return false;
        } else if (this.startForm.startAmount.toString() === '') {
            Vue.prototype.$warningTost('起始数不能为空');
            return false;
        }
        return true;
    }

    modifyValidate() {
        if (this.modifyForm.fermentPotNo === '') {
            Vue.prototype.$warningTost('领用发酵罐不能为空');
            return false;
        } else if (this.modifyForm.batch.length !== 10) {
            Vue.prototype.$warningTost('批次长度必须为10');
            return false;
        } else if (this.modifyForm.startAmount.toString() === '') {
            Vue.prototype.$warningTost('起始数不能为空');
            return false;
        } else if (this.modifyForm.endAmount.toString() === '') {
            Vue.prototype.$warningTost('结束数不能为空');
            return false;
        }
        return true;
    }

    changeOptions(flag: string) {
        if (flag === 'factory') {
            const item: any = this.factoryList.find((ele: any) => ele.deptId === this.params.factoryId);// eslint-disable-line
            this.params.factoryName = item ? item.deptName : '';
        } else if (flag === 'workshop') {
            const item: any = this.workshopList.find((ele: any) => ele.deptId === this.params.workshopId);// eslint-disable-line
            this.params.workshopName = item ? item.deptName : '';
        } else if (flag === 'productline') {
            const item: any = this.productlineList.find((ele: any) => ele.deptId === this.params.productLineId);// eslint-disable-line
            this.params.productLineName = item ? item.deptName : '';
        } else if (flag === 'fermentPotStart') {
            const item: any = this.fermentPotList.find((ele: any) => ele.holderId === this.startForm.fermentPotNo);// eslint-disable-line
            this.startForm.fermentPotName = item ? item.holderName : '';
            this.startForm.orderId = item ? item.orderId : '';
        } else if (flag === 'fermentPotModify') {
            const item: any = this.fermentPotList.find((ele: any) => ele.holderId === this.modifyForm.fermentPotNo);// eslint-disable-line
            this.modifyForm.fermentPotName = item ? item.holderName : '';
            this.modifyForm.orderId = item ? item.orderId : '';
            this.modifyForm.remainAmount = 0;
            this.modifyForm.remainAmountUnit = 'L';
            this.modifyForm.batch = '';
            this.getRemanAmountModify(this.params.workshopId, this.modifyForm.fermentPotNo, this.modifyForm.orderId);
        }
    }

    // 获取工厂
    getFactory() {
        this.factoryList = [];
        Vue.prototype.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.factoryList = res.data.typeList;
                if (!this.params.factoryId && res.data.typeList.length > 0) {
                    this.params.factoryId = res.data.typeList[0].deptId;
                    this.params.factoryName = res.data.typeList[0].deptName;
                }
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    // 根据工厂获车间
    getWorkshop(fid: string) {
        this.workshopList = [];
        if (fid) {
            Vue.prototype.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: fid, deptName: '压榨' }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.workshopList = res.data.typeList;
                    if (!this.params.workshopId && res.data.typeList.length > 0) {
                        this.params.workshopId = res.data.typeList[0].deptId;
                        this.params.workshopName = res.data.typeList[0].deptName;
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        }
    }

    // 产线
    getProductLine(wid: string) {
        this.productlineList = [];
        if (wid) {
            Vue.prototype.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: wid, deptType: 'proLine' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.productlineList = data.childList;
                    if (!this.params.productLineId && data.childList.length > 0) {
                        this.params.productLineId = data.childList[0].deptId;
                        this.params.productLineName = data.childList[0].deptName;
                    }
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        }
    }

    // 发酵罐
    getFermentPot(fid: string) {
        this.fermentPotList = [];
        if (fid) {
            Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_POT_LIST_API}`, 'POST', { factory: fid }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.fermentPotList = res.data.num;
                    // if (!this.params.factoryId && res.data.num.length > 0) {
                    //   this.params.workshopId = res.data.num[0].holderId
                    // }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.msg
                    });
                }
            });
        }
    }

    getRemanAmountStart(wId: string, fId: string, orderId: string) {
        Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_REMAIN_AMOUNT_API}`, 'POST', { workShop: wId, potNo: fId, orderId }, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.startForm.remainAmount = res.data.psp && res.data.psp.remainAmount ? res.data.psp.remainAmount : 0;
                this.startForm.remainAmountUnit = res.data.psp && res.data.psp.remainAmountUnit ? res.data.psp.remainAmountUnit : 'L';
                this.startForm.batch = res.data.psp && res.data.psp.batch ? res.data.psp.batch : '';
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    getRemanAmountModify(wId: string, fId: string, orderId: string) {
        Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_REMAIN_AMOUNT_API}`, 'POST', { workShop: wId, potNo: fId, orderId }, false, false, false).then(res => {
            if (res.data.code === 0) {
                this.modifyForm.remainAmount = res.data.psp && res.data.psp.remainAmount ? res.data.psp.remainAmount : 0;
                this.modifyForm.remainAmountUnit = res.data.psp && res.data.psp.remainAmountUnit ? res.data.psp.remainAmountUnit : 'L';
                this.modifyForm.batch = res.data.psp && res.data.psp.batch ? res.data.psp.batch : '';
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    setDisabled(flag: boolean) {
        this.disabled = flag;
    }

    setStore(params) {
        this.$store.commit('common/updateSqueezeWorkshop', params);
    }

    getOrderList() {
        if (this.params.factoryId === '') {
            Vue.prototype.$warningTost('请选择工厂');
            return;
        }
        if (this.params.workshopId === '') {
            Vue.prototype.$warningTost('请选择车间');
            return;
        }
        if (this.params.productLineId === '') {
            Vue.prototype.$warningTost('请选择布浆线');
            return;
        }
        if (this.params.applyDate === null || this.params.applyDate === '') {
            Vue.prototype.$warningTost('请选择领用日期');
            return;
        }
        // 保存选项值到common store
        this.setStore(this.params);
        this.searched = true;
        const params = {
            factory: this.params.factoryId,
            workShop: this.params.workshopId,
            productLine: this.params.productLineId,
            acqDate: this.params.applyDate
        };
        // let params = {
        //   factory: '1',
        //   workShop: '',
        //   productLine: '3ECBE91F774B45F28707697937CBB6E7',
        //   created: ''
        // }
        this.retrieveOrderList(params);
    }

    retrieveOrderList(params) {
        this.dataList = [];
        this.sdList = [];
        this.availableMap.clear();
        this.matchedMap.clear();
        Vue.prototype.$http(`${SQU_API.MATERIAL_APPLY_LIST_API}`, `POST`, params).then(res => {
            if (res.data.code === 0) {
                this.dataList = res.data.list;
                this.sdList = res.data.sdList;
                // let that = this
                this.sdList.forEach(item => this.availableMap.set(item['deviceId'], '0'));
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    save() {
        this.dataList.map((item: any) => {// eslint-disable-line
            if (item.status !== 'submit' && item.status !== 'checked') {
                item.status = 'saved';
            }
        });
        Vue.prototype
            .$http(`${SQU_API.MATERIAL_APPLY_UPDATE_API}`, `POST`, this.dataList)
            .then(res => {
                if (res.data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                    this.getFermentPot(this.params.factoryId);
                    this.getOrderList();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                this.$notify.error({ title: '错误', message: '保存失败' + err });
            });
    }

    submit() {
        this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.dataList.map((item: any) => {// eslint-disable-line
                if (item.status !== 'checked') {
                    item.status = 'submit';
                }
            });
            Vue.prototype
                .$http(`${SQU_API.MATERIAL_APPLY_UPDATE_API}`, `POST`, this.dataList)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.getFermentPot(this.params.factoryId);
                        this.getOrderList();
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg
                        });
                    }
                })
                .catch(err => {
                    this.$notify.error({
                        title: '错误',
                        message: '提交失败' + err
                    });
                });
        });
    }

    @Watch('params', { deep: true })
    onChangeValue() {
        this.searched = false;
        this.disabled = true;
    }

    @Watch('params.factoryId')
    onFactoryValue(newVal: string) {
        this.params.workshopId = '';
        this.params.workshopName = '';
        this.getWorkshop(newVal);
        this.getFermentPot(newVal);
    }

    @Watch('params.workshopId')
    onChangeWorkshop(newVal: string) {
        this.params.productLineId = '';
        this.params.productLineName = '';
        this.getProductLine(newVal);
    }

    @Watch('startForm.fermentPotNo')
    onChangeFerment(newVal: string) {
        this.startForm.remainAmount = 0;
        this.startForm.remainAmountUnit = 'L';
        this.startForm.batch = '';
        this.getRemanAmountStart(this.params.workshopId, newVal, this.startForm.orderId);
    }
    // @Watch('modifyForm.fermentPotNo', {immediate: false})
    // onChangeFerment2 (newVal: string, oldVal: string) {
    //   console.log('--------------------------------------------------')
    //   this.modifyForm.remainAmount = 0
    //   this.modifyForm.remainAmountUnit = 'L'
    //   this.getRemanAmountModify(this.params.workshopId, newVal, this.modifyForm.orderId)
    // }
}
</script>
<style lang="scss">
.dialog__class {
    border-radius: 6px 6px 0 0 !important;
    .el-dialog__header {
        height: 59px;
        background: rgba(24, 144, 255, 1);
        border-radius: 6px 6px 0 0;
        color: #fff;
        font-size: 20px;
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
    .reqI {
        color: red;
    }
}
</style>
<style lang="scss" scoped>
@import "@/assets/scss/_common.scss";
.pot-box {
    width: 217px;
    height: 250px;
    border-radius: 2px;
    border: 1px solid rgba(232, 232, 232, 1);
    margin-right: 50px;
    .pot-box-header {
        height: 40px;
        line-height: 40px;
        background: rgba(235, 235, 235, 1);
        border-radius: 4px 4px 0 0;
        .pot-box-title {
            font-size: 14px;
            font-family: PingFangSC-Medium, sans-serif;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.65);
        }
    }
    .pot-box-container {
        width: 120px;
        height: 120px;
        margin: auto;
        margin-top: 16px;
    }
    .img {
        background: url("~@/assets/img/sq_G1.png");
    }
    .pot-box-footer {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        .pot-box-button {
            width: 72px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.25);
            text-align: center;
            cursor: pointer;
            margin-left: 4px;
            margin-right: 4px;
            &:hover {
                background: rgba(24, 144, 255, 1);
            }
        }
        .pot-box-button-title {
            line-height: 24px;
            font-size: 14px;
            font-family: PingFangSC-Regular, sans-serif;
            font-weight: 400;
            color: #000;
            &:hover {
                color: #fff;
            }
        }
        .pot-box-button-disabled {
            width: 72px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.25);
            text-align: center;
            cursor: pointer;
            margin-left: 4px;
            margin-right: 4px;
            color: rgba(0, 0, 0, 0.6);
            background: #f7f9fa;
            &:hover {
                cursor: not-allowed;
            }
        }
        .pot-box-button-title-disabled {
            line-height: 24px;
            font-size: 14px;
            font-family: PingFangSC-Regular, sans-serif;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.6);
        }
    }
}
.rowButton {
    button {
        margin: 0 3px !important;
    }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
</style>
