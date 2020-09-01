<template>
    <el-row v-loading.fullscreen.lock="lodingS" element-loading-text="加载中">
        <div class="header_main">
            <query-table ref="queryTable" :query-form-data="queryFormData" :rules="rules" :list-interface="listInterface" query-auth="report:form:listShopAttM" table-class="newTable borderTable" :column="column" @get-data-success="setTable">
                <template slot="mds-button">
                    <el-button v-if="isAuth('report:form:exportShopAttM')" type="primary" size="small" @click="ExportExcel(true)">
                        导出
                    </el-button>
                </template>
            </query-table>
        </div>
    </el-row>
</template>

<script>
import { REP_API, BASICDATA_API } from '@/api/api';
import { getNewDate } from '@/net/validate';
export default {
    name: 'Index',
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['workshop', 'deptId']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workshop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                            deptId: val
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['productline']
                },
                {
                    type: 'select',
                    label: '生产产线',
                    prop: 'productline',
                    resVal: {
                        resData: 'childList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    defaultValue: '',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val });
                    }
                },
                {
                    type: 'select',
                    label: '生产班组',
                    prop: 'deptId',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDTEAM_API}`, 'POST', {
                            factory: val
                        });
                    },
                    defaultValue: '',
                    resVal: {
                        resData: 'teamList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'date-picker',
                    label: '生产日期',
                    dataType: 'month',
                    valueFormat: 'yyyy-MM',
                    prop: 'productDate'
                }
            ],
            rules: [
                {
                    prop: 'productDate',
                    text: '请选择月份'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPATTM_API}`, 'POST', params);
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '120'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '120'
                },
                {
                    prop: 'productLineName',
                    label: '产线',
                    minwidth: '120'
                },
                {
                    prop: 'teamName',
                    label: '班组',
                    minwidth: '100'
                },
                {
                    prop: 'userId',
                    label: '人员',
                    minwidth: '120'
                },
                {
                    prop: 'userId',
                    label: '统计',
                    child: [
                        { prop: 'dayAllDay', label: '白班天数', width: '90' },
                        { prop: 'nightAllDay', label: '夜班天数', width: '90' },
                        { prop: 'allTime', label: '总计出勤数（H）', width: '140' },
                        { prop: 'workAllDay', label: '上班天数', width: '90' },
                        { prop: 'offDutyAllDay', label: '休班天数', width: '90' }
                    ]
                }
            ],
            ExportTime: {},
            lodingS: false
        };
    },
    methods: {
        setTable(data) {
            this.column = this.column.slice(0, 6);
            const dataList = data.page.list
            if (dataList.length) {
                const temp = this.$refs.queryTable.queryForm.productDate;
                const month = temp.substring(temp.indexOf('-') + 1).split('')[0] === '0' ? temp.substring(temp.indexOf('-') + 1).slice(1) : temp.substring(temp.indexOf('-') + 1);
                dataList[0].listMonth.forEach((item, index) => {
                    this.column.push({
                        label: `${month}月${index + 1}日`,
                        child: [
                            {
                                prop: `listMonth[${index}].dayTime`,
                                label: '白班时数'
                            },
                            {
                                prop: `listMonth[${index}].nightTime`,
                                label: '夜班时数'
                            }
                        ]
                    })
                })
            }
        },
        ExportExcel() {
            if (!this.$refs.queryTable.queryForm.productDate) {
                this.$notify.error({ title: '错误', message: '请选择月份' });
                return false;
            }
            this.lodingS = true;
            this.$http(`${REP_API.REPOUTFORWORKOUTPUT_API}`, 'POST', this.$refs.queryTable.queryForm).then(({ data }) => {
                if (data.code === 0) {
                    this.ExportTime = setInterval(() => {
                        this.GetExportExcel();
                    }, 4000);
                } else {
                    this.lodingS = false;
                    this.$errorToast(data.msg);
                }
            });
        },
        GetExportExcel() {
            this.$http(`${REP_API.GETREPOUTFORWORKOUTPUT_API}`, 'GET', {
                asyncType: 'ASYNC_TYPE_EXPORT_SHOP_ATTM'
            })
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.asyncRecord) {
                            if (data.asyncRecord.asyncStatus === '0') {
                                this.lodingS = false;
                                clearInterval(this.ExportTime);
                                this.$notify.error({
                                    title: '错误',
                                    message: '导出失败'
                                });
                            } else if (data.asyncRecord.asyncStatus === '1') {
                                this.lodingS = false;
                                clearInterval(this.ExportTime);
                                this.$notify({
                                    title: '成功',
                                    message: '导出成功',
                                    type: 'success'
                                });
                                const elink = document.createElement('a');
                                elink.download = `车间出勤汇总报表${getNewDate()}.xlsx`;
                                elink.style.display = 'none';
                                elink.href = data.asyncRecord.fileUrl;
                                document.body.appendChild(elink);
                                elink.click();
                                document.body.removeChild(elink);
                            }
                        }
                    } else {
                        this.lodingS = false;
                        clearInterval(this.ExportTime);
                        this.$errorToast(data.msg);
                    }
                })
                .catch(() => {
                    this.lodingS = false;
                    clearInterval(this.ExportTime);
                });
        }
    }
};
</script>

<style scoped></style>
