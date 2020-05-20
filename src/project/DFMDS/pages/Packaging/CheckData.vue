<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="fiex">
                <el-col :span="20">
                    <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi_row">
                        <el-form-item label="生产车间：">
                            <el-input v-model="formHeader.workShop" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产产线：">
                            <el-input v-model="formHeader.productLine" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <el-input v-model="formHeader.productMaterial" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <el-input v-model="formHeader.orderNo" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="订单产量：">
                            <el-input v-model="formHeader.orderQuantity" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="订单日期：">
                            <el-input v-model="formHeader.orderDate" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-input v-model="formHeader.productDate" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <el-input v-model="formHeader.submitPeople" size="small" class="header_main__input" disabled />
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <el-input v-model="formHeader.submitTime" size="small" class="header_main__input" disabled />
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4">
                    <div style="float: right; font-size: 14px; line-height: 30px;">
                        <span class="point" :style="{background: orderStatus === 'noPass' ? 'red' : 'rgb(103, 194, 58)'}" />订单状态：
                        <span :style="{color: orderStatus === 'noPass' ? 'red' : ''}">
                            {{ orderStatus === 'noPass' ? '审核不通过' : (orderStatus === 'save' ? '已保存' : (orderStatus === 'submit' ? '已提交' : (orderStatus === 'checked' ? '通过' : ''))) }}
                        </span>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs v-model="activeName" type="border-card" class="NewDaatTtabs tabsPages" @tab-click="tabClick">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    <el-button>密封度检测</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>密封度：Kpa</span>
                    <div style="float: right;">
                        <el-button type="primary" size="small" @click="addRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="tightnesList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                    <el-table-column prop="testTime" width="200">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.testTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" placeholder="请选择时间" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第一排" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.firstRow" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第二排" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.secondRow" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第三排" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.thirdRow" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第四排" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.fourthRow" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="record" label="记录人">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.record" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini">
                            删除
                        </el-button>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    <el-button>称重记录</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>称重记录：g</span>
                    <div style="float: right;">
                        <el-button type="primary" size="small" @click="addRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table2" class="newTable" header-row-class-name="tableHead" :data="weightRecordList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                    <el-table-column prop="recordTime" width="200">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.recordTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" placeholder="请选择时间" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第一排净含量" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.firstRowContent" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第一排调称" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.firstRowTune" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第二排净含量" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.secondRowContent" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第二排调称" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.secondRowTune" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第三排净含量" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.thirdRowContent" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第三排调称" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.thirdRowTune" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第四排净含量" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.fourthRowContent" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="第四排调称" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.fourthRowTune" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="酱盒重量下限" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.weightDown" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="酱盒重量上限" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.weightUp" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="厂家" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.factory" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="记录人" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.record" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini">
                            删除
                        </el-button>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label" class="spanview">
                    <el-button>NR检测</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>NR检测</span>
                    <div style="float: right;">
                        <el-button type="primary" size="small" @click="addRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table3" class="newTable" header-row-class-name="tableHead" :data="NRTestList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                    <el-table-column prop="recordTime" width="200">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.recordTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" placeholder="请选择时间" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="NR含量（%）">
                        <el-table-column label="第一排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.firstRowContent" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第二排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.secondRowContent" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第三排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.thirdRowContent" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第四排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.fourthRowContent" size="mini" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="NR流量（L/min）">
                        <el-table-column label="第一排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.firstRowFlow" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第二排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.secondRowFlow" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第三排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.thirdRowFlow" size="mini" />
                            </template>
                        </el-table-column>
                        <el-table-column label="第四排" width="120">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.fourthRowFlow" size="mini" />
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="罐内温度（C）" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.tankTemperature" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="NR温度（C）" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.NRTemperature" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="NR纯度（%）" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.NRPurity" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="二级储压（Mpa）" width="140">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.secondPress" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="混合比重（%）" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.mixProportion" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="记录人" width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.record" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini">
                            删除
                        </el-button>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="4">
                <span slot="label" class="spanview">
                    <el-button>扭力检测</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>扭力检测</span>
                    <div style="float: right;">
                        <el-button type="primary" size="small" @click="addRow">
                            新增
                        </el-button>
                    </div>
                </div>
                <el-table ref="table4" class="newTable" header-row-class-name="tableHead" :data="torqueTestList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                    <el-table-column width="200">
                        <template slot="header">
                            <i class="reqI">*</i><span>检测时间</span>
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.testTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 180px;" placeholder="请选择时间" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="扭力矩/N.m" width="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.torque" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="真空度/Mpa" width="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.vacuum" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="检查人">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.check" size="mini" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini">
                            删除
                        </el-button>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_tips">
                        <i class="el-icon-info" />
                        <span v-if="isRedact">点击保存按钮，当前页面编辑信息将提交系统</span>
                        <span v-else>点击编辑按钮，对当前页面进行编辑</span>
                    </div>
                    <div class="redact_btn">
                        <el-button v-if="isRedact" type="primary" size="small" @click="cancel">
                            取消
                        </el-button>
                        <el-button type="primary" size="small" @click="save">
                            {{ isRedact ? '保存' : '编辑' }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            formHeader: {
                workShop: '压榨一车间',
                productLine: '一车',
                productMaterial: '六月香甜面酱手工线',
                orderNo: '129300303',
                orderQuantity: '1000KG',
                orderDate: '2020-05-10',
                productDate: '2020-05-13',
                submitPeople: '李潇梅',
                submitTime: '2020-05-10'

            },
            activeName: '1',
            orderStatus: 'noPass',
            isRedact: false,
            tightnesList: [
                { testTime: '2020-05-12 08:30', firstRow: '合格', secondRow: '不合格', thirdRow: '正常', fourthRow: '异常', remark: '备注', record: '李潇梅' },
                { testTime: '2020-05-12 08:30', firstRow: '合格', secondRow: '不合格', thirdRow: '正常', fourthRow: '异常', remark: '备注', record: '李潇梅' },
                { testTime: '2020-05-12 08:30', firstRow: '合格', secondRow: '不合格', thirdRow: '正常', fourthRow: '异常', remark: '备注', record: '李潇梅' }
            ],
            weightRecordList: [
                { recordTime: '2020-05-12 08:30', firstRowContent: '120g', firstRowTune: '140g', secondRowContent: '160g', secondRowTune: '180g', thirdRowContent: '200g', thirdRowTune: '220g', fourthRowContent: '240g', fourthRowTune: '260', weightDown: '100g', weightUp: '300g', factory: '济南新昌', remark: '备注', record: '李潇梅' },
                { recordTime: '2020-05-12 08:30', firstRowContent: '120g', firstRowTune: '140g', secondRowContent: '160g', secondRowTune: '180g', thirdRowContent: '200g', thirdRowTune: '220g', fourthRowContent: '240g', fourthRowTune: '260', weightDown: '100g', weightUp: '300g', factory: '济南新昌', remark: '备注', record: '李潇梅' },
                { recordTime: '2020-05-12 08:30', firstRowContent: '120g', firstRowTune: '140g', secondRowContent: '160g', secondRowTune: '180g', thirdRowContent: '200g', thirdRowTune: '220g', fourthRowContent: '240g', fourthRowTune: '260', weightDown: '100g', weightUp: '300g', factory: '济南新昌', remark: '备注', record: '李潇梅' }
            ],
            NRTestList: [
                { recordTime: '2020-05-12 08:30', firstRowContent: '30%', secondRowContent: '40%', thirdRowContent: '50%', fourthRowContent: '60%', firstRowFlow: '100', secondRowFlow: '120', thirdRowFlow: '140', fourthRowFlow: '160', tankTemperature: '85C', NRTemperature: '95C', NRPurity: '99.9%', secondPress: '100Mpa', mixProportion: '90%', remark: '备注', record: '李潇梅' },
                { recordTime: '2020-05-12 08:30', firstRowContent: '30%', secondRowContent: '40%', thirdRowContent: '50%', fourthRowContent: '60%', firstRowFlow: '100', secondRowFlow: '120', thirdRowFlow: '140', fourthRowFlow: '160', tankTemperature: '85C', NRTemperature: '95C', NRPurity: '99.9%', secondPress: '100Mpa', mixProportion: '90%', remark: '备注', record: '李潇梅' },
                { recordTime: '2020-05-12 08:30', firstRowContent: '30%', secondRowContent: '40%', thirdRowContent: '50%', fourthRowContent: '60%', firstRowFlow: '100', secondRowFlow: '120', thirdRowFlow: '140', fourthRowFlow: '160', tankTemperature: '85C', NRTemperature: '95C', NRPurity: '99.9%', secondPress: '100Mpa', mixProportion: '90%', remark: '备注', record: '李潇梅' }
            ],
            torqueTestList: [
                { testTime: '2020-05-14 08:30', torque: '100/N.m', vacuum: '99Mpa', remark: '备注', check: '李潇梅' },
                { testTime: '2020-05-14 08:30', torque: '100/N.m', vacuum: '99Mpa', remark: '备注', check: '李潇梅' },
                { testTime: '2020-05-14 08:30', torque: '100/N.m', vacuum: '99Mpa', remark: '备注', check: '李潇梅' }
            ],
            currPage: 1,
            pageSize: 10,
            totalCount: 8
        };
    },
    computed: {
            sidebarFold: {
                get() {
                    return this.$store.state.common.sidebarFold;
                }
            }
        },
    methods: {
        addRow() {
            switch (this.activeName) {
                case '1': if (this.tightnesList.length === 0) {
                            alert('11');
                        } else {
                            const last = this.tightnesList[this.tightnesList.length - 1];
                            this.tightnesList.push(last);
                        }
                    break;
                case '2': if (this.weightRecordList.length === 0) {
                            alert('11');
                        } else {
                            const last = this.weightRecordList[this.weightRecordList.length - 1];
                            this.weightRecordList.push(last);
                        }
                    break;
                case '3': if (this.NRTestList.length === 0) {
                            alert('11');
                        } else {
                            const last = this.NRTestList[this.NRTestList.length - 1];
                            this.NRTestList.push(last);
                        }
                    break;
                case '4': if (this.torqueTestList.length === 0) {
                            alert('11');
                        } else {
                            const last = this.torqueTestList[this.torqueTestList.length - 1];
                            this.torqueTestList.push(last);
                        }
                    break;
                default:
                    break;
            }
        },
        cancel() {
            this.isRedact = false;
        },
        save() {
            if (!this.isRedact) {
                alert('编辑');
            } else {
                alert('保存');
            }
            this.isRedact = !this.isRedact;
        },
        tabClick() {
            switch (this.activeName) {
                case '1':this.orderStatus = 'noPass';
                    break;
                case '2':this.orderStatus = 'save';
                    break
                case '3':this.orderStatus = 'submit';
                    break;
                case '4':this.orderStatus = 'checked';
                    break;
                default:
                    break;
            }
        },
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
        }
    }
};
</script>

