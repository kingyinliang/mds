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
                <mds-card :title="'溶解罐列表'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;" />
            </template>
        </query-table>
    </div>
</template>
<script lang="ts">

    // 空罐 E v
    // 入料中 R (投料)  v
    // 待清洗 C
    // 满罐 M  v
    // 领用中 U  v
    import { Vue, Component } from 'vue-property-decorator';
    // import { dateFormat, getUserNameNumber } from 'utils/utils';
    // import ImportBucket from './ImportBucket.vue';
    import { COMMON_API, STE_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'DissolveBucketIndex',
        components: {

        }
    })
    export default class DissolveBucketIndex extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
            importBucket: HTMLFormElement;
        }

        // 共用变数
        currentWorkShop=null // 当前车间  溶解罐取消车间维度
        currentPotId='' // 选取的当前罐id
        currentPotNo='' // 选取的当前罐号
        holderStatus: HolderStatus[]=[] // 罐状态对应

        targetQueryTableList: BucketDataListObj[] = []
        isTableDialogVisible=false
        isBucketDialogVisible = false;
        dialogType='filled' // 弹窗类型

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
                rule: [
                    { required: true, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '发酵'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '溶解罐号',
                prop: 'potId',
                labelWidth: 90,
                rule: [{ required: true, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
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
                prop: 'potId',
                text: '请选择溶解罐号'
            }
        ]

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

.el-button.is-plain:hover {
    color: #fff;
    background-color: #3a8ee6;
}
.el-button.is-plain.is-disabled:hover {
    color: #c0c4cc;
    background-color: #fff;
    border-color: #ebeef5;
}

</style>
