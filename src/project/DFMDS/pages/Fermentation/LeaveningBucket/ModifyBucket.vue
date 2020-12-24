<template>
    <div>
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="isTableDialogVisible" width="400px">
            <div class="inner-area">
                <div class="inner-area__title">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-radio-group v-model="tabType" @change="changeTab">
                                <el-radio label="modify">
                                    调整
                                </el-radio>
                                <el-radio label="convert">
                                    转存
                                </el-radio>
                                <el-radio label="move">
                                    挪罐
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="inner-area__body">
                    <el-tabs v-model="tabType">
                        <el-tab-pane label="调整" name="modify">
                            <el-form :model="modifyDataGroup" size="small" label-width="110px" class="orderMangedialog markStyle">
                                <el-form-item label="容器号：">
                                    <span class="default">{{ modifyDataGroup.holderName }}</span>
                                </el-form-item>
                                <el-form-item label="状态：">
                                    <span class="default">{{ modifyDataGroup.fermentorStatusName }}</span>
                                </el-form-item>
                                <el-form-item label="物料：">
                                    <el-select v-model="modifyDataGroup.materialCode" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="批次：">
                                    <el-select v-model="modifyDataGroup.batch" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="出/入罐：" class="star">
                                    <el-select v-model="modifyDataGroup.inOutFlag" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in inOutStatus"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="类别调整：" class="star">
                                    <el-select v-model="modifyDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="调整量：" class="star">
                                    <el-input v-model.trim="modifyDataGroup.a" placeholder="请输入" clearable>
                                        <span slot="suffix">KG</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="调整操作人：">
                                    <div class="required" style="min-height: 32px; line-height: 32px;">
                                        <span style="cursor: pointer;" @click="selectUser(modifyDataGroup)">
                                            <em v-for="(item, index) in splitString(modifyDataGroup.operators)" :key="index">{{ item }}，</em>
                                            <em>点击选择人员</em>
                                        </span>
                                    </div>
                                </el-form-item>

                                <el-form-item label="备注：">
                                    <el-input v-model.trim="modifyDataGroup.remark" placeholder="请输入" clearable />
                                </el-form-item>
                                <el-form-item label="操作人：">
                                    <span class="default">{{ modifyDataGroup.changer }}</span>
                                </el-form-item>
                                <el-form-item label="操作时间：">
                                    <span class="default">{{ modifyDataGroup.changed }}</span>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="转存" name="convert">
                            <el-form :model="convertDataGroup" size="small" label-width="110px" class="orderMangedialog markStyle">
                                <el-form-item label="容器号：">
                                    <span class="default">{{ convertDataGroup.holderName }}</span>
                                </el-form-item>
                                <el-form-item label="状态：">
                                    <span class="default">{{ convertDataGroup.fermentorStatusName }}</span>
                                </el-form-item>
                                <el-form-item label="物料：">
                                    <el-select v-model="convertDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="批次：">
                                    <el-select v-model="convertDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="领用量：" class="star">
                                    <el-input v-model.trim="convertDataGroup.a" placeholder="请输入" clearable style="width: 100%;">
                                        <span slot="suffix">KG</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="打入罐类别：" class="star">
                                    <el-select v-model="convertDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="打入罐号：" class="star">
                                    <el-select v-model="convertDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="打入物料：" class="star">
                                    <span class="default">{{ convertDataGroup.a }}</span>
                                </el-form-item>
                                <el-form-item label="打入批次：" class="star">
                                    <span class="default">{{ convertDataGroup.a }}</span>
                                </el-form-item>

                                <el-form-item label="转存操作人：">
                                    <div class="required" style="min-height: 32px; line-height: 32px;">
                                        <span style="cursor: pointer;" @click="selectUser(convertDataGroup)">
                                            <em v-for="(item, index) in splitString(convertDataGroup.operators)" :key="index">{{ item }}，</em>
                                            <em>点击选择人员</em>
                                        </span>
                                    </div>
                                </el-form-item>

                                <el-form-item label="备注：">
                                    <el-input v-model.trim="convertDataGroup.remark" placeholder="请输入" clearable />
                                </el-form-item>
                                <el-form-item label="操作人：">
                                    <span class="default">{{ convertDataGroup.changer }}</span>
                                </el-form-item>
                                <el-form-item label="操作时间：">
                                    <span class="default">{{ convertDataGroup.changed }}</span>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="挪罐" name="move">
                            <el-form :model="moveDataGroup" size="small" label-width="110px" class="orderMangedialog markStyle">
                                <el-form-item label="容器号：">
                                    <span class="default">{{ moveDataGroup.holderName }}</span>
                                </el-form-item>
                                <el-form-item label="状态：">
                                    <span class="default">{{ moveDataGroup.fermentorStatusName }}</span>
                                </el-form-item>
                                <el-form-item label="生产物料：">
                                    <el-select v-model="moveDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="批次：">
                                    <el-select v-model="moveDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="挪入罐类别：" class="star">
                                    <el-select v-model="moveDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="挪入罐号：" class="star">
                                    <el-select v-model="moveDataGroup.a" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="挪入批次：">
                                    <el-input v-model.trim="moveDataGroup.a" placeholder="请输入" clearable />
                                </el-form-item>

                                <el-form-item label="挪罐操作人：">
                                    <div class="required" style="min-height: 32px; line-height: 32px;">
                                        <span style="cursor: pointer;" @click="selectUser(moveDataGroup)">
                                            <em v-for="(item, index) in splitString(moveDataGroup.operators)" :key="index">{{ item }}，</em>
                                            <em>点击选择人员</em>
                                        </span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="备注：">
                                    <el-input v-model.trim="moveDataGroup.remark" placeholder="请输入" clearable />
                                </el-form-item>
                                <el-form-item label="操作人：">
                                    <span class="default">{{ moveDataGroup.changer }}</span>
                                </el-form-item>
                                <el-form-item label="操作时间：">
                                    <span class="default">{{ moveDataGroup.changed }}</span>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="clearImportBucket">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" @click="comfirmImportBucket">
                        确定
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 投料人员 -->
        <loaned-personnel v-if="isLoanedPersonnelStatusDialogVisible" ref="loanedPersonnel" :org-tree="orgTree" :arr-list="arrList" @changeUser="changeUser" />
    </div>
