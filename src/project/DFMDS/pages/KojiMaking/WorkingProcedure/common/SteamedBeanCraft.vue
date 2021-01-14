<template>
    <div class="koji-process-control">
        <mds-card title="蒸豆记录" name="table1" icon-bg="#487BFF">
            <template slot="titleBtn">
                <el-form :inline="true" label-width="115px">
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            蒸球压力(Mpa)：
                        </template>
                        <el-input v-model="steamBallPressure" placeholder="" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" size="small" style="width: 175px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">Mpa</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button v-if="isAuth('kjSBControlAdd')" type="primary" size="small" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" @click="addDataRow()">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftSteamBeanTable" :row-class-name="RowDelFlag" border tooltip-effect="dark" size="mini" style="min-height: 90px;">
                <el-table-column type="index" :index="index => getIndexMethod(index, craftSteamBeanTable)" label="序号" width="55" fixed />
                <el-table-column width="140" show-overflow-tooltip>
                    <template slot="header">
                        <span class="notNull">* </span>蒸球号
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.steamBallNo" placeholder="请选择" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 100%;" @change="val=>modifySteamBall(val,scope.row)">
                            <el-option v-for="(subItem, index) in steamBallList" :key="index" :label="subItem.holderName" :value="subItem.holderNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="192">
                    <template slot="header">
                        <span class="notNull">* </span>加汽开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addSteamStart" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" style="width: 170px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="192">
                    <template slot="header">
                        <span class="notNull">* </span>加汽结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addSteamEnd" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" style="width: 170px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="汽包压力" width="144">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.steamPocketPressure" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px; line-height: 32px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">Mpa</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="转动圈数" width="144">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.turnCount" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column label="蒸煮时间" width="80">
                    <template slot-scope="scope">
                        <p>{{ (scope.row.cookingDuration = Number(workTime(scope.row.addSteamEnd, scope.row.addSteamStart, scope.row))) }}min</p>
                    </template>
                </el-table-column>
                <el-table-column label="保压时间" width="144">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.pressureDuration" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px; line-height: 32px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">min</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column min-width="192">
                    <template slot="header">
                        熟豆放豆时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addBeanDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" style="width: 170px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="170">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card title="蒸豆硬度" name="table2" icon-bg="#487BFF">
            <template slot="titleBtn">
                <el-form :inline="true" label-width="115px">
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button v-if="isAuth('kjSBControlAdd')" type="primary" size="small" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" @click="addDataRow('hard')">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="hardTable" :row-class-name="RowDelFlag" border tooltip-effect="dark" size="mini" style="min-height: 90px;">
                <el-table-column type="index" :index="index => getIndexMethod(index, hardTable)" label="序号" width="50px" fixed />
                <el-table-column width="140" show-overflow-tooltip>
                    <template slot="header">
                        <span class="notNull">* </span>蒸球号
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.steamBallNo" placeholder="请选择" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 100%;" @change="val=>modifySteamBall(val,scope.row)">
                            <el-option v-for="(subItem, index) in steamBallList" :key="index" :label="subItem.holderName" :value="subItem.holderNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度1
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessOne" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度2
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessTwo" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度3
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessThree" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度4
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessFour" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度5
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessFive" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度6
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessSix" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度7
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessSeven" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度8
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessEight" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度9
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessNine" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="146">
                    <template slot="header">
                        <span class="notNull">* </span>蒸豆硬度10
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.hardnessTen" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" style="width: 120px;" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="170">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="craftAuditList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API, AUDIT_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber, getDateDiff } from 'utils/utils';
    import _ from 'lodash';


    @Component({
        name: 'WashBeanMaterialCraft'
    })
    export default class WashBeanMaterialCraft extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: 'N' }) isStatus: string;

        // 订单信息
        formHeader: Craft = {};

        // 蒸豆记录表格数据
        craftSteamBeanTable: CraftList[] = [];
        // 蒸球压力
        steamBallPressure = '';
        orgSteamBallPressure = '';
        // 硬度数据
        hardTable: CraftList[] = [];

        // 存储历史数据
        temCraftSteamBeanTable = [];
        temHardTable = []

        // 蒸球list
        steamBallList: SteamBallListOption[] = [];

        // 审核记录
        craftAuditList = [];

        // 提交保存时获取处理数据
        getSavedOrSubmitData(formHeader) {
            const handleCraftSteamBeanTable = () => {
                this.craftSteamBeanTable.map(item => {
                    item.steamBallPressure = this.steamBallPressure;
                })
            }
            // 蒸球压力数据处理
            this.steamBallPressure && handleCraftSteamBeanTable();

            // 蒸豆记录
            const tableSaveDto: SendDataForm = {
                deleteDto: [],
                insertDto: [],
                updateDto: []
            };
            // 蒸豆硬度
            const hardTableSaveDto: SendDataForm = {
                deleteDto: [],
                insertDto: [],
                updateDto: []
            };

            this.craftSteamBeanTable.forEach((item: CraftList, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        tableSaveDto.deleteDto.push(item.id)
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.temCraftSteamBeanTable[index], item)) {
                        item.kojiOrderNo = formHeader.kojiOrderNo
                        item.orderNo = formHeader.orderNo
                        tableSaveDto.updateDto.push(item)
                    }
                } else {
                    item.kojiOrderNo = formHeader.kojiOrderNo
                    item.orderNo = formHeader.orderNo
                    tableSaveDto.insertDto.push(item)
                }
            })

            this.hardTable.forEach((item: CraftList, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        hardTableSaveDto.deleteDto.push(item.id)
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.temHardTable[index], item)) {
                        item.kojiOrderNo = formHeader.kojiOrderNo
                        item.orderNo = formHeader.orderNo
                        hardTableSaveDto.updateDto.push(item)
                    }
                } else {
                    item.kojiOrderNo = formHeader.kojiOrderNo
                    item.orderNo = formHeader.orderNo
                    hardTableSaveDto.insertDto.push(item)
                }
            })

            return {
                steamBean: tableSaveDto.insertDto.length === 0 && tableSaveDto.updateDto.length === 0 && tableSaveDto.deleteDto.length === 0 ? null : {
                    insertDto: tableSaveDto.insertDto,
                    updateDto: tableSaveDto.updateDto,
                    deleteDto: tableSaveDto.deleteDto,
                    kojiOrderNo: formHeader.kojiOrderNo,
                    orderNo: formHeader.orderNo
                },
                steamBeanHardness: hardTableSaveDto.insertDto.length === 0 && hardTableSaveDto.updateDto.length === 0 && hardTableSaveDto.deleteDto.length === 0 ? null : {
                    insertDto: hardTableSaveDto.insertDto,
                    updateDto: hardTableSaveDto.updateDto,
                    deleteDto: hardTableSaveDto.deleteDto,
                    kojiOrderNo: formHeader.kojiOrderNo,
                    orderNo: formHeader.orderNo
                }
            };
        }


        // 初始化数据
        init(formHeader) {
            this.formHeader = formHeader;
            const { kojiOrderNo, orderNo } = formHeader;
            // 查询蒸豆记录
            this.getSteamBeanLogList(kojiOrderNo, orderNo);
            // 查询混合控制记录
            this.getHardTableLoglist(kojiOrderNo, orderNo);
            // 查询审核记录
            this.getAuditList(orderNo);
            // 蒸球list
            this.getSteamBallList();
        }


        // === 数据处理 === //
        // 新增记录
        addDataRow(type) {
            if (type) { //硬度
                this.hardTable.push({
                    kojiOrderNo: this.formHeader.kojiOrderNo,
                    orderNo: this.formHeader.orderNo,
                    steamBallNo: '',
                    hardnessEight: '',
                    hardnessFive: '',
                    hardnessFour: '',
                    hardnessNine: '',
                    hardnessOne: '',
                    hardnessSeven: '',
                    hardnessSix: '',
                    hardnessTen: '',
                    hardnessThree: '',
                    hardnessTwo: '',
                    remark: '',
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber(),
                    delFlag: 0
                });
            } else { // 蒸豆
                this.craftSteamBeanTable.push({
                    steamBallNo: '',
                    kojiOrderNo: this.formHeader.kojiOrderNo,
                    orderNo: this.formHeader.orderNo,
                    addSteamStart: dateFormat(new Date(), 'yyyy-MM-dd hh:mm'),
                    addSteamEnd: '',
                    steamPocketPressure: '',
                    turnCount: '',
                    pressureDuration: '',
                    addBeanDate: '',
                    remark: '',
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: getUserNameNumber(),
                    delFlag: 0
                });
            }
        }

        // 删除记录
        // delFlag 0未删除  1已删除
        removeRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
                // 蒸豆记录为空 蒸球压力值为'' 解释 提交数据时 蒸球压力存在 蒸豆记录的数据里 蒸豆数据为空时无法保存
                if (this.craftSteamBeanTable.filter(item => item.delFlag === 0).length === 0) {
                    this.steamBallPressure = ''
                }
            });
        }

        // 处理行显示class
        RowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }


        // 计算时间差
        workTime(end, start, row) {
            let diff = '0';
            if (end && start && row.delFlag !== 1) {
                diff = getDateDiff(start, end, 'minute');
            }
            return diff;
        }

        // ==== 提交处理汇总 ====== //
        // 提交时字段校验
        ruleSubmit() {
            // /^(0|[1-9]|10)(\.\d{1,2})?$/  //0-10 两位小数
            if (this.craftSteamBeanTable.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请填写工艺控制页签"蒸豆记录"');
                return false;
            }

            for (const item of this.craftSteamBeanTable.filter(it => it.delFlag !== 1)) {
                if (
                    !item.steamBallNo ||
                    !item.addSteamStart ||
                    !item.addSteamEnd
                ) {
                    this.$warningToast('请填写工艺控制页签"蒸豆记录"必填项');
                    return false;
                }
            }

            if (this.hardTable.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请填写工艺控制页签"蒸豆硬度"');
                return false;
            }

            for (const [index, item] of (this.hardTable.filter(it => it.delFlag !== 1)).entries()) {
                const reg = /^(0|[1-9]|10)(\.\d{1,2})?$/;
                if (
                    !item.steamBallNo ||
                    !item.hardnessOne ||
                    !item.hardnessTwo ||
                    !item.hardnessThree ||
                    !item.hardnessFour ||
                    !item.hardnessFive ||
                    !item.hardnessSix ||
                    !item.hardnessSeven ||
                    !item.hardnessEight ||
                    !item.hardnessNine ||
                    !item.hardnessTen
                ) {
                    this.$warningToast('请填写工艺控制页签"蒸豆硬度"必填项');
                    return false;
                }

                const decimalList = [item.hardnessOne, item.hardnessTwo, item.hardnessThree, item.hardnessFour, item.hardnessFive, item.hardnessSix, item.hardnessSeven, item.hardnessEight, item.hardnessNine, item.hardnessTen]

                for (let y = 0, len = decimalList.length; y < len; y++) {
                    if (!reg.test(String(decimalList[y]))) {
                        this.$warningToast(`工艺控制页签"蒸豆硬度的第${index + 1}条数据蒸豆硬度${y + 1}"输入格式有误`);
                        return false;
                    }
                }
            }

            return true;
        }

        // === 查询 汇总 ==== //

        // 查询最新蒸豆记录
        getSteamBeanLogList(kojiOrderNo, orderNo) {
            KOJI_API.KOJI_CRAFT_STEAM_BEAN_LOG_API({
                kojiOrderNo,
                orderNo
            }).then(({ data }) => {
                this.craftSteamBeanTable = data.data || [];
                this.temCraftSteamBeanTable = JSON.parse(JSON.stringify(data.data || []));

                // 蒸球压力回显
                if (data.data && data.data.length) {
                    this.steamBallPressure = data.data[0].steamBallPressure || ''
                }
            });
        }

        // 查询硬度记录
        getHardTableLoglist(kojiOrderNo, orderNo) {
            KOJI_API.KOJI_STEAM_BEAN_HARD_LIST_API({
                kojiOrderNo,
                orderNo
            }).then(({ data }) => {
                if (data.data && data.data.length > 0) {
                    this.hardTable = data.data || [];
                    this.temHardTable = JSON.parse(JSON.stringify(data.data || []));
                }
            });
        }

        // 查询最新审核记录
        getAuditList(orderNo) {
            AUDIT_API.STE_AUDIT_LOG_API({ orderNo, splitOrderNo: this.formHeader.kojiOrderNo, verifyType: ['SB_CONTROL', 'TIMESHEET'] }).then(({ data }) => {
                this.craftAuditList = data.data;
            });
        }

        // 查询蒸球list
        getSteamBallList() {
            COMMON_API.HOLDER_QUERY_BY_NOPAGE_API({
                deptId: this.formHeader.workShop,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: '026'
            }).then(({ data }) => {
                console.log('查询蒸球list')
                console.log(data.data)
                this.steamBallList = data.data
            })
        }

        modifySteamBall(val, row) {
            row.steamBallName = this.steamBallList.filter(item => item.holderNo === val)[0].holderName
            row.steamBallId = this.steamBallList.filter(item => item.holderNo === val)[0].id
        }
    }

    interface Craft {
        id?: string;
        items?: CraftList[];
        kojiOrderNo?: string;
        orderNo?: string;
        workShop?: string;
        potSaveDto?: object[];
        relStr?: string;
        sieveStartDate?: string;
        sieveEndDate?: string;
        cleanliness?: string;
        steamFlourMans?: string;
        washStartDate?: string;
        washEndDate?: string;
        steamPacketPressure?: string;
        steamFlourSpeed?: string;
        steamBallNo?: string;
        delFlag?: number;
        orderId?: string;
        factory?: string;
    }
    interface CraftList {
        id?: string;
        kojiOrderNo?: string;
        orderNo?: string;
        sieveBeanBatch?: string;
        sieveBeanSupplier?: string;
        sieveDeviceId?: string;
        sieveDeviceName?: string;
        sieveImpurityAmount?: number | string;
        sieveImpurityType?: string;
        sieveMans?: string;
        unit?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        delFlag?: number;
        drainEndDate?: string;
        drainMans?: string;
        drainStartDate?: string;
        steepDuration?: string;
        washBeanId?: string;
        waterEndDate?: string;
        waterMans?: string;
        waterStartDate?: string;
        batch?: string;
        supplier?: string;
        relStr?: string;
        flourWindTemp?: string;
        beanWindTempOne?: string;
        beanWindTempTwo?: string;
        mixtureTempOne?: string;
        mixtureTempTwo?: string;
        beanWindFrequency?: string;
        mixtureStart?: string;
        mixtrueEnd?: string;
        addSteamStart?: string;
        addSteamEnd?: string;
        steamPocketPressure?: string;
        turnCount?: string;
        pressureDuration?: string;
        addBeanDate?: string;
        steamBallNo?: string;
        hardnessEight?: number | string;
        hardnessFive?: number | string;
        hardnessFour?: number | string;
        hardnessNine?: number | string;
        hardnessOne?: number | string;
        hardnessSeven?: number | string;
        hardnessSix?: number | string;
        hardnessTen?: number | string;
        hardnessThree?: number | string;
        hardnessTwo?: number | string;
        steamBallPressure?: string;
    }

    interface SieveDeviceList {
        sieveDeviceId?: string;
        sieveDeviceName?: string;
        deviceNo?: string;
        deviceName?: string;
    }

    interface SendDataForm{
        deleteDto: string[];
        insertDto: CraftList[];
        updateDto: CraftList[];
    }

    interface SteamBallListOption{
        deptId?: string;
        holderArea?: string;
        holderBatch?: string;
        holderName?: string;
        holderNo?: string;
        holderStatus?: string;
        holderType?: string;
        id?: string;
    }

</script>

<style lang="scss" scoped>
    .koji-process-control {
        .stock-form_item_input_suffix {
            margin-right: 6px;
        }
        .cleanMarginBottom {
            margin-bottom: 10px;
        }
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
    }
</style>
