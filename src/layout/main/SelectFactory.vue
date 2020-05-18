<template>
    <el-dialog :show-close="false" :visible.sync="factoryVisible" class="selectFa">
        <div class="factoryBox">
            <i class="el-icon-close factory__close" @click="factoryVisible = false" />
            <div v-for="(item, index) in factory" :key="index" class="factoryItem">
                <div class="itemBox">
                    <div class="item-title">
                        <p class="item-title-p">
                            {{ item.deptShort }}
                            <el-radio v-model="defaultFactory" :label="item.deptCode" @change="setFactory" style="float: right;">
                                {{ '默认' }}
                            </el-radio>
                        </p>
                        <!--<el-switch-->
                        <!--v-model="item.value"-->
                        <!--style="float: right;"-->
                        <!--active-color="#8BC34A"-->
                        <!--inactive-color="#dcdfe6"-->
                        <!--@click="setOther(index)"-->
                        <!--/>-->
                    </div>
                    <div style="cursor: pointer;" @click="goFa(item)">
                        <img v-if="item.deptCode === '9999-xn'" src="../assets/img/factory7.png" alt="">
                        <img v-else-if="item.deptCode === '8888-xn'" src="../assets/img/factory8.png" alt="">
                        <img v-else :src="'../static/img/factory'+ index + '.png'" alt="">
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

        goFa(item) {
            sessionStorage.setItem('vuex', '');
            if (item.deptCode === '6010' || item.deptCode === '7100' || item.deptCode === '7101') {
                sessionStorage.setItem('factory', JSON.stringify(item || ''));
                window.location.href = '/MDS.html'
            } else if (item.deptCode === '9999-xn') {
                sessionStorage.setItem('factory', JSON.stringify(item || ''));
                window.location.href = '/SYSTEM.html'
            } else if (item.deptCode === '8888-xn') {
                sessionStorage.setItem('factory', JSON.stringify(item || ''));
                window.location.href = '/MDS.html#/DataEcharts/KojiMaking-DataScreening-index'
            } else {
                sessionStorage.setItem('factory', JSON.stringify(item || ''));
                window.location.href = '/DFMDS.html'
            }
        }

        init() {
            this.factoryVisible = true;
            this.defaultFactory = sessionStorage.getItem('defaultFactory');
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
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
</style>
