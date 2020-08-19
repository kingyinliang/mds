<template>
    <div>
        <data-entry
            ref="dataEntry"
            redact-auth="steAccEdit"
            save-auth="steAccEdit"
            submit-auth="steAccSubmit"
            :order-status="formHeader.statusName"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            :submit-rules="submitRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            @success="getOrderList"
        >
            <template slot="1" slot-scope="data">
                <acce-add ref="acceadd" :is-redact="data.isRedact" />
            </template>
            <template slot="2" slot-scope="data">
                <exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
            </template>
            <template slot="3" slot-scope="data">
                <text-record ref="textRecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import AcceAdd from './common/AcceAdd.vue';
    import { STE_API } from 'common/api/api';

    @Component({
        name: 'AcceAddIndex',
        components: {
            AcceAdd
        }
    })
    export default class AcceAddIndex extends Vue {
        $refs: {
            acceadd: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
        };

        formHeader: OrderData = {};
        headerBase = [
            {
                type: 'p',
                label: '生产车间',
                icon: 'factory-shengchanchejian',
                value: 'workShopName'
            },
            {
                type: 'p',
                label: '生产锅号',
                icon: 'factory-qiyaguanjianhua',
                value: 'potNo'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                label: '生产锅序',
                icon: 'factory-bianhao',
                value: 'potOrder'
            },
            {
                type: 'p',
                label: '生产产量',
                icon: 'factory--meirijihuachanliangpeizhi',
                value: 'potAmount'
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '生产日期',
                value: 'productDate'
            },
            {
                type: 'p',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员', // 操作人员
                value: 'changer'
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        tabs: TabsObj[] = [
            {
                label: '辅料添加',
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
            this.getOrderList()
        }

        // 查询表头
        getOrderList() {
            if (!this.isAuth('steAccQuery')) {
                this.$warningToast('无权限');
                return false
            }
            STE_API.STE_DETAIL_CRAFTHEADER_INFO_API({
                potOrderNo: this.$store.state.sterilize.AcceAdd.potOrderMap.potOrderNo
            }).then(({ data }) => {
                this.formHeader = data.data;
                this.formHeader.textStage = 'acceadd';
                this.tabs[0].status = this.formHeader.steTagPot.accessoriesStatus
                this.$refs.acceadd.init(this.formHeader);
                this.$refs.excRecord.init(this.formHeader, 'acceadd');
                this.$refs.textRecord.init(this.formHeader, 'sterilize');
            })
        }

        // 提交校验
        submitRules(): Function[] {
            return [this.$refs.acceadd.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        savedDatas() {
            const acceadd = this.$refs.acceadd.savedData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'acceadd');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            return STE_API.STE_ACCE_SAVE_API({
                ...acceadd,
                steExceptionInsertDtos: excRequest.InsertDto,
                steExceptionUpdateDtos: excRequest.UpdateDto,
                steExceptionRemoveDto: excRequest.ids,
                steTextInsertDto: textRequest.pkgTextInsert,
                steTextUpdateDto: textRequest.pkgTextUpdate
            })
        }

        submitDatas() {
            const acceadd = this.$refs.acceadd.savedData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'acceadd');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            return STE_API.STE_ACCE_SAVE_API({
                ...acceadd,
                steExceptionInsertDtos: excRequest.InsertDto,
                steExceptionUpdateDtos: excRequest.UpdateDto,
                steExceptionRemoveDto: excRequest.ids,
                steTextInsertDto: textRequest.pkgTextInsert,
                steTextUpdateDto: textRequest.pkgTextUpdate
            })
        }
    }
    interface TabsObj {
        label?: string;
        status?: string;
    }
    interface StatusObj {
        accessoriesStatus?: string;
    }
    interface OrderData {
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
        steTagPot?: StatusObj;
    }
</script>

<style scoped>

</style>
