<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steDisQuery"
            :type="'home'"
            :rules="queryTableFormRules"
            :query-form-data="queryTableFormData"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            @get-data-success="returnDataFromQueryTableForm"
        >
            <template v-if="targetQueryTableList.length!==0" slot="home">
                <mds-card :title="'溶解罐列表'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;">
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="item in targetQueryTableList" :key="item.potId" :span="4" style="min-width: 203px;">
                            <div class="card-bucket">
                                <div class="card-bucket__head">
                                    <span>{{ item.potNo }} - {{ holderStatus.filter( element => element.dictCode===item.potStatus)[0].dictValue }}</span>
                                    <el-button type="text" @click="goTargetDetail(item)">
                                        详情
                                    </el-button>
                                </div>
                                <div class="card-bucket__content">
                                    <div class="bucket-image">
                                        <div class="pot_border">
                                            <div class="pot" />
                                            <div class="pot_water">
                                                <div
                                                    class="pot_water_sole"
                                                    :style="{height: item.ratio+'%', background: '#1890FF' }"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="btn-group">
                                        <el-button v-if="isAuth('steDisIn')" size="small" plain :disabled="!(item.potStatus==='E'||item.potStatus==='R')" @click="btnImportBucket(item,)">
                                            入罐
                                        </el-button>
                                        <el-button v-if="item.potStatus!=='M' && isAuth('steDisFull')" size="small" plain :disabled="item.potStatus!=='R'" @click="btnFillBucket(item)">
                                            <!-- <el-button v-if="item.potStatus!=='M'" size="small" plain @click="btnFillBucket(item)"> -->
                                            满罐
                                        </el-button>
                                        <el-button v-else-if="isAuth('steDisFull')" size="small" plain @click="btnCannelFillBucket(item)">
                                            取消<br>满罐
                                        </el-button>
                                        <el-button v-if="isAuth('steDisClear')" size="small" plain :disabled="!(item.potStatus==='U')" @click="btnClearBucket(item)">
                                            <!-- <el-button size="small" plain @click="btnClearBucket(item)"> -->
                                            清罐
                                        </el-button>
                                    </div>
                                </div>
                                <div class="card-bucket__fotter">
                                    <div v-if="!(item.potStatus==='E'||item.potStatus==='C')">
                                        <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.prodcutMaterialName || '未有生产物料' }}</span><span>{{ item.potAmount || '0' }} </span>KG
                                    </div>
                                    <!-- <div><span>溶解辅料</span><span>10/100</span></div> -->
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <!-- <el-pagination v-if="targetQueryTableList.length!==0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="prev, pager, next,sizes, jumper" :total="totalCount" @size-change="handlePageSizeChangeFromRead" @current-change="handleCurrentPageChangeFromRead" /> -->
                </mds-card>
            </template>
        </query-table>
        <!-- 溶解罐清洗/满罐 -->
        <el-dialog :title="dialogForm[dialogType].title" width="50%" :close-on-click-modal="false" :visible.sync="isBucketDialogVisible">
            <el-form :model="dialogForm[dialogType].form" size="small" label-width="110px" class="orderMangedialog">
                <el-form-item label="溶解罐号：">
                    <span class="default">{{ dialogForm[dialogType].form.number }}</span>
                </el-form-item>
                <el-form-item label="状态：">
                    <span class="default">{{ dialogForm[dialogType].form.statusC }}</span>
                </el-form-item>
                <el-form-item :label="dialogType==='filled'?'满罐：':'清洗完成：'">
                    <!-- <el-switch v-if="dialogType==='filled'" v-model="dialogForm[dialogType].form.doit" />
                    <el-switch v-else v-model="dialogForm[dialogType].form.doit" /> -->
                    <el-checkbox v-if="dialogType==='filled'" v-model="dialogForm[dialogType].form.doit">
                        满罐
                    </el-checkbox>
                    <el-checkbox v-else v-model="dialogForm[dialogType].form.doit">
                        清罐
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model.trim="dialogForm[dialogType].form.remark" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="操作人：">
                    <span class="default">{{ dialogForm[dialogType].form.changer }}</span>
                </el-form-item>
                <el-form-item label="操作时间：">
                    <span class="default">{{ dialogForm[dialogType].form.changed }}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="btnClearBucketStatus">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="btnComfirmBucketStatus">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 溶解罐入罐 -->
        <import-bucket ref="importBucket" @importBucketFinish="importBucketFinish" />
    </div>
