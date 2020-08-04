<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-03 17:11:48
 * @LastEditors: Telliex
 * @LastEditTime: 2020-08-03 18:24:14
-->
<template>
    <div>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" :before-leave="beforeLeave" @tab-click="tabClick">
            <el-tab-pane v-for="(item, index) in tabs" :key="index" :name="setKey(index)">
                <span v-if="item.status !== undefined" slot="label" class="spanview">
                    <el-tooltip class="item" effect="dark" :content="getTagStatus(item.status)" placement="top-start">
                        <span
                            :style="{
                                color: item.status === 'noPass' ? 'red' : item.status === 'R' ? 'red' : ''
                            }"
                        >{{ item.label }}</span>
                    </el-tooltip>
                </span>
                <span v-if="item.status === undefined" slot="label" class="spanview">
                    {{ item.label }}
                </span>
                <slot :name="setKey(index)" :isRedact="isRedact" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import { COMMON_API, STE_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';


    @Component({
        name: 'InstorageDataTabs',
        components: {
        }
    })
    export default class InstorageDataTabs extends Vue {
        $refs: {
            // semiReceive: HTMLFormElement;
            // excRecord: HTMLFormElement;
            // textRecord: HTMLFormElement;
        }

        activeName= '1'
        isRedact= false
        tabs = [
            {
                label: '半成品领用',
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
           //
        }

        beforeLeave() {
            //
        }

        tabClick() {
            //
        }

        // 设置tabs的绑定
        setKey(index) {
            return (index + 1).toString();
        }

        get getTagStatus() {
                return (status) => {
                    let res = '';
                    switch (status) {
                        case 'noPass':
                            res = '不通过';
                            break;
                        case 'saved':
                            res = '已保存';
                            break;
                        case 'submit':
                            res = '已提交';
                            break;
                        case 'checked':
                            res = '通过';
                            break;
                        case 'F':
                            res = '接口失败';
                            break;
                        case 'C':
                            res = '已审核';
                            break;
                        case 'T':
                            res = '已同步';
                            break;
                        case 'R':
                            res = '已退回';
                            break;
                        case 'N':
                            res = '未录入';
                            break;
                        case 'D':
                            res = '待审核';
                            break;
                        case 'X':
                            res = '反审';
                            break;
                        case 'S':
                            res = '已保存';
                            break;
                        case 'P':
                            res = '已过账';
                            break;
                        case 'toBeAudited':
                            res = '待审核';
                            break;
                        default: res = status
                    }
                    return res;
                }
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


</script>

<style scoped>

</style>
