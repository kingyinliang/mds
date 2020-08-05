<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-03 17:11:48
 * @LastEditors: Telliex
 * @LastEditTime: 2020-08-04 18:28:17
-->
<template>
    <el-tabs id="DaatTtabs" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" :before-leave="beforeLeave" @tab-click="tabClick">
        <el-tab-pane v-for="(item, index) in tabTitles" :key="index" :name="setKey(index)">
            <span v-if="item.status !== undefined" slot="label" class="spanview">
                <el-tooltip effect="dark" :content="getTagStatus(item.status)" placement="top-start">
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
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
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

        @Prop({ default: [] }) tabTitles: object[];

        activeName= '1'
        isRedact= false

        mounted() {
           //
        }

        beforeLeave() {
            // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
        }

        tabClick() {
            // tab 被选中时触发
        }

        // 设置 tabs 的绑定
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

</script>

<style scoped>

</style>
