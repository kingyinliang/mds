<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :type="'home'"
            :rules="queryTableRules"
            :query-form-data="queryTableFormData"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            @get-data-success="setData"
        >
            <template slot="home">
                <mds-card :title="'溶解罐列表'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;">
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="item in bucketDataList" :key="item.id" :span="4" style="min-width: 203px;">
                            <div class="card-bucket">
                                <div class="card-bucket__head">
                                    <span>{{ item.bucketNo }} - {{ item.bucketStatus }}</span>
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
                                                    :style="{height: '80%', background: '#1890FF' }"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="btn-group">
                                        <el-button size="small" plain :disabled="!(item.bucketStatus==='空罐'||item.bucketStatus==='入罐')" @click="openImportBucketDialog">
                                            入罐
                                        </el-button>
                                        <el-button v-if="item.bucketStatus!=='满罐'" size="small" plain :disabled="item.bucketStatus!=='入料中'" @click="fillBucket">
                                            满罐
                                        </el-button>
                                        <el-button v-else size="small" plain @click="item.bucketStatus==='入料中'">
                                            取消满罐
                                        </el-button>
                                        <el-button size="small" plain :disabled="!(item.bucketStatus==='领用中')" @click="clearBucket">
                                            清罐
                                        </el-button>
                                    </div>
                                </div>
                                <div class="card-bucket__fotter">
                                    <div><span>杀菌完豆瓣</span><span>1000 KG</span></div>
                                    <div><span>溶解辅料</span><span>10/100</span></div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-pagination v-if="bucketDataList.length===0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="prev, pager, next,sizes, jumper" :total="totalCount" @size-change="handlePageSizeChangeFromRead" @current-change="handleCurrentPageChangeFromRead" />
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
                    <span class="default">{{ dialogForm[dialogType].form.status }}</span>
                </el-form-item>
                <el-form-item :label="dialogType==='filled'?'满罐：':'清洗完成：'">
                    <el-switch v-if="dialogType==='filled'" v-model="dialogForm[dialogType].form.doit" />
                    <el-switch v-else v-model="dialogForm[dialogType].form.doit" />
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
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="clearBucketStatus">取消</el-button>
                <el-button type="primary" size="small" @click="comfirmBucketStatus(true)">确定</el-button>
            </span>
        </el-dialog>
        <!-- 溶解罐入罐 -->
        <el-dialog title="入罐" :close-on-click-modal="false" :visible.sync="isTableDialogVisible" width="70%">
            <el-form ref="importBucketForm" :model="importBucketForm">
                <el-table class="newTable" :data="bucketDataList[nowBucketNo]" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%;">
                    <el-table-column label="序号" type="index" width="55" fixed="left" />
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            溶解罐号
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                自动带出
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>生产物料
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                自动带出
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>配置锅数
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入锅数" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>投料物料
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.classes" size="small" clearable>
                                <el-option
                                    v-for="item in classesOptions"
                                    :key="item.dictCode"
                                    :label="item.dictValue"
                                    :value="item.dictCode"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="inStorageUnit" width="100">
                        <template slot="header">
                            <span class="notNull">* </span>单位
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.inStorageUnit'" :rules="dataRules.inStorageUnit">
                                <el-select v-model="scope.row.inStorageUnit" placeholder="请选择" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                                    <el-option
                                        v-for="item in unitOptions"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>投料数量
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入数量" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>投料批次
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入数量" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>投料人
                        </template>
                        <template slot-scope="scope">
                            <div class="required" style="min-height: 32px; line-height: 32px;">
                                <span v-if="!isRedact" style="cursor: pointer;">
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</i>
                                </span>
                                <span>
                                    <i v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</i>
                                    <i>点击选择人员</i>
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="投料时间" width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">* </span>投料时间
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker
                                v-model="scope.row.productDate"
                                type="date"
                                placeholder="选择日期"
                                size="small"
                                style="width: 180px;"
                                value-format="yyyy-MM-dd"
                                format="yyyy.MM.dd"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" />
                    <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @click="removeFirstDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item label="满罐选项: ">
                    <el-switch v-model="importBucketForm.filled" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="clearImportBucket">取消</el-button>
                <el-button type="primary" size="small" @click="comfirmImportBucket">确定</el-button>
            </span>
        </el-dialog>
        <!-- 投料人员 -->
        <el-dialog title="投料人员" width="60%" :close-on-click-modal="false" :visible.sync="isLoanedPersonnelStatusDialogVisible">
            <loaned-personnel ref="loanedPersonnel" :org-tree="orgTree" :arr-list="arrList" @changeUser="changeUser" />
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="isLoanedPersonnelStatusDialogVisible = false">取消</el-button>
                <el-button type="primary" size="small">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import LoanedPersonnel from 'components/LoanedPersonnel.vue';
    import { COMMON_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'DissolveBucketIndex',
        components: {
            LoanedPersonnel
        }
    })
    export default class DissolveBucketIndex extends Vue {

        $refs: {
            loanedPersonnel: HTMLFormElement;
        }

        // 当前处理的 bucket index
        nowBucketNo=0

        holderStatus=[
            {
                value: 'E',
                label: '空罐'
            },
            {
                value: '选项1',
                label: '入料中'
            },
            {
                value: '选项1',
                label: '满罐'
            },
            {
                value: 'U',
                label: '领用中'
            }
        ]

        dataList: []
        totalCount = 1
        currPage = 1
        pageSize = 10
        dissolveBucketCode = ''

        bucketDataList=[
            {
                id: 1,
                bucketNo: 4,
                bucketStatus: '入料中',
                filled: false,
                cleared: false
            }
        ]

        orgArrList: string[] = []

        isBucketDialogVisible = false;
        isTableDialogVisible = false;
        dialogType='filled'
        dialogForm = {
            filled: {
                title: '溶解罐满罐',
                form: {
                    number: 'a22',
                    status: '领用中',
                    doit: false,
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            },
            clear: {
                title: '溶解罐清洗',
                form: {
                    number: 'a23',
                    status: '清洗中',
                    doit: false,
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            }
        };

        tableShow=[
            {
                prop: 'changer',
                label: '操作人'
            },
            {
                prop: 'changed',
                label: '操作时间'
            }
        ]

        // 入罐表单数据
        importBucketForm= {}
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '杀菌'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['dissolveBucketNo']
            },
            {
                type: 'select',
                label: '溶解罐号',
                prop: 'dissolveBucketNo',
                optionsFn: val => {
                    return COMMON_API.HOLDER_QUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptId: val,
                        current: 1,
                        size: 9999,
                        holderType: '019' // 溶解罐参数编码
                        // holderType: this.dissolveBucketCode
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
                prop: 'status',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            }
        ]

        queryTableRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        isLoanedPersonnelStatusDialogVisible = false;
        orgTree: object[] = [];
        arrList: string[] = [];

        mounted() {

            this.isLoanedPersonnelStatusDialogVisible = true;
            this.getTree()
        }

        // 查询请求
        queryTableListInterface = params => {
            params.current = 1;
            params.size = 10;
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // return STE_API.STE_HOME_LIST_API(params);
        };

        setData(data) {
            console.log(data);
        }

        // 改变每页条数
        handlePageSizeChangeFromRead(val: number): void {
            this.pageSize = val;
            this.getMsgDataList();
        }

        // 跳转页数
        handleCurrentPageChangeFromRead(val: number): void {
            this.currPage = val;
            this.getMsgDataList();
        }

        getMsgDataList(): void {
            //
        }

        // 获取组织结构树
        getTree() {
            COMMON_API.ORGSTRUCTURE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(({ data }) => {
                console.log('22222')
                console.log(data)
                this.orgTree = data.data;
               // this.arrList = [(this.orgTree[0].children[0].id)];
            });
        }


        // 员工确认
        changeUser() {
            // this.row.userList = userId;
            this.isLoanedPersonnelStatusDialogVisible = false;

        }


        // 去详请
        goTargetDetail() {
            // if (!isAuth('gra:material:list')) {
            //     this.$notify.error({
            //         title: MSG.AUTH.noAuthority.title,
            //         message: MSG.AUTH.noAuthority.message
            //     });
            //     return;
            // }
            // // ！！！！！！此部份逻辑不一样会需要送不同参数！！！！！！
            // this.targetAugs = {
            //     holderId: item.holderId,
            //     factory: this.plantList.factoryIDValue,
            //     deptId: this.plantList.workshopIDValue
            // };
            // this.mainTabs = this.mainTabs.filter(tabItem => tabItem.name !== 'DataEntry-Granary-BeanPulp-dataEntryIndex');
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Sterilize-DissolveBucket-DissolveBucketDetail`
                });
            }, 100);
        }

        openImportBucketDialog() {
            this.isTableDialogVisible = true
        }

        //  RowDelFlag
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';

        }

        // 满罐
        fillBucket() {
            this.dialogType = 'filled'
            this.isBucketDialogVisible = true;
        }

        // 取消溶解罐状态
        clearBucketStatus() {
            this.isBucketDialogVisible = false
        }

        // 溶解罐状态确认
        comfirmBucketStatus() {
            if (this.dialogType === 'filled') {
                if (this.bucketDataList[this.nowBucketNo].filled === true) {
                    this.bucketDataList[this.nowBucketNo].bucketStatus = '满罐'
                } else {
                    this.bucketDataList[this.nowBucketNo].bucketStatus = '入料中'
                }
            } else if (this.bucketDataList[this.nowBucketNo].cleared === true) {
                    this.bucketDataList[this.nowBucketNo].bucketStatus = '空罐'
                }

        }

        // 取消入罐
        clearImportBucket() {
            this.bucketDataList[this.nowBucketNo].filled = false
            this.isTableDialogVisible = false
        }

        // 入罐确认
        comfirmImportBucket() {
            if (this.bucketDataList[this.nowBucketNo].filled === true) {
                this.bucketDataList[this.nowBucketNo].bucketStatus = '满罐'
            } else {
                this.bucketDataList[this.nowBucketNo].bucketStatus = '入料中'
            }

        }

        // 清罐
        clearBucket(item) {
            this.$confirm('是否清罐?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dialogType = 'clear'
                this.isBucketDialogVisible = true;
            });
        }

        // 搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.deptName.indexOf(value) !== -1;
        }

        // 组织架构点击
        treeNodeClick(row: DeptObject) {
            this.$emit('treeNodeClick', row, true)
        }
    }

interface DeptObject {
    id?: string;
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
</style>

<style lang="scss" scoped>
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


</style>
