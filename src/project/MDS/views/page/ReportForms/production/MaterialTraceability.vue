<template>
    <div class="header_main" style=" margin: 10px; padding: 15px; background: #fff;">
        <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="multi clearfix" style="font-size: 0;">
            <el-form-item label="生产工厂：">
                <el-select v-model="formHeader.werks" :disabled="isDisabled">
                    <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item label="物料：">
                <el-input v-model="formHeader.materialCode" :disabled="isDisabled" />
            </el-form-item>
            <el-form-item label="批次：">
                <el-input v-model="formHeader.batch" :disabled="isDisabled" />
            </el-form-item>
            <el-form-item class="floatr">
                <el-button v-if="isAuth('material:view')" :disabled="isDisabled" type="primary" size="small" @click="GetList(true)">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" class="newTable loading-area" border header-row-class-name="tableHead" style="margin-top: 10px;">
            <el-table-column label="车间" prop="workShop" width="110" />
            <el-table-column label="订单" prop="orderNo" width="130" />
            <!-- <el-table-column label="物料" prop="materialCode" treeKey="id"></el-table-column> -->
            <table-tree-column label="物料" prop="materialName" tree-key="id" show-overflow-tooltip />
            <el-table-column label="批次" prop="batch" width="220" show-overflow-tooltip />
            <el-table-column label="数量" prop="entryQnt" width="90" show-overflow-tooltip />
            <el-table-column label="单位" prop="entryUom" width="70" />
        </el-table>
    </div>
</template>

<script>
import { REP_API, BASICDATA_API } from '@/api/api'
import TableTreeColumn from '@/views/components/table-tree-column'
import { Loading } from 'element-ui'
export default {
    name: 'MaterialTraceability',
    components: {
        TableTreeColumn
    },
    data() {
        return {
            loadings: {},
            formHeader: {
                werks: '', // 2812A6620E204D0FBAFB40ECA8AD58FF
                materialCode: '', // PS01150205
                batch: '' // 200114BL71
            },
            factory: '',
            dataList: [],
            num: 1,
            isDisabled: false,
            // loading: false,
            loadingText: '加载中……'
        }
    },
    mounted() {
        this.Getdeptcode()
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList
                    if (!this.formHeader.werks && data.typeList.length > 0) {
                        this.formHeader.werks = data.typeList[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            })
        },
    // 查询
    GetList() {
        if (!this.formHeader.werks) {
            this.$warningToast('请选择工厂')
            return false
        }
        if (!this.formHeader.materialCode) {
            this.$warningToast('请填写物料')
            return false
        }
        if (!this.formHeader.batch) {
            this.$warningToast('请填写批次')
            return false
        }
        this.num = 1;
        this.dataList = [];
        this.loadingsArea = Loading.service({
            lock: true,
            spinner: 'loadingGif',
            text: '加载中……',
            background: 'rgba(255, 255, 255, 0.7)',
            target: document.querySelector('.loading-area')
        })
        this.isDisabled = true;
        // this.loading = true;
        this.$http(`${REP_API.MaterialTraceability_LIST_API}`, 'POST', this.formHeader, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                if (!data.data) {
                    this.loadingText = data.msg;
                    this.loadingsArea.setText(this.loadingText);
                    this.GetCheckOver();
                    if (this.num > 1) {
                        this.orderStatus = setInterval(() => {
                            this.GetCheckOver();
                        }, 4000);
                    }
                } else {
                    this.dataList = [];
                    this.dataList.push(data.data);
                    this.RegroupData(this.dataList, 1);
                    this.loadingsArea.close();
                    this.isDisabled = false;
                }
            } else {
                this.loadingsArea.close();
                this.isDisabled = false;
                this.$errorToast(data.msg);
            }
        })
    },
    GetCheckOver() {
        this.num += 1;
        if (this.num < 150) {
            this.$http(`${REP_API.MaterialTraceability_checkOver_API}`, 'POST', this.formHeader, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    if (data.data !== null && data.data !== '{}') {
                        this.dataList = [];
                        // this.dataList.push(data.msg);
                        this.dataList.push(JSON.parse(data.data));
                        this.RegroupData(this.dataList, 1);
                        this.loadingsArea.close();
                        this.isDisabled = false;
                        clearInterval(this.orderStatus);
                    } else if (data.times <= 0) {
                        this.loadingsArea.close();
                        this.isDisabled = false;
                        clearInterval(this.orderStatus);
                        this.$errorToast('请求超时');
                    } else {
                        this.loadingText = data.msg;
                        this.loadingsArea.setText(this.loadingText);
                    }
                } else {
                    this.loadingsArea.close();
                    this.isDisabled = false;
                    this.$errorToast(data.msg);
                }
            })
        } else {
            this.loadingsArea.close();
            this.isDisabled = false;
            clearInterval(this.orderStatus);
            this.$errorToast('请求超时');
        }
    },
    // 数据重组
    RegroupData(dataList, level) {
        for (let i = 0; i < dataList.length; i++) {
            dataList[i]['_level'] = level
            let pinjie = '';
            if (dataList[i]['id'] > 1) {
                if (i === (dataList.length - 1)) {
                    pinjie = '└─';
                } else {
                    pinjie = '├─';
                }
            }
            dataList[i]['materialName'] = pinjie + '  ' + dataList[i]['materialName']
            dataList[i]['children'] = dataList[i]['views']
            if (dataList[i]['hasChildren'] === true) {
                this.RegroupData(dataList[i]['views'], level + 1)
            }
        }
        // dataList.map(item => {
        //   item._level = item.id
        //   item.children = item.views
        //   if (item.hasChildren === true) {
        //     this.RegroupData(item.views)
        //   }
        // })
    }
    }
}
</script>

<style lang="scss">
.loading-area {
    min-height: 250px;
    .el-loading-mask {
        z-index: 1000;
    }
}
</style>
