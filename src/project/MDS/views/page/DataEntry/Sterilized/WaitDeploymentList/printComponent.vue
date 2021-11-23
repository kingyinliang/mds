<template>
    <div id="accessoriesPrint" class="none_ele">
        <div class="accessoriesPrint__title">
            <img class="accessoriesPrint__title__icon" src="@/assets/img/printIcon.svg" alt="">
            <div class="accessoriesPrint__title__text">
                杀菌辅料领用单
            </div>
        </div>
        <div class="accessoriesPrint__main">
            <div class="accessoriesPrint__formHeader">
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">单号</span>：{{ formHeader.ORDER_NO }}
                </p>
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">工厂</span>：{{ formHeader.FACTORYNAME }}
                </p>
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">打印日期</span>：{{ printDate }}
                </p>
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">创建人员</span>：{{ formHeader.CREATOR }}
                </p>
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">生产车间</span>：{{ formHeader.WORK_SHOPNAME }}
                </p>
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">打印人员</span>：{{ printUser }}
                </p>
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">杀菌物料</span>：{{ formHeader.MATERIAL_NAME }} {{ formHeader.MATERIAL_CODE }}
                </p>
                <p class="accessoriesPrint__formHeader__item">
                    <span class="accessoriesPrint__formHeader__item__label">生产日期</span>：{{ formHeader.ALLOCATE_DATE }}
                </p>
            </div>
            <div class="accessoriesPrint__table">
                <table class="myTable" border="1" width="100%" cellspacing="0">
                    <tr>
                        <th v-for="(item, index) in accessoriesHead" :key="index">
                            {{ item }}
                        </th>
                    </tr>
                    <tr v-for="(item, ind) in accessoriesList" :key="ind">
                        <td v-for="(it, index) in accessoriesHead" :key="index" align="center">
                            <span v-if="index === 3" style=" display: block; width: 90px;">{{ item[index] }}</span>
                            <span v-else>{{ item[index] }}</span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="accessoriesPrint__formHeader accessoriesPrint__footer">
            <p class="accessoriesPrint__formHeader__item">
                <span class="accessoriesPrint__formHeader__item__label">领料签字</span>：
            </p>
            <p class="accessoriesPrint__formHeader__item">
                <span class="accessoriesPrint__formHeader__item__label">仓库签字</span>：
            </p>
            <p class="accessoriesPrint__formHeader__item">
                <span class="accessoriesPrint__formHeader__item__label">领料日期</span>：
            </p>
        </div>
    </div>
</template>

<script>
import printjs from 'utils/print.js'

import { dateFormat } from '@/net/validate';
export default {
    name: 'PrintComponent',
    props: {
        formHeader: {
            type: Object,
            default() {
                return {};
            }
        },
        accessoriesHead: {
            type: Array,
            default() {
                return [];
            }
        },
        accessoriesList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            printDate: dateFormat(new Date(), 'yyyy-MM-dd'),
            printUser: this.$store.state.user.realName + '（' + this.$store.state.user.name + '）'
        }
    },
    methods: {
        printAccessories() {
            printjs('#accessoriesPrint')
        }
    }
};
</script>

<style lang="scss" scoped>
    .none_ele {
        display: none !important;
    }
    #accessoriesPrint {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .accessoriesPrint__title {
            position: relative;
            &__text {
                font-size: 20px;
                line-height: 50px;
                text-align: center;
            }
            &__icon {
                position: absolute;
                left: 0;
                width: 60px;
                height: 50px;
            }
        }
        .accessoriesPrint__main {
            flex: 1;
        }
        .accessoriesPrint__formHeader {
            &__item {
                display: inline-block;
                width: 33.333%;
                font-size: 14px;
                line-height: 20px;
                &__label {
                    display: inline-block;
                    width: 56px;
                    text-align: justify;
                    text-align-last: justify;
                }
            }
        }
    }
</style>
<style lang="scss" media="print" scoped>
    @media print {
        @page {
            margin: auto;
            size: a4 landscape;
        }
        .none_ele {
            display: flex !important;
        }
    }
</style>
