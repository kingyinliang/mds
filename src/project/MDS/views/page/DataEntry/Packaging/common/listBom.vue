<template>
    <div>
        <el-table ref="table1" :row-class-name="tableRowClassName" header-row-class-name="tableHead" :data="listbomP" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
            <el-table-column type="index" width="50" label="序号" />
            <el-table-column width="240" :show-overflow-tooltip="true" label="物料">
                <template slot-scope="scope">
                    {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="60" />
            <el-table-column prop="needNum" label="需求用量" width="90" />
            <el-table-column label="生产使用" width="135">
                <template slot-scope="scope">
                    <div class="required">
                        <i class="reqI">*</i>
                        <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.productUseNum" size="small" placeholder="手工录入" type="number" min="0" />
                        <el-input v-else v-model="scope.row.productUseNum" size="small" placeholder="手工录入" disabled type="number" min="0" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="本班损耗">
                <template slot-scope="scope">
                    <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.classLoss" size="small" placeholder="手工录入" type="number" min="0" />
                    <el-input v-else v-model="scope.row.classLoss" size="small" placeholder="手工录入" disabled type="number" min="0" />
                </template>
            </el-table-column>
            <el-table-column label="不合格数">
                <template slot-scope="scope">
                    <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.belowGradeNum" size="small" placeholder="手工录入" type="number" min="0" />
                    <el-input v-else v-model="scope.row.belowGradeNum" size="small" placeholder="手工录入" disabled type="number" min="0" />
                </template>
            </el-table-column>
            <el-table-column label="不良批次">
                <template slot-scope="scope">
                    <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.badBatch" size="small" maxlength="10" placeholder="手工录入" />
                    <el-input v-else v-model="scope.row.badBatch" size="small" placeholder="手工录入" disabled />
                </template>
            </el-table-column>
            <el-table-column label="厂家">
                <template slot-scope="scope">
                    <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.factory" size="small" placeholder="手工录入" />
                    <el-input v-else v-model="scope.row.factory" size="small" placeholder="手工录入" disabled />
                </template>
            </el-table-column>
            <el-table-column label="批次" :show-overflow-tooltip="true" width="90">
                <template slot-scope="scope">
                    <span>{{ scope.row.batch }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                    <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.remark" size="small" />
                    <el-input v-else v-model="scope.row.remark" size="small" disabled />
                </template>
            </el-table-column>
        </el-table>
        <el-table v-if="order.properties !== '二合一&礼盒产线'" ref="table1" header-row-class-name="tableHead" :data="listbomS" :row-class-name="RowDelFlag" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
            <el-table-column type="index" width="50" label="序号" />
            <el-table-column width="120" label="物料（半成品）">
                <template slot-scope="scope">
                    {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="60" />
            <el-table-column width="150" label="领用罐号">
                <template slot-scope="scope">
                    <div class="required">
                        <i class="reqI">*</i>
                        <el-select
                            v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'"
                            v-model="scope.row.potNo"
                            placeholder="请选择"
                            filterable
                            size="small"
                            @change="HolderChange($event, scope.row)"
                        >
                            <el-option v-for="iteam in semiHolder" :key="iteam.holderId" :label="iteam.holderName" :value="iteam.holderId" />
                        </el-select>
                        <el-select v-else v-model="scope.row.potNo" placeholder="请选择" filterable disabled size="small">
                            -->
                            <el-option v-for="iteam in semiHolder" :key="iteam.holderId" :label="iteam.holderName" :value="iteam.holderId" />
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="120" label="罐内物料">
                <template slot-scope="scope">
                    {{ scope.row.holderMaterialCode + ' ' + scope.row.holderMaterialName }}
                </template>
            </el-table-column>
            <el-table-column width="190" label="过滤日期">
                <template slot-scope="scope">
                    <div class="required">
                        <i class="reqI">*</i>
                        <el-date-picker
                            v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked' && order.factoryCode === '6010'"
                            v-model="scope.row.filterDate"
                            size="small"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy.MM.dd HH:mm"
                            placeholder="选择"
                        />
                        <el-date-picker v-else v-model="scope.row.filterDate" size="small" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" disabled />
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="150" label="批次">
                <template slot-scope="scope">
                    <div class="required">
                        <i class="reqI">*</i>
                        <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked' && order.factoryCode === '6010'" v-model="scope.row.batch" size="small" maxlength="10" />
                        <el-input v-else v-model="scope.row.batch" size="small" disabled />
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="120" label="生产使用量">
                <template slot-scope="scope">
                    <div class="required">
                        <i class="reqI">*</i>
                        <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.productUseNum" size="small" />
                        <el-input v-else v-model="scope.row.productUseNum" size="small" disabled />
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="order.factoryCode !== '6010'" width="120" label="使用情况">
                <template slot-scope="scope">
                    <div class="required">
                        <i class="reqI">*</i>
                        <el-select v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.useUsage" size="small">
                            <el-option v-for="(item, index) in useUsageList" :key="index" :value="item" :label="item" />
                        </el-select>
                        <el-select v-else v-model="scope.row.useUsage" size="small" disabled>
                            <el-option v-for="(item, index) in useUsageList" :key="index" :value="item" :label="item" />
                        </el-select>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="order.factoryCode !== '6010'" label="库存量" width="120">
                <template slot-scope="scope">
                    <div class="required">
                        <i class="reqI">*</i>
                        <el-input v-model="scope.row.surplusAmount" size="small" disabled />
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="250" label="换罐时间">
                <template slot-scope="scope">
                    <el-date-picker
                        v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'"
                        v-model="scope.row.changePotDate"
                        type="datetime"
                        size="small"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                    />
                    <el-date-picker v-else v-model="scope.row.changePotDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" disabled />
                </template>
            </el-table-column>
            <el-table-column width="250" label="用完时间">
                <template slot-scope="scope">
                    <el-date-picker
                        v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'"
                        v-model="scope.row.usePotDate"
                        type="datetime"
                        size="small"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                    />
                    <el-date-picker v-else v-model="scope.row.usePotDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" disabled />
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                    <el-input v-if="isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'" v-model="scope.row.remark" size="small" />
                    <el-input v-else v-model="scope.row.remark" size="small" disabled />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="70">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.isSplit === '0' && isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '') && scope.row.status !== 'submit' && scope.row.status !== 'checked'"
                        type="text"
                        size="small"
                        @click="addSapS(listbomS, scope.row)"
                    >
                        <i class="icons iconfont factory-chaifen" />拆分
                    </el-button>
                    <el-button v-if="scope.row.isSplit === '1' && isRedact && (Sapstatus === 'noPass' || Sapstatus === 'saved' || Sapstatus === '')" class="delBtn" type="text" icon="el-icon-delete" size="small" @click="dellistbomS(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <audit-log :table-data="SapAudit" />
    </div>
</template>

<script>
import { PACKAGING_API } from '@/api/api';
import { accAdd, accSub } from '@/net/validate';
export default {
    name: 'ListBom',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean
        },
        order: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            Sapstatus: '',
            finHolder: [],
            semiHolder: [],
            listbomP: [],
            listbomS: [],
            listbomSS: [],
            SapAudit: [],
            useUsageList: ['领用完', '转他用'],
            repertory: [],
            distinctListbomS: []
        };
    },
    computed: {},
    methods: {
        // 获取包装车间物料领用列表
        /* eslint-disable no-shadow, @typescript-eslint/camelcase */
        GetpkgSap(order, data) {
            if (data) {
                this.listbomP = data.listbomP;
                this.listbomS = data.listbomS;
                this.listbomSS = data.listbomS;
                this.listbomS.forEach(item => {
                    item.isSplit = '0';
                    item.delFlag = '0';
                    item.id = '';
                    item.orderId = data.list[0].orderId;
                    item.holderMaterialCode = '';
                    item.holderMaterialName = '';
                });
                this.listbomP.forEach(item => {
                    item.id = '';
                    item.orderId = data.list[0].orderId;
                });
            } else {
                this.$http(`${PACKAGING_API.PKGSPALIST_API}`, 'POST', {
                    order_id: order.orderId,
                    factory: order.factory
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.listbomP = data.listFormP;
                        this.listbomS = data.listFormS;
                        this.listbomSS = JSON.parse(JSON.stringify(data.listFormS));
                        this.SapAudit = data.listApproval;
                        let sub = 0;
                        let che = 0;
                        let no = 0;
                        let sav = 0;
                        this.listbomP.forEach(item => {
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
                        this.listbomS.forEach(item => {
                            if (item.status === 'noPass') {
                                no = no + 1;
                            } else if (item.status === 'submit') {
                                sub = sub + 1;
                            } else if (item.status === 'checked') {
                                che = che + 1;
                            } else if (item.status === 'saved') {
                                sav = sav + 1;
                            }
                            item.useUsage = item.useUsage ? item.useUsage : '';
                            if (item.delFlag === '0' && item.holderId) {
                                this.distinctListbomS.push(item.holderId);
                            }
                        });
                        const set = new Set(this.distinctListbomS);
                        Array.from(set).map(item => {
                            if (!this.semiHolder.find(items => items.holderId === item)) {
                                let total = 0;
                                this.listbomS.map(itemB => {
                                    if (itemB.holderId === item && itemB.delFlag === '0') {
                                        total = total + itemB.productUseNum;
                                    }
                                });
                                const itemC = this.listbomS.find(itemD => itemD.holderId === item);
                                this.semiHolder.push({
                                    amount: total,
                                    batch: itemC.batch,
                                    fullDate: itemC.filterDate,
                                    holderId: itemC.holderId,
                                    holderName: itemC.holderName,
                                    holderNo: '',
                                    holderType: itemC.holderType,
                                    materialCode: itemC.materialCode,
                                    materialName: itemC.materialName
                                });
                            }
                        });
                        if (no > 0) {
                            this.Sapstatus = 'noPass';
                        } else if (sav > 0) {
                            this.Sapstatus = 'saved';
                        } else if (sub > 0) {
                            this.Sapstatus = 'submit';
                        } else if (che > 0) {
                            this.Sapstatus = 'checked';
                        }
                        this.$emit('GetlistbomStatus', this.Sapstatus);
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            }
        },
        /* eslint-enable no-shadow, @typescript-eslint/camelcase */
        // 修改
        /* eslint-disable no-shadow */
        UpdateSap(str, resolve) {
            this.listbomP.forEach(item => {
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
            this.listbomS.forEach(item => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
                // item.holderType = this.semiHolder.find(items => items.holderId === item.potNo).holderType
            });
            this.$http(`${PACKAGING_API.PKGSPAUPDATEP_API}`, 'POST', this.listbomP).then(({ data }) => {
                this.$http(`${PACKAGING_API.PKGSPAUPDATES_API}`, 'POST', this.listbomS).then(({ data }) => {
                    if (resolve) {
                        resolve('resolve');
                    }
                    if (data.code !== 0) {
                        this.$notify.error({
                            title: '错误',
                            message: '物料领用' + data.msg
                        });
                    }
                });
                if (data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '物料领用' + data.msg
                    });
                }
            });
        },
        // 物料提交
        subSap(resolve) {
            this.$http(`${PACKAGING_API.PKGSAVEFORMP_API}`, 'POST', this.listbomP).then(({ data }) => {
                if (data.code !== 0) {
                    this.$errorTost(data.msg);
                }
                this.$http(`${PACKAGING_API.PKGSAVEFORMS_API}`, 'POST', this.listbomS).then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorTost(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                });
            });
        },
        /* eslint-enable no-shadow*/
        // 校验
        saprul(st) {
            let ty = true;
            // for (var i = 0; i < this.listbomS.length - 1; i++) {
            //   for (var j = i + 1; j < this.listbomS.length; j++) {
            //     if (this.listbomS[i].delFlag !== '1' && this.listbomS[j].delFlag !== '1') {
            //       if (this.listbomS[i].potNo !== '' && this.listbomS[i].batch !== '' && this.listbomS[j].potNo !== '' && this.listbomS[j].batch !== '' && this.listbomS[i].materialCode === this.listbomS[j].materialCode && this.listbomS[i].potNo === this.listbomS[j].potNo && this.listbomS[i].batch === this.listbomS[j].batch) {
            //         ty = false
            //         this.$message.error('存在重复批次，请核实')
            //         return false
            //       }
            //     }
            //   }
            // }
            if (st === 'submit') {
                this.listbomP.forEach(item => {
                    if (item.delFlag !== '1') {
                        if (item.productUseNum === 0 || item.productUseNum) {
                            //
                        } else {
                            ty = false;
                            this.$warningTost('物料必填项未填');
                            return false;
                        }
                    }
                });
                // if (this.order.properties !== '二合一&礼盒产线') {
                //   for (var itema of this.listbomS) {
                //     if (itema.delFlag !== '1') {
                //       if (itema.potNo && itema.filterDate && itema.productUseNum && itema.batch) {
                //         if (!itema.useUsage && this.order.factoryCode !== '6010') {
                //           ty = false
                //           this.$warningTost('物料半成品必填项未填')
                //           return false
                //         }
                //       } else {
                //         ty = false
                //         this.$warningTost('物料半成品必填项未填')
                //         return false
                //       }
                //     }
                //   }
                // }
            }
            return ty;
        },
        bomRule() {
            let ty = true;
            for (const sole of this.listbomS) {
                if (sole.potNo !== '' && sole.potNo !== null) {
                    if (sole.materialCode !== sole.holderMaterialCode) {
                        ty = false;
                        this.$warningTost('物料领用中' + sole.holderMaterialCode + '领用物料与BOM物料不一致，请确认！');
                        return false;
                    }
                }
            }
            return ty;
        },
        ListbomsRule(str) {
            const ty = true;
            if (this.order.properties !== '二合一&礼盒产线') {
                for (const itema of this.listbomS) {
                    if (itema.delFlag !== '1') {
                        if (str === 'saved') {
                            if (itema.potNo) {
                                if (!this.ListbomsAllMustFill(itema)) {
                                    return false;
                                }
                            }
                        } else if (!this.ListbomsAllMustFill(itema)) {
                                return false;
                            }
                    }
                }
            }
            return ty;
        },
        ListbomsAllMustFill(item) {
            let ty = true;
            if (item.potNo && item.filterDate && item.productUseNum && item.batch) {
                if (!item.useUsage && this.order.factoryCode !== '6010') {
                    ty = false;
                    this.$warningTost('物料半成品必填项未填');
                    return false;
                }
            } else {
                ty = false;
                this.$warningTost('物料半成品必填项未填');
                return false;
            }
            let holderId;
            this.repertory = [];
            this.repertoryS = [];
            this.listbomSS.map(subItem => {
                if (subItem.holderType === '006' && subItem.delFlag === '0') {
                    let sole = '';
                    sole = this.repertoryS.find(items => items.holderId === subItem.potNo);
                    holderId = subItem.potNo;
                    if (sole) {
                        sole.total = Number(sole.total) + Number(subItem.productUseNum);
                    } else {
                        this.repertoryS.push({
                            holderId: holderId,
                            total: subItem.productUseNum ? subItem.productUseNum : 0
                        });
                    }
                }
            });
            this.listbomS.map(sunItem => {
                if (sunItem.holderType === '006' && sunItem.delFlag === '0') {
                    let sole = '';
                    sole = this.repertory.find(items => items.holderId === sunItem.potNo);
                    holderId = sunItem.potNo;
                    if (sole) {
                        sole.total = Number(sole.total) + Number(sunItem.productUseNum);
                    } else {
                        this.repertory.push({
                            holderId: holderId,
                            total: sunItem.productUseNum ? sunItem.productUseNum : 0
                        });
                    }
                }
            });
            // for (const items of this.repertory) {
            //     let amount = 0;
            //     if (this.repertoryS.find(sos => sos.holderId === items.holderId)) {
            //         amount = this.repertoryS.find(sos => sos.holderId === items.holderId).total + this.semiHolder.find(so => so.holderId === items.holderId).amount;
            //     } else {
            //         amount = this.semiHolder.find(so => so.holderId === items.holderId).amount;
            //     }
            //     if (items.total > amount) {
            //         ty = false;
            //         this.$warningTost(this.semiHolder.find(so => so.holderId === items.holderId).holderName + '罐生产使用量超过库存，请重新调整');
            //         return false;
            //     }
            // }
            return ty;
        },
        /* eslint-disable @typescript-eslint/camelcase */
        ListbomsRule_BackUp() {
            let ty = true;
            if (this.order.properties !== '二合一&礼盒产线') {
                for (const itema of this.listbomS) {
                    if (itema.delFlag !== '1') {
                        if (itema.potNo && itema.filterDate && itema.productUseNum && itema.batch) {
                            if (!itema.useUsage && this.order.factoryCode !== '6010') {
                                ty = false;
                                this.$warningTost('物料半成品必填项未填');
                                return false;
                            }
                        } else {
                            ty = false;
                            this.$warningTost('物料半成品必填项未填');
                            return false;
                        }
                    }
                }
            } else {
                let holderId;
                this.repertory = [];
                this.repertoryS = [];
                this.listbomSS.map(item => {
                    if (item.holderType === '006' && item.delFlag === '0') {
                        let sole = '';
                        sole = this.repertoryS.find(items => items.holderId === item.potNo);
                        holderId = item.potNo;
                        if (sole) {
                            sole.total = Number(sole.total) + Number(item.productUseNum);
                        } else {
                            this.repertoryS.push({
                                holderId: holderId,
                                total: item.productUseNum ? item.productUseNum : 0
                            });
                        }
                    }
                });
                this.listbomS.map(item => {
                    if (item.holderType === '006' && item.delFlag === '0') {
                        let sole = '';
                        // if (item.id === '') {
                        sole = this.repertory.find(items => items.holderId === item.potNo);
                        holderId = item.potNo;
                        // } else {
                        //   sole = this.repertory.find(items => items.holderId === item.holderId)
                        //   holderId = item.holderId
                        // }
                        if (sole) {
                            sole.total = Number(sole.total) + Number(item.productUseNum);
                        } else {
                            this.repertory.push({
                                holderId: holderId,
                                total: item.productUseNum ? item.productUseNum : 0
                            });
                        }
                    }
                });
                for (const items of this.repertory) {
                    let amount = 0;
                    if (this.repertoryS.find(sos => sos.holderId === items.holderId)) {
                        amount = this.repertoryS.find(sos => sos.holderId === items.holderId).total + this.semiHolder.find(so => so.holderId === items.holderId).amount;
                    } else {
                        amount = this.semiHolder.find(so => so.holderId === items.holderId).amount;
                    }
                    // console.log(items.holderId + ' total: ' + items.total + ' amount: ' + amount)
                    if (items.total > amount) {
                        ty = false;
                        this.$warningTost(this.semiHolder.find(so => so.holderId === items.holderId).holderName + '罐生产使用量超过库存，请重新调整');
                        return false;
                    }
                }
            }
            return ty;
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 获取罐
        GetPot(id, orderNo) {
            this.$http(`${PACKAGING_API.PKGSAVEMATERIALHOLDER_API}`, 'POST', {
                factory: id,
                orderNo: orderNo
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.semiHolder = data.list;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        HolderChange(val, row) {
            const semiInfo = this.semiHolder.find(item => item.holderId === val);
            if (this.order.factoryCode !== '6010' && semiInfo.materialCode !== row.materialCode) {
                this.$warningTost('领用物料与BOM物料不一致，请确认！');
            }
            row.holderMaterialCode = semiInfo.materialCode;
            row.holderMaterialName = semiInfo.materialName;
            row.filterDate = semiInfo.fullDate;
            row.batch = semiInfo.batch;
            row.holderType = semiInfo.holderType;
            row.surplusAmount = semiInfo.amount.toString();
        },
        // 删除半成品
        dellistbomS(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
                // num++; 似乎没用到的变数
            }).catch(() => {
                // this.$infoTost('已取消删除');
            });
        },
        // 新增物料半成品
        addSapS(form, row) {
            let serialNumber = 0;
            const maxlength = form.length;
            if (maxlength === 0) {
                serialNumber = 1;
            } else {
                serialNumber = accAdd(form[accSub(maxlength, 1)].serialNumber, 1);
            }
            form.push({
                batch: '',
                orderId: this.order.orderId,
                status: '',
                id: '',
                materialCode: row.materialCode,
                materialName: row.materialName,
                unit: row.unit,
                potNo: '',
                filterDate: null,
                productUseNum: '',
                changePotDate: null,
                usePotDate: null,
                isSplit: '1',
                delFlag: '0',
                useUsage: '',
                holderMaterialCode: '',
                holderMaterialName: '',
                serialNumber: serialNumber
            });
        },
        // tableRowClassName
        tableRowClassName({ row }) {
            if (row.delFlag === '1') {
                return 'warning-row';
            }
            return '';
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        }
    }
};
</script>

<style scoped></style>
