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
                    <el-table
                        v-for="(item, index) in trackMaterialData"
                        :key="index"
                        class="newTable"
                        :data="[item]"
                        :row-key="rowKeyHandler"
                        :show-header="index === 0"
                        :tree-props="{children: 'views', hasChildren: 'hasChildren'}"
                        header-row-class-name="tableHead"
                        border
                        tooltip-effect="dark"
                    >
                        <!-- <el-table-column type="index" label="序号" width="50" align="center" fixed /> -->
                        <table-tree-column label="物料" prop="materialName" child-key="views" level-key="level" min-width="600" tree-key="id" />
                        <el-table-column label="批次" prop="batch" min-width="120" />
                        <el-table-column label="数量" prop="entryQnt" min-width="100" />
                        <el-table-column label="单位" prop="entryUom" min-width="100" />
                        <el-table-column label="入罐时间" prop="productDate" min-width="100" />
                    </el-table>
                </mds-card>
            </template>
        </query-table>
        <report ref="reportRef" @drumBucketFinish="drumBucketFinish" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { COMMON_API, TRACK_API } from 'common/api/api';
    import Report from './TrackReport.vue';
    import SocketClient from 'utils/net/WebSocketConnectMDSIot';
    import { showFullScreenLoading, tryHideFullScreenLoading } from 'utils/net/httpProxy';
    import axios from 'axios'
    import { ElLoadingComponent } from 'element-ui/types/loading';
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
            queryTable: HTMLFormElement;
        };

        trackMaterialData: TraceDataType[] = [];

        socketClient: { closeWebSocket: Function } | null = null;

        trackKey = '';

        loading: ElLoadingComponent | null = null;

        loadingText = '';

        timestamp = 0;

        timer: number | null = null;

        queryFormData = [
            {
                type: 'select',
                label: '工厂',
                prop: 'werks',
                defaultValue: '7100',
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
                type: 'input',
                label: '物料描述',
                prop: 'materialCode',
                defaultValue: 'M010200001'
            },
            {
                type: 'input',
                label: '批次',
                prop: 'batch',
                defaultValue: '2010290201'
            },
            {
                type: 'radio',
                prop: 'mixType',
                defaultValue: 'TRACK_BACK_REVERSE_TRACE_BACK',
                radioArr: [
                    {
                        label: '正向追踪',
                        val: 'TRACK_BACK_FORWARD_TRACE_BACK'
                    },
                    {
                        label: '反向追踪',
                        val: 'TRACK_BACK_REVERSE_TRACE_BACK'
                    }
                ]
            }
        ];

        column = [
        ];

        hideLoading() {
            this.loading && this.loading.close();
        }

        mounted() {
            this.websocketToLogin()
            // this.getByKey()
        }

        destroyed() {
            this.socketClient && this.socketClient.closeWebSocket();
            this.clearTimer()
        }

        clearTimer() {
            this.timer && clearInterval(this.timer);
        }

        updateText(text: string) {
            const dom = document.querySelector('.el-loading-spinner .el-loading-text')
            if (dom) {
                dom.innerHTML = text
            }
        }

        satrtTime() {
            this.timestamp = 0
            this.timer = setInterval(() => {
                this.timestamp++
                this.loadingText = `正在追溯...  ${this.timestamp} s`
                this.updateText(this.loadingText)
                if (this.timestamp >= 300) {
                    this.$errorToast('追溯失败，请重新追溯')
                    tryHideFullScreenLoading()
                    this.clearTimer()
                }
            }, 1000)
        }

        // 查询
        listInterface(params) {
            // params['factory'] = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            showFullScreenLoading()
            return new Promise((resolve) => {
                TRACK_API[params.mixType](params)
                    .then(() => {
                        this.satrtTime()
                        resolve({
                            data: {
                                data: {
                                    records: []
                                }
                            }
                        })
                    })
                    .catch(() => {
                        this.clearTimer()
                        tryHideFullScreenLoading()
                    })
            });
        }

        websocketToLogin() {
            if (this.socketClient) {
                return
            }
            // 【agentData：发送的参数；this.getConfigResult：回调方法】
            let key;
            if (process.env.VUE_APP_ENV === 'development') {
                key = 1;
            } else if (process.env.VUE_APP_ENV === 'test') {
                key = 1;
            } else {
                key = 2;
            }
            const wsObject = [
                {
                    url: 'wss://23kdu5ymdj.execute-api.cn-north-1.amazonaws.com.cn/pre',
                    appid: 'df-mds-dev',
                    channel: 'mds-trace-back-dev'
                },
                {
                    url: 'wss://23kdu5ymdj.execute-api.cn-north-1.amazonaws.com.cn/pre',
                    appid: 'df-mds-test',
                    channel: 'mds-trace-back-test'
                },
                {
                    url: 'wss://95po8swao3.execute-api.cn-north-1.amazonaws.com.cn/prod',
                    appid: 'df-mds-prod',
                    channel: 'mds-trace-back-prod'
                }
            ];

            const url = `${wsObject[key].url}?appid=${wsObject[key].appid}&channel=${wsObject[key].channel}&flag=${sessionStorage.getItem('loginUserId')}`;
            this.socketClient = new SocketClient(url, this.getConfigResult);
        }

        getConfigResult(res) {
            // 接收回调函数返回数据的方法
            // const data = JSON.parse(res.data);
            // .replaceAll('amp;', '')
            this.trackKey = JSON.parse(res.data).url
            console.log('函数 websocket 接收', this.trackKey);
            this.getByKey()
            this.clearTimer()
            this.updateText('正在解析...')
        }

        // 通过key获取数据
        async getByKey() {
            axios.get(this.trackKey)
            // axios.get('/static/7100M0102000012010290201.json')
                .then(res => {
                    console.log(res, '+++++++++')
                    this.addLevelDeep(res.data, 1)
                    this.trackMaterialData = res.data
                    tryHideFullScreenLoading()
                })
                .catch(e => {
                    console.log(e)
                    this.$errorToast('获取json失败')
                    tryHideFullScreenLoading()
                })
        }

        addLevelDeep(list, level) {
            list.map(item => {
                item.level = level
                if (item.hasChildren) {
                    this.addLevelDeep(item.views, level + 1)
                }
            })
        }

        rowKeyHandler(row) {
            return row.id
        }

        drumBucketFinish() {
            console.log(111)
        }

        // 成品简报
        showReport(item) {
            this.$refs.reportRef.init(item);
        }

        // 报表导出
        exportReport() {
            const { materialCode, batch, werks } = this.$refs.queryTable.queryForm
            TRACK_API.TRACK_BACK_QUERY_LEVEL_TRACE_BACK_EXCEL({
                materialCode,
                batch,
                werks
            }).then(res => {
                const elink = document.createElement('a');
                elink.download = `${'fileName'}.xls`;
                elink.style.display = 'none';
                elink.href = res.data.data.url;
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            }).catch(e => {
                console.log(e)
            })
        }
    }

    interface TraceDataType {
        materialName?: string;
        batch?: string;
        entryQnt?: string;
        entryUom?: string;
        productDate?: string;
    }

</script>

<style scoped>

</style>