</template>
<script lang="ts">

        // 空罐 E
        // 入料中 R (投料)

        import { Vue, Component } from 'vue-property-decorator';
        import { dateFormat, getUserNameNumber } from 'utils/utils';
        import LoanedPersonnel from 'components/LoanedPersonnelv1.vue';
        import { COMMON_API, FER_API } from 'common/api/api';
        // import _ from 'lodash';
        // import { dateFormat } from 'utils/utils';

        @Component({
            name: 'ModifyBucketIndex',
            components: {
                LoanedPersonnel
            }
        })
        export default class ModifyBucketIndex extends Vue {
            $refs: {
                loanedPersonnel: HTMLFormElement;
            }

            // title
            dialogTitle=''


            currentTab='调整' // 当前 tab
            tabType='modify'
            currentFermentorStatusName=''
            currentItem: ItemObject={}
            inOutStatus: Options[]=[]

            currentWorkShop=''

            options=[
                {
                    dicCode: '',
                    dicValue: ''
                }
            ]


            // 点击赋予 item info
            currentCycle=''
            currentHolderId=''
            currentHolderName=''
            drumStageOptions: Options[]=[]

            // 当前 row
            currentRowIndex=0

            modifyDataGroup: ItemObject={
            } // modify data

            convertDataGroup: ItemObject={

            } // convert data

            moveDataGroup: ItemObject={

            } // move data


            isTableDialogVisible = false;
            isLoanedPersonnelStatusDialogVisible = false; // 选人
            orgTree: object[] = [];
            arrList: string[] = [];

            mounted() {
                // 获取组织树
                this.getTree();
                // 数据字典出入罐
                this.getInOutStatus();
            }

            // 数据字典出入罐
            getInOutStatus() {
                COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' }).then(({ data }) => {
                    this.inOutStatus = data.data
                });
            }

            // 获取物料
            getMaterial() {
                COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' }).then(({ data }) => {
                    this.inOutStatus = data.data
                });
            }

            changeTab(val) {
                console.log(val)
                if (val === 'modify') { // 调整
                    this.currentTab = '调整'
                } else if (val === 'convert') { // 转存
                    this.currentTab = '转存'
                } else { // 挪罐
                    this.currentTab = '挪罐'
                }
                this.dialogTitle = this.currentHolderName + this.currentTab
            }

            // 获取当前年月日 (年两位) 201010
            getNowFormatDate() {
                const date = new Date();
                const year = String(date.getFullYear());
                let month: string|number = date.getMonth() + 1;
                let strDate: number|string = date.getDate();
                if (Number(month) >= 1 && Number(month) <= 9) {
                    month = '0' + String(month);
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate;
                }
                const currentdate = year.substr(2, 2) + month + strDate;
                return currentdate;
            }


            splitString(str) {
                if (str !== '') {
                    return str.split(',')
                }
                return []
            }

            // 入罐
            async init(item) {
                console.log('入罐')
                console.log(item)
                this.currentItem = item

                this.isTableDialogVisible = true
                this.currentWorkShop = item.workshop
                this.currentCycle = item.cycle
                this.currentHolderId = item.holderId //
                this.currentHolderName = item.holderName //
                this.currentFermentorStatusName = item.fermentorStatusName //

                this.dialogTitle = this.currentHolderName + this.currentTab
                this.setData();
            }

            setData() {
                this.modifyDataGroup = {
                    holderName: this.currentHolderName,
                    holderId: '',
                    fermentorStatusName: this.currentFermentorStatusName,
                    material: '',
                    materialCode: '',
                    materialName: '',
                    batch: '',
                    inOutFlag: '',
                    moveAmount: null,
                    moveType: '',
                    operators: '',
                    orderNo: '',
                    remark: this.currentItem.remark,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber()
                } // modify data

                this.convertDataGroup = {
                    holderName: this.currentHolderName,
                    fermentorStatusName: this.currentFermentorStatusName,
                    material: '',
                    materialCode: '',
                    materialName: '',
                    batch: '',
                    operators: '',
                    remark: this.currentItem.remark,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber()
                } // convert data

                this.moveDataGroup = {
                    holderName: this.currentHolderName,
                    holderId: '',
                    fermentorStatusName: this.currentFermentorStatusName,
                    material: '',
                    materialCode: '',
                    materialName: '',
                    batch: '',
                    operators: '',
                    orderNo: '',
                    remark: this.currentItem.remark,
                    sourceHolderId: '',
                    targetHolderId: '',
                    targetHolderType: '',
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber()
                } // move data
            }

            getCyMatiral() {
                FER_API.FER_FERMENTOR_CY_SAVE_API({
                            cycle: this.currentCycle,
                            holderId: this.currentHolderId
                        }).then(() => {
                            this.$successToast('保存成功');

                        });
            }

            getBatch() {
                FER_API.FER_FERMENTOR_CY_SAVE_API({
                            cycle: this.currentCycle,
                            holderId: this.currentHolderId
                        }).then(() => {
                            this.$successToast('保存成功');

                        });
            }

            changeProdcutMaterialOption(val) {

                if (val !== '') {
                    //this.CYProdcutMaterial = this.options.filter(item => item.dictCode === val)[0].dictValue as string
                }

            }

            // 员工确认
            changeUser(item) {
                if (this.tabType === 'modify') {
                    this.modifyDataGroup.operators = item.join(',')
                } else if (this.tabType === 'convert') {
                    this.convertDataGroup.operators = item.join(',')

                } else if (this.tabType === 'move') {
                    this.moveDataGroup.operators = item.join(',')
                }
                this.isLoanedPersonnelStatusDialogVisible = false;
            }

            // 选择人员 正式借调
            selectUser(row) {
                this.isLoanedPersonnelStatusDialogVisible = true;
                // this.currentRowIndex = index
                this.$nextTick(() => {
                    if (this.tabType === 'modify') {
                        this.$refs.loanedPersonnel.init(row.operators, '调整操作人');
                    } else if (this.tabType === 'convert') {
                        this.$refs.loanedPersonnel.init(row.operators, '转存操作人');
                    } else if (this.tabType === 'move') {
                        this.$refs.loanedPersonnel.init(row.operators, '挪罐操作人');
                    }
                });
            }

            // 获取组织结构树
            getTree() {
                COMMON_API.ORGSTRUCTURE_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
                }).then(({ data }) => {
                    this.orgTree = data.data;
                });
            }


            // 入罐确认
            comfirmImportBucket() {

                if (this.tabType === 'modify') {

                        if (this.ruleSubmit()) {
                        const obj = {}
                        const deleteItemsArray: string[] = []
                        const insertListArray: CurrentLyDataTable[] = []
                        const updateListArray: CurrentLyDataTable[] = []

                        FER_API.FER_FERMENTOR_LY_SAVE_API({
                            cycle: this.currentCycle,
                            holderId: this.currentHolderId,
                            deleteIds: deleteItemsArray,
                            insertList: insertListArray,
                            updateList: updateListArray
                        }).then(() => {
                            this.$successToast('保存成功');
                            this.$emit('drumBucketFinish', obj);
                            this.isTableDialogVisible = false
                        });
                    }


                } else if (this.tabType === 'convert') {
                    if (this.ruleSubmit()) {
                        const obj = {}
                        const deleteItemsArray: string[] = []
                        const insertListArray: CurrentCyDataTable[] = []
                        const updateListArray: CurrentCyDataTable[] = []
                        FER_API.FER_FERMENTOR_CY_SAVE_API({
                            cycle: this.currentCycle,
                            holderId: this.currentHolderId,
                            deleteIds: deleteItemsArray,
                            insertList: insertListArray,
                            updateList: updateListArray
                        }).then(() => {
                            this.$successToast('保存成功');
                            this.$emit('drumBucketFinish', obj);
                            this.isTableDialogVisible = false
                        });
                    }
                } else if (this.tabType === 'move') {
                    if (this.ruleSubmit()) {
                        const obj = {}
                        const deleteItemsArray: string[] = []
                        const insertListArray: CurrentCyDataTable[] = []
                        const updateListArray: CurrentCyDataTable[] = []
                        FER_API.FER_FERMENTOR_CY_SAVE_API({
                            cycle: this.currentCycle,
                            holderId: this.currentHolderId,
                            deleteIds: deleteItemsArray,
                            insertList: insertListArray,
                            updateList: updateListArray
                        }).then(() => {
                            this.$successToast('保存成功');
                            this.$emit('drumBucketFinish', obj);
                            this.isTableDialogVisible = false
                        });
                    }
                }
            }

            clearImportBucket() {
                this.isTableDialogVisible = false
            }

            // 提交时跑校验
            ruleSubmit() {
                if (this.tabType === 'modify') {

                    // if (this.modifyDataGroup.length === 0 && this.modifyDataGroup.filter(it => it.delFlag !== 1).length === 0) {
                    //     this.$warningToast('请录入LY');
                    //     return false
                    // }

                    // // 表格栏位
                    // for (const item of this.modifyDataGroup.filter(it => it.delFlag !== 1)) {
                    //     if (!item.lyDate || !item.lyMans) {
                    //         this.$warningToast('请填写LY必填项');
                    //         return false
                    //     }
                    // }
                } else if (this.tabType === 'convert') {
                    // if (this.convertDataGroup.length === 0 && this.convertDataGroup.filter(it => it.delFlag !== 1).length === 0) {
                    //     this.$warningToast('请录入CY');
                    //     return false
                    // }

                    // // 表格栏位
                    // for (const item of this.convertDataGroup.filter(it => it.delFlag !== 1)) {
                    //     if (!item.cyAmount || !item.cyBatch || !item.cyMans) {
                    //         this.$warningToast('请填写CY必填项');
                    //         return false
                    //     }
                    // }
                } else if (this.tabType === 'move') {
                    //
                }

                return true
            }
        }


    interface Options{
        dictCode?: string;
        dictValue?: string;
    }

    interface ProductMaterial{
        dictCode?: string;
        dictValue?: string;
        id?: string;
    }

    //  这里的 cycle 类型跟其他接口有问题，现阶段用不到，所以不追究
    interface CurrentLyDataTable{
        changed: string;
        changer: string;
        cycle?: number;
        fermentorId: string;
        id?: string;
        lyDate: string;
        lyMans: string;
        remark: string;
        delFlag: number;
    }

    interface CurrentCyDataTable{
        changed: string;
        changer: string;
        checkStatus: string;
        checkStatusName: string;
        cyAmount: number;
        cyBatch: string;
        cyMans: string;
        cycle?: string;
        fermentorId: string;
        id?: string;
        injectionPotId: string;
        injectionPotName: string;
        injectionPotNo: string;
        remark: string;
        delFlag: number;
    }
    interface HeaderInfo {
        fermentorStatus: string;
        holderName: string;
        fermentorStatusName: string;
        holderId: string;
    }

    interface ItemObject {
        brineFlag?: string;
        brineFlagName?: string;
        changed?: string;
        changer?: string;
        batch?: string;
        currentStock?: number;
        cycle?: string;
        moveAmount?: number|null;
        material?: string;
        sourceHolderId?: string;
        operators?: string;
        moveType?: string;
        targetHolderId?: string;
        inOutFlag?: string;
        fermentDays?: number;
        fermentorStatus?: string;
        fermentorStatusName?: string;
        targetHolderType?: string;
        freezeFlag?: string;
        fullDate?: string;
        holderId?: string;
        holderName?: string;
        holderNo?: string;
        holderType?: string;
        holderTypeName?: string;
        holderVolume?: number;
        id?: string;
        intoDate?: string;
        judgeResult?: string;
        judgeResultName?: string;
        materialCode?: string;
        materialName?: string;
        matureFlag?: string;
        openFlag?: string;
        orderNo?: string;
        remark?: string;
        volumePercent?: number;
        workShop?: string;
    }

