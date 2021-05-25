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
            @search-init="searchInit"
        >
            <template slot="mds-button">
                <el-button type="primary" size="small" style="margin-left: 10px;" @click="exportReport()">
                    报表导出
                </el-button>
                <el-button v-show="queryTableRefForm.mixType === 'TRACK_BACK_FORWARD_TRACE_BACK'" type="primary" size="small" style="margin-left: 10px;" @click="showReport()">
                    成品简报
                </el-button>
                <!-- <el-button type="primary" size="small" style="margin-left: 10px;" @click="expand()">
                    一鍵展開
                </el-button> -->
            </template>

            <template slot="home">
                <mds-card title="物料追踪" :pack-up="false">
                    <!-- <el-table
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
                        <el-table-column type="index" label="序号" width="50" align="center" fixed />
                        <table-tree-column label="物料" prop="materialName" child-key="views" level-key="level" min-width="600" tree-key="id" />
                        <el-table-column label="批次" prop="batch" min-width="120" />
                        <el-table-column label="数量" prop="entryQnt" min-width="100" />
                        <el-table-column label="单位" prop="entryUom" min-width="100" />
                        <el-table-column label="入罐时间" prop="productDate" min-width="100" />
                    </el-table> -->
                    <div id="tree_table">
                        <div class="table_row_head">
                            <div class="table_td_head first_td" style="border-radius: 15px 0 0 0;">
                                物料
                            </div>
                            <div class="table_td_head">
                                批次
                            </div>
                            <div class="table_td_head">
                                数量
                            </div>
                            <div class="table_td_head">
                                单位
                            </div>
                            <div class="table_td_head" style="border-radius: 0 15px 0 0;">
                                入罐日期
                            </div>
                        </div>
                        <div v-if="!trackMaterialData.length" style="width: 100%; height: 40px; line-height: 40px; text-align: center;">
                            暂无数据
                        </div>
                        <tree-menu-row v-else ref="treeMenuRowRef" :views="trackMaterialData" />
                    </div>
                </mds-card>
            </template>
        </query-table>
        <report ref="reportRef" @drumBucketFinish="drumBucketFinish" />
        <batch-detail ref="batchDetailRef" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { COMMON_API, TRACK_API } from 'common/api/api';
    import Report from './TrackReport.vue';
    import BatchDetail from './batchDetail.vue'
    import SocketClient from 'utils/net/WebSocketConnectMDSIot';
    import { showFullScreenLoading, tryHideFullScreenLoading } from 'utils/net/httpProxy';
    import axios from 'axios'
    import { ElLoadingComponent } from 'element-ui/types/loading';
    // import { dateFormat } from 'utils/utils';
    // 乱糟糟，哎

    @Component({
        name: 'TrackIndex',
        components: {
            Report,
            BatchDetail
        }
    })
    export default class TrackIndex extends Vue {
        $refs: {
            reportRef: HTMLFormElement;
            queryTable: HTMLFormElement;
            batchDetailRef: HTMLFormElement;
            treeMenuRowRef: HTMLFormElement;
        };

        trackMaterialData: TraceDataType[] = [];

        socketClient: { closeWebSocket: Function } | null = null;

        trackKey = '';

        loading: ElLoadingComponent | null = null;

        loadingText = '';

        timestamp = 0;

        timer: number | null = null;

        queryTableRefForm = {}

        queryFormData = [
            {
                type: 'select',
                label: '工厂',
                prop: 'werks',
                defaultValue: '7100',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        deptType: ['FACTORY']
                    })
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
                defaultValue: 'TRACK_BACK_FORWARD_TRACE_BACK',
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
            this.queryTableRefForm = this.$refs.queryTable.queryForm
        }

        destroyed() {
            this.socketClient && this.socketClient.closeWebSocket();
            this.clearTimer()
        }

        searchInit() {
            const { materialCode, batch, werks } = this.$refs.queryTable.queryForm
            this.$store.commit('track/updateSearchInfo', { materialCode, batch, werks })
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
                    this.initLevel(res.data, 1, [])
                    this.trackMaterialData = res.data
                    tryHideFullScreenLoading()
                })
                .catch(e => {
                    console.log(e)
                    this.$errorToast('获取json失败')
                    tryHideFullScreenLoading()
                })
        }

        /**
         * 初始化列表
         * @param list 原始数据
         * @param level 层级
         */
        initLevel(list, level, lastFlagArray, expand = false) {
            list.map((item, index) => {
                item.level = level
                item.lastFlagArray = lastFlagArray
                //隐藏标志默认为false
                item.hiddenFlag = false
                //展开标志默认为false
                item.unfoldFlag = expand
                item.allChildrenShowFlag = true
                let hasNextFlag = false
                for (let i = index + 1; i < list.length; i++) {
                    if (!list[i].hiddenFlag) {
                        hasNextFlag = true
                        break
                    }
                }
                item.hasNextFlag = hasNextFlag
                //初始化兄弟尾部元素标志
                if (index + 1 === list.length) {
                    item.lastFlag = true
                } else {
                    item.lastFlag = false
                }
                //初始化兄弟首元素标志
                if (index === 0) {
                    item.firstFlag = true
                } else {
                    item.firstFlag = false
                }
                const nextLastFlagArray: boolean[] = [];
                lastFlagArray.map(flag => {
                    nextLastFlagArray.push(flag)
                })
                nextLastFlagArray.push(item.lastFlag)
                //递归
                if (item.hasChildren) {
                    this.initLevel(item.views, level + 1, nextLastFlagArray, expand)
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
            const { materialCode, batch, werks } = this.$refs.queryTable.queryForm
            this.$refs.reportRef.init(item, { materialCode, batch, werks });
        }

        // 报表导出
        exportReport() {
            const { materialCode, batch, werks, mixType } = this.$refs.queryTable.queryForm
            const api = mixType === 'TRACK_BACK_FORWARD_TRACE_BACK' ? 'TRACE_BACK_EXCEL_FORWARD' : 'TRACK_BACK_EXCEL_REVERSE'
            TRACK_API[api]({
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

        // 批次详情
        batchInit(row) {
            const { werks } = this.$refs.queryTable.queryForm
            this.$refs.batchDetailRef.init({ ...row, werks })
        }

        expand() {
            this.initLevel(this.trackMaterialData, 1, [], true)
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
#tree_table {
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
}

.table_row_head {
    display: flex;
    justify-content: flex-start;
    color: #fff;
    border-radius: 15px 15px 0 0;
}

.table_td_head {
    width: 100px;
    height: 40px;
    margin: 0 -1px -1px 0;
    line-height: 40px;
    text-align: center;
    background-color: #487bff;
    border: 1px solid transparent;
}
.first_td {
    flex: 1;
}
</style>
