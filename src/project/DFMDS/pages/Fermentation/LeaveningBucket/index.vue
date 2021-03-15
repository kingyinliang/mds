<!--
 * @Description: 发酵车间/发酵罐首页
 * @Anthor: Telliex
 * @Date: 2021-01-15 23:35:23
 * @LastEditors: Telliex
 * @LastEditTime: 2021-03-12 14:23:10
-->
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
            :show-page="false"
            @get-data-success="returnDataFromQueryTableForm"
        >
            <template slot="home">
                <!-- 发酵情况总览区块 -->
                <mds-card v-show="isSearchResultMetroShow" :title="'发酵情况总览'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px;">
                    <div class="sumbox">
                        <div class="topBox clearfix">
                            <div v-for="(item, index) in topBox" :key="index" class="clearfix" style="float: left;">
                                <el-popover
                                    placement="top"
                                    width="200"
                                    trigger="hover"
                                    :disabled="item.materialCountList.length===0"
                                >
                                    <div class="showBox">
                                        <ul>
                                            <li v-for="(element, subIndex) in item.materialCountList" :key="subIndex">
                                                <span>{{ element.materialName }}</span><span>{{ element.count }} 罐</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <template slot="reference">
                                        <div class="topBox_boxItem" @click="getResultBymetroItem(item)">
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
                                                            background: `linear-gradient(to right,${item.endColor} 0%,${item.endColor} 10%,${item.endColor})`
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
                                        </div>
                                    </template>
                                </el-popover>
                                <div v-if="item.color" class="topBox_circle" :style="{ background: item.color }">
                                    {{ item.text }}
                                </div>
                            </div>
                        </div>
                    </div>
                </mds-card>
                <!-- 发酵罐列表区块 -->
                <mds-card v-show="isSearchResultListShow" :title="'发酵罐列表'" :pack-up="false" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;">
                    <template slot="titleBtn">
                        <div style="float: right;" class="moreItems">
                            <el-button type="text" size="small" @click="getTotalList">
                                发酵罐一览表
                            </el-button>
                        </div>
                    </template>
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="item in targetQueryTableList" :key="item.potId" :span="4" style="min-width: 200px;">
                            <div class="card-bucket">
                                <div class="card-bucket__head">
                                    <span>{{ item.holderName }} - {{ item.fermentorStatusName }}</span>
                                    <el-button type="text" @click="goTargetItemDetail(item)">
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
                                                    :style="{height:((item.volumePercent)*100)+'%', background: setBucketColor(item.fermentorStatus,item.fermentDays)}"
                                                />
                                            </div>
                                            <span v-if="item.judgeResult==='CQ'" class="cq"><img src="../../../assets/img/icon-cq.png" alt=""></span>
                                        </div>
                                    </div>
                                    <div class="btn-group">
                                        <el-button v-if="isAuth('')" size="small" plain :disabled="item.fermentorStatus!=='F'" @click="btnFilledBucket(item)">
                                            鼓罐
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain :disabled="item.fermentorStatus!=='F' || item.orderNo===''" @click="btnLYCY(item)">
                                            LY/CY
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain :disabled="! ['F','S','O','T','A','U'].includes(item.fermentorStatus) || item.orderNo===''" @click="btnAdjust(item)">
                                            调整
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain :disabled="item.fermentorStatus!=='U' || item.orderNo===''" @click="btnClearBucket(item)">
                                            清罐
                                        </el-button>
                                        <el-button v-if="isAuth('')" size="small" plain :disabled="item.fermentorStatus!=='C'" @click="btnCleanBucket(item)">
                                            清洗
                                        </el-button>
                                    </div>
                                </div>
                                <div class="card-bucket__fotter" style="height: 40px;">
                                    <div v-show="!(item.fermentorStatus==='E')&&item.orderNo!==''">
                                        <el-tooltip class="item" effect="dark" :content="item.materialName" placement="top" :disabled="item.materialName===''">
                                            <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.materialName || '未有生产物料' }}</span>
                                        </el-tooltip>
                                        <span v-if="item.productProcess !== 'MIX'">{{ item.fermentDays || '0' }} 天</span>
                                    </div>
                                    <div v-show="!(item.fermentorStatus==='E')&&item.orderNo!==''">
                                        <el-tooltip class="item" effect="dark" :content="item.orderNo" placement="top" :disabled="item.orderNo===''">
                                            <span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{ item.orderNo || '未有订单号' }}</span>
                                        </el-tooltip>
                                        <span>{{ item.currentStock/1000 || '0' }} 吨</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-pagination :current-page="formHeader.currPage" :page-sizes="[30, 60, 90]" :page-size="formHeader.pageSize" layout="prev, pager, next,sizes, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </mds-card>
            </template>
        </query-table>
        <!-- 鼓罐 dialog -->
        <drum-bucket ref="drumBucket" @drumBucketFinish="drumBucketFinish" />
        <!-- LY/CY dialog -->
        <l-y-c-y-bucket ref="LYCYBucket" @drumBucketFinish="drumBucketFinish" />
        <!-- 调整 dialog -->
        <modify-bucket ref="modifyBucket" @drumBucketFinish="drumBucketFinish" />
        <!-- 清罐 dialog -->
        <el-dialog :title="`${clearDataForm.holderName}清罐`" width="400px" :close-on-click-modal="false" :visible.sync="isClearDialogVisible">
            <div style="font-size: 14px;">
                罐完成后，库存数量清零,请确认!
            </div>
            <el-form :model="clearDataForm" size="small" label-width="100px" class="orderMangedialog markStyle" style="margin-top: 10px;">
                <el-form-item label="清罐日期：" class="star">
                    <el-date-picker v-model="clearDataForm.clearDate" type="datetime" placeholder="请选择" style="width: 180px;" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="btnCloseDialog">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="saveClearBucket">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 清洗 dialog -->
        <el-dialog :title="`${cleanDataForm.holderName}清洗`" width="50%" :close-on-click-modal="false" :visible.sync="isCleanDialogVisible">
            <el-form :model="cleanDataForm" size="small" label-width="110px" class="orderMangedialog">
                <el-form-item label="容器号：">
                    <span class="default">{{ cleanDataForm.holderName }}</span>
                </el-form-item>
                <el-form-item label="状态：">
                    <span class="default">{{ cleanDataForm.fermentorStatusName }}</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="cleanDataForm.doit">
                        清洗完成
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model.trim="cleanDataForm.remark" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="操作人：">
                    <span class="default">{{ cleanDataForm.changer }}</span>
                </el-form-item>
                <el-form-item label="操作时间：">
                    <span class="default">{{ cleanDataForm.changed }}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="btnCloseDialog">
                    取消
                </el-button>
                <el-button type="primary" size="small" @click="saveWashBucket">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    import DrumBucket from './DrumBucket.vue'; // 鼓罐 dialog
    import LYCYBucket from './LYCYBucke.vue'; // LY/CY dialog
    import ModifyBucket from './ModifyBucket.vue'; // 调整 dialog

    @Component({
        name: 'FermentBucketIndex',
        components: {
            DrumBucket,
            LYCYBucket,
            ModifyBucket
        }
    })
    export default class FermentBucketIndex extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
            drumBucket: HTMLFormElement;
            LYCYBucket: HTMLFormElement;
            modifyBucket: HTMLFormElement;
        }

        // 共用变数
        workShopList: Options[]=[] // 生产车间
        holderStatus: Options[]=[] // 罐状态对应

        targetQueryTableList: BucketDataListObj[] = [] // 查询结果
        //searchSource='bar' // 查询来自哪？ search bar/ metro map

        // 清罐弹窗 data
        isClearDialogVisible = false;
        clearDataForm={
            holderId: '',
            holderName: '',
            clearDate: ''
        }

        // 清洗弹窗 data
        isCleanDialogVisible = false;
        cleanDataForm={
                holderId: '',
                holderName: '',
                fermentorStatusName: '',
                remark: '',
                doit: true,
                changer: '',
                changed: ''
        }

        isSearchResultMetroShow=false // 查询结果地铁图呈现
        isSearchResultListShow=false // 查询结果清单呈现
        formHeader={
            currPage: 1,
            fermStatus: '',
            holderId: '',
            holderType: '',
            pageSize: 30,
            totalCount: 0,
            workShop: '',
            fermentStage: ''
        }

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.ORG_QUERY_WORKSHOP_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptType: ['WORK_SHOP'],
                            deptName: '发酵'
                        }).then((res) => {
                            res.data.data.forEach(item => {
                                // eslint-disable-next-line no-invalid-this
                                this.workShopList.push({ dictCode: item.deptCode, dictValue: item.deptName })
                            })
                            resolve(res)
                        })
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
                            const resData = res
                            const holderTemp: object[] = []

                            res.data.data.forEach(item => {
                                if (item.dictCode === '001' || item.dictCode === '028' || item.dictCode === '025') {
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
                filterable: true,
                optionsFn: val => {
                return new Promise((resolve) => {
                        COMMON_API.HOLDER_DROPDOWN_API({
                        holderType: [val]
                    }).then((res) => {
                        resolve(res)
                    })
                })
            },
            resVal: {
                resData: 'data',
                label: ['holderName'],
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

        // 查询必填栏位校验
        queryTableFormRules = [
        ]

        // 地铁图样式
        topBox= [
            { //0
                color: '#999999FF',
                startColor: '#999999FF',
                endColor: '#999999FF',
                text: '空',
                ptext: '0个月',
                numNew: 0,
                potColor: '#FFF',
                middleText: '空罐',
                fermentStage: 'E',
                holderStatus: '0',
                num: '0',
                materialCountList: []
            },
            { //1
                color: '#D6D2C4FF',
                startColor: '#E9E9E9FF',
                endColor: '#D6D2C4FF',
                text: '30',
                ptext: '1个月',
                numNew: 30,
                potColor: '#999999',
                middleText: '酿造',
                fermentStage: '0',
                search: '1',
                num: '0',
                materialCountList: []
            },
            { //2
                color: '#CDA786FF',
                startColor: '#D6D2C4FF',
                endColor: '#CDA786FF',
                text: '60',
                ptext: '2个月',
                numNew: 60,
                potColor: '#D6D2C4',
                middleText: '酿造',
                fermentStage: '30',
                search: '2',
                num: '0',
                materialCountList: []
            },
            { //3
                color: '#B58150FF',
                startColor: '#CDA786FF',
                endColor: '#B58150FF',
                text: '90',
                ptext: '3个月',
                numNew: 90,
                potColor: '#CDA786',
                middleText: '酿造',
                fermentStage: '60',
                search: '3',
                num: '0',
                materialCountList: []
            },
            { //4
                color: '#C67C5AFF',
                startColor: '#B58150FF',
                endColor: '#C67C5AFF',
                text: '120',
                ptext: '4个月',
                numNew: 120,
                potColor: '#B58150',
                middleText: '酿造',
                fermentStage: '90',
                search: '4',
                num: '0',
                materialCountList: []
            },
            { //5
                color: '#AD592DFF',
                startColor: '#C67C5AFF',
                endColor: '#AD592DFF',
                text: '150',
                ptext: '5个月',
                numNew: 150,
                potColor: '#C67C5A',
                middleText: '酿造',
                fermentStage: '120',
                search: '5',
                num: '0',
                materialCountList: []
            },
            { //6
                color: '#8A391BFF',
                startColor: '#8A391BFF',
                endColor: '#8A391BFF',
                text: '180',
                ptext: '6个月',
                numNew: 180,
                potColor: '#AD592D',
                middleText: '酿造',
                fermentStage: '150',
                search: '6',
                num: '0',
                materialCountList: []
            },
            // {
            //     color: '#602813FF',
            //     startColor: '#C70909FF',
            //     endColor: '#8BC34AFF',
            //     text: '?',
            //     ptext: '6个月以上',
            //     numNew: 181,
            //     potColor: '#C70909',
            //     middleText: '酿造',
            //     fermentStage: '180',
            //     holderStatus: '4',
            //     num: '0',
            //     materialCountList: []
            // },
            // {
            //     color: '#C70909FF',
            //     startColor: '#8A391BFF',
            //     endColor: '#C70909FF',
            //     text: '超',
            //     ptext: '超期',
            //     numNew: 9999999999999,
            //     potColor: '#8A391B',
            //     middleText: '超期',
            //     fermentStage: 'O',
            //     search: '7',
            //     num: '0',
            //     materialCountList: []
            // },
            { //7
                color: '#82ab53',
                startColor: '#999999FF',
                endColor: '#999999FF',
                text: '调',
                ptext: '0个月',
                numNew: 0,
                potColor: '#FFF',
                middleText: '调酱',
                fermentStage: 'T',
                holderStatus: '0',
                num: '0',
                materialCountList: []
            },
            { //8
                color: '#5b8031',
                startColor: '#999999FF',
                endColor: '#999999FF',
                text: '已调',
                ptext: '0个月',
                numNew: 0,
                potColor: '#FFF',
                middleText: '已调',
                fermentStage: 'A',
                holderStatus: '0',
                num: '0',
                materialCountList: []
            },
            { //9
                color: '#4f5d3f',
                startColor: '#999999FF',
                endColor: '#999999FF',
                text: '领',
                ptext: '0个月',
                numNew: 0,
                potColor: '#FFF',
                middleText: '领料',
                fermentStage: 'U',
                holderStatus: '0',
                num: '0',
                materialCountList: []
            },
            { //10
                color: '',
                startColor: '#999999FF',
                endColor: '#999999FF',
                text: '',
                ptext: '0个月',
                numNew: 0,
                potColor: '#FFF',
                middleText: '空罐',
                fermentStage: 'E',
                holderStatus: '0',
                num: '0',
                materialCountList: []
            }
        ]

        mounted() {
            this.$refs.queryTable.searchSource = 'bar'
        }

        // 入罐完成
        drumBucketFinish() {
            this.$refs.queryTable.getDataList(true)
        }


        // 地铁图总览点击查询
        getResultBymetroItem(item) {
            console.log('地铁图传值');
            console.log(item);
            // this.searchSource = 'metro';
            this.$refs.queryTable.searchSource = 'metro'

            this.formHeader.fermentStage = item.fermentStage;
            this.formHeader.currPage = 1;
            this.formHeader.pageSize = 30;
            this.$refs.queryTable.queryForm.currPage = 1;
            this.$refs.queryTable.queryForm.pageSize = 30;
            this.$set(this.$refs.queryTable.queryForm, 'fermentStage', item.fermentStage);
            this.isSearchResultListShow = true;

            this.queryTableListInterface({
                searchSource: 'metro',
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                current: this.formHeader.currPage,
                size: this.formHeader.pageSize,
                workShop: this.formHeader.workShop,
                holderType: this.formHeader.holderType,
                holderId: this.formHeader.holderId,
                fermStatus: this.formHeader.fermStatus,
                fermentStage: this.formHeader.fermentStage
            }).then(({ data }) => {
                this.returnDataFromQueryTableForm(data);
            })
        }

        // 取得结果 data
        getData() {
            console.log('=======this.searchSource============')
            console.log(this.$refs.queryTable.searchSource)
            // this.searchSource = 'bar'
            if (this.$refs.queryTable.searchSource === 'bar') { // 来自 search bar 查询
                this.formHeader.fermentStage = '';
                this.queryTableListInterface({
                    searchSource: 'bar',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    currPage: this.formHeader.currPage,
                    pageSize: this.formHeader.pageSize,
                    workShop: this.formHeader.workShop,
                    holderType: this.formHeader.holderType,
                    holderId: this.formHeader.holderId,
                    fermStatus: this.formHeader.fermStatus,
                    fermentStage: this.formHeader.fermentStage
                }).then(({ data }) => {
                    this.returnDataFromQueryTableForm(data);
                })
            } else { // 来自 metro map 查询
                this.queryTableListInterface({
                    searchSource: 'metro',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    current: this.formHeader.currPage,
                    size: this.formHeader.pageSize,
                    workShop: this.formHeader.workShop,
                    holderType: this.formHeader.holderType,
                    holderId: this.formHeader.holderId,
                    fermStatus: this.formHeader.fermStatus,
                    fermentStage: this.formHeader.fermentStage
                }).then(({ data }) => {
                    this.returnDataFromQueryTableForm(data);
                })
            }
        }

        // 自动搜索(目前无用)
        createdEnd() {
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '') {
                    this.$refs.queryTable.getDataList(true);
                }
            })
        }

        // 跳转发酵罐一览表
        getTotalList() {
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Fermentation-LeaveningBucket-Overview'));
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-LeaveningBucket-Overview`
                });
            }, 100);
        }

        // 跳转 item 详请
        goTargetItemDetail(item) {
            this.$set(item, 'workShopName', this.workShopList.filter(element => element.dictCode === item.workShop)[0].dictValue);
            this.$store.commit('fer/updatefermentBucket', item);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Fermentation-LeaveningBucket-LeaveningBucketDetail'));
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-LeaveningBucket-LeaveningBucketDetail`
                });
            }, 100);
        }

        // queryTable 查询请求
        queryTableListInterface = (params) => {
            console.log('搜寻传值');
            console.log(params);
            let paramsTemp = {};
            if (params.searchSource === 'metro') {
                console.log('我来自地图');
                // eslint-disable-next-line no-invalid-this
                this.$refs.queryTable.searchSource = 'metro'
                paramsTemp = params;
            } else {
                console.log('我来自按钮查询')
                 // eslint-disable-next-line no-invalid-this
                 this.$refs.queryTable.searchSource = 'bar'
                paramsTemp = {
                    searchSource: 'bar',
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    current: params.currPage,
                    // size: params.pageSize,
                    // eslint-disable-next-line no-invalid-this
                    size: this.formHeader.pageSize,
                    workShop: params.workShop,
                    holderType: params.holderType,
                    holderId: params.holderId,
                    fermStatus: params.fermStatus,
                    fermentStage: ''
                }
            }
            return FER_API.FER_FERMENTOR_BATCH_QUERY_API(paramsTemp);
        };

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传');
            console.log(data);
            console.log(this.$refs.queryTable.searchSource)
            // 取得组件查找字段
            const queryForm = this.$refs.queryTable.queryForm;
            // 清空结果 array
            this.targetQueryTableList = [];
            // 更新地铁图数据
            this.topBox[0].num = data.data.emptyAmount;
            this.topBox[1].num = data.data.fermentingAmount0;
            this.topBox[2].num = data.data.fermentingAmount30;
            this.topBox[3].num = data.data.fermentingAmount60;
            this.topBox[4].num = data.data.fermentingAmount90;
            this.topBox[5].num = data.data.fermentingAmount120;
            this.topBox[6].num = data.data.fermentingAmount150;
            // this.topBox[7].num = data.data.fermentingAmount180;
            // this.topBox[8].num = data.data.overdueAmount;
            // this.topBox[9].num = data.data.mixingAmount;
            // this.topBox[10].num = data.data.adjustAmount;
            // this.topBox[11].num = data.data.useAmount;
            // this.topBox[12].num = data.data.emptyAmount;
            this.topBox[7].num = data.data.mixingAmount;
            this.topBox[8].num = data.data.adjustAmount;
            this.topBox[9].num = data.data.useAmount;
            this.topBox[10].num = data.data.emptyAmount;

            this.topBox[1].materialCountList = data.data.materialCountList0 || [];
            this.topBox[2].materialCountList = data.data.materialCountList30 || [];
            this.topBox[3].materialCountList = data.data.materialCountList60 || [];
            this.topBox[4].materialCountList = data.data.materialCountList90 || [];
            this.topBox[5].materialCountList = data.data.materialCountList120 || [];
            this.topBox[6].materialCountList = data.data.materialCountList150 || [];
            // this.topBox[7].materialCountList = data.data.materialCountList180 || [];
            // this.topBox[8].materialCountList = data.data.overdueMaterialCountList || [];
            // this.topBox[9].materialCountList = data.data.mixingMaterialCountList || [];
            // this.topBox[10].materialCountList = data.data.useMaterialCountList || [];
            // // this.topBox[11].materialCountList = data.data.useAmount;
            this.topBox[7].materialCountList = data.data.mixingMaterialCountList || [];
            this.topBox[8].materialCountList = data.data.useMaterialCountList || [];
            // this.topBox[11].materialCountList = data.data.useAmount;
            if (data.data.data.records.length !== 0) {
                this.isSearchResultMetroShow = true; // 地铁图区块呈现
                this.isSearchResultListShow = true; // 结果区块呈现
                this.targetQueryTableList = data.data.data.records;

                this.$set(this.formHeader, 'currPage', data.data.data.current);
                this.$set(this.formHeader, 'fermStatus', queryForm.fermStatus);
                this.$set(this.formHeader, 'holderId ', queryForm.holderId);
                this.$set(this.formHeader, 'holderType', queryForm.holderType);
                this.$set(this.formHeader, 'pageSize', data.data.data.size);
                this.$set(this.formHeader, 'totalCount', data.data.data.total);
                this.$set(this.formHeader, 'workShop', queryForm.workShop);

            } else {
                if (this.$refs.queryTable.searchSource === 'bar') { //查询来自按钮
                    this.isSearchResultMetroShow = false;
                    this.isSearchResultListShow = false;
                } else { //查询来自地铁图
                    this.isSearchResultListShow = false;
                }
                this.$infoToast('暂无任何内容');
            }

        }

        // [btn][鼓罐]
        btnFilledBucket(item) {
            console.log(item);
            this.$refs.drumBucket.init(item);
        }

        // [btn][LYCY]
        btnLYCY(item) {
            console.log(item);
            this.$refs.LYCYBucket.init(item);
        }

        // [btn][btnAdjust]
        btnAdjust(item) {
            console.log(item);
            this.$refs.modifyBucket.init(item);
        }

        // [btn][清罐]
        btnClearBucket(item) {
            console.log(item);
            this.isClearDialogVisible = true;
            this.clearDataForm = {
                holderId: item.holderId,
                holderName: item.holderName,
                clearDate: dateFormat(new Date(), 'yyyy-MM-dd')
            }
        }

        // [btn][清洗]
        btnCleanBucket(item) {
            console.log(item);
            this.isCleanDialogVisible = true;
            this.cleanDataForm = {
                holderId: item.holderId,
                holderName: item.holderName,
                fermentorStatusName: item.fermentorStatusName,
                remark: '',
                doit: false,
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        }


        // 关闭弹窗
        btnCloseDialog() {
            this.isCleanDialogVisible = false;
            this.isClearDialogVisible = false;
        }


        // 保存清罐  /fer/fermentor/clear
        saveClearBucket() {
            FER_API.FER_FERMENTOR_CLEAR_API({
                clearDate: this.clearDataForm.clearDate,
                holderId: this.clearDataForm.holderId
            }).then(() => {
                this.isClearDialogVisible = false
                this.$successToast('清罐成功');
                this.getData() // 刷新结果
            });
        }

        // 保存清洗
        saveWashBucket() {
            if (this.cleanDataForm.doit === true) {
                FER_API.FER_FERMENTOR_CLEAN_API({
                    holderId: this.cleanDataForm.holderId,
                    remark: this.cleanDataForm.remark
                }).then(() => {
                    this.isCleanDialogVisible = false
                    this.$successToast('清洗成功');
                    this.getData() // 刷新结果
                });
            }
        }


        // 改变每页条数
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.getData();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.getData();
        }

        //can color
        setBucketColor(target, num) {
            if (target === 'E' || target === 'R' || target === 'C') { //E:空罐,R:投料中,C:待清洗
                return '#ffffff'
            } else if (target === 'F' || target === 'S') { // F:发酵中, S:已入库
                    if (num <= 30) {
                        return '#d5d2C3'
                    } else if (num > 30 && num <= 60) {
                        return '#cca785'
                    } else if (num > 60 && num <= 90) {
                        return '#b58150'
                    } else if (num > 90 && num <= 120) {
                        return '#c77C5a'
                    } else if (num > 120 && num <= 150) {
                        return '#ad592d'
                    } else if (num > 150 && num <= 180) {
                        return '#8a391b'
                    } else if (num > 180) {
                        return '#8a391b' //'#602813'
                    }
                        return '#8a391b' // 超期
            } else if (target === 'U' || target === 'A' || target === 'T') { //T:调酱中,A:已调整,U:领料中
                return '#8a391b'
            }

            return '#eeeeee'
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
    workShopName: string;
}

