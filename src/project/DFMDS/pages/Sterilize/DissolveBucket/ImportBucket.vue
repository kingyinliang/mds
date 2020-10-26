<template>
    <div>
        <!-- 溶解罐入罐 -->
        <el-dialog title="入罐" :close-on-click-modal="false" :visible.sync="isTableDialogVisible" width="70%">
            <div class="inner-area">
                <div class="inner-area__title">
                    <h3><em class="title-icon" style="background: rgb(72, 123, 255);" />溶解罐列表 </h3>

                    <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="溶解罐">
                            <el-input v-model="formInline.user" placeholder="请输入" />
                        </el-form-item>
                        <el-form-item label="生产物料">
                            <el-select v-model="formInline.region" placeholder="请选择">
                                <el-option label="区域一" value="shanghai" />
                                <el-option label="区域二" value="beijing" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="配置锅数">
                            <el-input v-model="" placeholder="请输入" />
                        </el-form-item>
                    </el-form> -->

                    <el-button type="primary" size="small" @click="addNewDataRow()">
                        新增
                    </el-button>
                </div>
                <div class="inner-area__body">
                    <el-form ref="importBucketForm" :model="importBucketForm" size="size">
                        <el-table class="table-style-light" :data="importBucketInfo" :row-class-name="rowDelFlag" header-row-class-name="tableHead" size="mini" border style="width: 100%;" max-height="300">
                            <el-table-column label="序号" type="index" width="55" fixed="left" align="center" />
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    溶解罐
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="potName">
                                        {{ scope.row.potName }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="160" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>生产物料
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="prodcutMaterial">
                                        <el-select v-model="scope.row.prodcutMaterial" size="small" @change="changeProdcutMaterialOption(scope.row)">
                                            <el-option
                                                v-for="item in optionsTree"
                                                :key="item.productMaterialList[0].dictCode"
                                                :label="item.productMaterialList[0].dictValue"
                                                :value="item.productMaterialList[0].dictCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="140" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>配置锅数
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="potCount">
                                        <el-input v-model.trim="scope.row.potCount" size="small" placeholder="输入锅数" clearable />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料物料
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="feedMaterial">
                                        <el-select v-model="scope.row.feedMaterial" size="small" @change="changeFeedMaterialOption(scope.row)">
                                            <el-option
                                                v-for="item in findIndex(scope.row.prodcutMaterial)"
                                                :key="item.dictCode"
                                                :label="item.dictValue"
                                                :value="item.dictCode"
                                            />
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip="true" width="140">
                                <template slot="header">
                                    <span class="notNull">* </span>单位
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="feedUnit">
                                        <!-- <el-input v-model.trim="scope.row.feedUnit" size="small" placeholder="输入锅数" clearable /> -->
                                        {{ scope.row.feedUnit }}
                                        <!-- <el-select v-model="scope.row.feedUnit" placeholder="请选择" size="small">
                                            <el-option
                                                v-for="item in 10"
                                                :key="item.key"
                                                :label="item.value"
                                                :value="item.key"
                                            />
                                        </el-select> -->
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料数量
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="feedAmount">
                                        <el-input v-model.trim="scope.row.feedAmount" size="small" placeholder="输入数量" />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料批次
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="feedBatch">
                                        <el-input v-model.trim="scope.row.feedBatch" size="small" maxlength="10" placeholder="输入批次" />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="200" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">*</span>投料人
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="feedMan">
                                        <div class="required" style="min-height: 32px; line-height: 32px;">
                                            <!-- <span style="cursor: pointer;">
                                                <em v-for="(item, index) in scope.row.feedMan.split(',')" :key="index">{{ item }}，</em>
                                            </span> -->
                                            <span style="cursor: pointer;" @click="selectUser(scope.row,scope.$index)">
                                                <em v-for="(item, index) in splitString(scope.row.feedMan)" :key="index">{{ item }}，</em>
                                                <em>点击选择人员</em>
                                            </span>
                                        </div>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="投料时间" width="260" :show-overflow-tooltip="true">
                                <template slot="header">
                                    <span class="notNull">* </span>投料时间
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="feedDate">
                                        <el-date-picker
                                            v-model="scope.row.feedDate"
                                            type="datetime"
                                            placeholder="选择日期时间"
                                            style="width: 220px;"
                                            value-format="yyyy-MM-dd HH:mm"
                                            format="yyyy-MM-dd HH:mm"
                                            size="small"
                                        />
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                                <template slot-scope="scope">
                                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" width="180" />
                            <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" width="180" />
                            <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeDataRow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-form-item v-if="importBucketInfo.length>=1" label="满罐选项: " prop="">
                            <el-checkbox v-model="importBucketStatus" style="margin-left: 10px;" />
                        </el-form-item>
                    </el-form>
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
    import { COMMON_API, STE_API } from 'common/api/api';
    import _ from 'lodash';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'ImportBucketIndex',
        components: {
            LoanedPersonnel
        }
    })
    export default class ImportBucketIndex extends Vue {
        $refs: {
            loanedPersonnel: HTMLFormElement;
        }


        currentWorkShop=''
        // currentPotName=''
        // currentProdcutMaterial=''
        // currentPotCount=0

        // 点击赋予 item info
        currentPotNo=''
        currentPotId=''
        currentPotName=''
        currentPotStatus='E' // 罐状态
        currentCycle=''

        productMaterialList: ProductMaterial[]=[] // 生产物料清单
        // feedMateriallList: object[]=[] // 投料物料清单

        importBucketStatus=false // 是否满罐

        currentRowIndex=0
        dissolveBucketCode = ''

        optionsTree: OptionsTree[]=[]

        importBucketInfo: CurrentDataTable[]=[] // 主 data
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制
        // 入罐表单数据
        importBucketForm= {}

        isTableDialogVisible = false;
        isLoanedPersonnelStatusDialogVisible = false; // 选人
        orgTree: object[] = [];
        arrList: string[] = [];

        mounted() {
            this.getTree()
        }

        totalNum(target) {
            let result = 0
            target.forEach(item => {
                result = _.add(result, Number(item.feedAmount))
            })
            return result

        }

        splitString(str) {
            if (str !== '') {
                return str.split(',')
            }
            return []
        }


        changeProdcutMaterialOption(val) {
            if (val.prodcutMaterial !== '') {
                val.productMaterialName = this.optionsTree.filter(item => item.productMaterialList[0].dictCode === val.prodcutMaterial)[0].productMaterialList[0].dictValue
            }
            val.feedMaterial = ''
        }

        changeFeedMaterialOption(val) {
            if (val.feedMaterial !== '') {
                val.feedMaterialName = this.findIndex(val.prodcutMaterial).filter(item => item.dictCode === val.feedMaterial)[0].dictValue
            }
        }

        findIndex(val) {
            if (val === '') {
                return []
            }
            return this.optionsTree.filter(item => item.productMaterialList[0].dictCode === val)[0].feedMateriallList
        }

        // 入罐
        async init(item, workshop) {
            this.isTableDialogVisible = true
            this.currentPotId = item.potId
            this.currentPotNo = item.potNo
            this.currentPotName = item.potName
            this.currentPotStatus = item.potStatus
            this.currentWorkShop = workshop
            this.currentCycle = item.cycle
            this.importBucketStatus = false

            // API 容器管理-分页查询-查询生产物料
            await COMMON_API.HOLDER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.currentWorkShop,
                current: 1,
                size: 9999,
                holderNo: this.currentPotNo,
                holderType: '019' // 溶解罐参数编码
            }).then(({ data }) => {
                this.optionsTree = []
                if (data.data.records[0].material) {
                    data.data.records[0].material.forEach((element, index) => {
                        this.optionsTree.push({
                            productMaterialList: [{ dictCode: element.materialCode, dictValue: element.materialName }],
                            feedMateriallList: []
                        })
                        //this.productMaterialList.push({ dictCode: element.materialCode, dictValue: element.materialName, id: element.id })

                            // API 辅料前处理-查询不带分页 (查询生产物料)
                            STE_API.STE_PREACCESSORIES_LIST_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                productMaterial: element.materialCode,
                                preStage: 'DISSOLUTION'
                            }).then(({ data: target }) => {
                                this.optionsTree[index].feedMateriallList = []
                                if (target.data) {
                                    target.data.forEach(items => {
                                        this.optionsTree[index].feedMateriallList.push({ dictCode: items.useMaterial, dictValue: items.useMaterial + ' ' + items.useMaterialName })
                                    })
                                }
                            });

                    })
                }
            });


            // API 溶解罐管理-查询入罐信息
            await STE_API.STE_DISSOLUTIONBUCKET_ENTER_QUERY_API({
                cycle: item.cycle,
                id: item.id,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                potId: this.currentPotId,
                // potStatus: this.currentPotStatus,
                potNo: this.currentPotNo,
                workShop: this.currentWorkShop
            }).then(({ data }) => {
                this.importBucketInfo = []
                if (data.data) {
                    this.importBucketInfo = data.data
                    this.importBucketInfo.forEach(items => {
                        this.$set(items, 'cycle', this.currentCycle)
                    })
                    this.orgFormDataGroup = JSON.parse(JSON.stringify(this.importBucketInfo))
                }

                console.log('入罐消息')
                console.log(this.importBucketInfo)
            });

            // // API 辅料前处理-查询不带分页 (查询生产物料)
            // STE_API.STE_PREACCESSORIES_LIST_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     preStage: 'DISSOLUTION'
            // }).then(({ data }) => {
            //     console.log('辅料前处理')
            //     console.log(data)
            //     this.feedMateriallList = []
            //     if (data.data) {
            //         data.data.forEach(element => {
            //             this.feedMateriallList.push({ dictCode: element.useMaterial, dictValue: element.useMaterial + ' ' + element.useMaterialName })
            //         })
            //     }
            // });
        }

        // changeOption(val) {
        //     // val.productMaterialName=this.productMaterialList.filter(item=>item.dictCode===scope.row.prodcutMaterial)[0].dictValue
        //     // API 辅料前处理-查询不带分页 (查询生产物料)
        //     STE_API.STE_PREACCESSORIES_LIST_API({
        //         factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        //         productMaterial: val,
        //         preStage: 'DISSOLUTION'
        //     }).then(({ data }) => {
        //         console.log('辅料前处理')
        //         console.log(data)
        //         this.feedMateriallList = []
        //         if (data.data) {
        //             data.data.forEach(element => {
        //                 this.feedMateriallList.push({ dictCode: element.useMaterial, dictValue: element.useMaterial + ' ' + element.useMaterialName })
        //             })
        //         }
        //     });
        // }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
            })
        }

        // 员工确认
        changeUser(item) {
            this.importBucketInfo[this.currentRowIndex].feedMan = item.join(',')
            this.isLoanedPersonnelStatusDialogVisible = false;
        }

        // 选择人员 正式借调
        selectUser(row, index) {
            this.isLoanedPersonnelStatusDialogVisible = true;
            this.currentRowIndex = index
            this.$nextTick(() => {
                this.$refs.loanedPersonnel.init(row.feedMan, '投料人员');
            });

        }

        // 新增行
        addNewDataRow() {
            let sole: CurrentDataTable = {}
            const itemSize = this.importBucketInfo.length
            if (itemSize !== 0) {
                const tempProductMaterial = this.productMaterialList.filter(item => item.dictCode === this.importBucketInfo[itemSize - 1].prodcutMaterial) as ProductMaterial
                sole = {
                    cycle: this.currentCycle,
                    delFlag: 0,
                    potNo: this.currentPotNo, // 溶解罐号
                    potName: this.currentPotName, // 溶解罐名
                    prodcutMaterial: this.importBucketInfo[itemSize - 1].prodcutMaterial, // 生产物料
                    potCount: this.importBucketInfo[itemSize - 1].potCount, // 配置锅数
                    feedMaterial: this.importBucketInfo[itemSize - 1].feedMaterial, // 投料物料
                    feedUnit: 'KG', // 投料物料单位
                    feedAmount: 0, // 投料数量
                    feedBatch: '', // 投料批次
                    feedMan: '', // 投料人
                    feedDate: '', // 投料时间
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    feedMaterialName: this.importBucketInfo[itemSize - 1].feedMaterialName,
                    potStatus: this.currentPotStatus,
                    potId: this.currentPotId,
                    productMaterialName: tempProductMaterial.dictValue
                }
            } else {
                sole = {
                    cycle: this.currentCycle,
                    delFlag: 0,
                    potNo: this.currentPotNo, // 溶解罐号
                    potName: this.currentPotName, // 溶解罐名
                    prodcutMaterial: '', // 生产物料
                    potCount: 0, // 配置锅数
                    feedMaterial: '', // 投料物料
                    feedUnit: 'KG', // 投料物料单位
                    feedAmount: 0, // 投料数量
                    feedBatch: '', // 投料批次
                    feedMan: '', // 投料人
                    feedDate: '', // 投料时间
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    feedMaterialName: '',
                    potStatus: this.currentPotStatus,
                    potId: this.currentPotId,
                    productMaterialName: ''
                }
            }
            this.importBucketInfo.push(sole)
            // this.setValidate(this.currentFormDataGroup, this.ruleForm)
        }


        // 获取组织结构树
        getTree() {
            COMMON_API.ORGSTRUCTURE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(({ data }) => {
                this.orgTree = data.data;
               // this.arrList = [(this.orgTree[0].children[0].id)];
            });
        }


        //  RowDelFlag
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';

        }


        // 入罐确认
        comfirmImportBucket() {
            if (this.ruleSubmit()) {

                const obj = {}
                if (this.importBucketStatus === true) { // 满罐
                    this.currentPotStatus = 'M'
                } else {
                    this.currentPotStatus = 'R'
                }

                const delIdsArray: string[] = []
                const insertDtosArray: CurrentDataTable[] = []
                const updateDtosArray: CurrentDataTable[] = []

                this.importBucketInfo.forEach((item: CurrentDataTable, index) => {

                    if (item.delFlag === 1) {
                        if (item.id) {
                            delIdsArray.push(item.id)
                        }
                    } else if (item.id) {
                        if (!_.isEqual(this.orgFormDataGroup[index], item)) {
                            item.potStatus = this.currentPotStatus
                            item.workShop = this.currentWorkShop
                            updateDtosArray.push(item)
                        }
                    } else {
                        item.potStatus = this.currentPotStatus
                        item.workShop = this.currentWorkShop
                        insertDtosArray.push(item)
                    }
                })

                if (!(delIdsArray.length === 0 && insertDtosArray.length === 0 && updateDtosArray.length === 0)) {
                    STE_API.STE_DISSOLUTIONBUCKET_SAVE_API({
                        delIds: delIdsArray,
                        insertDtos: insertDtosArray,
                        updateDtos: updateDtosArray
                    }).then(({ data }) => {
                        console.log(data)
                        this.$emit('importBucketFinish', obj);
                        this.isTableDialogVisible = false
                    });
                } else {
                    this.isTableDialogVisible = false
                }
            }
        }

        clearImportBucket() {
            this.isTableDialogVisible = false
        }

        // 提交时跑校验
        ruleSubmit() {
            if (this.importBucketInfo.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请录入入罐');
                return false
            }
            for (const item of this.importBucketInfo.filter(it => it.delFlag !== 1)) {
                if (!item.prodcutMaterial || !item.potCount || !item.feedMaterial || !item.feedMan || !item.feedDate || !item.feedBatch || !item.feedAmount || !item.feedUnit) {
                    this.$warningToast('请填写入罐必填项');
                    return false
                }
            }
            return true
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
    dictCode?: string;
    dictValue?: string;
}

interface ProductMaterial{
    dictCode?: string;
    dictValue?: string;
    id?: string;
}

interface OptionsTree{
    productMaterialList: ProductMaterial[];
    feedMateriallList: HolderStatus[];
}

interface CurrentDataTable{
    cycle?: string;
    potId?: string;
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
    potStatus?: string;
    potNo?: string;
    potName?: string;
    prodcutMaterial?: string;
    productMaterialName?: string;
    remark?: string;
    delFlag?: number;
    workShop?: string;
}
interface FinalDataTable{
    changed?: string;
    changer?: string;
    feedAmount?: number;
    feedBatch?: string;
    feedDate?: string;
    feedMan?: string;
    feedMaterial?: string;
    feedMaterialName?: string;
    feedUnit?: string[];
    id?: string;
    potCount?: number;
    potNo?: string;
    prodcutMaterial?: string;
    productMaterialName?: string;
    remark?: string;
    delFlag?: number;
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
</style>

<style lang="scss" scoped>

.el-form-item {
    margin-bottom: 0;
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
