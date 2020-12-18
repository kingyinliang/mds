<template>
    <div>
        <el-dialog title="Y158领用" width="458px" :close-on-click-modal="false" :visible.sync="visible">
            <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
                <el-form-item label="领用库位：">
                    <el-select v-model="dataForm.materialLocation" :disabled="type !== 'add'" placeholder="请选择" style="width: 100%;" @change="workShopChange">
                        <el-option v-for="(item, index) in workShopList" :key="index" :label="item.materialLocation" :value="item.materialLocation" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领用批次：" prop="batch">
                    <el-select v-model="dataForm.batch" :disabled="type !== 'add'" placeholder="请选择" style="width: 100%;" @change="batchChange">
                        <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领用物料：">
                    <el-input v-model="dataForm.materialLink" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="库存量：">
                    <el-input v-model="dataForm.stockAmount" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="领用数量：" prop="amount">
                    <el-input v-model.number="dataForm.amount" placeholder="请输入" @input="calcStockAmount" />
                </el-form-item>
                <el-form-item label="单位：">
                    <el-input v-model="dataForm.unit" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="添加人：" prop="operationMans">
                    <el-tooltip class="item" effect="dark" :content="dataForm.operationMans + '点击选择人员'" placement="top">
                        <div class="koji-control-form_select" @click="selectUser(dataForm, '添加人', 'operationMans')">
                            {{ dataForm.operationMans }} 点击选择
                        </div>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-tooltip :disabled="!dataForm.remark" effect="dark" :content="dataForm.remark" placement="top">
                        <el-input v-model="dataForm.remark" placeholder="请输入" />
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="操作人：">
                    <el-input v-model="dataForm.changer" disabled />
                </el-form-item>
                <el-form-item label="操作时间：">
                    <el-input v-model="dataForm.changed" disabled />
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
        name: 'Y158MaterialApplyDialog',
        components: {
            LoanedPersonnel
        }
    })
    export default class Y158MaterialApplyDialog extends Vue {
        @Prop({ default: { workShop: '' } }) formHeader: FormHeaderobj;

        $refs: {dataForm: HTMLFormElement; loanedPersonnel: HTMLFormElement};
        // 车间下拉列表
        workShopList: object[] = [];
        // 库存信息
        stockInfoList: StockInfoList[] = [];
        // 批次list
        batchList: BatchList[] = [];

        loanedPersonnelStatus = false;
        row = {}
        rowField = ''

        // 保存库存量初始值
        STOCK_AMOUNT = 0;

        visible = false;
        type = '';

        dataRule = {
            amount: [
                { required: true, message: '领用数量不能为空', trigger: 'blur' },
                { type: 'number', message: '必须为数字值' }
            ],
            batch: [{ required: true, message: '请选择领用批次', trigger: 'change' }],
            operationMans: [
                { required: true, message: '请选择添加人', trigger: 'change' }
            ]
        };

        // 表单对象
        dataForm: DataForm = {};

        // 车间库位查询
        private getWorkShop(type) {
            KOJI_API.KOJI_STORAGE_STRAIN_DROPDOWN_API({
                workShop: this.$store.state.koji.orderKojiInfo.workShop
            }).then(({ data }) => {
                console.log('领用库位')
                console.log(data)
                this.workShopList = data.data;
                if (data.data.length !== 0 && type === 'add') {
                    this.dataForm.materialLocation = data.data[0]['materialLocation'];
                }
                // 默认选中第一个选项 库位详细信息查询
                this.checkShopDetail()
            });
        }

        // 库位详细信息查询--批次
        checkShopDetail() {
            KOJI_API.KOJI_STORAGE_STRAIN_DROPDOWN_API({
                // Y158 没有 workshop 概念，故可以不传。此处注解掉
                // workShop: this.$store.state.koji.orderKojiInfo.workShop,
                materialLocation: this.dataForm.materialLocation
            }).then(({ data }) => {
                this.batchList = data.data || [];
                if (this.type !== 'add') {
                    this.batchList.map(item => {
                        if (item.batch === this.dataForm.batch) {
                            this.dataForm.stockAmount = item.currentAmount;
                            this.STOCK_AMOUNT = Number(item.currentAmount);
                            if (this.dataForm.amount) { this.STOCK_AMOUNT += Number(this.dataForm.amount); }
                        }
                    })
                }
            });
        }

        // 内部借调弹窗选择
        selectUser(row, typeName, field) {
            this.row = row;
            this.rowField = field
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

        async init(infoData, type) {
            this.type = type;
            this.visible = true;
            let Data: DataForm = {};
            // 查询
            this.getWorkShop(type);

            if (type !== 'add') {
                Data = infoData;
            }

            this.dataForm = {
                id: Data.id,
                materialLocation: Data.materialLocation,
                batch: Data.batch,
                materialCode: Data.materialCode,
                materialName: Data.materialName,
                materialLink: Data.materialCode ? String(Data.materialName) + String(Data.materialCode) : '',
                materialType: 'Y158',
                amount: Data.amount,
                operationMans: Data.operationMans || '',
                stockAmount: Data.stockAmount || Data.currentAmount,
                unit: '盒',
                remark: Data.remark,
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                wareHouseNo: this.formHeader.wareHouseNo,
                orderNo: this.formHeader.orderNo,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                workShop: this.formHeader.workShop
            }
        }

        calcStockAmount() {
            const amount = this.dataForm.amount;
            if (amount === '') {
                this.dataForm.stockAmount = Number(this.STOCK_AMOUNT)
            }
            if (/^[1-9]?([0-9]+$)/.test(String(amount))) {
                this.dataForm.stockAmount = Number(this.STOCK_AMOUNT) - Number(amount)
            }
        }

        workShopChange() {
            this.checkShopDetail()
        }

        batchChange() {
            this.batchList.map(item => {
                if (item.batch === this.dataForm.batch) {
                    this.dataForm.materialLink = String(item.materialName) + String(item.materialCode);
                    this.dataForm.materialName = String(item.materialName);
                    this.dataForm.materialCode = String(item.materialCode);
                    this.dataForm.stockAmount = item.currentAmount;
                    this.STOCK_AMOUNT = Number(item.currentAmount);
                    this.dataForm.amount = '';
                    this.dataForm.storageId = item.id;
                }
            })
        }

        // 提交
        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.type === 'add') {
                        KOJI_API.KOJI_MATERIAL_GET_ADD_QUERY_API({
                            insertDto: [this.dataForm]
                        }).then(() => {
                            this.visible = false;
                            this.$emit('success', this.dataForm);
                        })
                    } else {
                        KOJI_API.KOJI_MATERIAL_GET_EDIT_QUERY_API({
                            updateDto: [this.dataForm]
                        }).then(() => {
                            this.visible = false;
                            this.$emit('success', this.dataForm);
                        })
                    }
                }
            })
        }
    }

    interface FormHeaderobj {
        workShop?: string;
        kojiOrderNo?: string;
        orderNo?: string;
        wareHouseNo?: string;
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
        currentAmount?: string;
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
        supplier?: string;
        orderNo?: string;
        kojiOrderNo?: string;
        smallBeanAmount?: string;
        unit?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        stockAmount?: string| number;
        currentAmount?: string;
        operationMans?: string;
        wareHouseNo?: string;
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
