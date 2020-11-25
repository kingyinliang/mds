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
            <template slot="home">
                <mds-card :title="'发酵情况总览'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;">
                    <el-row class="home_card__main" :gutter="10">
                        <div v-for="(item, index) in topBox" :key="index" class="clearfix" style="float: left;">
                            <div class="topBox_boxItem" @click="topClick(item)">
                                <div style="overflow: hidden;">
                                    <div class="topBox_boxItem_bar">
                                        <div
                                            class="topBox_boxItem_bar_box"
                                            :style="{ background: `linear-gradient(to right,${item.startColor} 0%,${item.startColor} 10%,${item.startColor})`}"
                                        />
                                    </div>
                                    <div style="float: left; width: 32px; font-size: 14px; line-height: 30px; text-align: center;">
                                        {{ item.middleText }}
                                    </div>
                                    <div class="topBox_boxItem_bar">
                                        <div
                                            class="topBox_boxItem_bar_box"
                                            :style="{
                                                background: `linear-gradient(to right,${item.endColor} 0%,${item.endColor} 10%,${item.endColor})`,
                                            }"
                                        />
                                    </div>
                                </div>
                                <p class="topBox_boxItem_tit">
                                    {{ item.ptext }}
                                </p>
                                <p class="topBox_boxItem_detail">
                                    总计: <span>{{ item.num }}</span> 罐
                                </p>
                                <div v-if="index > 0 && index < 7" class="topBox_boxItem_popover">
                                    <p class="">
                                        <em class="dot" style="background: #1890ff;" />味极鲜<span style="float: right;">{{ item.wdm }} 罐</span>
                                    </p>
                                    <p class="">
                                        <em class="dot" style="background: #ffbf00;" />六月鲜<span style="float: right;">{{ item.lyx }} 罐</span>
                                    </p>
                                    <em class="topBox_boxItem_popover_ar" />
                                </div>
                            </div>
                            <div v-if="item.color" class="topBox_circle" :style="{ background: item.color }">
                                {{ item.text }}
                            </div>
                        </div>
                    </el-row>
                </mds-card>
                <mds-card :title="'发酵罐列表'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;">
                    <template slot="titleBtn">
                        <div style="float: right;" class="moreItems">
                            <el-button type="text" size="small" @click="getMore">
                                发酵罐一览表
                            </el-button>
                        </div>
                    </template>
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="item in targetQueryTableList" :key="item.potId" :span="4" style="min-width: 203px;">
                            <div class="card-bucket">
                                <div class="card-bucket__head">
                                    <span>{{ item.holderName }} - {{ item.fermentorStatusName }}</span>
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
                                        <el-button v-if="isAuth('')" size="small" plain @click="btnFilledBucket(item)">
                                            鼓罐
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain @click="btnLYCY(item)">
                                            <!-- <el-button v-if="item.fermentorStatus!=='M'" size="small" plain @click="btnFillBucket(item)"> -->
                                            LY/CY
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain @click="btnAdjust(item)">
                                            调整
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain @click="btnClearBucket(item)">
                                            <!-- <el-button size="small" plain @click="btnClearBucket(item)"> -->
                                            清罐
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain @click="btnWashBucket(item)">
                                            清洗
                                        </el-button>
                                    </div>
                                </div>
                                <div class="card-bucket__fotter">
                                    <div v-show="!(item.fermentorStatus==='E'||item.fermentorStatus==='C')">
                                        <el-tooltip class="item" effect="dark" :content="item.materialName" placement="top">
                                            <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.materialName || '未有生产物料' }}</span>
                                        </el-tooltip>
                                        <span>{{ item.fermentDays || '0' }} 天</span>
                                    </div>
                                    <div v-show="!(item.fermentorStatus==='E'||item.fermentorStatus==='C')">
                                        <el-tooltip class="item" effect="dark" :content="item.orderNo" placement="top">
                                            <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.orderNo || '未有订单号' }}</span>
                                        </el-tooltip>
                                        <span>{{ item.currentStock || '0' }} 吨</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="prev, pager, next,sizes, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </mds-card>
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
    import { COMMON_API, FER_API } from 'common/api/api';
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
        dataList=[
            {}
        ]

        totalCount = 0;
        currPage= 1
        pageSize= 10

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
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
                label: '容器类型',
                prop: 'holderType',
                labelWidth: 90,
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.DICTQUERY_API({
                            dictType: 'COMMON_HOLDER_TYPE'
                        }).then((res) => {
                            console.log('容器类型')
                            console.log(res)
                            const resData = res
                            const holderTemp: object[] = []

                            res.data.data.forEach(item => {
                                if (item.dictCode === '001' || item.dictCode === '028' || item.dictCode === '029') {
                                    holderTemp.push({ dictCode: item.dictCode, dictValue: item.dictValue })
                                }
                            })
                            resData.data.data = holderTemp
                            resolve(resData)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                },
                linkageProp: ['holderId']
            },
            {
                type: 'select',
                label: '容器号',
                prop: 'holderId',
                labelWidth: 90,
                optionsFn: val => {
                return new Promise((resolve) => {
                        COMMON_API.HOLDER_DROPDOWN_API({
                        holderType: [val]
                    }).then((res) => {
                        console.log('容器号')
                        console.log(res)
                        resolve(res)
                    })
                })
            },
            resVal: {
                resData: 'data',
                label: ['holderNo'],
                value: 'id'
            },
            defaultValue: ''
            },
            {
                type: 'select',
                label: '状态',
                prop: 'fermStatus',
                labelWidth: 50,
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_FERM_STATUS' }).then((res) => {

                            resolve(res)
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
        ]

        topBox: [
            {
                color: '#999999FF';
                startColor: '#999999FF';
                endColor: '#999999FF';
                text: '空';
                ptext: '';
                numNew: 0;
                potColor: '#FFF';
                middleText: '空罐';
                holderStatus: '0';
                num: '0';
            },
            {
                color: '#D6D2C4FF';
                startColor: '#E9E9E9FF';
                endColor: '#D6D2C4FF';
                text: '1';
                ptext: '30天';
                numNew: 30;
                potColor: '#999999';
                middleText: '酿造';
                search: '1';
                num: '0';
            },
            {
                color: '#CDA786FF';
                startColor: '#D6D2C4FF';
                endColor: '#CDA786FF';
                text: '2';
                ptext: '60天';
                numNew: 60;
                potColor: '#D6D2C4';
                middleText: '酿造';
                search: '2';
                num: '0';
            },
            {
                color: '#B58150FF';
                startColor: '#CDA786FF';
                endColor: '#B58150FF';
                text: '3';
                ptext: '90天';
                numNew: 90;
                potColor: '#CDA786';
                middleText: '酿造';
                search: '3';
                num: '0';
            },
            {
                color: '#C67C5AFF';
                startColor: '#B58150FF';
                endColor: '#C67C5AFF';
                text: '4';
                ptext: '130天';
                numNew: 120;
                potColor: '#B58150';
                middleText: '酿造';
                search: '4';
                num: '0';
            },
            {
                color: '#AD592DFF';
                startColor: '#C67C5AFF';
                endColor: '#AD592DFF';
                text: '5';
                ptext: '150天';
                numNew: 150;
                potColor: '#C67C5A';
                middleText: '酿造';
                search: '5';
                num: '0';
            },
            {
                color: '#8A391BFF';
                startColor: '#8A391BFF';
                endColor: '#8A391BFF';
                text: '6';
                ptext: '180天';
                numNew: 180;
                potColor: '#AD592D';
                middleText: '酿造';
                search: '6';
                num: '0';
            },
            {
                color: '#C70909FF';
                startColor: '#8A391BFF';
                endColor: '#C70909FF';
                text: '超';
                ptext: '180天以上';
                numNew: 9999999999999;
                potColor: '#8A391B';
                middleText: '超期';
                search: '7';
                num: '0';
            },
            {
                color: '#8BC34AFF';
                startColor: '#C70909FF';
                endColor: '#8BC34AFF';
                text: '压';
                ptext: ' ';
                numNew: 0;
                potColor: '#C70909';
                middleText: '压榨';
                holderStatus: '4';
                num: '0';
            },
            {
                color: '';
                startColor: '#999999FF';
                endColor: '#999999FF';
                text: '';
                ptext: '';
                numNew: 0;
                potColor: '#FFF';
                middleText: '空罐';
                holderStatus: '0';
                num: '0';
            }
        ]

        getData() {
            //
        }

        getMore() {
            //
        }

        // queryTable 查询请求
        queryTableListInterface = (params) => {
            console.log('搜寻传值')
            console.log(params)
            const paramsTemp = {
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                current: params.currPage,
                size: params.pageSize,
                workShop: params.workShop,
                holderType: params.holderType,
                holderId: params.holderId,
                fermStatus: params.fermStatus

            }

            // paramsTemp.size = this.pageSize
            // paramsTemp.current = this.currPage
            return FER_API.FER_FERMENTOR_BATCH_QUERY_API(paramsTemp);
        };

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                this.targetQueryTableList = data.data.data.records
                this.currPage = data.data.data.current
                this.pageSize = data.data.data.size
                this.totalCount = data.data.data.total
            } else {
                this.$infoToast('暂无任何内容');
            }

        }

        // [btn][鼓罐]
        btnFilledBucket(item) {
            console.log(item)
        }

        // [btn][LYCY]
        btnLYCY(item) {
            console.log(item)
        }

        // [btn][btnAdjust]
        btnAdjust(item) {
            console.log(item)
        }

        // [btn][清罐]
        btnClearBucket(item) {
            console.log(item)
        }

        // [btn][洗罐]
        btnWashBucket(item) {
            console.log(item)
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getData();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getData();
        }


    }

