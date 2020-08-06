<template>
    <div>
        <div class="header_main">
            <el-card class="searchCard">
                <el-form :inline="true" :model="formHeader" size="small" label-width="85px" class="topform multi_row searchCard__form">
                    <el-form-item label="生产车间：" class="must-fill">
                        <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;" clearable @change="selectWorkshop">
                            <el-option v-for="(item, index) in workshopList" :key="index" :label="item.targetName" :value="item.targetCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产日期：" class="must-fill">
                        <el-date-picker v-model="formHeader.inKjmDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" style="width: 180px;" />
                    </el-form-item>
                    <el-form-item label="生产订单：" class="must-fill">
                        <el-select v-model="formHeader.orderNo" placeholder="请选择" style="width: 180px;" clearable @change="selectOrder">
                            <el-option v-for="(item) in orderNoList" :key="item.id" :label="item.orderNo" :value="item.orderNo" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产物料：">
                        <p class="input_border_bg" style="width: 180px;">
                            {{ formHeader.material }}
                        </p>
                    </el-form-item>
                    <el-form-item label="提交人员：">
                        <p class="input_border_bg" style="width: 180px;">
                            {{ formHeader.changer }}
                        </p>
                    </el-form-item>
                    <el-form-item label="提交时间：">
                        <p class="input_border_bg" style="width: 180px;">
                            {{ formHeader.changed }}
                        </p>
                    </el-form-item>
                </el-form>
                <div class="searchCard__control">
                    <div>
                        <el-button type="primary" size="small" :disabled="!formHeader.workShop||!formHeader.inKjmDate||!formHeader.orderNo" @click="btnGetResult">
                            查询
                        </el-button>
                    </div>
                    <div v-show="formHeader.status!==''">
                        <span
                            class="dot"
                            :style="{
                                background: formHeader.status === 'noPass' ? 'red' : formHeader.status === 'saved' ? '#1890f' : formHeader.status === 'submit' ? '#1890ff' : formHeader.status === '已同步' ? '#f5f7fa' : 'rgb(103, 194, 58)',
                            }"
                        />订单状态：
                        <span
                            :style="{
                                color: formHeader.status === 'noPass' ? 'red' : '',
                            }"
                        >{{ formHeader.status === 'noPass' ? '审核不通过' : formHeader.status === 'saved' ? '已保存' : formHeader.status === 'submit' ? '已提交' : formHeader.status === 'checked' ? '通过' : formHeader.status === '已同步' ? '未录入' : formHeader.status }}</span>
                    </div>
                </div>
            </el-card>

            <div v-show="searchCard">
                <tie-tabs :tab-titles="tabTitles">
                    <template slot="1">
                        <in-storage ref="inStorage" :is-redact="isRedact" card-title="入库列表" :table-data="tableData" :order-info="orderData" :pkg-work-shop-list="pkgWorkShopList" />
                    </template>
                    <template slot="2" slot-scope="data">
                        <exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
                    </template>
                    <template slot="3">
                        <text-record ref="textRecord" :is-redact="isRedact" />
                    </template>
                </tie-tabs>

                <redact-box>
                    <template slot="button">
                        <el-button v-if="isAuth('steStgEdit') && searchCard" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                            {{ isRedact ? '取消' : '编辑' }}
                        </el-button>
                        <template v-if="isRedact && searchCard" style="float: right; margin-left: 10px;">
                            <el-button v-if="isAuth('steStgEdit')" type="primary" size="small" @click="savedDatas()">
                                保存
                            </el-button>
                            <el-button v-if="isAuth('steStgSubmit')" type="primary" size="small" @click="submitDatas()">
                                提交
                            </el-button>
                        </template>
                    </template>
                </redact-box>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// 查询按钮
