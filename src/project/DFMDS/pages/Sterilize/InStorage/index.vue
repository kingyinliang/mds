<template lang="pug">
    div
        .header_main
            el-card.searchCard
                el-form.topform.multi_row.searchCard__form(:inline="true" :model="formHeader" size="small" label-width="85px")
                    el-form-item.must-fill(label="生产车间：")
                        el-select(v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;" clearable="" @change="selectWorkshop"): el-option(v-for="(item, index) in workshopList" :key="index" :label="item.targetName" :value="item.targetCode")
                    el-form-item.must-fill(label="生产日期：")
                        el-date-picker(v-model="formHeader.inKjmDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" style="width: 180px;" @change="selectTime")
                    el-form-item.must-fill(label="生产订单：")
                        el-select(v-model="formHeader.orderNo" placeholder="请选择" style="width: 180px;" clearable="" @change="selectOrder"): el-option(v-for="(item) in orderNoList" :key="item.id" :label="item.orderNo" :value="item.orderNo")
                    el-form-item(label="生产物料：")
                        el-tooltip(class="item" effect="dark" :content="formHeader.material" placement="top-start" :disabled="formHeader.material===''")
                            p.input_border_bg(style="width: 200px;") {{ formHeader.material }}
                    el-form-item(label="提交人员：")
                        el-tooltip(class="item" effect="dark" :content="formHeader.changer" placement="top-start" :disabled="formHeader.changer===''")
                            p.input_border_bg(style="width: 180px;") {{ formHeader.changer }}
                    el-form-item(label="提交时间：")
                        el-tooltip(class="item" effect="dark" :content="formHeader.changed" placement="top-start" :disabled="formHeader.changed===''")
                            p.input_border_bg(style="width: 180px;") {{ formHeader.changed }}
                .searchCard__control
                    div
                        el-button(type="primary" size="small" @click="btnGetResult") 查询
                    div(v-show="formHeader.inStorageStatus!==''")
                        //- span.dot(:style="{background: formHeader.status === 'noPass' ? 'red' : formHeader.status === 'saved' ? '#1890f' : formHeader.status === 'submit' ? '#1890ff' : formHeader.status === '已同步' ? '#f5f7fa' : 'rgb(103, 194, 58)',}")
                        span {{`入库状态：${checkStatusOption[formHeader.inStorageStatus]}`}}
                        //- span(:style="{color: formHeader.status === 'noPass' ? 'red' : '',}") {{ formHeader.status === 'noPass' ? '审核不通过' : formHeader.status === 'saved' ? '已保存' : formHeader.status === 'submit' ? '已提交' : formHeader.status === 'checked' ? '通过' : formHeader.status === '已同步' ? '未录入' : formHeader.status }}
            div(v-if="searchCard")
                tie-tabs(:tab-titles="tabTitles" ref="tabTitles")
                    template(slot="1"): in-storage(ref="inStorage" :is-redact="isRedact" card-title="入库列表" :table-data="tableData" :order-info="orderData" :pkg-work-shop-list="pkgWorkShopList")
                    template(slot="2"): exc-record(ref="excRecord" :is-redact="isRedact" :form-header="formHeader")
                    template(slot="3"): text-record(ref="textRecord" :is-redact="isRedact")
                //- redact-box
                //-     template(slot="button")
                //-         el-button.button(v-if="isAuth('steStgEdit') && searchCard" type="primary" size="small" @click="isRedact = !isRedact" :disabled="!alreadySearch") {{ isRedact ? '取消' : '编辑' }}
                //-         template(v-if="isRedact && searchCard" style="float: right; margin-left: 10px;")
                //-             el-button(v-if="isAuth('steStgSubmit')" type="primary" size="small" @click="submitDatas()") 提交
                //-             el-button(v-if="isAuth('steStgEdit')" type="primary" size="small" @click="savedDatas()") 保存
            redact-box(v-if="!(formHeader.orderStatus === 'C' || formHeader.orderStatus === 'D' || formHeader.orderStatus === 'P' || formHeader.orderStatus ==='M')" :disabled="redactBoxDisable" :is-redact.sync='isRedact' redact-auth="steStgEdit" save-auth="steStgEdit" submit-auth="steStgSubmit" :urgent-submit="false" :submit-rules="submitRules" :saved-rules="savedRules" :saved-datas="savedDatas" :submit-datas="submitDatas")
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
    import ExcRecord from './ExcRecord.vue' // tab3 文本记录
    import TextRecord from './TextRecord.vue' // tab3 文本记录
    import RedactBox from 'components/RedactBox.vue' // 下方状态 bar

    @Component({
        name: 'Instorage',
        components: {
            TieTabs,
            InStorage,
            ExcRecord,
            TextRecord,
            RedactBox
        }
    })
    export default class Instorage extends Vue {
        $refs: {
            tabTitles: HTMLFormElement;
            inStorage: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        formHeader: FormHeader= {
            workShop: '',
            inKjmDate: dateFormat(new Date(), 'yyyy-MM-dd'),
            orderNo: '',
            material: '',
            materialCode: '',
            materialName: '',
            changer: '',
            changed: '',
            status: '',
            outputUnit: '',
            outputUnitName: '',
            workShopName: '',
            factory: '',
            orderId: '',
            orderStatus: '',
            orderType: '',
            productDate: '',
            productLine: '',
            inStorageStatus: ''
        }

        orderData: OptionsInList={}

        workshopList: OptionsInList[] = [];
        pkgWorkShopList: OptionsInList[]=[]
        orderNoList: OptionsInList[] = [];

        // 入库状态 option
        inStorageStatus: InStorageStatusOptions[]=[]
        // 通用 check status option
        checkStatusOption={}

        searchCard=true

        isRedact = false;

        globalOrderNumber=''
        redactBoxDisable=true

        tabTitles = [
            {
                label: '杀菌入库',
                status: 'N'
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
                content: ['normalFlag'],
                wrapper: {
                    'Y': '是',
                    'N': '否'
                }
            },
            {
                type: 'string',
                prop: 'packageLineName',
                label: '包装产线',
                minWidth: 220,
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
                content: [{
                            buttonName: '删除',
                            btn: 'delBtn',
                            icon: 'el-icon-delete'
                        }
                        ]
            }
        ]

        mounted() {
            // 获取车间
            this.getWorkshopList();
            // 通用审核状态抓取
            this.getCheckStatus();
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
            this.formHeader.orderNo = ''
            this.formHeader.material = ''
            this.formHeader.status = ''
            this.formHeader.changer = ''
            this.formHeader.changed = ''
            this.formHeader.material = ''
            this.formHeader.materialCode = ''
            this.formHeader.materialName = ''
            this.formHeader.outputUnit = ''
            this.formHeader.outputUnitName = ''
            this.formHeader.factory = ''
            this.formHeader.orderId = ''
            this.formHeader.orderStatus = ''
            this.formHeader.orderType = ''
            this.formHeader.productDate = ''
            this.formHeader.productLine = ''
            this.formHeader.inStorageStatus = ''
            if (val !== '') {
                this.formHeader.workShop = val;
                this.formHeader.workShopName = this.workshopList.filter(item => item.targetCode === val)[0].targetName
                this.getOrderList()
            }
        }

        // 时间选择触发
        selectTime(val) {
            if (val !== '') {
                this.formHeader.orderNo = ''
                this.formHeader.material = ''
                this.formHeader.status = ''
                this.formHeader.changer = ''
                this.formHeader.changed = ''
                this.formHeader.material = ''
                this.formHeader.materialCode = ''
                this.formHeader.materialName = ''
                this.formHeader.outputUnit = ''
                this.formHeader.outputUnitName = ''
                this.formHeader.factory = ''
                this.formHeader.orderId = ''
                this.formHeader.orderStatus = ''
                this.formHeader.orderType = ''
                this.formHeader.productDate = ''
                this.formHeader.productLine = ''
                this.formHeader.inStorageStatus = ''
                this.formHeader.inKjmDate = val;
                this.getOrderList()
            }
        }

        // 订单下拉抓取
        getOrderList() {
            const orderTemp: string[] = []
            COMMON_API.ORDER_LIST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                productDate: this.formHeader.inKjmDate,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                console.log('订单下拉')
                console.log(data)
                this.orderNoList = data.data

                this.orderNoList.forEach(item => {
                    orderTemp.push(item.orderNo as string)
                })

                // 获取入库状态状态
                STE_API.STE_INSTORAGE_QUERY_TABS_STATUS_API(orderTemp
                ).then(({ data: element }) => {
                    this.inStorageStatus = element.data

                })
            })
        }

        // 通用审核状态抓取
        getCheckStatus() {
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_CHECK_STATUS'
            }).then(({ data }) => {
                if (data.data.length !== 0) {
                    data.data.forEach(item => {
                        this.$set(this.checkStatusOption, item.dictCode, item.dictValue)
                    })
                }
            })
        }

        // 订单选择触发
        selectOrder(val) {
            this.globalOrderNumber = val
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
                this.formHeader.factory = ''
                this.formHeader.orderId = ''
                this.formHeader.orderStatus = ''
                this.formHeader.orderType = ''
                this.formHeader.productDate = ''
                this.formHeader.productLine = ''
                this.formHeader.inStorageStatus = ''
                return false
            }
            this.orderData = this.orderNoList.filter(item => item.orderNo === val)[0]
            this.formHeader.material = this.orderData.materialCode + ' ' + this.orderData.materialName
            // this.formHeader.status = this.orderData.orderStatusName
            this.formHeader.changer = this.orderData.changer
            this.formHeader.changed = this.orderData.changed
            this.formHeader.materialCode = this.orderData.materialCode
            this.formHeader.materialName = this.orderData.materialName
            this.formHeader.outputUnit = this.orderData.outputUnit
            this.formHeader.outputUnitName = this.orderData.outputUnitName
            this.formHeader.workShopName = this.orderData.workShopName
            this.formHeader.factory = this.orderData.factory
            this.formHeader.orderId = this.orderData.id
            this.formHeader.orderStatus = this.orderData.orderStatus
            this.formHeader.orderType = this.orderData.orderType
            this.formHeader.productDate = this.orderData.productDate
            this.formHeader.productLine = this.orderData.productLine
            this.formHeader.inStorageStatus = this.inStorageStatus.filter(item => item.orderNo === this.formHeader.orderNo)[0].instorageStatus
            this.tabTitles[0]['status'] = this.formHeader.inStorageStatus
        }

        // 查询包装产线
        getPkgWorkShopList() {
            STE_API.STE_PKGLINE_QUERY_API({
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                console.log('包装产线')
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
            this.searchCard = false
            STE_API.STE_INSTORAGE_QUERY_API({
                orderNo: this.formHeader.orderNo,
                productDate: this.formHeader.inKjmDate,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                // 多馀的 this.searchCard 是对页签的状态强制更新
                this.isRedact = false
                this.searchCard = true
                this.redactBoxDisable = false
                this.getPkgWorkShopList()
                // $nextTick 避免页面者不到 inStorage.init
                this.$nextTick(() => {
                    if (!data.data) {
                        this.$infoToast('暂无任何内容');
                        this.$refs.inStorage.init([], this.formHeader)
                    } else {
                        this.$refs.inStorage.init(data.data, this.formHeader)
                    }
                    this.$refs.excRecord.init(this.formHeader, 'INSTORAGE');
                    this.$refs.textRecord.init(this.formHeader.orderNo, 'sterilize');
                })
            })
        }

        // {redact-box} 保存
        savedDatas() {
            const inStorageRequest = this.$refs.inStorage.getSavedOrSubmitData();
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'INSTORAGE');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            STE_API.STE_INSTORAGE_SAVE_API({
                exceptionDelete: excRequest.ids,
                exceptionInsert: excRequest.insertDto,
                exceptionUpdate: excRequest.updateDto,
                instorageDelete: inStorageRequest.ids,
                instorageInsert: inStorageRequest.steControlInsertDto,
                instorageUpdate: inStorageRequest.steControlUpdateDto,
                steOrderUpdateDto: this.formHeader,
                textInsert: textRequest.pkgTextInsert,
                textUpdate: textRequest.pkgTextUpdate
            }).then(() => {
                this.$successToast('保存成功');
                this.isRedact = false;
                // 重整数据

                this.getWorkshopList()
                this.btnGetResult();
                this.selectOrder(this.globalOrderNumber)
            })
        }

        // {redact-box} 提交
        submitDatas() {
            const inStorageRequest = this.$refs.inStorage.getSavedOrSubmitData();
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'INSTORAGE');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            STE_API.STE_INSTORAGE_SUBMIT_API({
                exceptionDelete: excRequest.ids,
                exceptionInsert: excRequest.insertDto,
                exceptionUpdate: excRequest.updateDto,
                instorageDelete: inStorageRequest.ids,
                instorageInsert: inStorageRequest.steControlInsertDto,
                instorageUpdate: inStorageRequest.steControlUpdateDto,
                steOrderUpdateDto: this.formHeader,
                textInsert: textRequest.pkgTextInsert,
                textUpdate: textRequest.pkgTextUpdate
            }).then(() => {
                this.$successToast('提交成功');
                this.isRedact = false;
                // 重整数据
                this.getWorkshopList()
                this.btnGetResult();
                this.selectOrder(this.globalOrderNumber)
            })
        }

        // {redact-box} 提交需跑的验证 function
        submitRules(): Function[] {
            return [this.$refs.inStorage.ruleSubmit, this.$refs.excRecord.ruleSubmit, this.$refs.textRecord.ruleSubmit]
        }

        // {redact-box} 保存需跑的验证 function
        savedRules(): Function[] {
            return []
        }

    }


    interface FormHeader{
        inStorageStatus?: string;
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
        factory?: string;
        orderId?: string;
        orderStatus?: string;
        orderType?: string;
        productDate?: string;
        productLine?: string;
    }

    interface OptionsInList{
        inStorageStatus?: string;
        changed?: string;
        changer?: string;
        // countMan: null;
        // countOutput: null;
        // countOutputUnit: '';
        // deviceTime: null;
        // dispatchMan: 'S01';
        // exceptionDateCount: null;
        factory?: string;
        // factoryName: '(8300)济南欣昌';
        // germs: null;
        id?: string;
        materialCode?: string;
        materialName?: string;
        // operator: '';
        // operatorDate: null;
        // orderEndDate: '2020-08-03';
        orderNo?: string;
        // orderStartDate: '2020-08-03';
        orderStatus?: string;
        orderStatusName?: string;
        orderType?: string;
        outputUnit?: string;
        outputUnitName?: string;
        // planOutput: 10000;
        productDate?: string;
        productLine?: string;
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
    interface InStorageStatusOptions{
        accessoriesStatus: string;
        controlStatus: string;
        id: string;
        instorageStatus: string;
        materialStatus: string;
        orderNo: string;
        timesheetStatus: string;
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