</script>
<style scoped>
.markStyle >>> th .notNull::before {
    margin-right: 4px;
    color: #f00;
    content: "*";
}
.markStyle >>> th .notNull {
    color: #333;
}

.markStyle >>> .star .el-form-item__label::before {
    margin-right: 4px;
    color: #f56c6c;
    content: "*";
}

.el-pagination >>> .el-pager li.active {
    width: 24px;
    min-width: auto;
    height: 24px;
    color: #fff;
    line-height: 24px;
    background: rgba(72, 123, 255, 1);
    border-radius: 4px;
    cursor: default;
}

.header_main >>> .el-dialog .el-dialog__body {
    padding: 20px;
}

.header_main >>> .el-dialog .el-date-editor .el-input__prefix {
    background: transparent;
}

.inner-area__body >>> .el-checkbox__inner {
    position: relative;
    z-index: 1;
    display: inline-block;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #1b91ff;
    border-radius: 10px;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.inner-area__body >>> .el-checkbox__inner::after {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: #1b91ff;
    border: none;
    border: 0;
    border-radius: 4px;
    transform: rotate(0deg) scaleY(0);
    transform-origin: center;
    transition: transform 0.15s ease-in 0.05s;
    content: "";
}

.inner-area__body >>> .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: rotate(0deg) scaleY(1);
}

