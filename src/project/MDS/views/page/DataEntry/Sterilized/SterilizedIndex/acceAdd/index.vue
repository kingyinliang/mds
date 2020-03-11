<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-row type="flex">
                <el-col>
                    <form-head :formHeader="formHeader" />
                </el-col>
                <el-col style="width: 100px;">
                    <div
                        style="padding-top: 0; float: right;"
                        :style="{
                            color: orderStatus === 'noPass' ? 'red' : '',
                        }"
                    >
                        <span
                            style="width: 5px; height: 5px; float: left; background: #1890ff; border-radius: 50%; margin-top: 7px; margin-right: 3px;"
                            :style="{
                                background: orderStatus === 'noPass' ? 'red' : '#1890FF',
                            }"
                        />{{ orderStatus === 'noPass' ? '审核不通过' : orderStatus === 'saved' ? '已保存' : orderStatus === 'submit' ? '已提交' : orderStatus === 'checked' ? '通过' : orderStatus === '已同步' ? '未录入' : '未录入' }}
                    </div>
                </el-col>
                <img v-if="supStatus" src="@/assets/img/zhang.png" alt="" class="sup-status">
            </el-row>
            <el-row style="text-align: right; position: absolute; bottom: 10px; right: 20px;" class="buttonCss">
                <template style="float: right; margin-left: 10px;">
                    <el-button type="primary" class="button" size="small" @click="Refresh">
                        刷新
                    </el-button>
                    <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('ste:supMaterial:mySaveOrUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                        {{ isRedact ? '取消' : '编辑' }}
                    </el-button>
                </template>
                <template v-if="isRedact" style="float: right; margin-left: 10px;">
                    <el-button v-if="isAuth('ste:supMaterial:mySaveOrUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('ste:supMaterial:submit')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </el-row>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    辅料添加
                </span>
                <el-card class="newCard">
                    <div class="clearfix" style="padding-top: 5px; padding-bottom: 5px;">
                        <h3 style="line-height: 32px;">
                            辅料添加记录
                        </h3>
                        <el-button v-if="isAuth('ste:supMaterial:mySaveOrUpdate')" type="primary" size="mini" style="float: right;" :disabled="!isRedact" @click="addOver(multipleSelectionAddSup, 'addSup')">
                            添加完成
                        </el-button>
                    </div>
                    <el-table headerRowClassName="tableHead" :data="AddSupDate" :rowClassName="RowDelFlag" border tooltipEffect="dark" @selection-change="handleSelectionChangeAddSup">
                        <el-table-column type="selection" :selectable="CheckBoxA" width="40" />
                        <el-table-column type="index" width="55" label="序号" :showOverflowTooltip="true" />
                        <el-table-column label="状态" width="100">
                            <template slot-scope="scope">
                                <div
                                    :class="{
                                        reds: scope.row.status === 'noPass',
                                        che: scope.row.status === 'checked',
                                    }"
                                >
                                    {{ scope.row.status === 'noPass' ? '不通过' : scope.row.status === 'saved' ? scope.row.addStatus : scope.row.status === 'submit' ? '已提交' : scope.row.status === 'checked' ? '通过' : scope.row.addStatus }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="物料"
                            :showOverflowTooltip="true"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="需求数量" width="80" prop="adjustAmount" :showOverflowTooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.supStatus === '已推送' ? scope.row.adjustAmount : scope.row.supStatus === '已确认' ? scope.row.adjustAmount : scope.row.adjustAmountPro }}
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" width="50" prop="unit" :showOverflowTooltip="true" />
                        <el-table-column label="操作" width="65">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="scope.row.isSplit === '0'"
                                    type="text"
                                    size="mini"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (scope.row.status !== 'submit' && scope.row.status !== 'checked')))"
                                    @click="addData(scope.row, scope.$index, AddSupDate)"
                                >
                                    <i class="icons iconfont factory-chaifen" />拆分
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column width="125">
                            <template slot="header">
                                <i class="reqI">*</i><span>批次</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input
                                    v-model="scope.row.batch"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))"
                                    placeholder="请输入"
                                    maxlength="10"
                                    size="mini"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="领用数量" width="100">
                            <template slot="header">
                                <i class="reqI">*</i><span>领用数量</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.receiveAmount" :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))" placeholder="请输入" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))" placeholder="请输入" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="115" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="isAuth('ste:supMaterial:mySaveOrUpdate')"
                                    type="text"
                                    size="mini"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))"
                                    @click="addOver(multipleSelectionAddSup, 'addSup', scope.row)"
                                >
                                    添加完成
                                </el-button>
                                <el-button
                                    v-if="scope.row.isSplit !== '0'"
                                    type="text"
                                    size="mini"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))"
                                    @click="delRow(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="newCard">
                    <div class="clearfix" style="padding-top: 5px; padding-bottom: 5px;">
                        <h3 style="line-height: 32px;">
                            增补料记录
                        </h3>
                        <el-button v-if="isAuth('ste:supMaterial:mySaveOrUpdate')" type="primary" size="mini" style="float: right;" :disabled="!isRedact" @click="addOver(multipleSelectionSup, 'Sup')">
                            添加完成
                        </el-button>
                    </div>
                    <el-table headerRowClassName="tableHead" :data="SupDate" :rowClassName="RowDelFlag" border tooltipEffect="dark" @selection-change="handleSelectionChangeSup">
                        <el-table-column type="selection" :selectable="CheckBoxA" width="34" />
                        <el-table-column type="index" width="55" label="序号" />
                        <el-table-column label="状态" width="100">
                            <template slot-scope="scope">
                                {{ scope.row.status === 'noPass' ? '不通过' : scope.row.status === 'saved' ? scope.row.addStatus : scope.row.status === 'submit' ? '已提交' : scope.row.status === 'checked' ? '通过' : scope.row.addStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="物料"
                            :showOverflowTooltip="true"
                        >
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="添加数量" width="80" prop="addAmount" :showOverflowTooltip="true" />
                        <el-table-column label="单位" width="50" prop="unit" :showOverflowTooltip="true" />
                        <el-table-column label="操作" width="65">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="scope.row.isSplit === '0'"
                                    type="text"
                                    size="mini"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (scope.row.status !== 'submit' && scope.row.status !== 'checked')))"
                                    @click="addData(scope.row, scope.$index, SupDate)"
                                >
                                    <i class="icons iconfont factory-chaifen" />拆分
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column width="125">
                            <template slot="header">
                                <i class="reqI">*</i><span>批次</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input
                                    v-model="scope.row.batch"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))"
                                    placeholder="请输入"
                                    maxlength="10"
                                    size="mini"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column label="领用数量" width="100">
                            <template slot="header">
                                <i class="reqI">*</i><span>领用数量</span>
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.receiveAmount" :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))" placeholder="请输入" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" width="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))" placeholder="请输入" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="115" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="isAuth('ste:supMaterial:mySaveOrUpdate')"
                                    type="text"
                                    size="mini"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))"
                                    @click="addOver(multipleSelectionSup, 'Sup', scope.row)"
                                >
                                    添加完成
                                </el-button>
                                <el-button
                                    v-if="scope.row.isSplit !== '0'"
                                    type="text"
                                    size="mini"
                                    :disabled="!(isRedact && (scope.row.status === 'noPass' || (isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked' && scope.row.addStatus !== '已添加')))"
                                    @click="delRow(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <auditLog :tableData="DataAudit" />
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    异常记录
                </span>
                <exc-record ref="excrecord" :isRedact="isRedact" :order="formHeader" />
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label" class="spanview">
                    文本记录
                </span>
                <text-record ref="textrecord" :isRedact="isRedact" />
            </el-tab-pane>
        </el-tabs>
        <el-dialog width="400px" title="添加确认" class="ShinHoDialog" :closeOnClickModal="false" :visible.sync="visible">
            <div
                style="height: 160px; overflow-y: initial;"
                :style="{
                    'overflow-y': addSupOverData.length > 5 || SupOverData.length > 5 ? 'scroll' : 'initial',
                }"
            >
                <p v-for="(item, index) in addSupOverData" :key="index" style="line-height: 20px; margin-bottom: 8px;">
                    {{ item.materialCode + ' ' + item.materialName }}已经添加{{ item.receiveAmount + item.unit }},确认添加完成！
                </p>
                <p v-for="(item, index) in SupOverData" :key="index" style="line-height: 20px; margin-bottom: 8px;">
                    {{ item.materialCode + ' ' + item.materialName }}已经添加{{ item.receiveAmount + item.unit }},确认添加完成！
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="addOverTo()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
import { STERILIZED_API } from '@/api/api';
import { Stesave } from '@/net/validate';
export default {
    name: 'Index',
    components: {
        ExcRecord,
        TextRecord,
        FormHead: resolve => {
            require(['../components/formHead'], resolve);
        },
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    data() {
        return {
            visible: false,
            isRedact: false,
            supStatus: false,
            formHeader: {},
            activeName: '1',
            orderStatus: '',
            multipleSelectionAddSup: [],
            AddSupDate: [],
            multipleSelectionSup: [],
            SupDate: [],
            DataAudit: [],
            addSupOverData: [],
            SupOverData: []
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        }
    },
    mounted() {
        this.GetOrderHead();
    },
    methods: {
        Refresh() {
            this.GetOrderHead();
            // this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Sterilized-SterilizedIndex-acceAdd-index')
            // if (this.mainTabs.length >= 1) {
            //   // 当前选中tab被删除
            //   if (this.mainTabsActiveName === 'DataEntry-Sterilized-SterilizedIndex-acceAdd-index') {
            //     this.$router.push({name: this.mainTabs[this.mainTabs.length - 1].name}, () => {
            //       this.mainTabsActiveName = this.$route.name
            //     })
            //   }
            // } else {
            //   this.menuActiveName = ''
            //   this.$router.push({name: 'home'})
            // }
            // this.$nextTick(() => {
            //   this.$router.push({name: 'DataEntry-Sterilized-SterilizedIndex-acceAdd-index'})
            // })
        },
        GetDataList() {
            this.$http(`${STERILIZED_API.STE_ENTER_SUP_LIST_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.acceOrderId,
                factory: this.$store.state.common.sterilized.acceFactory,
                orderNo: this.$store.state.common.sterilized.acceOrderNo,
                materialCode: this.formHeader.materialCode
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.steSupMaterialBean.resultList) {
                        this.AddSupDate = data.steSupMaterialBean.resultList;
                    }
                    if (data.steSupMaterialBean.supList) {
                        this.SupDate = data.steSupMaterialBean.supList;
                    }
                    const c = this.AddSupDate.concat(this.SupDate);
                    this.DataAudit = data.vList;
                    this.supStatus = true;
                    if (c.length > 0) {
                        c.forEach(items => {
                            if (items.supStatus !== '已确认') {
                                this.supStatus = false;
                            }
                        });
                    } else {
                        this.supStatus = false;
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 拆分
        addData(row, index, data) {
            data.splice(index + 1, 0, {
                addAmount: row.addAmount,
                // addStatus: '未添加',
                addStatus: row.addStatus,
                adjustAmount: row.adjustAmount,
                adjustAmountPro: row.adjustAmountPro,
                batch: '',
                delFlag: '0',
                diffAmount: row.diffAmount,
                id: '',
                isOperation: row.isOperation,
                isSplit: '1',
                isSupplement: row.isSupplement,
                materialCode: row.materialCode,
                materialName: row.materialName,
                orderId: row.orderId,
                planAmount: row.planAmount,
                receiveAmount: '',
                remark: '',
                status: '',
                supStatus: row.supStatus,
                unit: row.unit
            });
        },
        setAmount(row) {
            // row.adjustAmount = row.receiveAmount
        },
        // 添加完成
        addOver(data, str, row) {
            this.addSupOverData = [];
            this.SupOverData = [];
            if (row) {
                str === 'addSup' ? (this.addSupOverData = [row]) : (this.SupOverData = [row]);
                if (!this.dataRul(this.addSupOverData, 'AddSupDate', true)) {
                    return;
                }
                this.visible = true;
            } else if (data.length > 0) {
                    str === 'addSup' ? (this.addSupOverData = data) : (this.SupOverData = data);
                    if (!this.dataRul(this.SupOverData, 'SupDate', true)) {
                        return;
                    }
                    this.visible = true;
                } else {
                    this.$warning_SHINHO('请选择数据');
                }
        },
        // 添加完成确认
        addOverTo() {
            if (!this.dataRul(this.addSupOverData, 'AddSupDate', true)) {
                return;
            }
            if (!this.dataRul(this.SupOverData, 'SupDate', true)) {
                return;
            }
            this.addSupOverData.forEach(item => {
                item.addStatus = '已添加';
                item.status = 'saved';
            });
            this.SupOverData.forEach(item => {
                item.addStatus = '已添加';
                item.status = 'saved';
            });
            this.$http(`${STERILIZED_API.STE_ENTER_SUP_UPDATE_API}`, 'POST', {
                resultList: this.AddSupDate,
                supList: this.SupDate
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.visible = false;
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success'
                    });
                    this.GetOrderHead(true);
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        delRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelectionAddSup.length > 0) {
                    this.multipleSelectionAddSup.forEach((item, index) => {
                        if (item === row) {
                            this.multipleSelectionAddSup.splice(index, 1);
                        }
                    });
                    this.multipleSelectionSup.forEach((item, index) => {
                        if (item === row) {
                            this.multipleSelectionSup.splice(index, 1);
                        }
                    });
                }
                row.delFlag = '1';
            });
        },
        //  RowDelFlag
        RowDelFlag({ row, rowIndex }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                if (row.isOperation === '1') {
                    return 'yellow-row';
                }
                    return '';


        },
        // 辅料添加多选
        handleSelectionChangeAddSup(val) {
            this.multipleSelectionAddSup = [];
            val.forEach((item, index) => {
                if (item.delFlag !== '1') {
                    this.multipleSelectionAddSup.push(item);
                }
            });
        },
        // 增补料多选
        handleSelectionChangeSup(val) {
            this.multipleSelectionSup = [];
            val.forEach((item, index) => {
                if (item.delFlag !== '1') {
                    this.multipleSelectionSup.push(item);
                }
            });
        },
        // 辅料修改
        UpdateSup(str, resolve, reject) {
            this.AddSupDate.forEach(item => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
            });
            this.SupDate.forEach(item => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
            });
            this.$http(`${str === 'saved' ? STERILIZED_API.STE_ENTER_SUP_UPDATE_API : STERILIZED_API.STE_ENTER_SUP_SUBMIT_API}`, 'POST', {
                resultList: this.AddSupDate,
                supList: this.SupDate
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('辅料添加' + data.msg);
                    }
            });
        },
        // 保存提交
        SubmitForm() {
            if (!this.dataRul(this.AddSupDate, 'AddSupDate')) {
                return;
            }
            if (!this.dataRul(this.SupDate, 'SupDate')) {
                return;
            }
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            });
        },
        savedOrSubmitForm(str) {
            const net1 = new Promise((resolve, reject) => {
                this.Stesave.excUpdate(this, 'AddSup', resolve, reject);
            });
            const net2 = new Promise((resolve, reject) => {
                this.Stesave.textUpdate(this, 'AddSup', resolve, reject);
            });
            const net3 = new Promise((resolve, reject) => {
                this.UpdateSup(str, resolve, reject);
            });
            if (str === 'submit') {
                const submitNet = Promise.all([net1, net2, net3]);
                submitNet
                    .then(() => {
                        const net0 = new Promise((resolve, reject) => {
                            this.Stesave.orderUpdate(this, 'supmStatus', str, resolve, reject);
                        });
                        Promise.all([net0])
                            .then(() => {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.GetOrderHead();
                            })
                            .catch(err => {
                                this.$notify.error({
                                    title: '错误',
                                    message: err
                                });
                            });
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            } else {
                const savedNet = Promise.all([net1, net2, net3]);
                savedNet
                    .then(() => {
                        const net0 = new Promise((resolve, reject) => {
                            this.Stesave.orderUpdate(this, 'supmStatus', str, resolve, reject);
                        });
                        Promise.all([net0])
                            .then(() => {
                                this.$notify({
                                    title: '成功',
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.GetOrderHead();
                            })
                            .catch(err => {
                                this.$notify.error({
                                    title: '错误',
                                    message: err
                                });
                            });
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            }
        },
        // 验证
        dataRul(data, data1, st) {
            console.log(data);
            let ty = true;
            for (var item of data) {
                if (item.delFlag === '0') {
                    if (item.adjustAmount === '0' || item.adjustAmount === 0) {
                    } else {
                        if (!item.batch) {
                            ty = false;
                            this.$warning_SHINHO('批次必填');
                            return false;
                        }
                        if (item.batch.length !== 10) {
                            ty = false;
                            this.$warning_SHINHO('批次长度限制10位');
                            return false;
                        }
                    }
                    if (!item.receiveAmount) {
                        ty = false;
                        this.$warning_SHINHO('领用数量必填');
                        return false;
                    }
                    if (!st) {
                        if (item.adjustAmount === '0' || item.adjustAmount === 0) {
                        } else if (item.addStatus !== '已添加') {
                                ty = false;
                                this.$warning_SHINHO('有未添加完成的物料，无法提交！');
                                return false;
                            }
                        // if (item.supStatus !== '已确认') {
                        //   ty = false
                        //   this.$warning_SHINHO('品保未确认')
                        //   return false
                        // }
                    }
                    let sum = 0;
                    let dataArr = [];
                    if (data1 === 'AddSupDate') {
                        dataArr = this.AddSupDate;
                    } else if (data1 === 'SupDate') {
                        dataArr = this.SupDate;
                    }
                    dataArr.forEach(it => {
                        if (it.materialCode === item.materialCode && it.delFlag !== '1') {
                            sum += Number(it.receiveAmount);
                        }
                    });
                    if (data1 === 'AddSupDate') {
                        console.log(sum);
                        if (sum !== Number(item.adjustAmount)) {
                            ty = false;
                            this.$warning_SHINHO('领用数量不等于需求数量');
                        }
                    } else if (data1 === 'SupDate') {
                        console.log(sum);
                        if (item.isSplit === '0') {
                            let addAmount = 0;
                            dataArr
                                .filter(row => row.materialCode === item.materialCode && row.isSplit === '0')
                                .forEach(row => {
                                    addAmount += Number(row.addAmount);
                                });
                            if (sum !== addAmount) {
                                ty = false;
                                this.$warning_SHINHO('领用数量不等于添加数量');
                            }
                        }
                    }
                }
            }
            return ty;
        },
        CheckBoxA(row) {
            if (row.status === 'checked' || row.status === 'submit' || row.addStatus === '已添加') {
                return 0;
            }
                return 1;

        },
        // 获取订单表头
        GetOrderHead(st) {
            this.$http(`${STERILIZED_API.STE_ORDER_HEAD_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.acceOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (!st) {
                        this.isRedact = false;
                    }
                    this.formHeader = data.list[0];
                    this.orderStatus = data.list[0].supmStatus;
                    this.Stesave = new Stesave(this.formHeader);
                    this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    if (this.formHeader.status !== '') {
                        this.GetDataList();
                        this.$refs.excrecord.GetExcDate({
                            order_id: this.formHeader.orderId,
                            sign: 'AddSup'
                        });
                        this.$refs.textrecord.GetText({
                            order_id: this.formHeader.orderId,
                            sign: 'AddSup'
                        });
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        }
    }
};
</script>
<style>
.yellow-row {
    background-color: yellow !important;
}
</style>
<style lang="scss" scoped>
.reds {
    color: red;
}

.che {
    color: rgb(103, 194, 58);
}

.sup-status {
    width: 100px;
    height: 100px;
    position: absolute;
    right: 90px;
    top: 20px;
    transform: rotateZ(-30deg);
}
</style>
