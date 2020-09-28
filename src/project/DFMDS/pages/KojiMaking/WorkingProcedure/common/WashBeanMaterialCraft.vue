<template>
    <div class="koji-process-control">
        <mds-card title="筛豆记录" name="table1" icon-bg="#487BFF">
            <div>
                <el-form :inline="true" :model="craftSeiveBeanInfo" label-width="115px">
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>筛豆开始时间：
                        </template>
                        <el-date-picker v-model="craftSeiveBeanInfo.sieveStartDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>筛豆结束时间：
                        </template>
                        <el-date-picker v-model="craftSeiveBeanInfo.sieveEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            停机时长：
                        </template>
                        <el-input v-model="craftSeiveBeanInfo.sieveStopDuration" placeholder="" :disabled="!isRedact" size="small" style="width: 175px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="addSeiveBeanDataRow()">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftSeiveBeanTable" :row-class-name="RowDelFlag" border tooltip-effect="dark" size="small">
                <el-table-column type="index" :index="index => getIndexMethod(index, craftSeiveBeanTable)" label="序号" width="50px" fixed />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>大豆批次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.sieveBeanBatch" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;" @change="controlTypeChange($event, scope.row)">
                            <el-option v-for="(subItem, index) in setMaterialTableData" :key="index" :label="subItem.batch" :value="subItem.batch" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="大豆厂家" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.sieveBeanSupplier }}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header" min-width="100">
                        <span class="notNull">* </span>设备
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.sieveDeviceId" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;">
                            <el-option v-for="(subItem, index) in sieveDeviceList" :key="index" :label="subItem.deviceName" :value="subItem.deviceNo" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header" min-width="100">
                        <span class="notNull">* </span>杂质类
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.sieveImpurityType" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;">
                            <el-option v-for="(subItem, index) in sieveImpurityTypeList" :key="index" :label="subItem.label" :value="subItem.value" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header" min-width="100">
                        <span class="notNull">* </span>杂质数量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.sieveImpurityAmount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.unit }}
                    </template>
                </el-table-column>
                <el-table-column width="140" show-overflow-tooltip>
                    <template slot="header">
                        <span class="notNull">* </span>筛豆操作人
                    </template>
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact" style="cursor: pointer;" @click="selectUser(scope.row, '筛豆操作人', 'sieveMans')">
                                <em>{{ scope.row.sieveMans }}</em>
                                <em>点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="180">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
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
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :inline="true" style="margin-top: 5px;">
                <el-form-item label="杂质数量合计：" style="margin-bottom: 5px;">
                    <span>{{ totalSieveImpurityAmount }} KG</span>
                </el-form-item>
            </el-form>
        </mds-card>
        <mds-card title="洗豆记录" name="table2" icon-bg="#487BFF">
            <div>
                <el-form :inline="true" :model="craftWashBeanInfo" label-width="115px">
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>泡豆水洁净度：
                        </template>
                        <el-select v-model="craftWashBeanInfo.cleanliness" class="stock-form_item_style" size="small" placeholder="请选择" clearable :disabled="!isRedact">
                            <el-option v-for="(item, index) in cleanlinessList" :key="index" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>洗豆操作人：
                        </template>
                        <span v-if="isRedact" style="cursor: pointer;" @click="selectUser(craftWashBeanInfo, '洗豆操作人', 'washMans')">{{ craftWashBeanInfo.washMans }} 点击选择人员</span>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>洗豆开始时间：
                        </template>
                        <el-date-picker v-model="craftWashBeanInfo.washStartDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>洗豆结束时间：
                        </template>
                        <el-date-picker v-model="craftWashBeanInfo.washEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                </el-form>
            </div>
        </mds-card>
        <mds-card title="泡豆记录" name="table3" icon-bg="#487BFF">
            <template slot="titleBtn">
                <el-form :inline="true" label-width="115px">
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="addWashBeanDataRow()">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftWashBeanTable" :row-class-name="RowDelFlag" border tooltip-effect="dark" size="mini">
                <el-table-column type="index" :index="index => getIndexMethod(index, craftWashBeanTable)" label="序号" width="50px" fixed />
                <el-table-column width="140" show-overflow-tooltip>
                    <template slot="header">
                        <span class="notNull">* </span>泡豆罐号
                    </template>
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact" style="cursor: pointer;" @click="selectScan(scope.row)">
                                <em>{{ scope.row.relStr }}</em>
                                <em>  点击选择</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="192">
                    <template slot="header">
                        <span class="notNull">* </span>加水开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.waterStartDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="192">
                    <template slot="header">
                        <span class="notNull">* </span>加水结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.waterEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column width="140" show-overflow-tooltip>
                    <template slot="header">
                        <span class="notNull">* </span>加水操作人
                    </template>
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact" style="cursor: pointer;" @click="selectUser(scope.row, '加水操作人', 'waterMans')">
                                <em>{{ scope.row.waterMans }}</em>
                                <em> 点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="192">
                    <template slot="header">
                        <span class="notNull">* </span>排水开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.drainStartDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="192">
                    <template slot="header">
                        <span class="notNull">* </span>排水结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.drainEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column width="140" show-overflow-tooltip>
                    <template slot="header">
                        <span class="notNull">* </span>排水操作人
                    </template>
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact" style="cursor: pointer;" @click="selectUser(scope.row, '排水操作人', 'drainMans')">
                                <em>{{ scope.row.drainMans }}</em>
                                <em> 点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="泡豆时长" width="80">
                    <template slot-scope="scope">
                        <p>{{ (scope.row.steepDuration = Number(workTime(scope.row.drainEndDate, scope.row.waterStartDate, scope.row))) }}H</p>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
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
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="craftAuditList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <scan-select-dialog ref="scanSelectDialog" @changeUser="setScanValue" />
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" @changeUser="changeUser" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API, AUDIT_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber, getDateDiff } from 'utils/utils';

    import ScanSelectDialog from '../common/ScanSelectDialog.vue';
    import LoanedPersonnel from 'components/LoanedPersonnel.vue';

    @Component({
        name: 'WashBeanMaterialCraft',
        components: {
            ScanSelectDialog,
            LoanedPersonnel
        }
    })
    export default class WashBeanMaterialCraft extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: [] }) setMaterialTableData: CraftList[];

        $refs: {
            loanedPersonnel: HTMLFormElement;
            scanSelectDialog: HTMLFormElement;
        };

        // 订单信息
        formHeader: Craft = {};

        // 筛豆记录表单数据
        craftSeiveBeanInfo: Craft = {};
        // 筛豆记录表格数据
        craftSeiveBeanTable: CraftList[] = [];
        // 洗豆记录表格数据
        craftWashBeanInfo: Craft = {};
        // 洗豆记录表单数据
        craftWashBeanTable: CraftList[] = [];
        // 审核记录
        craftAuditList = [];

        // 人员组织选择
        loanedPersonnelStatus = false;

        // 人员操作对象
        row: Craft = {};
        rowField = ''
        // 泡豆罐操作对象
        scanRow: Craft = {};

        // 提交保存时获取处理数据
        getSavedOrSubmitData(orderInfo) {
            function filterTableData(whichTable: CraftList[], type) {
                if (type === 'insert') {
                    return whichTable.filter(item => !item.id && item.delFlag !== 1);
                }
                if (type === 'update') {
                    return whichTable.filter(item => item.id && item.delFlag !== 1);
                }
                if (type === 'del') {
                    return whichTable.filter(item => item.id && item.delFlag === 0);
                }
            }

            console.log(orderInfo.orderNo, 666)

            return {
                kojiBeanSieveSaveDto: {
                    ...this.craftSeiveBeanInfo,
                    item: {
                        insertDtos: filterTableData(this.craftSeiveBeanTable, 'insert'),
                        updateDtos: filterTableData(this.craftSeiveBeanTable, 'update'),
                        removeIds: filterTableData(this.craftSeiveBeanTable, 'del')
                    },
                    orderNo: this.formHeader.orderNo
                },
                kojiBeanWashSaveDto: {
                    ...this.craftWashBeanInfo,
                    items: {
                        insertDatas: filterTableData(this.craftWashBeanTable, 'insert'),
                        updateDatas: filterTableData(this.craftWashBeanTable, 'update'),
                        removeIds: filterTableData(this.craftWashBeanTable, 'del')
                    },
                    orderNo: this.formHeader.orderNo
                }
            };
        }

        // 设备list
        sieveDeviceList: object[] = [];
        // 杂质类list
        sieveImpurityTypeList: object[] = [
            { label: '豆皮', value: 'BEAN_SKIN' },
            { label: '小豆', value: 'SMALL_BEAN' },
            { label: '废豆', value: 'WASTE_BEAN' }
        ];

        // 泡豆罐list
        itemPotDtos: object[] = [];

        // 洁净度List
        cleanlinessList: object[] = [
            { label: '合格', value: 'Y' },
            { label: '不合格', value: 'N' }
        ];

        // 初始化数据
        init(formHeader) {
            const { orderNo, workShop } = formHeader;

            console.log(formHeader, 88)
            this.formHeader = formHeader;
            // 查询设备list
            this.getSieveDeviceList(workShop);
            // 查询筛豆记录
            this.getSeiveBeanLogList(orderNo);
            // 查询洗豆记录
            this.getWashBeanLogList(orderNo);
            // 查询审核记录
            this.getAuditList(orderNo);
        }

        // === 数据处理 === //
        // 新增筛豆记录
        addSeiveBeanDataRow() {
            this.craftSeiveBeanTable.push({
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo,
                sieveBeanBatch: '',
                sieveBeanSupplier: '',
                sieveDeviceId: '',
                sieveDeviceName: '',
                sieveImpurityAmount: '',
                sieveImpurityType: '',
                sieveMans: '',
                unit: 'KG',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0
            });
        }

        // 新增泡豆记录
        addWashBeanDataRow() {
            this.craftWashBeanTable.push({
                potSaveDto: [],
                drainEndDate: '',
                drainMans: '',
                drainStartDate: '',
                relStr: '',
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo,
                steepDuration: '',
                washBeanId: '',
                waterEndDate: '',
                waterMans: '',
                waterStartDate: '',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0
            });
        }

        // 删除筛豆记录
        // delFlag 0未删除  1已删除
        removeRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            });
        }

        // 处理行显示class
        RowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        // 大豆批次选择更改大豆厂家
        controlTypeChange(dictType, row) {
            this.setMaterialTableData.map(item => {
                if (item.batch === row.sieveBeanBatch) {
                    row.sieveBeanSupplier = item.supplier || '';
                }
            });
        }

        // 计算筛豆数量总数
        get totalSieveImpurityAmount() {
            let num = 0;
            this.craftSeiveBeanTable.map(item => {
                if (item.sieveImpurityAmount) {
                    num += Number(item.sieveImpurityAmount);
                }
            });

            this.$emit('changeSieveTotalNum', num);
            return num;
        }

        // 计算时间差
        workTime(end, start, row) {
            let diff = '0';
            if (end && start && row.delFlag !== 1) {
                diff = getDateDiff(start, end, 'hour');
            }
            return diff;
        }

        // 内部借调
        selectUser(row, typeName, field) {
            this.row = row;
            this.rowField = field
            this.loanedPersonnelStatus = true;

            let selArr = [];
            if (row.field) {
                selArr = row.field.split(',');
            }
            this.$nextTick(() => {
                this.$refs.loanedPersonnel.init(selArr, typeName);
            });
        }

        // 操作人数据回显处理
        changeUser(userIds) {
            console.log(userIds);
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

        // 泡豆罐选择
        selectScan(row) {
            this.scanRow = row;
            // 内部借调、学习
            this.$nextTick(() => {
                this.$refs.scanSelectDialog.init(this.formHeader.workShop, '筛豆人员选择');
            });
        }

        // 泡豆罐回显处理
        setScanValue(result) {
            console.log(result);
            const arr = [...result];
            const relArr: ItemPotDtos[] = [];
            let relStr = '';
            arr.map((item, index) => {
                if (item) {
                    const tem = item.split(',');
                    relArr.push({
                        beanJarId: tem[2],
                        beanJarName: tem[0],
                        beanJarNo: tem[1]
                    })
                    relStr += `${index > 0 ? ',' : ''}${tem[0]}`
                }
            });
            this.scanRow.potSaveDto = relArr;
            this.scanRow.relStr = relStr;
        }

        // ==== 提交处理汇总 ====== //
        // 提交时字段校验
        ruleSubmit() {
            /*
            // 筛豆记录表单数据
            craftSeiveBeanInfo: Craft = {};
            // 筛豆记录表格数据
            craftSeiveBeanTable: CraftList[] = [];
            // 洗豆记录表格数据
            craftWashBeanInfo: Craft = {};
            // 洗豆记录表单数据
            craftWashBeanTable: CraftList[] = [];
            */
            if (!this.craftSeiveBeanInfo.sieveStartDate || !this.craftSeiveBeanInfo.sieveEndDate) {
                this.$warningToast('请填写工艺控制页签筛豆记录筛豆时间必填项');
                return false;
            }


            for (const item of this.craftSeiveBeanTable.filter(it => it.delFlag !== 1)) {
                if (
                    !item.sieveBeanBatch ||
                    // !item.sieveBeanSupplier ||
                    !item.sieveImpurityType ||
                    !item.sieveImpurityAmount ||
                    !item.sieveMans
                ) {
                    this.$warningToast('请填写工艺控制页签筛豆记录必填项');
                    return false;
                }
            }

            if (
                !this.craftWashBeanInfo.cleanliness ||
                !this.craftWashBeanInfo.washMans ||
                !this.craftWashBeanInfo.washStartDate ||
                !this.craftWashBeanInfo.washEndDate
            ) {
                this.$warningToast('请填写工艺控制页签洗豆记录相关必填项');
                return false;
            }

            for (const item of this.craftWashBeanTable.filter(it => it.delFlag !== 1)) {
                if (
                    !item.relStr ||
                    !item.waterStartDate ||
                    !item.waterEndDate ||
                    !item.waterMans ||
                    !item.drainStartDate ||
                    !item.drainEndDate ||
                    !item.drainMans
                ) {
                    this.$warningToast('请填写工艺控制页签泡豆记录先关必填项');
                    return false;
                }
            }

            return true;
        }

        // === 查询 汇总 ==== //

        // 查询最新筛豆记录
        getSeiveBeanLogList(kojiOrderNo) {
            KOJI_API.KOJI_SBEAN_SIEVE_QUERY_API({
                kojiOrderNo
            }).then(({ data }) => {
                this.craftSeiveBeanInfo = data.data;
                this.craftSeiveBeanTable = data.data.item || [];
            });
        }

        // 查询最新筛豆记录
        getWashBeanLogList(kojiOrderNo) {
            KOJI_API.KOJI_SBEAN_WASH_QUERY_API({
                kojiOrderNo
            }).then(({ data }) => {
                this.craftWashBeanInfo = data.data;
                this.craftWashBeanTable = data.data.item || [];
            });
        }

        // 查询最新审核记录
        getAuditList(orderNo) {
            AUDIT_API.AUDIT_LOG_LIST_API({ orderNo, verifyType: '' }).then(({ data }) => {
                this.craftAuditList = data.data;
            });
        }

        // 查询设备list
        getSieveDeviceList(deptId) {
            COMMON_API.DEVICE_LISTBYTYPE_API({ deptId, deptName: '洗豆', factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id }).then(({ data }) => {
                this.sieveDeviceList = data.data || [];
            });
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
        washMans?: string;
        washStartDate?: string;
        washEndDate?: string;
    }
    interface CraftList {
        id?: number;
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
        potSaveDto?: ItemPotDtos[];
        relStr?: string;
    }
    interface ItemPotDtos {
        beanJarId?: string;
        beanJarName?: string;
        beanJarNo?: string;
        id?: string;
    }
</script>

<style lang="scss" scoped>
    .koji-process-control {
        .stock-form_item_input_suffix {
            margin-right: 20px;
        }
        .cleanMarginBottom {
            margin-bottom: 10px;
        }
    }
</style>
