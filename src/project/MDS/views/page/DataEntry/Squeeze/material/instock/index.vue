<template>
    <div>
        <div class="header_main">
            <el-card class="newCard">
                <el-row type="flex">
                    <el-col>
                        <el-form :model="params" size="small" :inline="true" label-position="right" label-width="70px" class="sole_row">
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
                            <el-form-item label="入罐日期：">
                                <el-date-picker v-model="params.applyDate" type="date" value-format="yyyy-MM-dd" style="width: 150px;" />
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button v-if="isAuth('prs:inStorage:list')" type="primary" size="small" @click="getOrderList()">
                                    查询
                                </el-button>
                                <!-- <el-button v-if="(isAuth('prs:inStorage:mySaveOrUpdate') || isAuth('prs:inStorage:submitToOrde')) && searched && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="setDisabled(!disabled)">
                                    {{
                                        disabled ? '编辑' : '返回'
                                    }}
                                </el-button>
                                <el-button v-if="isAuth('prs:inStorage:mySaveOrUpdate') && searched && !disabled && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="doSaveAction()">
                                    保存
                                </el-button>
                                <el-button v-if="isAuth('prs:inStorage:submitToOrder') && searched && !disabled && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="doSubmitAction()">
                                    提交
                                </el-button> -->
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-card>
            <el-row v-if="searched" style="margin-top: 10px; padding-bottom: 10px; background-color: #fff;">
                <mds-card title="物料管理入库" :pack-up="false" name="materialInstock">
                    <el-row :gutter="10" class="potColorBlock">
                        <el-col :span="8" class="potColorBlock_item">
                            <div class="potColorBlock_sole bgColor">
                                <div class="potColorBlock_sole_title">
                                    原汁罐
                                    <span>{{ isAvailable === '0' ? '待入库' : '入库中' }}</span>
                                </div>
                                <div class="potColorBlock_sole_content">
                                    <div class="sole_pic">
                                        <img src="@/assets/img/potColorBlock.png">
                                    </div>
                                    <div class="sole_button">
                                        <el-button type="primary" size="small" :disabled="!(!disabled && isAvailable === '0' && orderStatus !== 'submit' && orderStatus !== 'checked')" @click="inPotStart()">
                                            入罐开始
                                        </el-button>
                                        <el-button type="primary" size="small" :disabled="!(!disabled && isAvailable === '1' && orderStatus !== 'submit' && orderStatus !== 'checked')" @click="inPotEnd()">
                                            入罐结束
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-table ref="table" header-row-class-name="tableHead" class="newTable" :row-class-name="rowDelFlag" :data="dataList" border tooltip-effect="dark" @row-dblclick="modifyRecord">
                        <el-table-column label="状态" width="95">
                            <template slot-scope="scope">
                                <span
                                    :style="{
                                        color: scope.row.status === 'noPass' ? 'red' : scope.row.status === 'checked' ? '#67C23A' : '',
                                    }"
                                >{{ scope.row.status === 'noPass' ? '审核不通过' : scope.row.status === 'saved' ? '已保存' : scope.row.status === 'submit' ? '已提交' : scope.row.status === 'checked' ? '通过' : scope.row.status === '已同步' ? '未录入' : '未录入' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="日期" width="100">
                            <template slot-scope="scope">
                                {{ scope.row.inDate }}
                            </template>
                        </el-table-column>
                        <el-table-column label="原汁罐号" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                {{ scope.row.potName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="物料" :show-overflow-tooltip="true" width="120">
                            <template slot-scope="scope">
                                {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column label="原汁批次" width="120">
                            <template slot-scope="scope">
                                {{ scope.row.batch }}
                            </template>
                        </el-table-column>
                        <el-table-column label="起始数">
                            <template slot-scope="scope">
                                {{ scope.row.startAmount }}
                            </template>
                        </el-table-column>
                        <el-table-column label="结束数">
                            <template slot-scope="scope">
                                {{ scope.row.endAmount }}
                            </template>
                        </el-table-column>
                        <el-table-column label="入罐数量">
                            <template slot-scope="scope">
                                {{ scope.row.inAmount }}
                            </template>
                        </el-table-column>
                        <el-table-column label="满罐数量">
                            <template slot-scope="scope">
                                {{ scope.row.fullPotAmount }}
                            </template>
                        </el-table-column>
                        <el-table-column label="单位">
                            <template slot-scope="scope">
                                {{ scope.row.unit }}
                            </template>
                        </el-table-column>
                        <el-table-column label="混合罐类型" width="120">
                            <template slot-scope="scope">
                                {{ scope.row.mixType }}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否满罐">
                            <template slot-scope="scope">
                                {{ scope.row.fullPot === '1' ? '是' : '否' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="满罐日期" width="100">
                            <template slot-scope="scope">
                                {{ scope.row.fulPotDate }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人" width="140">
                            <template slot-scope="scope">
                                {{ scope.row.changer }}
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.remark }}
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
                </mds-card>
                <!-- <el-col :span="5" style="">
                    <el-row type="flex" justify="center" style="margin-top: 20px;">
                        <div class="pot-box">
                            <div class="pot-box-header">
                                <span class="pot-box-title" style="margin-left: 5px;">原汁罐</span>
                                <span class="pot-box-title" style="float: right; margin-right: 5px;"></span>
                            </div>
                            <div class="pot-box-container img" />
                            <div class="pot-box-footer">
                                <div v-if="!disabled && isAvailable === '0' && orderStatus !== 'submit' && orderStatus !== 'checked'" class="pot-box-button" @click="inPotStart()">
                                    <span class="pot-box-button-title">入罐开始</span>
                                </div>
                                <div v-else class="pot-box-button-disabled">
                                    <span class="pot-box-button-title-disabled">入罐开始</span>
                                </div>
                                <div v-if="!disabled && isAvailable === '1' && orderStatus !== 'submit' && orderStatus !== 'checked'" class="pot-box-button" @click="inPotEnd()">
                                    <span class="pot-box-button-title">入罐结束</span>
                                </div>
                                <div v-else class="pot-box-button-disabled">
                                    <span class="pot-box-button-title-disabled">入罐结束</span>
                                </div>
                            </div>
                        </div>
                    </el-row>
                </el-col> -->
            </el-row>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="500px" custom-class="dialog__class">
            <div slot="title" class="title">
                <span>入罐开始</span>
            </div>
            <div>
                <el-form ref="startForm" :model="startForm" :label-width="formLabelWidth" size="small">
                    <el-form-item label="原汁罐号：" required>
                        <el-select v-model="startForm.potNo" value-key="holderId" placeholder="请选择" filterable style="width: 220px;" @change="changeOptions('pot')">
                            <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物料：" required>
                        <el-select v-model="startForm.materialCode" :disabled="startForm.materialSt" filterable placeholder="请选择" size="small" style="width: 220px;" @change="setmaterial(startForm)">
                            <el-option v-for="item in SerchSapList" :key="item.code" :label="item.code + ' ' + item.value" :value="item.code" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="混合罐类型：" required>
                        <el-select v-model="startForm.mixType" placeholder="请选择" :disabled="startForm.mixTypeSt" filterable style="width: 220px;">
                            <el-option label="正常" value="正常" />
                            <el-option label="单用混合" value="单用混合" />
                            <el-option label="共用混合" value="共用混合" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次：" required>
                        <el-input v-model.trim="startForm.batch" maxlength="10" style="width: 220px;" :disabled="startForm.batchSt" />
                    </el-form-item>
                    <el-form-item label="起始数：" required>
                        <el-input v-model.number="startForm.startAmount" type="number" style="width: 220px;" />
                    </el-form-item>
                    <el-form-item label="单位：" required>
                        {{ (startForm.unit = 'L') }}
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
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="saveStart()">
                    保存
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible2" width="500px" custom-class="dialog__class">
            <div slot="title" class="title">
                <span>入罐结束</span>
            </div>
            <div>
                <el-form ref="endForm" :model="endForm" :label-width="formLabelWidth" size="small">
                    <el-form-item label="原汁罐号：" required>
                        {{ endForm.potName }}
                    </el-form-item>
                    <el-form-item label="批次：" required>
                        {{ endForm.batch }}
                    </el-form-item>
                    <el-form-item label="结束数：" required>
                        <el-input v-model.number="endForm.endAmount" type="number" style="width: 220px;" @change="abc" />
                    </el-form-item>
                    <el-form-item label="单位：" required>
                        {{ (endForm.unit = 'L') }}
                    </el-form-item>
                    <el-form-item label="是否满罐：">
                        <el-select v-model="endForm.fullPot" placeholder="请选择" filterable style="width: 220px;" @change="setfullPotAmount('endForm')">
                            <el-option label="是" value="1" />
                            <el-option label="否" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="满罐数量：">
                        <el-input v-model.number="endForm.fullPotAmount" type="number" disabled style="width: 220px;" />
                    </el-form-item>
                    <el-form-item label="满罐日期：">
                        <el-date-picker v-model="endForm.fulPotDate" type="date" value-format="yyyy-MM-dd" style="width: 220px;" />
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
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="saveEnd()">
                    保存
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible3" width="500px" custom-class="dialog__class">
            <div slot="title" class="title">
                <span>入罐修改</span>
            </div>
            <div>
                <el-form ref="modifyForm" :model="modifyForm" :label-width="formLabelWidth" size="small">
                    <el-form-item label="原汁罐号：" required>
                        <el-select v-model="modifyForm.potNo" value-key="holderId" placeholder="请选择" filterable style="width: 220px;" @change="changeOptions('potModify')">
                            <el-option v-for="(item, index) in potList" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物料：" required>
                        <el-select v-model="modifyForm.materialCode" :disabled="modifyForm.materialSt" filterable placeholder="请选择" size="small" style="width: 220px;" @change="setmaterial(modifyForm)">
                            <el-option v-for="item in SerchSapList" :key="item.code" :label="item.code + ' ' + item.value" :value="item.code" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="混合罐类型：" required>
                        <el-select v-model="modifyForm.mixType" placeholder="请选择" :disabled="modifyForm.mixTypeSt" filterable style="width: 220px;">
                            <el-option label="正常" value="正常" />
                            <el-option label="单用混合" value="单用混合" />
                            <el-option label="共用混合" value="共用混合" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次：" required>
                        <el-input v-model.trim="modifyForm.batch" style="width: 220px;" maxlength="10" :disabled="modifyForm.batchSt" />
                    </el-form-item>
                    <el-form-item label="起始数：" required>
                        <el-input v-model.number="modifyForm.startAmount" type="number" style="width: 220px;" />
                    </el-form-item>
                    <el-form-item label="结束数：" required>
                        <el-input v-model.number="modifyForm.endAmount" type="number" style="width: 220px;" />
                    </el-form-item>
                    <el-form-item label="是否满罐：">
                        <el-select v-model="modifyForm.fullPot" placeholder="请选择" filterable style="width: 220px;" @change="setfullPotAmount('modifyForm')">
                            <el-option label="是" value="1" />
                            <el-option label="否" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="满罐数量：">
                        <el-input v-model.number="modifyForm.fullPotAmount" type="number" style="width: 220px;" />
                    </el-form-item>
                    <el-form-item label="满罐日期：">
                        <el-date-picker v-model="modifyForm.fulPotDate" type="date" value-format="yyyy-MM-dd" style="width: 220px;" />
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model.trim="modifyForm.remark" style="width: 220px;" />
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
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="saveModify()">
                    保存
                </el-button>
            </div>
        </el-dialog>
        <redact-box v-if="searched">
            <template slot="button">
                <el-button v-if="(isAuth('prs:inStorage:mySaveOrUpdate') || isAuth('prs:inStorage:submitToOrde')) && searched && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="setDisabled(!disabled)">
                    {{
                        disabled ? '编辑' : '取消'
                    }}
                </el-button>
                <el-button v-if="isAuth('prs:inStorage:mySaveOrUpdate') && searched && !disabled && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="doSaveAction()">
                    保存
                </el-button>
                <el-button v-if="isAuth('prs:inStorage:submitToOrder') && searched && !disabled && orderStatus !== 'submit' && orderStatus !== 'checked'" type="primary" size="small" @click="doSubmitAction()">
                    提交
                </el-button>
            </template>
        </redact-box>
    </div>
</template>

<script lang="ts">
import { BASICDATA_API, SQU_API, SYSTEMSETUP_API } from '@/api/api';
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
    SerchSapList = [];
    dataList: object[] = [];
    potList: object[] = [];
    isAvailable = '0';
    searched = false;
    disabled = true;
    dialogFormVisible = false;
    dialogFormVisible2 = false;
    dialogFormVisible3 = false;
    formLabelWidth = '130px';
    teststr = '';
    ci = 0;
    startForm = {
        inDate: '',
        potNo: '',
        potName: '',
        materialCode: '',
        materialName: '',
        materialSt: false,
        mixTypeSt: false,
        batch: '',
        batchSt: false,
        unit: 'L',
        startAmount: 0,
        mixType: '',
        changed: '',
        changer: '',
        uuid: '',
        holderStatus: ''
    };

    endForm = {
        potNo: '',
        potName: '',
        batch: '',
        unit: 'L',
        endAmount: 0,
        fullPot: '',
        fullPotAmount: 0,
        fulPotDate: '',
        remark: '',
        changed: '',
        changer: ''
    };

    modifyForm = {
        id: '',
        recordId: '',
        inDate: '',
        potNo: '',
        potName: '',
        materialCode: '',
        materialName: '',
        materialSt: false,
        mixTypeSt: false,
        batch: '',
        batchSt: false,
        startAmount: 0,
        endAmount: 0,
        mixType: '',
        fullPot: '',
        fullPotAmount: 0,
        fulPotDate: '',
        remark: '',
        changed: '',
        changer: '',
        uuid: '',
        holderStatus: ''
    };

    mounted() {
        this.params.applyDate = dateFormat(new Date(), 'yyyy-MM-dd');
        this.getFactory();
        this.getWorkshop(this.params.factoryId);
        // this.getProductLine(this.params.workshopId)
        // this.getPot(this.params);
        this.getMaterial(this.params.factoryId);
    }

    delRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            row.delFlag = '1';
        }).catch(() => {
            // this.$infoToast('已取消删除');
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
        let status = '';
        let no = 0;
        let sub = 0;
        let che = 0;
        let sav = 0;
        this.dataList.forEach((item: any) => {// eslint-disable-line
            if (item.status === 'noPass') {
                no = no + 1;
            } else if (item.status === 'saved') {
                sav = sav + 1;
            } else if (item.status === 'submit') {
                sub = sub + 1;
            } else if (item.status === 'checked') {
                che = che + 1;
            }
        });
        if (no > 0) {
            // 有一条数据不通过，则总状态为不通过
            status = 'noPass';
        } else if (sav > 0) {
            status = 'saved';
        } else if (sub > 0) {
            status = 'submit';
        } else if (che > 0) {
            status = 'checked';
        }
        return status;
    }

    modifyRecord(row) {
        this.ci = 0;
        if (this.disabled || row.status === 'submit' || row.status === 'checked') {
            return;
        }
        this.teststr = row.potNo;
        if (typeof this.potList.find((item: object) => item['holderId'] === row.potNo) === 'undefined') {
            this.potList.push({
                holderId: row.potNo,
                holderName: row.potName,
                batch: row.batch,
                potType: row.mixType,
                materialCode: row.materialCode,
                materialName: row.materialName
            });
        }
        this.modifyForm = {
            id: row.id ? row.id : 'id',
            recordId: row.recordId ? row.recordId : 'record',
            inDate: row.inDate ? row.inDate : dateFormat(new Date(), 'yyyy-MM-dd'),
            potNo: row.potNo ? row.potNo : '',
            potName: row.potName ? row.potName : '',
            materialCode: row.materialCode ? row.materialCode : '',
            materialName: row.materialName ? row.materialName : '',
            materialSt: false,
            mixTypeSt: false,
            batch: row.batch ? row.batch : '',
            batchSt: false,
            startAmount: row.startAmount ? row.startAmount : 0,
            endAmount: row.endAmount ? row.endAmount : 0,
            mixType: row.mixType ? row.mixType : '正常',
            fullPot: row.fullPot ? row.fullPot : '0',
            fullPotAmount: row.fullPotAmount ? row.fullPotAmount : 0,
            // fulPotDate: row.fulPotDate ? row.fulPotDate : dateFormat(new Date(), 'yyyy-MM-dd'),
            fulPotDate: row.fulPotDate ? row.fulPotDate : '',
            remark: row.remark ? row.remark : '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
            changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
            uuid: row.uuid,
            holderStatus: row.holderStatus
        };
        this.dialogFormVisible3 = true;
        if (row.holderStatus !== '6') {
            this.changeOptions('potModify');
        }
    }

    saveModify() {
        if (this.modifyValidate()) {
            let matchedIndex = -1;
            this.dataList.forEach((item, index) => {
                if (item['id'] === this.modifyForm.id) {
                    matchedIndex = index;
                }
            });
            if (matchedIndex < 0) {
                // 新增
                this.dataList.forEach((item: any, index) => {// eslint-disable-line
                    if (item.recordId === this.modifyForm.recordId) {
                        matchedIndex = index;
                    }
                });
            }
            if (matchedIndex >= 0) {
                const record = this.dataList[matchedIndex];
                // eslint-disable-next-line
                const potSole: any = this.potList.find(ele => ele['holderId'] === this.modifyForm.potNo);
                Object.assign(record, {
                    batch: this.modifyForm.batch,
                    materialCode: this.modifyForm.materialCode,
                    materialName: this.modifyForm.materialName,
                    inDate: this.modifyForm.inDate,
                    potNo: this.modifyForm.potNo,
                    potName: JSON.parse(JSON.stringify(this.modifyForm.potName)),
                    startAmount: this.modifyForm.startAmount,
                    mixType: this.modifyForm.mixType,
                    endAmount: this.modifyForm.endAmount,
                    inAmount: this.modifyForm.endAmount - this.modifyForm.startAmount,
                    remark: this.modifyForm.remark,
                    fullPot: this.modifyForm.fullPot,
                    fullPotAmount: this.modifyForm.fullPotAmount,
                    fulPotDate: this.modifyForm.fulPotDate,
                    changed: this.modifyForm.changed,
                    changer: this.modifyForm.changer,
                    uuid: this.modifyForm.uuid,
                    holderStatus: potSole['holderStatus']
                });
                this.dataList.splice(matchedIndex, 1, record);
            }
            if (this.dataList.findIndex(ite => ite['uuid'] === this.modifyForm.uuid) + 1 === this.dataList.length) {
                this.isAvailable = '0';
            }
            this.dialogFormVisible3 = false;
        }
    }

    inPotStart() {
        this.startForm = {
            inDate: this.params.applyDate,
            potNo: '',
            potName: '',
            materialCode: '',
            materialName: '',
            materialSt: false,
            mixTypeSt: false,
            batch: '',
            batchSt: false,
            unit: '',
            startAmount: 0,
            mixType: '正常',
            changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
            changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
            uuid: '',
            holderStatus: ''
        };
        this.dialogFormVisible = true;
    }

    saveStart() {
        if (this.startValidate()) {
            const recordId = Vue.prototype.uuid();
            const result = {
                recordId,
                factory: this.params.factoryId,
                workShop: this.params.workshopId,
                productLine: this.params.productLineId,
                batch: this.startForm.batch,
                materialCode: this.startForm.materialCode,
                materialName: this.startForm.materialName,
                unit: this.startForm.unit,
                inDate: this.startForm.inDate,
                potNo: this.startForm.potNo,
                potName: this.startForm.potName,
                startAmount: this.startForm.startAmount,
                mixType: this.startForm.mixType,
                changed: this.startForm.changed,
                changer: this.startForm.changer,
                delFlag: 0,
                uuid: Vue.prototype.uuid(),
                holderStatus: this.startForm.holderStatus
            };
            this.dataList.push(result);
            this.dialogFormVisible = false;
            this.isAvailable = '1';
        }
    }

    inPotEnd() {
        const startData: any = this.dataList.find((item, index) => index === this.dataList.length - 1);// eslint-disable-line
        this.endForm = {
            potNo: startData.potNo,
            potName: startData.potName,
            batch: startData.batch,
            unit: startData.unit,
            endAmount: startData.endAmount ? startData.endAmount : 0,
            fullPot: startData.fullPot ? startData.fullPot : '0',
            fullPotAmount: startData.fullPotAmount ? startData.fullPotAmount : 0,
            fulPotDate: '',
            // fulPotDate: startData.fulPotDate ? startData.fulPotDate : dateFormat(new Date(), 'yyyy-MM-dd'),
            remark: startData.remark ? startData.remark : '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd h:m:s'),
            changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
        };
        this.dialogFormVisible2 = true;
    }

    saveEnd() {
        if (this.endValidate()) {
            this.isAvailable = '0';
            const startData = this.dataList.pop();
            if (startData) {
                Object.assign(startData, {
                    endAmount: this.endForm.endAmount,
                    inAmount: this.endForm.endAmount - (startData ? startData['startAmount'] : 0),
                    remark: this.endForm.remark,
                    fullPot: this.endForm.fullPot,
                    fullunitPot: this.endForm.unit,
                    fullPotAmount: this.endForm.fullPotAmount,
                    fulPotDate: this.endForm.fulPotDate,
                    changed: this.endForm.changed,
                    changer: this.endForm.changer
                });
                this.dataList.push(startData);
            }
            this.dialogFormVisible2 = false;
        }
    }

    setmaterial(it) {
        const item = this.SerchSapList.find(ele => ele['code'] === it.materialCode);
        it.materialName = item ? item['value'] : '';
    }

    startValidate() {
        if (this.startForm.potNo === '') {
            Vue.prototype.$warningToast('原汁罐号不能为空');
            return false;
        } else if (this.startForm.materialCode === '') {
            Vue.prototype.$warningToast('物料不能为空');
            return false;
        } else if (this.startForm.batch.length !== 10) {
            Vue.prototype.$warningToast('批次长度必须为10');
            return false;
        } else if (this.startForm.startAmount.toString() === '') {
            Vue.prototype.$warningToast('起始数不能为空');
            return false;
        }
        return true;
    }

    endValidate() {
        if (this.endForm.endAmount.toString() === '') {
            Vue.prototype.$warningToast('结束数不能为空');
            return false;
        } else if (this.endForm.fullPot === '1' && (this.endForm.fullPotAmount.toString() === '' || this.endForm.fullPotAmount.toString() === '0')) {
            Vue.prototype.$warningToast('满罐数量不能为空');
            return false;
        } else if (this.endForm.fullPot === '1' && this.endForm.fulPotDate === '') {
            Vue.prototype.$warningToast('满罐日期不能为空');
            return false;
        }
        return true;
    }

    modifyValidate() {
        if (this.modifyForm.potNo === '') {
            Vue.prototype.$warningToast('原汁罐号不能为空');
            return false;
        } else if (this.modifyForm.batch.length !== 10) {
            Vue.prototype.$warningToast('批次长度必须为10');
            return false;
        } else if (this.modifyForm.materialCode === '') {
            Vue.prototype.$warningToast('物料不能为空');
            return false;
        } else if (this.modifyForm.startAmount.toString() === '') {
            Vue.prototype.$warningToast('起始数不能为空');
            return false;
        } else if (this.modifyForm.endAmount.toString() === '') {
            Vue.prototype.$warningToast('结束数不能为空');
            return false;
        } else if (this.modifyForm.fullPot === '1' && this.modifyForm.fullPotAmount.toString() === '') {
            Vue.prototype.$warningToast('满罐数量不能为空');
            return false;
        } else if (this.modifyForm.fullPot === '1' && this.modifyForm.fulPotDate === '') {
            Vue.prototype.$warningToast('满罐日期不能为空');
            return false;
        }
        return true;
    }

    changeOptions(flag: string) {
        if (flag === 'factory') {
            const item = this.factoryList.find(ele => ele['deptId'] === this.params.factoryId);
            this.params.factoryName = item ? item['deptName'] : '';
        } else if (flag === 'workshop') {
            const item = this.workshopList.find(ele => ele['deptId'] === this.params.workshopId);
            this.params.workshopName = item ? item['deptName'] : '';
        } else if (flag === 'productline') {
            const item = this.productlineList.find(ele => ele['deptId'] === this.params.productLineId);
            this.params.productLineName = item ? item['deptName'] : '';
        } else if (flag === 'pot') {
            const item: any = this.potList.find(ele => ele['holderId'] === this.startForm.potNo);// eslint-disable-line
            this.startForm.potName = item ? item.holderName : '';
            this.startForm.batch = item ? item.batch : '';
            if (item && item.potType) {
                this.startForm.mixType = item.potType;
                this.startForm.mixTypeSt = true;
            } else {
                this.startForm.mixTypeSt = false;
            }
            this.startForm.materialCode = item.materialCode || '';
            this.startForm.materialName = item.materialName || '';
            item.materialCode ? (this.startForm.materialSt = true) : (this.startForm.materialSt = false);
            item.batch ? (this.startForm.batchSt = true) : (this.startForm.batchSt = false);
            (!item.batch || item.holderStatus === '6') ? (this.startForm.batchSt = false) : (this.startForm.materialSt = true);
            this.startForm.holderStatus = item.holderStatus;
            // if (!item.batch) {
            //     this.startForm.batchSt = false;
            // } else {
            //     if (item.holderStatus === '6') {
            //         this.startForm.batchSt = false;
            //     } else {
            //         this.startForm.batchSt = true;
            //     }
            // }
        } else if (flag === 'potModify') {
            this.ci = Number(this.ci) + Number(1);
            const item: any = this.potList.find(ele => ele['holderId'] === this.modifyForm.potNo);// eslint-disable-line
            if (item && item.batch === '') {
                if (this.teststr !== this.modifyForm.potNo) {
                    const fa = this.potList.find(it => it['holderId'] === this.modifyForm.potNo)
                    this.modifyForm.potName = fa ? fa['holderName'] : '';
                    this.modifyForm.batch = item.batch;
                    this.modifyForm.mixType = '正常';
                    this.modifyForm.materialCode = item.materialCode;
                    this.modifyForm.materialName = item.materialName;
                    this.modifyForm.batchSt = false;
                    this.modifyForm.materialSt = false;
                    this.modifyForm.mixTypeSt = false;
                    this.modifyForm.holderStatus = item.holderStatus;
                } else if (this.ci !== 1) {
                    const fa = this.potList.find(it => it['holderId'] === this.modifyForm.potNo)
                    this.modifyForm.potName = fa ? fa['holderName'] : '';
                    this.modifyForm.batch = '';
                    this.modifyForm.mixType = '正常';
                    this.modifyForm.materialCode = item.materialCode;
                    this.modifyForm.materialName = item.materialName;
                    this.modifyForm.batchSt = false;
                    this.modifyForm.materialSt = false;
                    this.modifyForm.mixTypeSt = false;
                    this.modifyForm.holderStatus = item.holderStatus;
                }
            } else {
                this.modifyForm.potName = item ? item.holderName : '';
                this.modifyForm.batch = item ? item.batch : '';
                if (item && item.potType) {
                    this.modifyForm.mixType = item.potType;
                    this.modifyForm.mixTypeSt = true;
                }
                this.modifyForm.materialCode = item ? item.materialCode : '';
                this.modifyForm.materialName = item ? item.materialName : '';
                item.materialCode ? (this.modifyForm.batchSt = true) : (this.modifyForm.batchSt = false);
                if (item.holderStatus === '6') {
                    this.modifyForm.materialSt = false;
                } else {
                    this.modifyForm.materialSt = (Boolean(item['batch']));
                }
            }
        }
    }

    abc() {
        if (this.endForm.fullPot === '1') {
            const startData = this.dataList.find((item, index) => index === this.dataList.length - 1);
            const item = this.potList.find(ele => ele['holderId'] === this.endForm.potNo)
            this.endForm.fullPotAmount = (item ? item['amount'] * 1000 : 0) + (Number(this.endForm.endAmount) - (startData ? startData['startAmount'] : 0));
        }
    }

    setfullPotAmount(str) {
        if (str === 'endForm') {
            if (this.endForm.fullPot === '1') {
                const startData = this.dataList.find((item, index) => index === this.dataList.length - 1);
                const item = this.potList.find(ele => ele['holderId'] === this.endForm.potNo)
                this.endForm.fullPotAmount = (item ? item['amount'] * 1000 : 0) + (Number(this.endForm.endAmount) - (startData ? startData['startAmount'] : 0));
            } else {
                this.endForm.fullPotAmount = 0;
            }
        } else if (str === 'modifyForm') {
            if (this.modifyForm.fullPot === '1') {
                const item = this.potList.find(ele => ele['holderId'] === this.modifyForm.potNo)
                this.modifyForm.fullPotAmount = (item ? item['amount'] * 1000 : 0) + (this.modifyForm.endAmount - this.modifyForm.startAmount);
            } else {
                this.modifyForm.fullPotAmount = 0;
            }
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
                    this.$notify.error({ title: '错误', message: res.data.msg });
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

    // 获取物料下拉
    getMaterial(factory) {
        Vue.prototype.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: factory, type: 'YA_M_MATERIAL' }, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                this.SerchSapList = data.dicList;
            } else {
                this.$notify.error({ title: '错误', message: data.msg });
            }
        });
    }

    // 原汁罐
    getPot(params) {
        this.potList = [];
        if (params.workshopId) {
            Vue.prototype.$http(`${SQU_API.PRE_INSTORAGE_LIST_API}`, 'POST', { factory: params.factoryId, workShop: params.workshopId, created: params.applyDate }, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.potList = res.data.holderList;
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            });
        }
        // let params = {
        //   type: 'holder_type',
        //   holder_type: '013',
        //   pageSize: 9999,
        //   workShopName: wName,
        //   currPage: 1
        // }
        // this.potList = []
        // if (wName) {
        //   Vue.prototype.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params, false, false, false).then(res => {
        //     if (res.data.code === 0) {
        //       this.potList = res.data.page.list
        //     } else {
        //       this.$notify.error({title: '错误', message: res.data.msg})
        //     }
        //   })
        // }
    }

    setDisabled(flag: boolean) {
        this.disabled = flag;
    }

    setStore(params) {
        this.$store.commit('common/updateSqueezeWorkshop', params);
    }

    getOrderList() {
        if (this.params.factoryId === '') {
            this.$warningToast('请选择工厂');
            return;
        }
        if (this.params.workshopId === '') {
            this.$warningToast('请选择车间');
            return;
        }
        // if (this.params.productLineId === '') {
        //   this.$message.error('请选择布浆线')
        //   return
        // }
        if (this.params.applyDate === null || this.params.applyDate === '') {
            this.$warningToast('请选择入罐日期');
            // this.$notify({ title: '错误', message: '请选择入罐日期', type: 'warning' });
            return;
        }
        this.getPot(this.params);
        // 保存选项值到common store
        this.setStore(this.params);
        this.searched = true;
        const params = {
            factory: this.params.factoryId,
            workShop: this.params.workshopId,
            productLine: this.params.productLineId,
            created: this.params.applyDate
        };
        this.retrieveOrderList(params);
    }

    retrieveOrderList(params) {
        Vue.prototype.$http(`${SQU_API.MATERIAL_IN_LIST_API}`, `POST`, params).then(res => {
            if (res.data.code === 0) {
                this.isAvailable = '0';
                this.dataList = res.data.list;
                this.dataList.map((item: object) => {
                    item['uuid'] = item['id'];
                });
            } else {
                this.$notify.error({ title: '错误', message: res.data.msg });
            }
        });
    }

    async save() {
        let result = { code: 0, msg: '' };
        this.dataList.map((item: object) => {
            if (item['status'] !== 'submit' && item['status'] !== 'checked') {
                item['status'] = 'saved';
            }
        });
        await Vue.prototype
            .$http(`${SQU_API.MATERIAL_IN_SAVE_API}`, `POST`, this.dataList)
            .then(res => {
                result = { code: res.data.code, msg: res.data.code === 0 ? '保存成功' : res.data.msg };
            })
            .catch(err => {
                result = { code: 1, msg: '保存失败：' + err };
            });
        return result;
    }

    save2() {
        this.dataList.map((item: object) => {
            if (item['status'] !== 'submit' && item['status'] !== 'checked') {
                item['status'] = 'saved';
            }
        });
        return new Promise<object>((resolve: (value: object) => void, reject) => {
            let result = { code: 0, msg: '' };
            Vue.prototype
                .$http(`${SQU_API.MATERIAL_IN_SAVE_API}`, `POST`, this.dataList)
                .then(res => {
                    result = { code: res.data.code, msg: res.data.code === 0 ? '保存成功' : res.data.msg };
                    if (res.data.code === 0) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                })
                .catch(err => {
                    result = { code: 1, msg: '保存失败：' + err };
                    reject(result);
                });
        });
    }

    doSaveAction() {
        // Promise.resolve(this.save()).then((result) => {
        //   this.$message.success(result.msg)
        //   if (result.code === 0) {
        //     this.getOrderList()
        //   }
        // })
        this.save2()
            .then((result) => {
                this.$notify({ title: '成功', message: result['msg'], type: 'success' });
                this.getOrderList();
            })
            .catch((result: { code: number; msg: string }) => {
                Vue.prototype.$errorToast(result.msg);
            });
    }

    async submit() {
        let result = { code: 0, msg: '' };
        this.dataList.map((item: object) => {
            if (item['status'] !== 'checked') {
                item['status'] = 'submit';
            }
        });
        await Vue.prototype
            .$http(`${SQU_API.MATERIAL_IN_SUBMIT_API}`, `POST`, this.dataList)
            .then(res => {
                result = { code: res.data.code, msg: res.data.code === 0 ? '提交成功' : res.data.msg };
            })
            .catch(err => {
                result = { code: 1, msg: '提交失败：' + err };
            });
        return result;
    }

    submit2() {
        let result = { code: 0, msg: '' };
        this.dataList.map((item: object) => {
            if (item['status'] !== 'checked') {
                item['status'] = 'submit';
            }
        });
        return new Promise<object>((resolve: (value: object) => void, reject) => {
            Vue.prototype
                .$http(`${SQU_API.MATERIAL_IN_SUBMIT_API}`, `POST`, this.dataList)
                .then(res => {
                    result = { code: res.data.code, msg: res.data.code === 0 ? '提交成功' : res.data.msg };
                    if (res.data.code === 0) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                })
                .catch(err => {
                    result = { code: 1, msg: '提交失败：' + err };
                    reject(result);
                });
        });
    }

    doSubmitAction() {
        // Promise.all([this.save(), this.submit()]).then((result) => {
        //   if (result[0].code === 0 && result[1].code === 0) {
        //     this.getOrderList()
        //   } else {
        //     this.$message.success('提交失败')
        //   }
        // })
        this.$confirm('确认提交, 是否继续?', '提交', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.save2()
                .then(() => this.submit2())
                .then((result) => {
                    this.$notify({ title: '成功', message: result['msg'], type: 'success' });
                    this.getOrderList();
                })
                .catch((result: { code: number; msg: string }) => {
                    Vue.prototype.$errorToast(result.msg);
                });
        }).catch(() => {
            // this.$infoToast('已取消删除');
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
        this.getMaterial(newVal);
    }

    @Watch('params.workshopId')
    onChangeWorkshop() {
        this.params.productLineId = '';
        this.params.productLineName = '';
        // this.getProductLine(newVal)
        // this.getPot(this.params);
    }
}
</script>
<style lang="scss">
.dialog__class {
    border-radius: 6px 6px 0 0 !important;

    .el-dialog__header {
        height: 59px;
        color: #fff;
        font-size: 20px;
        background: rgba(24, 144, 255, 1);
        border-radius: 6px 6px 0 0;

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
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 2px;

    .pot-box-header {
        height: 40px;
        line-height: 40px;
        background: rgba(235, 235, 235, 1);
        border-radius: 4px 4px 0 0;

        .pot-box-title {
            color: rgba(0, 0, 0, 0.65);
            font-weight: 500;
            font-size: 14px;
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
        display: flex;
        justify-content: center;
        margin-top: 20px;

        .pot-box-button {
            width: 72px;
            height: 24px;
            margin-right: 4px;
            margin-left: 4px;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background: rgba(24, 144, 255, 1);
            }
        }

        .pot-box-button-title {
            color: #000;
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;

            &:hover {
                color: #fff;
            }
        }

        .pot-box-button-disabled {
            width: 72px;
            height: 24px;
            margin-right: 4px;
            margin-left: 4px;
            color: rgba(0, 0, 0, 0.6);
            text-align: center;
            background: #f7f9fa;
            border: 1px solid rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                cursor: not-allowed;
            }
        }

        .pot-box-button-title-disabled {
            color: rgba(0, 0, 0, 0.6);
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
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
