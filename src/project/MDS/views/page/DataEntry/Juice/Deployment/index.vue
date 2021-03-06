<template>
    <div class="header_main">
        <el-card class="searchCard searchCards">
            <el-row>
                <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi_row">
                    <el-form-item label="生产工厂：">
                        <el-select v-model="formHeader.factory" placeholder="请选择" class="width150px">
                            <el-option value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产车间：">
                        <el-select v-model="formHeader.workShop" palceholder="请选择" class="width150px">
                            <el-option value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in workshop" :key="index" :value="item.deptId" :label="item.deptName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产日期：">
                        <el-date-picker v-model="formHeader.allocateDate" type="date" placeholder="请选择" style="width: 150px;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                    </el-form-item>
                    <el-form-item label="调配单号：">
                        <el-input v-model="formHeader.orderNo" style="width: 150px;" />
                    </el-form-item>
                    <el-form-item label="订单号：">
                        <el-input v-model="formHeader.orderNoAnother" style="width: 150px;" />
                    </el-form-item>
                    <el-form-item class="floatr">
                        <template style="float: right;">
                            <el-button v-if="isAuth('ste:allocate:allocateList')" type="primary" size="small" @click="SearchList">
                                查询
                            </el-button>
                            <!-- <el-button v-if="isAuth('ste:allocate:allocateUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                                {{ isRedact ? '取消' : '编辑' }}
                            </el-button> -->
                        </template>
                        <!-- <template v-if="isRedact" style="float: right;">
                            <el-button type="primary" size="small" @click="SavedForm()">
                                保存
                            </el-button>
                            <el-button type="primary" size="small" @click="SubmitForm()">
                                提交
                            </el-button>
                        </template> -->
                    </el-form-item>
                </el-form>
            </el-row>
            <!-- <div class="toggleSearchBottom">
                <em class="el-icon-caret-top" />
            </div> -->
        </el-card>
        <mds-card title="原汁调配" name="deployment" :pack-up="false" style="margin-top: 10px;">
            <el-table :data="dataList" class="newTable" border header-row-class-name="tableHead" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" :selectable="CheckBoxInit" />
                <el-table-column label="状态" width="90" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span
                            :style="{
                                color: scope.row.status === '审核不通过' ? 'red' : scope.row.status === '审核通过' ? '#7ED321' : '',
                            }"
                        >{{ scope.row.status }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="调配单号" prop="orderNo" width="130" />
                <el-table-column label="生产车间" prop="workShopName" width="100" :show-overflow-tooltip="true" />
                <el-table-column label="调配单日期" prop="allocateDate" width="115" />
                <el-table-column label="杀菌物料" width="190" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}{{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="计划BL原汁总量" prop="planAmount" />
                <el-table-column label="BL原汁总量" prop="blAmount" width="100" />
                <el-table-column label="单位" prop="unit" width="50" />
                <el-table-column width="130">
                    <template slot="header">
                        <em class="reqI">*</em> 调配罐
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.holderId" size="small" :disabled="!isRedact">
                            <el-option value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in holderList" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="170">
                    <template slot="header">
                        <em class="reqI">*</em> 调配日期
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.allocateTime" :disabled="!isRedact" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 150px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="调配单备注" prop="remark" width="100" :show-overflow-tooltip="true" />
                <el-table-column label="创建人员" prop="creator" width="150" />
                <el-table-column label="创建时间" prop="created" width="170" />
                <el-table-column label="调配人员" prop="changer" width="150" />
                <el-table-column label="调配时间" prop="changed" width="170" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="ShowDetail(scope.row)">
                            调配
                        </el-button>
                        <el-button type="primary" size="small" @click="AddRecord(scope.row)">
                            记录
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="pages.currentPage" :page-sizes="[10, 20, 50]" :page-size="pages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pages.currentTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogTableVisible" width="1000px" custom-class="dialog__class">
            <div slot="title">
                调配列表
            </div>
            <el-table style="margin-bottom: 20px;" :data="ItemList" border header-row-class-name="tableHead" :row-class-name="RowDelFlag1">
                <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}
                        {{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="订单单位" width="80" prop="unit">
                    <template slot-scope="scope">
                        {{ scope.row.unit }}<span v-if="scope.row.materialName === 'Y010'">/{{ scope.row.yunit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="计划领料" prop="planAmount" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.planAmount }}<span v-if="scope.row.materialName === 'Y010'">/{{ scope.row.yplanAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="SplitStatus(scope.row)" @click="SplitDate(scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="罐号" prop="productDate" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.holderName" size="small" disabled />
                    </template>
                </el-table-column>
                <el-table-column label="类别" :show-overflow-tooltip="true" width="80">
                    <template slot-scope="scope">
                        {{ scope.row.category }}
                    </template>
                </el-table-column>
                <el-table-column width="120">
                    <template slot="header">
                        <em class="reqI">*</em> 实际领料
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveAmount" :disabled="SplitStatuss(scope.row)" size="small" />
                    </template>
                </el-table-column>
                <el-table-column width="130">
                    <template slot="header">
                        <em class="reqI">*</em> 批次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-if="scope.row.materialName === 'Y010'" v-model="scope.row.batch" value-key="batch" placeholder="请选择" :disabled="SplitStatuss(scope.row)" size="small" @change="changeBatch($event, scope.row)">
                            <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch" />
                        </el-select>
                        <el-input v-else v-model="scope.row.batch" maxlength="10" :disabled="SplitStatuss(scope.row)" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="Y010库存" prop="currentQuantity" width="100" />
                <el-table-column label="备注" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(lineStatus !== '已提交' && lineStatus !== '审核通过' && isRedact !== false)" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="small"
                            :disabled="scope.row.isSplit === '0' || lineStatus === '已提交' || lineStatus === '审核通过' || isRedact === false || scope.row.status === 'checked' || scope.row.status === 'submit'"
                            @click="DelOrderNo(scope.row)"
                        />
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="ItemList" border header-row-class-name="tableHead" :row-class-name="RowDelFlag2">
                <el-table-column label="物料" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}
                        {{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="数量" prop="planAmount" :show-overflow-tooltip="true" />
                <el-table-column label="订单单位" prop="unit" :show-overflow-tooltip="true" />
                <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <template>
                    <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" size="small" :disabled="!(lineStatus !== '已提交' && lineStatus !== '审核通过' && isRedact !== false)" @click="SaveSplit()">确 定</el-button>
                </template>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="RecordDialogTableVisible" width="550px" custom-class="dialog__class">
            <div slot="title">
                记录
            </div>
            <el-form ref="record" :model="record" size="small" label-width="140px" :rules="recordrules" style="width: 471px;">
                <el-form-item label="搅罐时间（min）：" prop="stirringTime">
                    <el-input v-model="record.stirringTime" size="small" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'" />
                </el-form-item>
                <el-form-item label="送样时间：" prop="sampleTime">
                    <el-date-picker
                        v-model="record.sampleTime"
                        class="width100"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        size="small"
                        :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'"
                    />
                </el-form-item>
                <el-form-item label="一次性合格：" prop="oneOffSuc">
                    <el-select v-model="record.oneOffSuc" filterable class="width100" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) of oneOffSucList" :key="index" :value="item" :label="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="不合格原因：">
                    <el-select v-model="record.nonReasons" filterable class="width100" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) of nonReasonsList" :key="index" :value="item.code" :label="item.value" />
                    </el-select>
                </el-form-item>
                <el-row v-for="(item, index) in record.Reason" :key="index" style="width: 510px;">
                    <el-col style="width: 300px;">
                        <el-form-item label="不合格调整分类：">
                            <el-select v-model="item.nonReasonClass" filterable :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'">
                                <el-option value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(subItem, subIndex) of nonReasonClassList" :key="subIndex" :value="subItem" :label="subItem" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="width: 170px;">
                        <el-form-item label="数量：" label-width="50px">
                            <el-input v-model="item.adjustAmount" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'" />
                        </el-form-item>
                    </el-col>
                    <el-col style="width: 32px; margin-left: 8px;">
                        <el-button v-if="index === 0" type="primary" icon="el-icon-plus" circle size="small" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'" @click="addReasons" />
                        <el-button v-else type="danger" icon="el-icon-delete" circle size="small" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'" @click="delReason(index)" />
                    </el-col>
                </el-row>
                <el-form-item label="调前米数：">
                    <el-input v-model="record.beforeMet" class="width100" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'" />
                </el-form-item>
                <el-form-item label="调后米数：">
                    <el-input v-model="record.afterMet" class="width100" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'" />
                </el-form-item>
                <el-form-item label="合格时间：">
                    <el-date-picker v-model="record.qualTime" type="datetime" class="width100" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="请选择" size="small" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'" />
                </el-form-item>
                <el-form-item label="白班操作人：">
                    <el-select v-model="record.dayOperator" filterable class="width100" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) of userList" :key="index" :value="item.realName + `(${item.userName})`" :label="item.realName + `(${item.userName})`" />
                    </el-select>
                </el-form-item><el-form-item label="夜班操作人：">
                    <el-select v-model="record.nightOperator" filterable class="width100" :disabled="!isRedact || soleRowstatus === '已提交' || soleRowstatus === '审核通过'">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) of userList" :key="index" :value="item.realName + `(${item.userName})`" :label="item.realName + `(${item.userName})`" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <template>
                    <el-button size="small" @click="RecordDialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" size="small" :disabled="!(soleRowstatus !== '已提交' && soleRowstatus !== '审核通过' && isRedact !== false)" @click="RecordSave('record')">确 定</el-button>
                </template>
            </span>
        </el-dialog>
        <redact-box>
            <template slot="button">
                <el-button v-if="isAuth('ste:allocate:allocateUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact" style="float: right;">
                    <el-button type="primary" size="small" @click="SavedForm()">
                        保存
                    </el-button>
                    <el-button type="primary" size="small" @click="SubmitForm()">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { headanimation, dateFormat, accAdd } from '@/net/validate';
import { BASICDATA_API, STERILIZED_API, SYSTEMSETUP_API, INVENTORY_API } from '@/api/api';
export default {
    name: 'JuiceDeployment',
    data() {
        return {
            RecordDialogTableVisible: false,
            recordrules: {
                stirringTime: [
                    {
                        required: true,
                        message: '请输入搅罐时间',
                        trigger: 'blur'
                    }
                ],
                sampleTime: [
                    {
                        required: true,
                        message: '请选择送样时间',
                        trigger: 'blur'
                    }
                ],
                oneOffSuc: [
                    {
                        required: true,
                        message: '请选择一次性合格',
                        trigger: 'blur'
                    }
                ]
            },
            record: {},
            soleRowstatus: '',
            oneOffSucList: ['是', '否'],
            nonReasonsList: ['氨氮高', '盐高', '氨氮低', '盐低'],
            nonReasonClassList: ['原汁', '水', '盐水'],
            formHeader: {
                factory: '',
                workShop: '',
                orderNo: '',
                orderNoAnother: ''
            },
            pages: {
                currentTotal: 0, // 总条数
                currentPage: 1, // 当前页数
                pageSize: 10
            },
            factory: [],
            workshop: [],
            isRedact: false,
            dataList: [],
            dialogTableVisible: false,
            ItemList: [],
            materialName: '',
            orderTypeSign: '',
            multipleSelection: [],
            holderList: [],
            lineStatus: '',
            thrwHolderList: [],
            userList: [],
            strList: [],
            strList1: [],
            strList2: [],
            Tdata: '',
            batchList: []
        };
    },
    watch: {
        'formHeader.factory'(n) {
            this.Getdeptbyid(n);
            this.GetHolderList(n);
        },
        'formHeader.workShop'(n) {
            this.dataList = [];
            this.ThrowHolder(n);
        }
    },
    mounted() {
        headanimation(this.$);
        // this.getBatchList();
        this.Getdeptcode();
        this.GetUserList();
        this.GetHolderStatusList();
    },
    methods: {
        // 批次
        getBatchList() {
            this.$http(`${INVENTORY_API.Y010_LIST_BATCH_LIST_API}`, `POST`, {}, false, false, false).then(({ data }) => {
                this.batchList = data.info;
            });
        },
        changeBatch(val, row) {
            const batchSole = this.batchList.find(item => (item.batch === val));
            row['currentQuantity'] = batchSole['currentQuantity'];
            row['holderId'] = batchSole['holderId'];
        },
        IsGuanStatus(row) {
            return row.materialName.indexOf('原汁') === -1 || !(this.lineStatus !== '已提交' && this.lineStatus !== '审核通过' && this.isRedact !== false && row.status !== 'submit' && row.status !== 'checked');
        },
        changeH(row) {
            row.category = '';
            if (row.holderId) {
                if (this.thrwHolderList.filter(item => item.holderId === row.holderId).length > 0) {
                    row.category = this.thrwHolderList.filter(item => item.holderId === row.holderId)[0].type;
                } else {
                    // this.$warningToast('BOM物料对应批次所需的原汁罐号不存在')
                }
            }
        },
        CheckMessage() {
            let tys = 0;
            for (const items of this.ItemList) {
                if (items.holderId !== null && items.holderType !== null && items.holderType === '013') {
                    if (this.thrwHolderList.filter(item => item.holderId === items.holderId && items.batch === item.batch).length <= 0) {
                        tys = 1;
                    }
                }
            }
            if (tys === 1) {
                this.$warningToast('BOM物料对应批次所需的原汁罐号不存在');
            }
        },
        // 获取不合格原因
        GetHolderStatusList() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'reason_yznopass' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.nonReasonsList = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.workshop = [];
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.formHeader.workShop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '杀菌' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length > 0) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        } else {
                            this.formHeader.workShop = '';
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 获取罐
        GetHolderList(id) {
            this.$http(`${STERILIZED_API.JUICEDEPLOYMENTHOLDER}`, 'POST', { factory: id }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.holderList = data.holderList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        ThrowHolder(id) {
            this.thrwHolderList = [];
            if (id) {
                const params = {
                    factory: this.formHeader.factory,
                    workShop: id,
                    code: '013'
                };
                this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTHROWHOLDER}`, 'POST', params, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.thrwHolderList = data.holderList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 查询
        /* eslint-disable @typescript-eslint/camelcase*/
        SearchList() {
            if (this.formHeader.factory === '') {
                this.$warningToast('请选择工厂');
                return false;
            }
            this.ThrowHolder(this.formHeader.workShop);
            // this.formHeader.order_no = this.formHeader.orderNoAnother;
            this.$http(`${STERILIZED_API.JUICEDEPLOYMENTSEARCHLIST}`, 'POST', { ...this.formHeader, order_no: this.formHeader.orderNoAnother }).then(({ data }) => {
                if (data.code === 0) {
                    this.dataListAll = data.orderInfo;
                    this.dataListAll.map(item => {
                        if (item.allocateTime === '' || item.allocateTime === null) {
                            item.allocateTime = dateFormat(new Date(), 'yyyy-MM-dd');
                        }
                    });
                    this.pages.currentTotal = this.dataListAll.length;
                    this.pages.currentPage = 1;
                    this.dataList = this.dataListAll.slice((this.pages.currentPage - 1) * this.pages.pageSize, this.pages.currentPage * this.pages.pageSize);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        /* eslint-disenable @typescript-eslint/camelcase*/
        ShowDetail(row) {
            this.getBatchList();
            this.Tdata = row;
            this.materialName = row.materialName;
            this.$http(
                `${STERILIZED_API.JUICEDEPLOYMENTITEMS}`,
                'POST',
                {
                    materialCode: row.materialCode,
                    orderNo: row.id,
                    factory: this.formHeader.factory,
                    sign: 'oldMethod'
                },
                false,
                false,
                false
            ).then(({ data }) => {
                if (data.code === 0) {
                    this.ItemList = data.info;
                    this.ItemList.map(item => {
                        if (typeof item.id === 'undefined') {
                            item.id = '';
                        }
                        if (!item.category) {
                            this.changeH(item);
                        }
                        if (item.receiveAmount === '' || !item.receiveAmount) {
                            item.receiveAmount = item.planAmount;
                        }
                    });
                    this.dialogTableVisible = true;
                    this.lineStatus = row.status;
                    this.ID = row.id;
                    this.orderTypeSign = data.orderTypeSign;
                    setTimeout(() => {
                        this.CheckMessage();
                    }, 1000);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 拆分
        SplitDate(row, index) {
            this.ItemList.splice(index + 1, 0, {
                materialName: row.materialName,
                materialCode: row.materialCode,
                unit: row.unit,
                category: row.category,
                planAmount: row.planAmount,
                yunit: row.yunit,
                yplanAmount: row.yplanAmount,
                holderId: null,
                receiveAmount: '',
                batch: '',
                remark: '',
                isSplit: '1',
                delFlag: '0',
                id: ''
            });
        },
        // 调配 确定
        SaveSplit() {
            const batchList = [];
            let ty = true;
            let strMsg = '';
            let Y010 = 0;
            for (const item of this.ItemList) {
                if (item.materielType !== 'BL_LY') {
                    batchList.push(item.batch);
                    item.ID = this.ID;
                    if ((!item.receiveAmount || item.receiveAmount === '') && item.delFlag === '0') {
                        this.$warningToast('请填写实际领料');
                        return false;
                    }
                    if ((!item.batch || item.batch === '') && item.delFlag === '0') {
                        this.$warningToast('请填写批次');
                        return false;
                    }
                    if (item.batch.length !== 10 && item.delFlag === '0') {
                        this.$warningToast('批次应为10位');
                        return false;
                    }
                    if (item.materialName === 'Y010' && item.delFlag === '0') {
                        Y010 = accAdd(Y010, item.receiveAmount);
                    }
                    // if (item.materialName.indexOf('原汁') !== -1 && (item.holderId === '' || !item.holderId)) {
                    //   this.$warningToast('原汁物料需选择罐号')
                    //   return false
                    // }
                    if (this.orderTypeSign === '1' && item.holderId && this.thrwHolderList.filter(it => item.holderId === it.holderId)[0].isRdSign !== '1') {
                        ty = false;
                    }
                    // if (/六月鲜/g.test(this.materialName)) {
                    //   if (/味极鲜/g.test(item.category)) {
                    //     this.$message.error('领用原汁与生产物料不匹配！无法保存，无法操作')
                    //     return false
                    //   }
                    // }
                }
            }
            // 实际领用数应小于计划领料
            if (this.ItemList.findIndex(item => item.materialName === 'Y010' && item.delFlag === '0') !== -1) {
                const planAmount = this.ItemList.find(item => item.materialName === 'Y010' && item.delFlag === '0').planAmount
                if (Number(planAmount) !== Y010) {
                    this.$warningToast('Y010物料实际领料数总和应等于计划领用数');
                    return false;
                }
            }
            // if (this.Tdata.cDay !== null && this.Tdata.cDay * 1 < 6) {
            this.Tdata.sbList.map(items => {
                if (items.cDay !== null && Number(items.cDay) < 6) {
                    strMsg += `${this.Tdata.sbList[0].yzHolderName}，${this.Tdata.sbList[0].batch}批次原汁，沉淀天数不足，是否确认使用？`;
                }
            });
            // }
            if (strMsg !== '') {
                this.$confirm(strMsg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (ty) {
                        this.SubmitFunction();
                    } else {
                        this.$confirm(`领用原汁非R&D原汁，请确认！`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.SubmitFunction();
                        }).catch(() => {
                            // this.$infoToast('已取消删除');
                        });
                    }
                });
            } else if (ty) {
                this.SubmitFunction();
            } else {
                this.$confirm(`领用原汁非R&D原汁，请确认！`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.SubmitFunction();
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
            }
            // if (new Set(batchList).size !== batchList.length) {
            //   this.$warningToast('批次不能重复')
            //   return false
            // }
        },
        SubmitFunction() {
            console.log(this.ItemList);
            this.ItemList.forEach((item, index) => {
                if (item.materielType === 'BL_LY') {
                    delete this.ItemList[index];
                } else {
                    item.receiveAmount = item.receiveAmount.toString();
                    item.planAmount = item.planAmount.toString();
                }
            });
            this.ItemList = this.ItemList.filter(function(val) {
                return val;
            });
            if (this.ItemList.length) {
                this.$http(`${STERILIZED_API.JUICEDEPLOYMENTITEMSAVE}`, 'POST', {
                    tiaoHolder: this.dataList,
                    params: this.ItemList
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        this.SearchList();
                        // this.ThrowHolder(this.formHeader.workShop)
                        this.dialogTableVisible = false;
                    } else if (data.mes.length === 0) {
                            this.$errorToast(data.msg);
                        } else {
                            this.$errorToast(data.mes.join(','));
                        }
                });
            } else {
                this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success'
                });
                this.SearchList();
                this.dialogTableVisible = false;
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // header saved
        SavedForm() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请勾选数据');
                return false;
            }
            this.multipleSelection.forEach(item => {
                item.status = '已调配';
            });
            this.$http(`${STERILIZED_API.JUICEDEPLOYMENTSAVE}`, 'POST', this.multipleSelection).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                    this.isRedact = false;
                    this.SearchList();
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        SubmitForm() {
            this.$confirm('确认提交该订单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length === 0) {
                    this.$warningToast('请勾选数据');
                    return false;
                }
                for (const item of this.multipleSelection) {
                    if (item.isUpdate === false) {
                        this.$warningToast('请先保存调配详情信息（调配单：' + item.orderNo + '）');
                        return false;
                    }
                    if (!item.holderId || !item.allocateTime || item.holderId === '' || item.allocateTime === '') {
                        this.$warningToast('请填写必填项');
                        return false;
                    }
                }
                this.$http(`${STERILIZED_API.JUICEDEPLOYMENTSUBMIT}`, 'POST', this.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        this.isRedact = false;
                        this.SearchList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 复选框初始状态
        CheckBoxInit(row) {
            if (this.isRedact === false || row.status === '已提交' || row.status === '审核通过') {
                return 0;
            }
                return 1;

        },
        handleSizeChange(val) {
            this.pages.pageSize = val;
            this.dataList = this.dataListAll.slice((this.pages.currentPage - 1) * this.pages.pageSize, this.pages.currentPage * this.pages.pageSize);
        },
        handleCurrentChange(val) {
            this.pages.currentPage = val;
            this.dataList = this.dataListAll.slice((this.pages.currentPage - 1) * this.pages.pageSize, this.pages.currentPage * this.pages.pageSize);
        },
        // 删除
        DelOrderNo(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
                // this.ItemList.splice(this.ItemList.indexOf(row), 1)
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        SplitStatus(row) {
            if (row.materialName.indexOf('原汁') === -1) {
                return this.lineStatus === '已提交' || this.lineStatus === '审核通过' || this.isRedact === false || row.status === 'submit' || row.status === 'checked';
            }
                return true;

        },
        SplitStatuss(row) {
            if (row.materialName.indexOf('原汁') === -1) {
                return !(this.lineStatus !== '已提交' && this.lineStatus !== '审核通过' && this.isRedact !== false && row.status !== 'submit' && row.status !== 'checked');
            }
                return true;

        },
        GetUserList() {
            this.$http(`${STERILIZED_API.JUICEDUSERLIST}`, 'POST', {
                deptName: '原汁组'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.userList = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        addReasons() {
            if (this.record.Reason.length === 3) {
                this.$warningToast('最多三个调整框');
                return;
            }
            this.record.Reason.push({ adjustAmount: '', nonReasonClass: '' });
        },
        delReason(index) {
            this.record.Reason.splice(index, 1);
        },
        AddRecord(row) {
            this.soleRowstatus = row.status;
            this.$http(`${STERILIZED_API.JUICEDLIST}`, 'POST', { aId: row.id }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    if (data.list.length === 1) {
                        const Reason = [];
                        Reason.push({
                            adjustAmount: data.list[0].adjustAmount,
                            nonReasonClass: data.list[0].nonReasonClass
                        });
                        if ((data.list[0].nonReasonClassTwo && data.list[0].nonReasonClassTwo !== '0') || data.list[0].adjustAmountTwo) {
                            Reason.push({
                                adjustAmount: data.list[0].adjustAmountTwo,
                                nonReasonClass: data.list[0].nonReasonClassTwo
                            });
                        }
                        if ((data.list[0].nonReasonClassThree && data.list[0].nonReasonClassThree !== '0') || data.list[0].adjustAmountThree) {
                            Reason.push({
                                adjustAmount: data.list[0].adjustAmountThree,
                                nonReasonClass: data.list[0].nonReasonClassThree
                            });
                        }
                        this.record = {
                            aId: row.id,
                            // adjustAmount: data.list[0].adjustAmount,
                            // nonReasonClass: data.list[0].nonReasonClass,
                            Reason: Reason,
                            afterMet: data.list[0].afterMet,
                            beforeMet: data.list[0].beforeMet,
                            dayOperator: data.list[0].dayOperator,
                            delFlag: '0',
                            id: data.list[0].id,
                            nightOperator: data.list[0].nightOperator,
                            nonReasons: data.list[0].nonReasons,
                            oneOffSuc: data.list[0].oneOffSuc,
                            qualTime: data.list[0].qualTime,
                            remark: '',
                            sampleTime: data.list[0].sampleTime,
                            stirringTime: data.list[0].stirringTime
                        };
                    } else {
                        this.record = {
                            aId: row.id,
                            adjustAmount: '',
                            afterMet: '',
                            beforeMet: '',
                            dayOperator: '',
                            delFlag: '0',
                            id: '',
                            Reason: [{ adjustAmount: '', nonReasonClass: '' }],
                            nightOperator: '',
                            nonReasonClass: '',
                            nonReasons: '',
                            oneOffSuc: '',
                            qualTime: '',
                            remark: '',
                            sampleTime: '',
                            stirringTime: ''
                        };
                    }
                    this.RecordDialogTableVisible = true;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        //  RowDelFlag
        RowDelFlag1({ row }) {
            if (row.materielType === 'BL_LY') {
                return 'rowDel';
            } else if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        RowDelFlag2({ row }) {
            if (row.materielType !== 'BL_LY') {
                return 'rowDel';
            }
                return '';

        },
        RecordSave(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.record.oneOffSuc === '否') {
                        if (this.record.nonReasons === '' || this.record.Reason[0].nonReasonClass === '') {
                            this.$notify({
                                title: '警告',
                                message: '请选择不合格原因，不合格调整分类',
                                type: 'warning'
                            });
                            return false;
                        }
                    }
                    this.record.Reason.forEach((item, index) => {
                        if (index === 0) {
                            this.record.nonReasonClass = item.nonReasonClass;
                            this.record.adjustAmount = item.adjustAmount;
                        } else if (index === 1) {
                            this.record.nonReasonClassTwo = item.nonReasonClass;
                            this.record.adjustAmountTwo = item.adjustAmount;
                        } else if (index === 2) {
                            this.record.nonReasonClassThree = item.nonReasonClass;
                            this.record.adjustAmountThree = item.adjustAmount;
                        }
                    });
                    if (this.record.Reason.length === 1) {
                        this.record.nonReasonClassTwo = '0';
                        this.record.adjustAmountTwo = '0';
                        this.record.nonReasonClassThree = '0';
                        this.record.adjustAmountThree = '0';
                    }
                    if (this.record.Reason.length === 2) {
                        this.record.nonReasonClassThree = '0';
                        this.record.adjustAmountThree = '0';
                    }
                    this.$http(`${STERILIZED_API.JUICEDRECORDSAVE}`, 'POST', this.record).then(({ data }) => {
                        if (data.code === 0) {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            this.RecordDialogTableVisible = false;
                            this.$refs[formName].resetFields();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss">
// .dialog__class {
//     border-radius: 6px !important;
//     .el-dialog__header {
//         height: 59px;
//         color: #fff;
//         font-size: 20px;
//         background: rgba(24, 144, 255, 1);
//         border-radius: 6px 6px 0 0;
//         .el-dialog__headerbtn .el-dialog__close {
//             color: #fff;
//         }
//     }
// }
</style>
