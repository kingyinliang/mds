<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            type="home"
            :factory-type="1"
            :query-form-data="queryFormData"
            :column="column"
            :show-table="true"
            :custom-data="true"
            :show-operation-column="true"
            :operation-column-width="65"
            :list-interface="listInterface"
        >
            <template slot="mds-button">
                <el-button type="primary" size="small" style="margin-left: 10px;" @click="exportReport()">
                    报表导出
                </el-button>
                <el-button type="primary" size="small" style="margin-left: 10px;" @click="showReport()">
                    成品简报
                </el-button>
            </template>

            <template slot="home">
                <mds-card title="物料追踪" :pack-up="false">
                    <el-table ref="semiReceive" class="newTable" :data="semiReceiveList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" header-row-class-name="tableHead" border tooltip-effect="dark">
                        <el-table-column type="index" label="序号" width="50" align="center" fixed />
                        <table-tree-column label="物料" prop="fermentPotName" min-width="300" tree-key="id" show-overflow-tooltip />
                        <el-table-column label="批次" prop="stePotName" min-width="85" />
                        <el-table-column label="数量" prop="stePotName" min-width="85" />
                        <el-table-column label="单位" prop="stePotName" min-width="85" />
                        <el-table-column label="入罐时间" prop="changed" min-width="100" />
                    </el-table>
                </mds-card>
            </template>
        </query-table>
        <report ref="reportRef" @drumBucketFinish="drumBucketFinish" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    import Report from './TrackReport.vue';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'TrackIndex',
        components: {
            Report
        }
    })
    export default class TrackIndex extends Vue {
        $refs: {
            reportRef: HTMLFormElement;
        };

        queryFormData = [
            {
                type: 'select',
                label: '工厂',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '发酵'
                    });
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '物料描述',
                prop: 'status',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        dictType: 'FER_OPEN_STATUS'
                    });
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'input',
                label: '批次',
                prop: 'openPotNo'
            },
            {
            type: 'radio',
            prop: 'mixType',
            defaultValue: '反向追踪',
            radioArr: [
                {
                    label: '正向追踪',
                    val: '正向追踪'
                },
                {
                    label: '反向追踪',
                    val: '反向追踪'
                }
            ]
        }
        ];

        column = [
        ];

        // 查询
        listInterface(params) {
            params['factory'] = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return FER_API.FER_OPEN_POT_APPLY_LIST_API(params);
        }

        // 成品简报
        showReport(item) {
            this.$refs.reportRef.init(item);
        }

        // 报表导出
        exportReport() {
            //
        }


    }
</script>

<style scoped>

</style>