</template>
<script lang="ts">

    // 空罐 E v
    // 入料中 R (投料)  v
    // 待清洗 C
    // 满罐 M  v
    // 领用中 U  v
    import { Vue, Component } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import ImportBucket from './ImportBucket.vue';
    import { COMMON_API, STE_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'DissolveBucketIndex',
        components: {
            ImportBucket
        }
    })
    export default class DissolveBucketIndex extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
            importBucket: HTMLFormElement;
        }

        // 共用变数
        currentWorkShop='' // 当前车间
        currentPotId='' // 选取的当前罐id
        currentPotNo='' // 选取的当前罐号
        holderStatus: HolderStatus[]=[] // 罐状态对应

        // totalCount = 1
        // currPage = 1
        // pageSize = 10

        targetQueryTableList: BucketDataListObj[] = []
        isTableDialogVisible=false
        isBucketDialogVisible = false;
        dialogType='filled' // 弹窗类型

        dialogForm = {
            filled: {
                title: '溶解罐满罐',
                form: {
                    cycle: '',
                    number: '',
                    status: '',
                    statusC: '',
                    doit: false,
                    remark: '',
                    changer: '',
                    changed: '',
                    id: ''
                }
            },
            clear: {
                title: '溶解罐清洗',
                form: {
                    cycle: '',
                    number: '',
                    status: '',
                    statusC: '',
                    doit: false,
                    remark: '',
                    changer: '',
                    changed: '',
                    id: ''
                }
            }
        }; // 弹窗 form

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                rule: [{ required: true, message: ' ', trigger: 'change' }],
                labelWidth: 90,
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.ORG_QUERY_WORKSHOP_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptType: ['WORK_SHOP'],
                            deptName: '杀菌'
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['potId']
            },
            {
                type: 'select',
                label: '溶解罐号',
                prop: 'potId',
                labelWidth: 80,
                optionsFn: val => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptId: val,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '状态',
                prop: 'potStatus',
                labelWidth: 50,
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_HOLDER_STATUS' }).then((res) => {
                            const temp = res
                            temp.data.data = temp.data.data.filter(element => element.dictValue !== '发酵')
                            temp.data.data.forEach(item => {
                                if (item.dictValue === '投料') {
                                    item.dictValue = '入料中'
                                } else if (item.dictValue === '领用') {
                                    item.dictValue = '领用中'
                                } else if (item.dictValue === '清洗') {
                                    item.dictValue = '待清洗'
                                }
                            })
                            resolve(temp)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]


        mounted() {
            // 抓取字典里罐状态并改写
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_HOLDER_STATUS' }).then(({ data }) => {
                this.holderStatus = []
                const temp = data
                temp.data = temp.data.filter(element => element.dictValue !== '发酵')
                temp.data.forEach(item => {
                    if (item.dictValue === '投料') {
                        item.dictValue = '入料中'
                    } else if (item.dictValue === '领用') {
                        item.dictValue = '领用中'
                    } else if (item.dictValue === '清洗') {
                        item.dictValue = '待清洗'
                    }
                    this.holderStatus.push({ dictCode: item.dictCode, dictValue: item.dictValue })
                })
            });

        }

        setEnvVal(val) {
            this.currentWorkShop = val
        }

        // 入罐完成
        importBucketFinish() {
            this.$refs.queryTable.getDataList(true)
        }

        // [BTN]入罐
        btnImportBucket(item) {
            console.log('入罐item')
            console.log(item)
            this.isTableDialogVisible = true;
            this.$refs.importBucket.init(item, this.currentWorkShop)
        }

        // [BTN]满罐
        btnFillBucket(item) {
            console.log(item)
            this.dialogType = 'filled'
            this.isBucketDialogVisible = true;
            this.currentPotId = item.potId // 选取的当前罐id
            this.currentPotNo = item.potNo // 选取的当前罐号
            const tempHolderStatus: HolderStatus[] = this.holderStatus.filter(element => element.dictCode === item.potStatus)
            this.dialogForm.filled.form = {
                    cycle: item.cycle,
                    number: this.currentPotNo,
                    status: item.potStatus,
                    statusC: tempHolderStatus[0].dictValue,
                    doit: false,
                    id: this.currentPotId,
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }

        }

        // [BTN]取消满罐
        btnCannelFillBucket(item) {
            console.log(item)
            this.dialogType = 'filled'
            // this.isBucketDialogVisible = true;
            this.currentPotId = item.potId // 选取的当前罐id
            this.currentPotNo = item.potNo // 选取的当前罐号
            const tempHolderStatus: HolderStatus[] = this.holderStatus.filter(element => element.dictCode === 'R')
            this.dialogForm.filled.form = {
                    cycle: item.cycle,
                    number: this.currentPotNo,
                    status: 'R',
                    statusC: tempHolderStatus[0].dictValue,
                    doit: false,
                    remark: '',
                    id: this.currentPotId,
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
            this.dialogForm.filled.form.status = 'R'
                STE_API.STE_DISSOLUTIONBUCKET_FULL_API({
                    cycle: item.cycle,
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    potId: this.currentPotId,
                    fullFlag: '0',
                    remark: ''
                }).then(({ data }) => {
                    console.log('取消满罐')
                    console.log(data)
                    this.$refs.queryTable.getDataList(true)
                });

        }


        // queryTable 查询请求
        queryTableListInterface = params => {
            console.log('搜寻传值')
            console.log(params)
            const paramsTemp = JSON.parse(JSON.stringify(params))
            paramsTemp.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            if (params.potStatus === '') {
                paramsTemp.potStatus = []
            } else {
                paramsTemp.potStatus = [params.potStatus]
            }
            return STE_API.STE_DISSOLUTIONBUCKET_QUERY_API(paramsTemp);
        };

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                this.targetQueryTableList = data.data
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        // // 改变每页条数
        // handlePageSizeChangeFromRead(val: number): void {
        //     this.pageSize = val;
        //     this.getMsgDataList();
        // }

        // // 跳转页数
        // handleCurrentPageChangeFromRead(val: number): void {
        //     this.currPage = val;
        //     this.getMsgDataList();
        // }

        // getMsgDataList(): void {
        //     //
        // }


        // 去详请
        goTargetDetail(item) {
            item.workShop = this.currentWorkShop
            this.$store.commit('sterilize/updateDissolveBucket', item);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-DissolveBucket-DissolveBucketDetail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Sterilize-DissolveBucket-DissolveBucketDetail`
                });
            }, 100);
        }

        // [BTN] 关闭溶解罐弹窗
        btnClearBucketStatus() {
            this.isBucketDialogVisible = false
        }

        // [BTN]溶解罐状弹窗确认
        btnComfirmBucketStatus() {
            if (this.dialogType === 'filled') {
                if (this.dialogForm.filled.form.doit === true) {
                    this.dialogForm.filled.form.status = 'M'
                } else {
                    this.dialogForm.filled.form.status = 'R'
                }
                console.log('溶解罐满罐')
                // 溶解罐管理-满罐
                STE_API.STE_DISSOLUTIONBUCKET_FULL_API({
                    cycle: this.dialogForm.filled.form.cycle,
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    potId: this.dialogForm.filled.form.id,
                    fullFlag: this.dialogForm.filled.form.status === 'M' ? '1' : '0',
                    remark: this.dialogForm.filled.form.remark
                }).then(({ data }) => {
                    console.log('满罐')
                    console.log(data)
                    this.$refs.queryTable.getDataList(true)
                    this.isBucketDialogVisible = false
                });
            } else {
                if (this.dialogForm.clear.form.doit === true) {
                    this.dialogForm.clear.form.status = 'E'
                } else {
                    this.dialogForm.clear.form.status = 'C'
                }
                console.log('溶解罐清理')
                // 溶解罐管理-清罐
                STE_API.STE_DISSOLUTIONBUCKET_CLEAN_API({
                    cycle: this.dialogForm.clear.form.cycle,
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    potId: this.dialogForm.clear.form.id,
                    fullFlag: this.dialogForm.clear.form.status === 'E' ? '0' : '1', // API 似乎有误
                    remark: this.dialogForm.clear.form.remark
                }).then(({ data }) => {
                    console.log('清罐')
                    console.log(data)
                    this.$refs.queryTable.getDataList(true)
                    this.isBucketDialogVisible = false
                });
            }
        }

        // 清罐
        btnClearBucket(item) {
            console.log(item)
            this.$confirm('是否清罐?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dialogType = 'clear'
                this.isBucketDialogVisible = true;
                this.currentPotId = item.potId // 选取的当前罐id
                this.currentPotNo = item.potNo // 选取的当前罐号
                const tempHolderStatus: HolderStatus[] = this.holderStatus.filter(element => element.dictCode === item.potStatus)
                this.dialogForm.clear.form = {
                        cycle: item.cycle,
                        number: this.currentPotNo,
                        status: item.potStatus,
                        statusC: tempHolderStatus[0].dictValue,
                        doit: false,
                        remark: '',
                        id: this.currentPotId,
                        changer: getUserNameNumber(),
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            });
        }
    }

interface DeptObject {
    id?: string;
}
interface BucketDataListObj{
    cycle?: string;
    id?: string;
    potAmount?: string;
    potId?: string;
    potNo?: string;
    potStatus?: string;
    prodcutMaterial?: string;
    prodcutMaterialName?: string;
}

interface HolderStatus{
    dictCode: string;
    dictValue: string;
}

interface CurrentDataTable{
    changed?: string;
    changer?: string;
    feedAmount?: number;
    feedBatch?: string;
    feedDate?: string;
    feedMan?: string;
    feedMaterial?: string;
    feedMaterialName?: string;
    feedUnit?: string;
    id?: string;
    potCount?: number;
    potNo?: string;
    prodcutMaterial?: string;
    productMaterialName?: string;
    remark?: string;
    delFlag?: number;
    userList?: object[];
}

</script>
<style scoped>
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

.card-bucket__content >>> .el-button span {
    line-height: 20px;
}

.orderMangedialog >>> .el-checkbox__inner {
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

.orderMangedialog >>> .el-checkbox__inner::after {
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

.orderMangedialog >>> .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: rotate(0deg) scaleY(1);
}

.header_main >>> .searchCard .el-form-item.is-error .el-input__inner,
.header_main >>> .searchCard .el-form-item.is-success .el-input__inner,
.header_main >>> .searchCard .el-form-item.is-error .el-input__inner:focus,
.header_main >>> .searchCard .el-form-item.is-success .el-input__inner:focus {
    border-color: #dcdfe6;
}

</style>

<style lang="scss" scoped>

.el-form-item {
    margin-bottom: 0;
}

.orderMangedialog {
    .el-form-item {
        margin-bottom: 10px;
    }
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
        height: 20px;
        padding: 0 10px;
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
    text-align: right;
}


</style>
