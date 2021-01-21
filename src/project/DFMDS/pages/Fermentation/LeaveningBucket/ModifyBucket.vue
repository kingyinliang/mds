<!--
 * @Description:发酵罐/调整
 * @Anthor: Telliex
 * @Date: 2021-01-15 23:35:23
 * @LastEditors: Telliex
 * @LastEditTime: 2021-01-21 14:26:59
-->
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
                                    <el-select v-model="modifyDataGroup.materialCode" placeholder="请选择" clearable style="width: 100%;" @change="changeMaterialOptions">
                                        <el-option
                                            v-for="item in materialOptions"
                                            :key="item.materialCode"
                                            :label="`${item.materialName} ${item.materialCode}`"
                                            :value="item.materialCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="批次：">
                                    <el-select v-model="modifyDataGroup.batch" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in batchOptions"
                                            :key="item.batch"
                                            :label="item.batch"
                                            :value="item.batch"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="出/入罐：" class="star">
                                    <el-select v-model="modifyDataGroup.inOutFlag" placeholder="请选择" clearable style="width: 100%;" @change="changeInOutFlag">
                                        <el-option
                                            v-for="item in inOutStatusOptions"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="类别调整：" class="star">
                                    <el-select v-model="modifyDataGroup.moveType" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in moveTypeOptions"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="调整量：" class="star">
                                    <el-input v-model.number="modifyDataGroup.moveAmount" placeholder="请输入" clearable>
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
                                    <el-select v-model="convertDataGroup.materialCode" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in materialOptions"
                                            :key="item.materialCode"
                                            :label="`${item.materialName} ${item.materialCode}`"
                                            :value="item.materialCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="批次：">
                                    <el-select v-model="convertDataGroup.batch" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in batchOptions"
                                            :key="item.batch"
                                            :label="item.batch"
                                            :value="item.batch"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="领用量：" class="star">
                                    <el-input v-model.trim="convertDataGroup.moveAmount" placeholder="请输入" clearable style="width: 100%;">
                                        <span slot="suffix">KG</span>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="打入罐类别：" class="star">
                                    <el-select v-model="convertDataGroup.targetHolderType" placeholder="请选择" clearable style="width: 100%;" @change="val=>changeHolderTypeOptions('convert',val)">
                                        <el-option
                                            v-for="item in convertHolderTypeOptions"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="打入罐号：" class="star">
                                    <el-select v-model="convertDataGroup.targetHolderId" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in convertHolderIdOptions"
                                            :key="item.id"
                                            :label="item.holderName"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="打入物料：">
                                    <span class="default">{{ convertDataGroup.convertMaterial }}</span>
                                </el-form-item>
                                <el-form-item label="打入批次：">
                                    <span class="default">{{ convertDataGroup.convertBatch }}</span>
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
                                    <span class="default">{{ moveDataGroup.material }}</span>
                                </el-form-item>
                                <el-form-item label="批次：">
                                    <span class="default">{{ moveDataGroup.batch }}</span>
                                </el-form-item>
                                <el-form-item label="挪入罐类别：" class="star">
                                    <el-select v-model="moveDataGroup.targetHolderType" placeholder="请选择" clearable style="width: 100%;" @change="val=>changeHolderTypeOptions('move',val)">
                                        <el-option
                                            v-for="item in moveHolderTypeOptions"
                                            :key="item.dictCode"
                                            :label="item.dictValue"
                                            :value="item.dictCode"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="挪入罐号：" class="star">
                                    <el-select v-model="moveDataGroup.targetHolderId" placeholder="请选择" clearable style="width: 100%;">
                                        <el-option
                                            v-for="item in moveHolderIdOptions"
                                            :key="item.id"
                                            :label="item.holderName"
                                            :value="item.id"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="挪入批次：" class="star">
                                    <el-input v-model.trim="moveDataGroup.movebatch" placeholder="请输入" clearable />
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
        import { Vue, Component } from 'vue-property-decorator';
        import { dateFormat, getUserNameNumber } from 'utils/utils';
        import LoanedPersonnel from 'components/LoanedPersonnelv1.vue';
        import { COMMON_API, FER_API } from 'common/api/api';

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

            dialogTitle='' // 弹窗 title
            currentTab='调整' // 当前初始 tab
            tabType='modify' // 当前初始 tab type
            currentItem: ItemObject={} // 当前 item

            currentWorkShop=''
            currentCycle=''
            currentHolderId=''
            currentHolderName=''
            currentFermentorStatusName=''

            inOutStatusOptions: Options[]=[] // 出入罐下拉选
            moveTypeOptions: Options[]=[] // 调整类别下拉选
            moveHolderTypeOptions: Options[]=[] // 挪入罐类别下拉选
            convertHolderTypeOptions: Options[]=[] // 打入罐类别下拉选
            moveHolderIdOptions: HolderIdOptions[]=[] // 挪入罐号下拉选
            convertHolderIdOptions: HolderIdOptions[]=[] // 打入罐号下拉选
            materialOptions: MaterialOptions[]=[] // 物料下拉选
            batchOptions: BatchOptions[]=[] // 批次下拉选
            dataOfMateriaBatch: MoveDataOfMateriaBatch={} // 挪罐物料批次

            modifyDataGroup: ItemObject={} // modify data
            convertDataGroup: ItemObject={} // convert data
            moveDataGroup: ItemObject={} // move data

            isTableDialogVisible = false; // 调整弹窗 dialog 显示与否
            isLoanedPersonnelStatusDialogVisible = false; // 选人弹窗 dialog 显示与否

            orgTree: object[] = [];
            arrList: string[] = [];


            mounted() {
                // 获取组织树
                this.getTree();
            }

            /**
             * @description: 查找数据字典
             * @param1 {*} 字典字串
             * @return {*}
             * @example: 示例代码
             */
            queryFromDict(dictTypeString, Fn) {
                return new Promise((resolve) => {
                    COMMON_API.DICTQUERY_API({ dictType: dictTypeString }).then(({ data }) => {
                        Fn(data.data);
                        resolve(null);
                    });
                })
            }

            // ＝＝调整＝＝

            // 数据字典出入罐
            // getInOutStatusOptions() {
            //     COMMON_API.DICTQUERY_API({ dictType: 'COMMON_FER_ADJUST' }).then(({ data }) => {
            //         this.inOutStatusOptions = data.data
            //     });
            // }

            // 获取物料下拉
            getMaterialOptions() {
                this.materialOptions = []
                return new Promise((resolve) => {
                    FER_API.FER_FERMENTOR_ADJUSTION_GET_MATERIAL_LIST_API({
                        holderId: this.currentHolderId
                    }).then(({ data }) => {
                        console.log('根据容器查询物料列表');
                        console.log(data.data)
                        if (data.data && data.data.length !== 0) {
                            this.materialOptions = data.data
                        }
                        resolve(null)
                    });
                })
            }

            // 获取批次下拉
            getBatchOptions(materialCode = '') {
                this.batchOptions = [];
                return new Promise((resolve) => {
                    FER_API.FER_FERMENTOR_ADJUSTION_GET_MATERIAL_BATCH_LIST_API({
                        holderId: this.currentHolderId,
                        materialCode: materialCode
                    }).then(({ data }) => {
                        console.log('根据容器查询主物料批次');
                        console.log(data.data)
                        if (data.data && data.data.length !== 0) {
                            this.batchOptions = data.data
                        }
                        resolve(null)
                    });
                })
            }

            // 获取调整类别
            // getMoveTypeOptions(string) {
            //     COMMON_API.DICTQUERY_API({ dictType: string }).then(({ data }) => {
            //         this.moveTypeOptions = data.data
            //     });
            // }
            // ＝＝转储＝＝

            // 获取打入罐容器类型
            getConvertHolderTypeOptions() {
                this.convertHolderTypeOptions = [];
                return new Promise((resolve) => {
                    COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_HOLDER_TYPE'
                    }).then(({ data }) => {
                        const holderTemp: object[] = []
                        data.data.forEach(item => {
                            if (item.dictCode === '001' || item.dictCode === '028' || item.dictCode === '029' || item.dictCode === '027') {
                                holderTemp.push({ dictCode: item.dictCode, dictValue: item.dictValue })
                            }
                        })
                        console.log('打入罐容器类型')
                        console.log(holderTemp)
                        this.convertHolderTypeOptions = holderTemp
                        resolve(null)
                    })
                })
            }

            // 获取打入罐容器号
            getConvertHolderIdOptions(val) {
                this.moveHolderIdOptions = []
                return new Promise((resolve) => {
                        COMMON_API.HOLDER_DROPDOWN_API({
                        holderType: [val],
                        holderStatus: 'E'
                    }).then(({ data }) => {
                        console.log('打入罐容器号')
                        console.log(data.data)
                        this.convertHolderIdOptions = data.data
                        resolve(null)
                    })
                })
            }

            // ＝＝挪罐＝＝
            // 获取物料批次
            getMaterialBatchOptions() {
                this.dataOfMateriaBatch = {}
                return new Promise((resolve) => {
                    FER_API.FER_FERMENTOR_ADJUSTION_GET_MATERIAL_BATCH_API({
                        holderId: this.currentHolderId
                    }).then(({ data }) => {
                        console.log('根据容器查询主物料批次');
                        console.log(data.data)
                        if (data.data && data.data.length !== 0) {
                            this.dataOfMateriaBatch = data.data
                        }
                        resolve(null)
                    });
                })
            }


            // 获取挪入罐容器类型
            getMoveHolderTypeOptions() {
                this.moveHolderTypeOptions = [];
                return new Promise((resolve) => {
                    COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_HOLDER_TYPE'
                    }).then(({ data }) => {
                        const holderTemp: object[] = []
                        data.data.forEach(item => {
                            if (item.dictCode === '001' || item.dictCode === '028' || item.dictCode === '029') {
                                holderTemp.push({ dictCode: item.dictCode, dictValue: item.dictValue })
                            }
                        })
                        console.log('挪入罐容器类型')
                        console.log(holderTemp)
                        this.moveHolderTypeOptions = holderTemp
                        resolve(null)
                    })
                })
            }

            // 获取挪入罐容器号
            getMoveHolderIdOptions(val) {
                this.moveHolderIdOptions = []
                return new Promise((resolve) => {
                        COMMON_API.HOLDER_DROPDOWN_API({
                        holderType: [val],
                        holderStatus: 'E'
                    }).then(({ data }) => {
                        console.log('挪入罐容器号')
                        console.log(data.data)
                        this.moveHolderIdOptions = data.data
                        resolve(null)
                    })
                })
            }

            changeInOutFlag(val) {
                this.modifyDataGroup.moveType = ''
                // this.getMoveTypeOptions(val)
                this.queryFromDict(val, (data) => {
                    this.moveTypeOptions = data;
                }); // 获取调整类别
            }

            changeMaterialOptions(materialCode) {
                if (this.materialOptions.length !== 0) {
                    this.modifyDataGroup.materialName = this.materialOptions.filter(item => item.materialCode === materialCode)[0].materialName
                    this.getBatchOptions(materialCode)
                }
            }

            changeHolderTypeOptions(who, val) {
                if (who === 'convert') {
                    this.getConvertHolderIdOptions(val)
                }
                if (who === 'move') {
                    this.getMoveHolderIdOptions(val)
                }
            }

            async changeTab(val) {
                console.log(val)
                if (val === 'modify') { // 调整
                    this.currentTab = '调整'
                    // 获取物料
                    await this.getMaterialOptions();
                    // 获取批次
                    await this.getBatchOptions(this.materialOptions[0] ? this.materialOptions[0].materialCode : '');
                    // 数据字典出入罐
                    // await this.getInOutStatusOptions();
                    await this.queryFromDict('COMMON_FER_ADJUST', (data) => {
                        this.inOutStatusOptions = data;
                    });
                    // 设置数据
                    await this.setData('modify');

                } else if (val === 'convert') { // 转存
                    this.currentTab = '转存'
                    // 获取物料
                    await this.getMaterialOptions();
                    // 获取批次
                    await this.getBatchOptions(this.materialOptions[0] ? this.materialOptions[0].materialCode : '');

                    // 获取打入罐类别
                    await this.getConvertHolderTypeOptions()

                    // 获取打入物料打入批次
                    await this.getMaterialBatchOptions();
                    // 设置数据
                    await this.setData('convert');
                } else { // 挪罐
                    this.currentTab = '挪罐'
                    // 获取挪入罐类别
                    await this.getMoveHolderTypeOptions();
                    // 获取物料批次
                    await this.getMaterialBatchOptions();
                    // 设置数据
                    await this.setData('move');
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
                if (!str) {
                    return []
                }
                return str.split(',')
            }

            // 发酵罐 item 数值
            init(item) {
                console.log('发酵罐 item 数值')
                console.log(item)
                this.currentTab = '调整' // 当前初始 tab
                this.tabType = 'modify'
                this.currentItem = item
                this.isTableDialogVisible = true
                this.currentWorkShop = item.workshop
                this.currentCycle = item.cycle
                this.currentHolderId = item.holderId //
                this.currentHolderName = item.holderName //
                this.currentFermentorStatusName = item.fermentorStatusName //

                this.dialogTitle = this.currentHolderName + this.currentTab
                // 调整 tab ＝＝＝＝＝
                this.changeTab(this.tabType);
            }

            setData(tab) {
                if (tab === 'modify') {
                    this.modifyDataGroup = {
                        holderName: this.currentHolderName,
                        holderId: this.currentHolderId,
                        fermentorStatusName: this.currentFermentorStatusName,
                        materialCode: this.materialOptions[0] ? this.materialOptions[0].materialCode : '',
                        materialName: this.materialOptions[0] ? this.materialOptions[0].materialName : '',
                        batch: this.batchOptions[0] ? this.batchOptions[0].batch : '', //v
                        inOutFlag: '',
                        moveAmount: null,
                        moveType: '',
                        operators: '',
                        orderNo: this.batchOptions[0] ? this.batchOptions[0].orderNo : '',
                        remark: '',
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                        changer: getUserNameNumber()
                    } // modify data
                } else if (tab === 'convert') {
                    this.convertDataGroup = {
                        holderName: this.currentHolderName,
                        holderId: this.currentHolderId,
                        fermentorStatusName: this.currentFermentorStatusName,
                        materialCode: this.materialOptions[0] ? this.materialOptions[0].materialCode : '',
                        materialName: this.materialOptions[0] ? this.materialOptions[0].materialName : '',
                        moveAmount: null,
                        batch: this.batchOptions[0] ? this.batchOptions[0].batch : '', //v
                        operators: '',
                        orderNo: this.batchOptions[0] ? this.batchOptions[0].orderNo : '',
                        convertMaterial: `${this.dataOfMateriaBatch.materialName || ''} ${this.dataOfMateriaBatch.materialCode || ''}`,
                        convertMaterialCode: this.dataOfMateriaBatch.materialCode || '',
                        convertMaterialName: this.dataOfMateriaBatch.materialName || '',
                        convertBatch: this.dataOfMateriaBatch.batch || '',
                        sourceHolderId: this.currentHolderId,
                        targetHolderId: '',
                        targetHolderType: '',
                        remark: '',
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                        changer: getUserNameNumber()
                    } // convert data
                } else {
                    this.moveDataGroup = {
                        holderName: this.currentHolderName,
                        holderId: this.currentHolderId,
                        fermentorStatusName: this.currentFermentorStatusName,
                        material: `${this.dataOfMateriaBatch.materialName || ''} ${this.dataOfMateriaBatch.materialCode || ''}`,
                        materialCode: this.dataOfMateriaBatch.materialCode || '',
                        materialName: this.dataOfMateriaBatch.materialName || '',
                        batch: this.dataOfMateriaBatch.batch || '',
                        movebatch: '',
                        operators: '',
                        orderNo: this.currentItem.orderNo,
                        remark: '',
                        sourceHolderId: this.currentHolderId,
                        targetHolderId: '',
                        targetHolderType: '',
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                        changer: getUserNameNumber()
                    } // move data
                }
            }

            getCyMatiral() {
                FER_API.FER_FERMENTOR_CY_SAVE_API({
                    cycle: this.currentCycle,
                    holderId: this.currentHolderId
                }).then(() => {
                    this.$successToast('保存成功');
                });
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
                        FER_API.FER_FERMENTOR_ADJUSTION_ADJUST_API({
                            batch: this.modifyDataGroup.batch,
                            holderId: this.modifyDataGroup.holderId,
                            inOutFlag: this.modifyDataGroup.inOutFlag,
                            materialCode: this.modifyDataGroup.materialCode,
                            materialName: this.modifyDataGroup.materialName,
                            moveAmount: this.modifyDataGroup.moveAmount,
                            moveType: this.modifyDataGroup.moveType,
                            operators: this.modifyDataGroup.operators,
                            orderNo: this.modifyDataGroup.orderNo,
                            remark: this.modifyDataGroup.remark
                        }).then(() => {
                            this.$successToast('保存成功');
                            this.isTableDialogVisible = false
                        });
                    }


                } else if (this.tabType === 'convert') {
                    if (this.ruleSubmit()) {
                        FER_API.FER_FERMENTOR_ADJUSTION_TRANS_API({
                            batch: this.convertDataGroup.batch,
                            operators: this.convertDataGroup.operators,
                            orderNo: this.convertDataGroup.orderNo,
                            remark: this.convertDataGroup.remark,
                            sourceHolderId: this.convertDataGroup.sourceHolderId,
                            targetHolderId: this.convertDataGroup.targetHolderId,
                            targetHolderType: this.convertDataGroup.targetHolderType
                        }).then(() => {
                            this.$successToast('保存成功');
                            this.isTableDialogVisible = false
                        });
                    }
                } else if (this.tabType === 'move') {
                    if (this.ruleSubmit()) {
                        FER_API.FER_FERMENTOR_ADJUSTION_CHANGE_API({
                            batch: this.moveDataGroup.batch, //x
                            operators: this.moveDataGroup.operators, //x
                            orderNo: this.currentItem.orderNo, //x
                            remark: this.moveDataGroup.remark, //x
                            sourceHolderId: this.moveDataGroup.sourceHolderId,
                            targetHolderId: this.moveDataGroup.targetHolderId, //x
                            targetHolderType: this.moveDataGroup.targetHolderType //x
                        }).then(() => {
                            this.$successToast('保存成功');
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
                    if (this.modifyDataGroup.inOutFlag === '' || this.modifyDataGroup.moveType === '' || this.modifyDataGroup.moveAmount === 0) {
                        this.$warningToast('请录入调整必填栏位');
                        return false
                    }
                } else if (this.tabType === 'convert') {
                    if (this.convertDataGroup.moveAmount === null || this.convertDataGroup.targetHolderType === '' || this.convertDataGroup.targetHolderId === '') {
                        this.$warningToast('请录入CY');
                        return false
                    }
                } else if (this.tabType === 'move') {
                    if (this.moveDataGroup.targetHolderType === '' || this.moveDataGroup.targetHolderId === '') {
                        this.$warningToast('请录入挪罐必填栏位');
                        return false
                    }
                }
                return true
            }
        }

    interface Options{
        dictCode?: string;
        dictValue?: string;
    }

    interface MaterialOptions{
        materialCode?: string;
        materialName?: string;
        materialType?: string;
    }

    interface BatchOptions{
        batch?: string;
        currentStock?: string;
        materialCode?: string;
        materialName?: string;
        materialType?: string;
        orderNo?: string;
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
        convertBatch?: string;
        convertMaterial?: string;
        convertMaterialCode?: string;
        convertMaterialName?: string;
        movebatch?: string; //
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

    interface MoveDataOfMateriaBatch{
        batch?: string;
        currentStock?: string;
        materialCode?: string;
        materialName?: string;
        materialType?: string;
        orderNo?: string;
    }

    interface HolderIdOptions{
        deptId?: string;
        holderName?: string;
        holderNo?: string;
        holderType?: string;
        holderVolume?: number;
        id?: string;
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
        height: 36px;
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
