<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :type="'home'"
            :rules="rules"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
        >
            <template slot="home">
                <mds-card :title="'溶解罐列表'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;">
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="o in 10" :key="o" :span="4" style="min-width: 203px;">
                            <div class="card-bucket">
                                <div class="card-bucket__head">
                                    <span>4#-领用中</span>
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
                                        <button class="button" @click="toRouter('1', item)">
                                            入罐
                                        </button>
                                        <button class="button" @click="toRouter('2', item)">
                                            满罐
                                        </button>
                                        <button class="button" @click="toRouter('3', item)">
                                            清罐
                                        </button>
                                    </div>
                                </div>
                                <div class="card-bucket__fotter">
                                    <div><span>杀菌完豆瓣</span><span>1000 KG</span></div>
                                    <div><span>溶解辅料</span><span>10/100</span></div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="prev, pager, next,sizes, jumper" :total="totalCount" @size-change="handlePageSizeChangeFromRead" @current-change="handleCurrentPageChangeFromRead" />
                </mds-card>
            </template>
        </query-table>
        <el-dialog :title="dialogForm[dialogType].title" width="500px" :close-on-click-modal="false" :visible.sync="dialogVisible">
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
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="getDataList(true)">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="入罐" :close-on-click-modal="false" :visible.sync="dialogTableVisible">
            <el-form ref="importBucketForm" :model="importBucketForm">
                <el-table class="newTable" :data="importBucketDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%;">
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogTableVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="getDataList(true)">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="投料人员" width="700px" :close-on-click-modal="false" :visible.sync="loanedPersonnelStatus">
            <loaned-personnel ref="loanedPersonnel" :org-tree="orgTree" :arr-list="arrList" @changeUser="changeUser" />
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="loanedPersonnelStatus = false">取消</el-button>
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

        dataList: []
        totalCount = 1
        currPage = 1
        pageSize = 10
        dissolveBucketCode = ''

        dialogVisible = false;
        dialogTableVisible = false;
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

        importBucketForm= {}
        importBucketDataGroup=[]
        queryFormData = [
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
                        holderType: '019'
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
                    // return COMMON_API.ORG_QUERY_WORKSHOP_API({
                    //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    //     deptType: ['WORK_SHOP'],
                    //     deptName: '杀菌'
                    // })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            }
        ]

        rules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        loanedPersonnelStatus = false;
        orgTree = [];
        arrList = [];

        mounted() {
            this.getContainerTypeList();
        }

        // 查询请求
        listInterface = params => {
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
                this.orgTree = data.data;
                // this.arrList = [this.OrgTree[0].children[0].id];
            });
        }

        // 员工确认
        changeUser(userId) {
            // this.row.userList = userId;
            this.loanedPersonnelStatus = false;

        }

        // 容器类型下拉
        getContainerTypeList() {
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_HOLDER_TYPE'
            }).then(({ data }) => {
                data.data.forEach(item => {
                    if (item.dictValue === '溶解罐') {
                        this.dissolveBucketCode = item.dictCode
                    }
                })
            });
        }

        // 去详请
        goTargetDetail(item) {
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
            .button {
                display: inline-block;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin: 0;
                margin-bottom: 14px;
                padding: 8px 16px;
                color: #606266;
                font-weight: 500;
                font-size: 14px;
                line-height: 1;
                white-space: nowrap;
                text-align: center;
                background: #fff;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                outline: 0;
                cursor: pointer;
                -webkit-transition: 0.1s;
                transition: 0.1s;
                -webkit-appearance: none;
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