// 生产车间、生产日期、生产订单未选取时，状态 discale
// 订单状态
// 生产订单没有值时，不显示
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';
    import TieTabs from './DataTabs.vue';
    import InStorage from './InStorage.vue'
    import TextRecord from './TextRecord.vue' // tab3 文本记录

    @Component({
        name: 'Instorage',
        components: {
            TieTabs,
            InStorage,
            TextRecord
        }
    })
    export default class Instorage extends Vue {
        $refs: {
            inStorage: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        formHeader: FormHeader= {
            workShop: '',
            inKjmDate: dateFormat(new Date(), 'yyyy-MM-dd'),
            orderNo: '',
            materialCode: '',
            materialName: '',
            changer: '',
            changed: '',
            status: '',
            outputUnit: '',
            outputUnitName: '',
            workShopName: ''
        }

        orderData: OptionsInList={}
        isRedact = false;
        workshopList: OptionsInList[] = [];
        pkgWorkShopList: OptionsInList[]=[]
        orderNoList: OptionsInList[] = [];
        searchCard = true;

        tabTitles = [
            {
                label: '杀菌入库',
                status: '未录入'
            },
            {
                label: '异常记录'
            },
            {
                label: '文本记录'
            }
        ];

        tableData=[
            {
                type: 'index',
                prop: '',
                label: '序号',
                width: 50,
                content: ['']
            },
            {
                type: 'string',
                prop: 'normalFlag',
                label: '正常入库',
                minWidth: 100,
                content: ['normalFlag']
            },
            {
                type: 'string',
                prop: 'packageLine',
                label: '包装产线',
                minWidth: 200,
                content: ['packageLineName']
            },
            {
                type: 'string',
                prop: 'packageOrderNo',
                label: '包装订单',
                minWidth: 100,
                content: ['packageOrderNo']
            },
            {
                type: 'string',
                prop: 'material',
                label: '入库物料',
                minWidth: 200,
                content: ['materialCode', 'materialName']
            },
            {
                type: 'string',
                prop: 'materialUnit',
                label: '单位',
                minWidth: 70,
                content: ['materialUnit']
            },
            {
                type: 'string',
                prop: 'inStorageAmount',
                label: '入库数量',
                minWidth: 100,
                content: ['inStorageAmount']
            },
            {
                type: 'string',
                prop: 'inStorageBatch',
                label: '入库批次',
                minWidth: 100,
                content: ['inStorageBatch']
            },
            {
                type: 'string',
                prop: 'remark',
                label: '备注',
                minWidth: 100,
                content: ['remark']
            },
            {
                type: 'string',
                prop: 'changer',
                label: '操作人',
                minWidth: 140,
                content: ['changer']
            },
            {
                type: 'string',
                prop: 'changed',
                label: '操作时间',
                minWidth: 140,
                content: ['changed']
            },
            {
                type: 'control',
                prop: '',
                label: '操作',
                width: 100,
                content: [{ buttonName: '删除' }]
            }

            // {
            //     type: 'button',
            //     prop: 'normalFlag',
            //     label: '正常入库',
            //     width: 100,
            //     minWidth: 100,
            //     content: []
            // }
        ]

        mounted() {
            // if (!this.isAuth('steStgQuery')) {
            //     this.$warningToast('无权限');
            //     return false
            // }

            // 获取车间
            this.getWorkshopList();


        }

        // 车间下拉抓取
        getWorkshopList() {
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '杀菌'
            }).then(({ data }) => {
                    this.workshopList = []
                    if (data.data.length !== 0) {
                        data.data.forEach(item => {
                            this.workshopList.push({ targetCode: item.id, targetName: item.deptName })
                        })
                        // 根据回传预先取第一笔
                        this.formHeader.workShop = data.data[0]['id'];
                        this.formHeader.workShopName = data.data[0]['deptName'];
                        this.getOrderList()
                    }
            })
        }

        // 车间选择触发
        selectWorkshop(val) {
            if (val !== '') {
                this.formHeader.workShop = val;
                this.formHeader.workShopName = this.workshopList.filter(item => item.targetCode === val)[0].targetName
                this.getOrderList()
            }

        }

        // 订单下拉抓取
        getOrderList() {
            COMMON_API.ORDER_LIST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                productDate: this.formHeader.inKjmDate,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                console.log('获取所有订单讯息')
                console.log(data)
                this.orderNoList = data.data
            })
        }

        // 订单选择触发
        selectOrder(val) {
            if (this.formHeader.inKjmDate === '') {
                this.$infoToast('请选择生产日期');
                return false
            }
            if (this.formHeader.workShop === '') {
                this.$infoToast('请选择车间');
                return false
            }

            // 清除下拉选单时连带清除有值时所带出来的栏位内容
            if (val === '') {
                this.formHeader.material = ''
                this.formHeader.status = ''
                this.formHeader.changer = ''
                this.formHeader.changed = ''
                this.formHeader.material = ''
                this.formHeader.materialCode = ''
                this.formHeader.materialName = ''
                this.formHeader.outputUnit = ''
                this.formHeader.outputUnitName = ''
                return false
            }
            this.orderData = this.orderNoList.filter(item => item.orderNo === val)[0]
            this.formHeader.material = this.orderData.materialCode + ' ' + this.orderData.materialName
            this.formHeader.status = this.orderData.orderStatusName
            this.formHeader.changer = this.orderData.changer
            this.formHeader.changed = this.orderData.changed
            this.formHeader.materialCode = this.orderData.materialCode
            this.formHeader.materialName = this.orderData.materialName
            this.formHeader.outputUnit = this.orderData.outputUnit
            this.formHeader.outputUnitName = this.orderData.outputUnitName
            this.formHeader.workShopName = this.orderData.workShopName
        }

        // 查询包装产线
        getPkgWorkShopList() {
            STE_API.STE_PKGLINE_QUERY_API({
                // orderNo: this.formHeader.orderNo
                orderNo: '833000001283'
            }).then(({ data }) => {
                console.log('查询包装查询结果')
                console.log(data)
                this.pkgWorkShopList = []
                if (data.data) {
                    data.data.forEach(item => {
                        this.pkgWorkShopList.push({ targetCode: item.pkgLine, targetName: item.pkgLineName })
                    })
                }
            })
        }

        // 查询结果
        btnGetResult() {
            if (this.formHeader.workShop === '' || this.formHeader.inKjmDate === '' || this.formHeader.orderNo === '') {
                this.$infoToast('尚有必填栏位');
                return false
            }

            STE_API.STE_INSTORAGE_QUERY_API({
                orderNo: this.formHeader.orderNo,
                productDate: this.formHeader.inKjmDate,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                console.log('查询结果')
                console.log(data)

                if (!data.data) {
                    this.$infoToast('暂无任何内容');
                    this.$refs.inStorage.init([], this.formHeader)
                } else {
                    this.$refs.inStorage.init(data.data, this.formHeader)
                }
                this.getPkgWorkShopList()
                this.$refs.textRecord.init(this.formHeader.orderNo, 'sterilize');
            })
        }

        savedDatas() {
            let exceptionDeleteTemp
            let exceptionInsertTemp
            let exceptionUpdateTemp
            let instorageDeleteTemp
            let instorageInsertTemp
            let instorageUpdateTemp
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            STE_API.STE_INSTORAGE_SAVE_API({
                exceptionDelete: exceptionDeleteTemp,
                exceptionInsert: exceptionInsertTemp,
                exceptionUpdate: exceptionUpdateTemp,
                instorageDelete: instorageDeleteTemp,
                instorageInsert: instorageInsertTemp,
                instorageUpdate: instorageUpdateTemp,
                steOrderUpdateDto: '',
                textInsert: textRequest.pkgTextInsert,
                textUpdate: textRequest.pkgTextUpdate
            }).then(() => {
                this.$successToast('保存成功');
            })
        }

        submitDatas() {
            // const steSemi = this.$refs.semiReceive.savedData(this.formHeader);
            // const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'semiReceive');
            // const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            // return STE_API.STE_SEMI_SUBMIT_API({
            //     ...steSemi,
            //     steExceptionInsertDtos: excRequest.InsertDto,
            //     steExceptionUpdateDtos: excRequest.UpdateDto,
            //     steExceptionRemoveDto: excRequest.ids,
            //     steTextInsertDto: textRequest.pkgTextInsert,
            //     steTextUpdateDto: textRequest.pkgTextUpdate
            // })
        }
    }

    interface FormHeader{
            workShop?: string;
            workShopName?: string;
            inKjmDate?: string;
            orderNo?: string;
            changer?: string;
            changed?: string;
            status?: string;
            material?: string;
            materialCode?: string;
            materialName?: string;
            outputUnit?: string;
            outputUnitName?: string;

    }

    interface OptionsInList{
        changed?: string;
        changer?: string;
        // countMan: null;
        // countOutput: null;
        // countOutputUnit: '';
        // deviceTime: null;
        // dispatchMan: 'S01';
        // exceptionDateCount: null;
        // factory: '4F8122C62C6D6C6999';
        // factoryName: '(8300)济南欣昌';
        // germs: null;
        // id: '494837770712338449';
        materialCode?: string;
        materialName?: string;
        // operator: '';
        // operatorDate: null;
        // orderEndDate: '2020-08-03';
        orderNo?: string;
        // orderStartDate: '2020-08-03';
        orderStatus?: string;
        orderStatusName?: string;
        // orderType: '8330';
        outputUnit?: string;
        outputUnitName?: string;
        // planOutput: 10000;
        // productDate: '2020-08-03';
        // productLine: '474262750789451776';
        // productLineName: '杀菌一线';
        // readyTime: null;
        // realInAmount: null;
        // realOutput: null;
        // userTime: null;
        workShop?: string;
        workShopName?: string;
    }

    interface OptionsInList{
        targetCode?: string;
        targetName?: string;
    }
</script>

<style scoped>
.searchCard {
    padding: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);
}

.searchCard >>> .el-card__body {
    display: flex;
    flex-direction: row;
}

.searchCard >>> .el-card__body .searchCard__form {
    flex: 1;
}
.header_main .searchCard >>> .el-card__body .searchCard__form > div.el-form-item.el-form-item--small {
    margin-bottom: 10px !important;
}

.searchCard >>> .el-card__body .searchCard__control {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    justify-content: space-between;
    width: 150px;
    font-size: 14px;
}

.searchCard .dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-right: 8px;
    line-height: 16px;
    border-radius: 50%;
}

.searchCard >>> .must-fill > label::before {
    margin-right: 4px;
    color: #f56c6c;
    content: "*";
}
</style>