interface DeptObject {
    id?: string;
}
interface BucketDataListObj{
    brineFlag: string;
    brineFlagName: string;
    changed: string;
    changer: string;
    currentStock: number;
    cycle: string;
    fermentDays: number;
    fermentorStatus: string;
    fermentorStatusName: string;
    freezeFlag: string;
    fullDate: string;
    holderId: string;
    holderName: string;
    holderNo: string;
    holderType: string;
    holderTypeName: string;
    holderVolume: number;
    id: string;
    intoDate: string;
    judgeResult: string;
    judgeResultName: string;
    materialCode: string;
    materialName: string;
    matureFlag: string;
    openFlag: string;
    orderNo: string;
    remark: string;
    workShop: string;
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

.moreItems {
    .el-button {
        font-size: 12px;
        &::after {
            content: ">>";
        }
    }
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
        padding: 20px 6px;
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
                margin-bottom: 5px;
                padding: 8px 16px;
                font-weight: 500;
                font-size: 14px;
                line-height: 1;
            }
        }
    }
    .card-bucket__fotter {
        height: 40px;
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


.topBox {
    width: 1260px;
    margin: auto;
    padding: 10px 0;
    &_boxItem {
        position: relative;
        // width: 102px;
        float: left;
        cursor: pointer;
        &_bar {
            float: left;
            width: 30px;
            height: 2px;
            margin: 15px 0 0;
            background: #f2f2f2;
            &_box {
                height: 2px;
            }
        }
        &_tit {
            height: 32px;
            color: black;
            font-size: 14px;
            line-height: 32px;
            // margin-top: 10px;
            text-align: center;
        }
        &_detail {
            color: #666;
            font-size: 14px;
            text-align: center;
            span {
                color: black;
                font-size: 16px;
            }
        }
        &_popover {
            position: absolute;
            top: -60px;
            z-index: 999999;
            display: none;
            min-width: 150px;
            min-height: 52px;
            padding: 10px 16px;
            font-size: 13px;
            line-height: 18px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
            .dot {
                float: left;
                width: 6px;
                height: 6px;
                margin: 4px 5px 0 0;
                border-radius: 50%;
            }
            &_ar {
                position: absolute;
                bottom: -12px;
                width: 0;
                height: 0;
                border-color: #fff transparent transparent;
                border-style: solid;
                border-width: 6px;
            }
        }
    }
    &_circle {
        float: left;
        width: 32px;
        height: 32px;
        margin: 0 2px;
        color: white;
        line-height: 32px;
        text-align: center;
        background: #999;
        border-radius: 50%;
        transition: all 0.5s;
    }
}
</style>