interface Options{
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
.home_card__main {
    min-width: 1200px;
}

.markStyle >>> th .notNull::before {
    margin-right: 4px;
    color: #f00;
    content: "*";
}
.markStyle >>> th .notNull {
    color: #333;
}


.markStyle >>> .star .el-form-item__label::before {
    margin-right: 4px;
    color: #f56c6c;
    content: "*";
}

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
.header_main >>> .fermenterTotalBox {
    width: 100%;
    overflow: scroll;
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
            position: relative;
            display: flex;
            flex: 2;
            justify-content: center;
            .pot_border {
                position: relative;
                width: 115px;
                height: 202px;
                overflow: hidden;
                .pot {
                    position: absolute;
                    top: 0;
                    z-index: 10;
                    width: 115px;
                    height: 202px;
                    // background: url(./assets/img/ferPotNew.png) no-repeat;
                    background: bottom center url("~@/assets/img/ferPotNew.png") no-repeat;
                    background-size: contain;
                }
                .pot_water {
                    position: absolute;
                    right: 0;
                    bottom: 10px;
                    left: 0;
                    width: 115px;
                    height: 182px;
                    margin: 0 auto;
                    overflow: hidden;
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

            .cq {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 99;
                img {
                    width: 80%;
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
                padding: 6px 10px;
                font-weight: 900;
                font-size: 12px;
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
    width: 1400px;
    margin: auto;
    padding: 10px 0;
    overflow-x: scroll;
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
$icon-bg-color:#f05c4a,#333,#147fe7,#5bd171,#ffbf00;
$repeat: length($icon-bg-color);  // How often you want the pattern to repeat.
.showBox {
    padding: 5px;
    li {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
        padding-left: 7px;
        font-size: 12px;
        list-style: none;
        &::before {
            position: absolute;
            top: 5px;
            left: -1px;
            width: 5px;
            height: 5px;
            border-radius: 5px;
            content: "";
        }
    }
}

@for $i from 1 through $repeat {
    .showBox li:nth-child(#{length($icon-bg-color)}n+#{$i})::before {
        background-color: nth($icon-bg-color, $i);
    }
}


</style>
