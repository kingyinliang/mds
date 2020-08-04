<template>
    <div>
        <div class="header_main">
            <el-card class="searchCard">
                <el-form :inline="true" :model="formHeader" size="small" label-width="100px" class="topform multi_row searchCard__form">
                    <el-form-item label="生产车间：" class="must-fill">
                        <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;" clearable>
                            <el-option v-for="(item, index) in workshopList" :key="index" :label="item.deptName" :value="item.id" />
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
                <data-tabs>
                    <template slot="1" slot-scope="data">
                        <in-storage ref="inStorage" :is-redact="data.isRedact" :data="currentFormDataGroup" />
                    </template>
                    <template slot="2" slot-scope="data">
                        <exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
                    </template>
                    <template slot="3" slot-scope="data">
                        <text-record ref="textRecord" :is-redact="data.isRedact" />
                    </template>
                </data-tabs>

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
        <!-- <data-entry
            ref="dataEntry"
            :order-status-show="false"
            :redact-auth="'pkg:order:update'"
            :save-auth="'pkg:order:update'"
            :submit-auth="'pkg:order:update'"
            :order-status="formHeader.orderStatusName"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            @success="getOrderList"
        >
            <template slot="1" slot-scope="data">
                <semi-receive ref="semiReceive" :is-redact="data.isRedact" />
            </template>
            <template slot="2" slot-scope="data">
                <exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
            </template>
            <template slot="3" slot-scope="data">
                <text-record ref="textRecord" :is-redact="data.isRedact" />
            </template>
        </data-entry> -->
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
    import DataTabs from './DataTabs.vue';
    import InStorage from './InStorage.vue'

    @Component({
        name: 'Instorage',
        components: {
            DataTabs,
            InStorage
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
            material: '',
            changer: '',
            changed: '',
            status: ''
        }

        orderData={}
        isRedact = false;
        workshopList = [];
        orderNoList: OptionsInList[] = [];
        searchCard = true;
        currentFormDataGroup: CurrentDataTable[] = [] // 主 data

        tabs = [
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

        mounted() {
            if (!this.isAuth('steStgQuery')) {
                this.$warningToast('无权限');
                return false
            }
            this.getWorkshopList();
        }

        selectOrder(val) {
            if (val === '') {
                this.formHeader.material = ''
                this.formHeader.status = ''
                this.formHeader.changer = ''
                this.formHeader.changed = ''
                return false
            }
            const tempOrderNoList = this.orderNoList.filter(item => item.orderNo === val)
            this.orderData = tempOrderNoList[0]
            this.formHeader.material = tempOrderNoList[0].materialCode + ' ' + tempOrderNoList[0].materialName
            this.formHeader.status = tempOrderNoList[0].orderStatusName
            this.formHeader.changer = tempOrderNoList[0].changer
            this.formHeader.changed = tempOrderNoList[0].changed
        }

        // 车间
        getWorkshopList() {
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '杀菌'
            }).then(({ data }) => {
                    this.workshopList = data.data;
                    if (data.data.length !== 0) {
                        this.formHeader.workShop = data.data[0]['id'];
                        // 获取生产订单
                        this.getOrderList()
                    }
            })
        }

        // 查询订单资料
        getOrderList() {
            COMMON_API.ORDER_LIST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                productDate: this.formHeader.inKjmDate,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                this.orderNoList = data.data
            })
        }

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
                console.log('data')
                console.log(data)
                if (!data.data || data.data.length === 0) {
                    this.$infoToast('暂无任何内容');
                    this.currentFormDataGroup = [];
                    return false
                }
                this.currentFormDataGroup = data.data
            })
        }

        savedDatas() {
            // const steSemi = this.$refs.semiReceive.savedData(this.formHeader);
            // const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'semiReceive');
            // const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            return STE_API.STE_SEMI_SAVE_API({
                // ...steSemi,
                // steExceptionInsertDtos: excRequest.InsertDto,
                // steExceptionUpdateDtos: excRequest.UpdateDto,
                // steExceptionRemoveDto: excRequest.ids,
                // steTextInsertDto: textRequest.pkgTextInsert,
                // steTextUpdateDto: textRequest.pkgTextUpdate
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
            inKjmDate?: string;
            orderNo?: string;
            material?: string;
            changer?: string;
            changed?: string;
            status?: string;
    }

    interface OrderData {
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
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
        // outputUnit: 'KG';
        // outputUnitName: '千克';
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

    interface CurrentDataTable{
        changed?: string;
        changer?: string;
        checkStatus?: string;
        id?: string;
        inStorageAmount?: number;
        inStorageBatch?: string;
        inStoragePot?: number;
        materialCode?: string;
        materialName?: string;
        materialUnit?: string;
        materialUnitName?: string;
        normalFlag?: string;
        orderId?: string;
        orderNo?: string;
        packageLine?: string;
        packageOrderNo?: string;
        productDate?: string;
        workShop?: string;
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
