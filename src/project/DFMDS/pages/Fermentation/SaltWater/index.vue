<template>
    <div class="header_main saltWater">
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
            <template v-if="targetQueryTableList.length===0" slot="home">
                <mds-card title="发酵罐列表" :pack-up="false">
                    <template slot="titleBtn">
                        <el-button type="text" size="small" style="float: right; margin-top: 8px;">
                            发酵罐一览表>>
                        </el-button>
                    </template>
                    <template>
                        <div class="pots">
                            <div v-for="(i) in 10" :key="i" class="pot">
                                <div class="header">
                                    <span>{{ '001' + '-' + '投料中' }}</span>
                                    <el-button type="primary" size="mini" style="padding: 7px 6px;" @click="toDetailPage(i)">
                                        盐水发料
                                    </el-button>
                                </div>
                                <div class="con">
                                    <img src="../../../assets/img/ferPot.png" alt="">
                                </div>
                                <div class="foot">
                                    <p>
                                        <span>{{ '六月香熟酱' }}</span>
                                        <span>{{ "90天" }}</span>
                                    </p>
                                    <p>
                                        <span>{{ '8098980980909' }}</span>
                                        <span>{{ "120吨" }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </template>
                </mds-card>
                <el-row>
                    <el-pagination :current-page="1" :page-sizes="[10, 20, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="10" @size-change="(val) => {'tabHandleSizeChange(tabItem.pages, val)'}" @current-change="(val) => {'tabHandleCurrentChange(tabItem.pages, val)'}" />
                </el-row>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import { dateFormat, getUserNameNumber } from 'utils/utils';
    // import ImportBucket from './ImportBucket.vue';
    import { COMMON_API, STE_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'SaltWater',
        components: {

        }
    })
    export default class SaltWater extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        targetQueryTableList: SaltWaterObj[] = []

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
                label: '发酵罐/池',
                prop: 'potId',
                labelWidth: 90,
                filterable: true,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
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
                type: 'date-interval',
                label: '投料日期',
                labelWidth: 90,
                valueFormat: 'yyyy-MM-dd',
                // defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'orderStartDateBegin',
                propTwo: 'orderStartDateEnd'
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
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
                this.targetQueryTableList = data.data as SaltWaterObj[];
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        toDetailPage(row) {
            console.log(row);
            // this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-KojiMaking-Audit-AuditDetail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-SaltWater-SaltWaterDetail`
                });
            }, 100);
            // this.$router.push({
            //     name: `DFMDS-pages-Fermentation-SaltWater-SaltWaterDetail`
            // })
        }
    }
    interface SaltWaterObj {
        id: string;
    }
</script>

<style lang="scss" scoped>
    .header_main {
        .pots {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .pot {
                box-sizing: border-box;
                // width: 203px;
                // width: 16%;
                // height: 308px;
                width: calc(20% - 20px);
                margin-right: 20px;
                margin-bottom: 20px;
                padding: 5px;
                background: #fff;
                border: 1px solid rgba(0, 0, 0, 0.09);
                border-radius: 8px;
                box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.09);
                opacity: 0.99;
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 36px;
                    border-bottom: 1px solid #e8e8e8;
                    span {
                        color: #666;
                        font-size: 14px;
                    }
                }
                .con {
                    box-sizing: border-box;
                    width: 100%;
                    padding: 20px;
                    text-align: center;
                    img {
                        width: 60%;
                    }
                }
                .foot {
                    p {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 3px;
                        span {
                            color: #333;
                            font-weight: 500;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
</style>
