<template>
    <el-dialog :show-close="false" :visible.sync="factoryVisible" class="selectFa">
        <div class="factoryBox">
            <em class="el-icon-close factory__close" @click="factoryVisible = false" />
            <div v-for="(item, index) in factory" :key="index" class="factoryItem">
                <div class="itemBox">
                    <div class="item-title">
                        <p class="item-title-p">
                            {{ item.deptShort }}
                            <!--<el-radio v-model="defaultFactory" :label="item.deptCode" style="float: right;" @change="setFactory">-->
                            <!--{{ '默认' }}-->
                            <!--</el-radio>-->
                            <el-switch
                                :value="item.deptCode === defaultFactory"
                                style="float: right; width: 30px;"
                                active-color="#8BC34A"
                                inactive-color="#dcdfe6"
                                @change="setOther(item)"
                            />
                        </p>
                    </div>
                    <div style="cursor: pointer;" @click="goFa(item)">
                        <img v-if="item.deptCode === '9999-xn'" src="../assets/img/factory7.png" alt="">
                        <img v-else-if="item.deptCode === '8888-xn'" src="../assets/img/factory8.png" alt="">
                        <img v-else-if="item.deptCode === '6010'" src="../assets/img/factory0.png" alt="">
                        <img v-else-if="item.deptCode === '7100'" src="../assets/img/factory1.png" alt="">
                        <img v-else-if="item.deptCode === '7101'" src="../assets/img/factory2.png" alt="">
                        <img v-else-if="item.deptCode === '8500'" src="../assets/img/factory3.png" alt="">
                        <img v-else-if="item.deptCode === '8300'" src="../assets/img/factory4.png" alt="">
                        <img v-else src="" alt="">
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';

    @Component({
        components: {
        }
    })
    export default class SelectFactory extends Vue {
        factory: object[] = [];
        factoryVisible = false;
        defaultFactory = '';

        setOther(item) {
            console.log(item);
            if (this.defaultFactory !== item.deptCode) {
                COMMON_API.SET_FACTORY_API({
                    factoryCode: item.deptCode
                }).then(({ data }) => {
                    this.defaultFactory = item.deptCode;
                    sessionStorage.setItem('defaultFactory', this.defaultFactory || '');
                    this.$successToast(data.msg)
                })
            } else {
                COMMON_API.SET_FACTORY_API({
                    factoryCode: ''
                }).then(({ data }) => {
                    this.defaultFactory = '';
                    sessionStorage.setItem('defaultFactory', this.defaultFactory || '');
                    this.$successToast(data.msg)
                })
            }
        }

        jumpTo(factory, href) {
            COMMON_API.UPDATE_FACTORY_API({
                factory: factory.id
            }).then(({ data }) => {
                console.log(data);
                sessionStorage.setItem('factory', JSON.stringify(factory || ''));
                window.location.href = href
            })
        }

        goFa(item) {
            sessionStorage.setItem('vuex', '');
            if (item.deptCode === '6010' || item.deptCode === '7100' || item.deptCode === '7101') {
                this.jumpTo(item, '/MDS.html')
            } else if (item.deptCode === '9999-xn') {
                this.jumpTo(item, '/SYSTEM.html')
            } else if (item.deptCode === '8888-xn') {
                this.jumpTo(item, '/MDS.html#/DataEcharts/KojiMaking-DataScreening-index')
            } else {
                this.jumpTo(item, '/DFMDS.html')
            }
        }

        init() {
            this.factoryVisible = true;
            this.defaultFactory = sessionStorage.getItem('defaultFactory') || '';
            this.factory = JSON.parse(sessionStorage.getItem('userFactory') || '[]')
        }

        setFactory() {
            COMMON_API.SET_FACTORY_API({
                factoryCode: this.defaultFactory
            }).then(({ data }) => {
                sessionStorage.setItem('defaultFactory', this.defaultFactory || '');
                this.$successToast(data.msg)
            })
        }
    }
</script>

<style lang="scss" scoped>
.selectFa {

    ::v-deep .el-dialog {/* stylelint-disable-line */
        width: 100%;
        background: none;
        box-shadow: none;
        .el-dialog__header {
            background: none;
        }
        .el-dialog__body {
            display: flex;
            justify-content: center;
        }
    }
    ::v-deep .el-switch .el-switch__core {/* stylelint-disable-line */
        height: 6px;
        &::after {
            top: -6px;
            left: -1px;
            box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.5);
        }
    }
    ::v-deep .el-switch.is-checked {/* stylelint-disable-line */
        .el-switch__core::after {
            left: 100%;
            margin-left: -15px;
        }
    }

    .factoryBox {
        position: relative;
        width: 1168px;
        margin: auto;
        .factory__close {
            position: absolute;
            top: -64px;
            right: -32px;
            color: white;
            font-size: 32px;
            cursor: pointer;
        }
    }
    .factoryItem {
        display: inline-block;
        padding: 5px;
        .itemBox {
            box-sizing: content-box !important;
            width: 250px;
            padding: 16px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.09);
            img {
                display: block;
                width: 150px;
                height: 103px;
                margin: auto;
            }
            .item-title {
                margin: 0 0 30px 0;
                font-weight: bold;
                font-size: 16px;
                .item-title-p {
                    width: 250px;
                    margin: 0;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>
