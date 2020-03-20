<!--生产入库-->
<template>
    <div>
        <!--数据录入-->
        <mds-card :title="'生产入库'" :name="'instock'">
            <!--录入-->
            <el-row class="forColor" :gutter="10">
                <el-col v-for="(item, index) in flourContainerList" :key="index" class="colorItem" :span="6" style="margin-bottom: 10px;">
                    <div class="stock-box colorContainer">
                        <p class="stock-title">
                            <i class="iconfont factory-zhizaozhuisu" />{{ flourContainerList[index].holderName }}
                        </p>
                        <div class="stock-container clearfix">
                            <img src="@/assets/img/ui2.0/instockPot.png" alt="" class="stock-img">
                            <div v-if="isRedact && inStorageState != 'submit' && inStorageState != 'checked'" class="stock-button enabled" @click="addNewRecord(flourContainerList[index].holderId, flourContainerList[index].holderName)">
                                入罐
                            </div>
                            <div v-else class="stock-button disabled">
                                入罐
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!--table-->
            <el-table class="newTable" headerRowClassName="tableHead" :data="wheatDataList" border tooltipEffect="dark" :rowClassName="rowDelFlag" @row-dblclick="modifyOldRecord">
                <el-table-column label="日期" width="110">
                    <template slot-scope="scope">
                        {{ scope.row.inPortDate | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column label="麦粉计量仓" :showOverflowTooltip="true" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.flourDeviceName }}
                    </template>
                </el-table-column>
                <el-table-column label="粮仓" showOverflowTooltip>
                    <template slot-scope="scope">
                        {{ scope.row.wheatDeviceName }}
                    </template>
                </el-table-column>
                <el-table-column width="90" label="起始">
                    <template slot-scope="scope">
                        {{ scope.row.startWeight }}
                    </template>
                </el-table-column>
                <el-table-column label="结束" width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.row.endWeight }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="入库数" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.inPortWeight }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="50">
                    <template slot-scope="scope">
                        <span>{{ (scope.row.weightUnit = 'KG') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="入库批次" width="110">
                    <template slot-scope="scope">
                        <span>{{ scope.row.inPortBatch }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作人员" width="100" showOverflowTooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.changer }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160" showOverflowTooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.changed }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact || scope.row.status === 'submit' || scope.row.status === 'checked'" @click="dellistbomS(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px;">
                <span>入库数合计：</span>{{ totalInstock }} KG
            </div>
        </mds-card>
        <!--审批-->
        <auditLog :tableData="readAudit" />
        <el-dialog :title="stockForm.flourDeviceName" :closeOnClickModal="false" :visible.sync="dialogFormVisible" width="450px">
            <el-form ref="stockForm" :model="stockForm" :rules="dataRule" size="small">
                <el-form-item label="粮仓：" :labelWidth="formLabelWidth" required prop="wheatDeviceId">
                    <el-select v-model="stockForm.wheatDeviceId" valueKey="wheatDeviceId" placeholder="请选择粮仓" style="width: 220px;" :disabled="!isRedact" @change="changeWheatContainer">
                        <el-option v-for="(item, index) in wheatContainerList" :key="index" :label="item.holderName" :value="item.holderId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="起始(KG)：" :labelWidth="formLabelWidth" required prop="startWeight">
                    <el-input v-model.number="stockForm.startWeight" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 220px;" :disabled="!isRedact" />
                </el-form-item>
                <el-form-item label="结束(KG)：" :labelWidth="formLabelWidth" required prop="endWeight">
                    <el-input v-model.number="stockForm.endWeight" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 220px;" :disabled="!isRedact" />
                </el-form-item>
                <el-form-item label="入库批次：" :labelWidth="formLabelWidth" required prop="inPortBatch">
                    <el-input v-model="stockForm.inPortBatch" maxlength="10" style="width: 220px;" :disabled="!isRedact" />
                </el-form-item>
                <el-form-item label="操作时间：" :labelWidth="formLabelWidth">
                    <label>{{ stockForm.changed }}</label>
                </el-form-item>
                <el-form-item label="操作人：" :labelWidth="formLabelWidth">
                    <label>{{ stockForm.changer }}</label>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :disabled="!isRedact" @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" :disabled="!isRedact" @click="cacheStockData()">
                    保存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { dateFormat, accSub } from '@/net/validate';
import { WHT_API, BASICDATA_API } from '@/api/api';
export default {
    filters: {
        formatDate(date) {
            if (date && date.length > 10) {
                return date.substring(0, 10);
            }
            return date;
        }
    },
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: Boolean,
        inStorageState: {
            type: String,
            default: ''
        },
        order: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        // let validate = (rule, value, callback) => {
        //   if (value <= 0) {
        //     callback(new Error('必须大于0'))
        //   } else {
        //     callback()
        //   }
        // }
        return {
            // stoppageType: [],
            // equipmentType: [],
            // materialShort: [],
            // enery: [],
            wheatDataList: [],
            readAudit: [],
            flourContainerList: [],
            wheatContainerList: [],
            dialogFormVisible: false,
            formLabelWidth: '120px',
            stockForm: {},
            dataRule: {
                wheatDeviceId: [{ required: true, message: '必选', trigger: 'click' }],
                startWeight: [{ required: true, message: '必填', trigger: 'blur' }],
                endWeight: [{ required: true, message: '必填', trigger: 'blur' }],
                inPortBatch: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { max: 10, message: '长度不能超过10', trigger: 'blur' }
                ]
            },
            batchList: []
        };
    },
    computed: {
        operator: function() {
            return `(${this.stockForm.changer})${this.stockForm.changer}`;
        },
        totalInstock: function() {
            let total = 0;
            for (const ele of this.wheatDataList) {
                if (ele.delFlag === '0') {
                    total += parseFloat(ele.inPortWeight);
                }
            }
            return total;
        }
    },
    watch: {
        'order.productDate'(n) {
            // 监听头部生产日期
            this.wheatDataList.forEach(item => {
                if (item.status !== 'submit' && item.status !== 'checked') {
                    item.inPortDate = dateFormat(new Date(n), 'yyyy-MM-dd hh:mm:ss');
                }
            });
        }
    },
    mounted() {
        this.getFlourContainerList();
        this.getWheatContainerList();
        // this.getWheatDataList()
    },
    methods: {
        validate() {
            // if (this.wheatDataList === undefined || this.wheatDataList.length === 0) {
            if (typeof this.wheatDataList === 'undefined' || this.wheatDataList.filter(item => item.delFlag === '0').length === 0) {
                this.$warningTost('生产入库未录入数据');
                return false;
            }
            for (const item of this.wheatDataList) {
                if (item.delFlag === '0') {
                    if (item.inPortWeight <= 0) {
                        this.$warningTost('入库数必须大于0');
                        return false;
                    }
                }
            }
            return true;
        },
        // 麦粉计量仓容器
        /* eslint-disable @typescript-eslint/camelcase */
        getFlourContainerList() {
            this.flourContainerList = [];
            if (typeof this.order === 'undefined' || typeof this.order.workShopName === 'undefined') {
                return;
            }
            const params = {
                type: 'holder_type',
                holder_type: '009',
                // holder_no: 'MM002',
                pageSize: 9999,
                workShopName: this.order.workShopName,
                currPage: 1
            };
            this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.flourContainerList = data.page.list;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 粮仓
        /* eslint-disable @typescript-eslint/camelcase */
        getWheatContainerList() {
            this.wheatContainerList = [];
            if (typeof this.order === 'undefined' || typeof this.order.workShopName === 'undefined') {
                return;
            }
            const params = {
                type: 'holder_type',
                holder_type: '002',
                // holder_no: '001',
                pageSize: 9999,
                workShopName: this.order.workShopName,
                currPage: 1
            };
            this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.wheatContainerList = data.page.list;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 获取入库数据
        getWheatDataList(orderId) {
            this.wheatDataList = [];
            this.readAudit = [];
            // if (typeof this.order === 'undefined' || typeof this.order.orderId === 'undefined') {
            //   return
            // }
            let inState = '';
            this.$http(`${WHT_API.INSTORAGELIST_API}`, 'POST', { orderId })
                .then(({ data }) => {
                    if (data.code === 0) {
                        // success
                        this.wheatDataList = data.wlist;
                        this.readAudit = data.vrlist;
                        let no = 0;
                        let sub = 0;
                        let che = 0;
                        let sav = 0;
                        this.wheatDataList.forEach(item => {
                            if (item.status === 'noPass') {
                                no = no + 1;
                            } else if (item.status === 'submit') {
                                sub = sub + 1;
                            } else if (item.status === 'checked') {
                                che = che + 1;
                            } else if (item.status === 'saved') {
                                sav = sav + 1;
                            }
                        });
                        if (no > 0) {
                            inState = 'noPass';
                        } else if (sub > 0) {
                            inState = 'submit';
                        } else if (sav > 0) {
                            inState = 'saved';
                        } else if (che > 0) {
                            inState = 'checked';
                        }
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                })
                .finally(() => {
                    this.$emit('setInStorageState', inState);
                });
        },
        addNewRecord(flourDeviceId, flourDeviceName) {
            const now = new Date();
            const dateStr = dateFormat(now, 'yyyy-MM-dd hh:mm:ss');
            const inPortDateStr = dateFormat(new Date(this.order.productDate), 'yyyy-MM-dd hh:mm:ss');
            this.stockForm = {
                wheatDeviceId: '',
                startWeight: 0,
                endWeight: 0,
                created: dateStr,
                creator: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                changed: dateStr,
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                orderId: this.order.orderId,
                flourDeviceId,
                flourDeviceName,
                recordId: this.uuid(),
                inPortDate: inPortDateStr,
                inPortBatch: '',
                delFlag: '0'
            };
            this.dialogFormVisible = true;
            if (typeof this.$refs['stockForm'] !== 'undefined') {
                this.$refs['stockForm'].resetFields();
            }
        },
        modifyOldRecord(row) {
            // noPass saved
            if (!this.isRedact || row.status === 'submit' || row.status === 'checked') {
                return;
            }
            this.dialogFormVisible = true;
            // if (this.$refs['stockForm'] !== undefined) {
            //   this.$refs['stockForm'].resetFields()
            // }
            // 点击保存之前，不能对列表数据做更改，此处用clone
            this.stockForm = Object.assign({}, row);
            // this.stockForm.changed = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            // this.stockForm.changer = this.$store.state.user.realName + `(${this.$store.state.user.name})`
        },
        cacheStockData() {
            this.$refs['stockForm'].validate(valid => {
                if (valid) {
                    let currentRecord = [];
                    if (Object.prototype.hasOwnProperty.call(this.stockForm, 'recordId')) {
                        // 新增行
                        currentRecord = this.wheatDataList.filter(data => data.recordId === this.stockForm.recordId);
                    } else {
                        // 原有行
                        currentRecord = this.wheatDataList.filter(data => data.id === this.stockForm.id);
                    }
                    this.stockForm.inPortWeight = accSub(this.stockForm.endWeight, this.stockForm.startWeight);
                    this.stockForm.wheatDeviceName = this.wheatContainerList.find(item => item.holderId === this.stockForm.wheatDeviceId).holderName;
                    if (currentRecord && currentRecord.length > 0) {
                        // modify
                        Object.assign(currentRecord[0], this.stockForm);
                    } else {
                        // add
                        const clone = Object.assign({}, this.stockForm);
                        this.wheatDataList.push(clone);
                    }
                    this.dialogFormVisible = false;
                }
            });
        },
        // 保存
        saveIn(resolve) {
            if (this.wheatDataList.length > 0) {
                this.wheatDataList.forEach(item => {
                    // 应产品要求，如果对不通过数据做修改保存操作，页签状态还是未通过，故此处不做状态赋值。
                    // if (item.status !== 'submit' || item.status !== 'checked') {
                    //   item.status = 'saved'
                    // }
                    // 新增行赋值saved
                    if (typeof item.status === 'undefined' || item.status === null || item.status.trim() === '') {
                        item.status = 'saved';
                    }
                });
                this.$http(WHT_API.INSTORAGESAVE_API, 'POST', this.wheatDataList)
                    .then(({ data }) => {
                        if (data.code !== 0) {
                            this.$error_SHINHO(data.msg);
                        }
                        if (resolve) {
                            resolve('resolve');
                        }
                    })
                    .catch(error => {
                        console.log('catch data::', error);
                    });
            } else if (resolve) {
                    resolve('resolve');
                }
        },
        // 入库提交
        submitIn(resolve) {
            if (this.wheatDataList.length > 0) {
                this.wheatDataList.forEach(item => {
                    if (item.status !== 'checked') {
                        item.status = 'submit';
                    }
                });
                this.$http(`${WHT_API.INSTORAGESUBMIT_API}`, 'POST', this.wheatDataList)
                    .then(({ data }) => {
                        if (data.code !== 0) {
                            this.$error_SHINHO(data.msg);
                        }
                        if (resolve) {
                            resolve('resolve');
                        }
                    })
                    .catch(error => {
                        console.log('catch data::', error);
                    });
            } else if (resolve) {
                    resolve('resolve');
                }
        },
        changeWheatContainer(value) {
            // let wheat = this.wheatContainerList.find((item) => item.holderId === value)
            // let holderNo = ''
            // if (wheat) {
            //   this.stockForm.wheatDeviceName = wheat.holderName
            //   holderNo = wheat.holderNo
            // }
            // let now = new Date()
            // this.stockForm.inPortBatch = dateFormat(now, 'yyMMdd') + holderNo
            this.stockForm.inPortBatch = this.batchList.find(item => item.holderId === value && item.littleHolderId === this.stockForm.flourDeviceId).batch;
        },
        // 删除
        dellistbomS(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        // RowDelFlag
        rowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        // 那批次
        getBatch(workshop) {
            this.$http(`${WHT_API.INSTORAGEBATCHLIST_API}`, 'POST', {
                workShop: workshop
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.batchList = data.list;
                } else {
                    this.$warningTost(data.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.stock-box {
    padding: 10px;
    color: white;
    box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(171, 171, 171, 0.5);
    .stock-title {
        font-size: 12px;
        line-height: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .stock-container {
        margin-top: 20px;
        .stock-img {
            width: 82px;
            margin-left: 10px;
            float: left;
        }
        .stock-button {
            margin-top: 32px;
            float: right;
            width: 65px;
            height: 32px;
            font-size: 12px;
            color: white;
            line-height: 32px;
            text-align: center;
            border-radius: 4px;
        }
        .enabled {
            background: #487bff;
            &:hover {
                color: #fff;
                background: #1890ff;
                cursor: pointer;
            }
        }
        .disabled {
            background: #a0cfff;
            &:hover {
                cursor: not-allowed;
            }
        }
    }
}
</style>