<style scoed lang="scss">
.header_main__input .el-input__inner {
    width: 170px;
    color: #666 !important;
    background-color: #f5f5f5;
    border: none;
}
.tab__heads {
    margin-bottom: 10px;
    line-height: 32px;
}
.title-icon {
    float: left;
    width: 4px;
    height: 12px;
    margin-top: 10px;
    margin-right: 5px;
    background: #487bff;
    border-radius: 2px;
}

// .redactBox {
//     position: fixed;
//     right: 0;
//     bottom: 0;
//     z-index: 99;
//     width: 100%;
//     height: 48px;
//     transition: all 0.3s;
//     .redact {
//         width: 100%;
//         height: 100%;
//         padding: 8px 16px;
//         background: rgba(255, 255, 255, 1);
//         border: 1px solid rgba(232, 232, 232, 1);
//         box-shadow: 2px -3px 5px 0 rgba(214, 210, 196, 1);
//         &_tips {
//             float: left;
//             color: #999;
//             font-size: 14px;
//             line-height: 32px;
//             i {
//                 margin-right: 5px;
//                 color: #487bff;
//             }
//         }
//         &_btn {
//             float: right;
//             .el-button--primary {
//                 color: #000;
//                 background-color: #fff;
//                 border-color: #d9d9d9;
//             }
//             .el-button--primary:last-child {
//                 color: #fff;
//                 background-color: #487bff;
//                 border-color: #487bff;
//             }
//         }
//     }
// }

</style>
