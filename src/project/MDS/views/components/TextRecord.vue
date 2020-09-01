<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-07-16 11:33:16
 * @LastEditors: Telliex
 * @LastEditTime: 2020-08-07 16:39:11
-->
<template>
    <mds-card title="文本记录">
        <el-input v-model="textObj.pkgText" type="textarea" class="textarea" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script>
import { PACKAGING_API } from '@/api/api';
export default {
    name: 'TextRecord',
    components: {},
    props: {
        isRedact: {
            type: Boolean
        }
    },
    data() {
        return {
            textObj: {
                id: '',
                pkgText: ''
            }
        };
    },
    computed: {},
    methods: {
        // 获取文本记录
        /* eslint-disable @typescript-eslint/camelcase*/
        GetText(id) {
            let postdata;
            if (typeof id === 'string') {
                postdata = {
                    order_id: id
                };
            } else if (typeof id === 'object') {
                postdata = id;
            }
            this.$http(`${PACKAGING_API.PKGTEXTLIST_API}`, 'POST', postdata).then(({ data }) => {
                if (data.code === 0) {
                    this.textObj = data.listForm[0]
                        ? data.listForm[0] : { id: '', pkgText: '' };
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase*/
        UpdateText(formHeader, str, resolve, reject) {
            if (formHeader.orderHouseId) {
                this.textObj.orderHouseId = formHeader.orderHouseId;
                this.textObj.blongProc = formHeader.blongProc;
                this.textObj.orderId = formHeader.orderId;
            } else if (str === 'Squeeze') {
                this.textObj.factory = formHeader.factory;
                this.textObj.workShop = formHeader.workShop;
                this.textObj.productLine = formHeader.productLine;
                this.textObj.productDate = formHeader.productDate;
            } else if (str === 'ste') {
                this.textObj.orderId = formHeader.orderId;
                this.textObj.sign = formHeader.sign;
            } else {
                this.textObj.orderId = formHeader.orderId;
            }
            this.$http(`${PACKAGING_API.PKGTEXTUPDATE_API}`, 'POST', this.textObj).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '修改文本' + data.msg
                    });
                    if (reject) {
                        reject('修改文本' + data.msg);
                    }
                }
            });
        }
    }
};
</script>

<style>
.textarea textarea {
    width: 100%;
    height: 100% !important;
}
</style>
