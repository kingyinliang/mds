<template>
    <div>
        <el-dialog title="面粉领用" width="458px" :close-on-click-modal="false" :visible.sync="visible">
            <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
                <el-form-item label="领用库位：">
                    <el-input v-model="dataForm.materialHL" placeholder="NA" disabled />
                </el-form-item>
                <el-form-item label="BOM物料：">
                    <el-input v-model="dataForm.material" placeholder="NA" disabled />
                </el-form-item>
                <el-form-item label="领用批次：" prop="batch">
                    <el-select v-model="dataForm.batch" :disabled="type !== 'add'" placeholder="请选择" style="width: 100%;" @change="batchChange">
                        <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领用物料：">
                    <el-input v-model="dataForm.materialLink" placeholder="NA" disabled />
                </el-form-item>
                <el-form-item label="库存量：">
                    <el-input v-model="dataForm.stockAmount" placeholder="NA" disabled />
                </el-form-item>
                <el-form-item label="领用数量：" prop="amount">
                    <el-input v-model.number="dataForm.amount" placeholder="手动输入" @input="calcStockAmount" />
                </el-form-item>
                <el-form-item label="单位：">
                    <el-input v-model="dataForm.unitName" placeholder="NA" disabled />
                </el-form-item>
                <el-form-item label="面粉厂家：">
                    <el-input v-model="dataForm.supplier" placeholder="NA" disabled />
                </el-form-item>
                <el-form-item label="上面人：" prop="operationMans">
                    <el-tooltip class="item" effect="dark" :content="dataForm.operationMans + '点击选择人员'" placement="top">
                        <div class="koji-control-form_select" @click="selectUser(dataForm, '上面人', 'operationMans')">
                            {{ dataForm.operationMans }} 点击选择
                        </div>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="杂质数量：" prop="impurityAmount">
                    <el-input v-model.number="dataForm.impurityAmount" placeholder="手动输入" />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-tooltip :disabled="!dataForm.remark" effect="dark" :content="dataForm.remark" placement="top">
                        <el-input v-model="dataForm.remark" placeholder="手动输入" />
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="操作人：">
                    <el-input v-model="dataForm.changer" placeholder="NA" disabled />
                </el-form-item>
                <el-form-item label="操作时间：">
                    <el-input v-model="dataForm.changed" placeholder="NA" disabled />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">
                    取消
                </el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" @changeUser="changeUser" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { KOJI_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import LoanedPersonnel from 'components/LoanedPersonnel.vue';

    @Component({
        name: 'FlourMaterialApplyDialog',
        components: {
            LoanedPersonnel
        }
    })
    export default class FlourMaterialApplyDialog extends Vue {
        @Prop({ default: { workShop: '' } }) formHeader: FormHeaderobj;

        $refs: { dataForm: HTMLFormElement; loanedPersonnel: HTMLFormElement };
        // 批次list
        batchList: BatchList[] = [];

        // 保存库存量初始值
        STOCK_AMOUNT = 0;

        visible = false;
        type = '';
        loanedPersonnelStatus = false;
        row = {};
        rowField = '';

        dataRule = {
            amount: [
                { required: true, message: '领用数量不能为空', trigger: 'blur' },
                { type: 'number', message: '必须为数字值' }
            ],
            batch: [{ required: true, message: '请选择领用批次', trigger: 'change' }],
            operationMans: [{ required: true, message: '请选择上面人', trigger: 'change' }],
            impurityAmount: [
                {
                    validator: (rule, value, callBack) => {
                        if (value === '' || /^\d{1,}$/.test(value)) {
                            callBack();
                        } else {
                            callBack(new Error('必须为数字值'));
                        }
                    },
                    trigger: 'blur'
                }
            ]
        };

        // 表单对象
        dataForm: DataForm = {};

        async init(infoData, formHeader, type) {
            this.type = type;
            this.visible = true;
            let Data: DataForm = {};
            let storageId = '';
            if (type === 'add') {
                this.batchList = infoData.detailsList || [];
                Data = {
                    ...infoData,
                    ...infoData.detailsList[0],
                    operationMans: Data.operationMans || ''
                };
                this.STOCK_AMOUNT = Data.stockAmount || Data.currentAmount ? Number(Data.stockAmount) || Number(Data.currentAmount) : 0;
                storageId = infoData.detailsList[0].id;
            } else {
                storageId = infoData.storageId;
                // 查询
                await KOJI_API.KOJI_STORAGE_WHEAT_DROPDOWN_API({
                    workShop: formHeader.workShop,
                    wareHouseNo: infoData.wareHouseNo,
                    materialLocation: infoData.materialLocation
                }).then(({ data }) => {
                    this.batchList = data.data;
                    this.batchList.map(item => {
                        if (item.batch === infoData.batch) {
                            infoData.stockAmount = item.currentAmount;
                            this.STOCK_AMOUNT = Number(item.currentAmount);
                            if (infoData.amount) { this.STOCK_AMOUNT += Number(infoData.amount); }
                        }
                    });
                    Data = {
                        ...infoData
                    };
                });
            }

            console.log(Data, '==============')

            this.dataForm = {
                id: Data.id,
                materialHL: Data.wareHouseNo || Data.materialLocation,
                wareHouseNo: Data.wareHouseNo,
                materialLocation: Data.materialLocation,
                batch: Data.batch,
                material: `${String(Data.materialName)} ${String(Data.materialCode)}`,
                materialCode: Data.materialCode,
                materialName: Data.materialName,
                materialLink: Data.materialCode ? Data.materialName + Data.materialCode : '',
                materialType: 'FLOUR',
                amount: Data.amount,
                impurityAmount: Data.impurityAmount || 0,
                supplier: Data.supplier,
                stockAmount: Data.stockAmount || Data.currentAmount,
                operationMans: Data.operationMans || '',
                unit: Data.unit,
                unitName: Data.unitName,
                remark: Data.remark,
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                orderNo: this.formHeader.orderNo,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                workShop: this.formHeader.workShop,
                storageId: storageId
            };
        }

        calcStockAmount() {
            const amount = this.dataForm.amount;
            if (amount === '') {
                this.dataForm.stockAmount = Number(this.STOCK_AMOUNT);
            }
            if (/^[1-9]?([0-9]+$)/.test(String(amount))) {
                this.dataForm.stockAmount = Number(this.STOCK_AMOUNT) - Number(amount);
            }
        }

        batchChange() {
            this.batchList.map(item => {
                if (item.batch === this.dataForm.batch) {
                    this.dataForm.materialLink = String(item.materialName) + String(item.materialCode);
                    // this.dataForm.stockAmount = item.stockAmount;
                    this.dataForm.stockAmount = item.currentAmount
                    this.dataForm.supplier = item.supplier;
                    this.STOCK_AMOUNT = Number(item.currentAmount);
                    this.dataForm.storageId = item.id;
                    this.calcStockAmount();
                }
            });
        }

        // 提交
        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.type === 'add') {
                        const params = JSON.parse(JSON.stringify(this.dataForm))
                        delete params.id;
                        KOJI_API.KOJI_MATERIAL_GET_ADD_QUERY_API({
                            insertDto: [{
                                ...params,
                                impurityAmount: this.dataForm.impurityAmount || 0
                            }]
                        }).then(() => {
                            this.visible = false;
                            this.$emit('success', this.dataForm);
                        });
                    } else {
                        KOJI_API.KOJI_MATERIAL_GET_EDIT_QUERY_API({
                            updateDto: [{
                                ...this.dataForm,
                                impurityAmount: this.dataForm.impurityAmount || 0
                            }]
                        }).then(() => {
                            this.visible = false;
                            this.$emit('success', this.dataForm);
                        });
                    }
                }
            });
        }

        // 内部借调弹窗选择
        selectUser(row, typeName, field) {
            this.row = row;
            this.rowField = field;
            this.loanedPersonnelStatus = true;
            this.$nextTick(() => {
                let selArr = [];
                if (row[field]) {
                    selArr = row[field].split(',');
                }
                this.$refs.loanedPersonnel.init(selArr, typeName);
            });
        }

        // 操作人数据回显处理
        changeUser(userIds) {
            this.loanedPersonnelStatus = false;
            const arr = [...userIds];
            let relStr = '';
            arr.map((item, index) => {
                if (item) {
                    relStr += `${index > 0 ? ',' : ''}${item}`;
                }
            });
            this.row[this.rowField] = relStr;
        }
    }

    interface FormHeaderobj {
        workShop?: string;
        kojiOrderNo?: string;
        orderNo?: string;
    }

    interface StockInfoList {
        workShop?: string;
        beanLocation?: string;
        beanWareHouse?: string;
        detailsList: object[];
    }

    interface BatchList {
        id?: string;
        batch?: string;
        materialName?: string;
        materialCode?: string;
        stockAmount?: string;
        supplier?: string;
        currentAmount?: string|number;
    }

    interface DataForm {
        id?: string;
        materialLocation?: string;
        batch?: string;
        material?: string;
        materialCode?: string;
        materialName?: string;
        materialLink?: string;
        materialType?: string;
        amount?: string;
        impurityAmount?: string|number;
        supplier?: string;
        orderNo?: string;
        kojiOrderNo?: string;
        smallBeanAmount?: string;
        unit?: string;
        unitName?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        stockAmount?: string | number;
        currentAmount?: string;
        operationMans?: string;
        wareHouseNo?: string;
        materialHL?: string;
        workShop?: string;
        storageId?: string;
    }
</script>
<style lang="scss" scoped>
    .koji-control-form_select {
        min-width: 200px;
        max-width: 300px;
        padding-left: 8px;
        overflow: hidden;
        color: #333;
        white-space: nowrap;
        text-overflow: ellipsis;
        background: #f5f5f5;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