.inner-area__body >>> .el-tabs__header {
    display: none;
}


</style>

<style lang="scss" scoped>
    .el-form-item {
        margin-bottom: 10px;
    }
    .inner-area {
        .inner-area__title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            h3 {
                font-weight: bold;
                font-size: 14px !important;
                line-height: 32px;
                .title-icon {
                    display: inline-block;
                    width: 4px;
                    height: 12px;
                    margin-top: 10px;
                    margin-right: 5px;
                    background: #487bff;
                    border-radius: 2px;
                }
                .point-icon {
                    width: 5px;
                    height: 5px;
                    margin-top: 13px;
                    margin-right: 5px;
                    background: #487bff;
                    border-radius: 3px;
                }
            }
        }
        .inner-area__body {
            .table-style-light {
                .el-table__header {
                    th {
                        color: white;
                        text-align: center;
                        background: #e8e8e8;
                        background-color: #e8e8e8 !important;
                        border-top: none;
                        border-right: none;
                        border-bottom: none;
                        border-left: none;
                    }
                }
                .el-table__body {
                    td {
                        padding: 0;
                    }
                }
                tr:nth-child(even) {
                    background-color: #f7f7f7;
                }
                .el-table__row {
                    td:first-child {
                        border-left: 2px solid transparent;
                    }
                }
                .hover-row {
                    td:first-child {
                        border-left: 2px solid #e8e8e8;
                    }
                }
                .el-table__row:hover {
                    td:first-child {
                        border-left: 2px solid #e8e8e8;
                    }
                }

                .el-input.is-disabled .el-input__inner {
                    width: 100%;
                    overflow: hidden;
                    color: #666 !important;
                    background: none;
                    border: none;
                }
            }
        }
    }

    .default {
        display: block;
        padding: 2px 20px;
        background: #f5f5f5;
        border-radius: 4px;
    }
    .card-bucket {
        margin-bottom: 10px;
        background: #fff;
        border: 1px solid rgba(171, 171, 171, 0.5);
        border-radius: 8px;
        -webkit-box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
        .card-bucket__head {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 11px 10px;
            font-size: 14px;
            border-bottom: 1px #e8e8e8 solid;

            .el-button {
                font-size: 12px;
                &::after {
                    content: ">>";
                }
            }
        }
        .card-bucket__content {
            display: flex;
            padding: 6px;
            .bucket-image {
                display: flex;
                flex: 2;
                justify-content: center;
                .pot_border {
                    position: relative;
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                    .pot {
                        position: absolute;
                        top: 0;
                        z-index: 10;
                        width: 100%;
                        height: 200px;
                        // background: url(./assets/img/ferPotNew.png) no-repeat;
                        background: url("~@/assets/img/ferPotNew.png") no-repeat;
                        background-size: contain;
                    }
                    .pot_water {
                        position: absolute;
                        bottom: 13px;
                        width: 114px;
                        height: 200px;
                        &_sole {
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            overflow: hidden;
                            border-top: none;
                        }
                        &_sole::before,
                        &_sole::after {
                            position: absolute;
                            bottom: 100%;
                            left: 50%;
                            width: 300px;
                            height: 290px;
                            background-color: #fff;
                            border-radius: 55% 45%;
                            transform: translate(-50%, -70%) rotate(0);
                            content: "";
                        }
                        &_sole::after {
                            border-radius: 55% 45%;
                            transform: translate(70%, -50%) rotate(0);
                            opacity: 0.3;
                        }
                    }
                    &:hover {
                        .pot_water_sole::after {
                            animation: rotate 5s linear infinite;
                        }
                        .pot_water_sole::before {
                            animation: rotate 4.5s linear infinite;
                        }
                    }

                    @keyframes rotate {
                        0% {
                            transform: translate(-50%) rotateZ(0deg);
                        }
                        100% {
                            transform: translate(-50%) rotateZ(360deg);
                        }
                    }
                }
            }
            .btn-group {
                display: flex;
                flex: 1;
                flex-flow: column;
                justify-content: center;
                .el-button {
                    display: inline-block;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    margin: 0;
                    margin-bottom: 14px;
                    padding: 8px 16px;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 1;
                }
            }
        }
        .card-bucket__fotter {
            padding: 10px 10px 0;
            font-weight: 600;
            font-size: 12px;

            > div {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
            }
        }
    }

    .dialog-footer {
        margin-top: 10px;
        text-align: right;
    }


</style>
