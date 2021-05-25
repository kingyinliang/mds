<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-04-23 13:46:34
 * @LastEditors: Telliex
 * @LastEditTime: 2021-04-23 14:55:28
-->
<template>
    <div class="floatInfo header_main">
        <el-dialog title="成品简报" :close-on-click-modal="false" :visible.sync="isTableDialogVisible" width="70%">
            <div class="inner-area">
                <div class="inner-area__title">
                    <h3 />
                    <el-button type="primary" size="small" @click="exportData()">
                        导出
                    </el-button>
                </div>
                <div class="inner-area__body">
                    <el-table ref="reportDataRef" class="table-style-light data-table newTable" :data="reportData" header-row-class-name="tableHead" size="mini" border style="width: 100%;" max-height="300">
                        <el-table-column type="index" label="序号" width="50" align="center" fixed />
                        <el-table-column prop="workShop" label="生产车间" :show-overflow-tooltip="true" width="160" />
                        <el-table-column prop="orderNo" label="生产订单" :show-overflow-tooltip="true" width="160" />
                        <el-table-column prop="" label="成品物料" :show-overflow-tooltip="true" min-width="200">
                            <template slot-scope="scope">
                                {{ scope.row.materialName }} {{ scope.row.materialCode }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="160" />
                        <el-table-column prop="batch" label="生产批次" :show-overflow-tooltip="true" width="160" />
                        <el-table-column prop="entryQnt" label="入库数量" :show-overflow-tooltip="true" width="160" />
                        <el-table-column prop="entryUom" label="单位" :show-overflow-tooltip="true" width="160" />
                        <el-table-column prop="sampleCount" label="样品数量" :show-overflow-tooltip="true" width="160" />
                        <el-table-column prop="badCount" label="不良数量" :show-overflow-tooltip="true" width="160" />
                    </el-table>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import { TRACK_API } from 'common/api/api';
    import { Vue, Component } from 'vue-property-decorator';
    // import { COMMON_API, FER_API } from 'common/api/api';

    @Component({
        name: 'TrackReport',
        components: {
        }
    })
    export default class TrackReport extends Vue {
        $refs: {
        }

        // 表单数据
        reportData= []
        isTableDialogVisible = false;

        params = {};

        // 入罐
        async init(item, params) {
            this.isTableDialogVisible = true
            this.reportData = item
            this.params = params
            TRACK_API.TRACK_BACK_QUERY_FINSH_TRACE_BACK_QUERY({
                werks: params.werks,
                batch: params.batch,
                materialCode: params.materialCode
            }).then(res => {
                this.reportData = res.data.data
            })
            // FER_API.FER_FERMENTOR_FLATION_BATCH_QUERY_API({
            //         holderId: this.currentHolderId
            //     }).then(({ data }) => {

            //         this.drumBucketInfo = []
            //         if (data.data) {
            //             this.drumBucketInfo = data.data
            //             this.drumBucketInfo.forEach((element) => {
            //                 this.$set(element, 'delFlag', 0)
            //             })
            //         }
            //         this.orgFormDataGroup = JSON.parse(JSON.stringify(this.drumBucketInfo))

            //     })


        }

        exportData() {
            TRACK_API.TRACK_BACK_QUERY_FINSH_TRACE_BACK_EXCEL(this.params).then(res => {
                const elink = document.createElement('a');
                elink.download = `${'fileName'}.xls`;
                elink.style.display = 'none';
                elink.href = res.data.data.url;
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
            }).catch(e => {
                console.log(e)
            })
        }

    }

</script>
<style scoped>


.inner-area__body >>> .el-checkbox__inner {
    position: relative;
    z-index: 1;
    display: inline-block;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #1b91ff;
    border-radius: 10px;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.inner-area__body >>> .el-checkbox__inner::after {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    background: #1b91ff;
    border: none;
    border: 0;
    border-radius: 4px;
    transform: rotate(0deg) scaleY(0);
    transform-origin: center;
    transition: transform 0.15s ease-in 0.05s;
    content: "";
}

.inner-area__body >>> .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: rotate(0deg) scaleY(1);
}

.data-table >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
    width: 1px;
    background: #ccc;
    border: none;
}

.data-table >>> .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    color: #ccc;
}

.floatInfo >>> .el-dialog .el-dialog__body {
    padding: 20px;
}

</style>

<style lang="scss" scoped>

.el-form-item {
    margin-bottom: 0;
}

.inner-area {
    .inner-area__title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        h3 {
            font-weight: bold;
            font-size: 14px !important;
            line-height: 32px;
            .title-icon {
                display: inline-block;
                width: 4px;
                height: 12px;
                margin-top: 10px;
                margin-right: 5px;
                background: #487bff;
                border-radius: 2px;
            }
            .point-icon {
                width: 5px;
                height: 5px;
                margin-top: 13px;
                margin-right: 5px;
                background: #487bff;
                border-radius: 3px;
            }
        }
    }
    .inner-area__body {
        .table-style-light {
            .el-table__header {
                th {
                    color: white;
                    text-align: center;
                    background: #e8e8e8;
                    background-color: #e8e8e8 !important;
                    border-top: none;
                    border-right: none;
                    border-bottom: none;
                    border-left: none;
                }
            }
            .el-table__body {
                td {
                    padding: 0;
                }
            }
            tr:nth-child(even) {
                background-color: #f7f7f7;
            }
            .el-table__row {
                td:first-child {
                    border-left: 2px solid transparent;
                }
            }
            .hover-row {
                td:first-child {
                    border-left: 2px solid #e8e8e8;
                }
            }
            .el-table__row:hover {
                td:first-child {
                    border-left: 2px solid #e8e8e8;
                }
            }

            .el-input.is-disabled .el-input__inner {
                width: 100%;
                overflow: hidden;
                color: #666 !important;
                background: none;
                border: none;
            }
        }
    }
}

.default {
    display: block;
    padding: 2px 20px;
    background: #f5f5f5;
    border-radius: 4px;
}
.card-bucket {
    margin-bottom: 10px;
    background: #fff;
    border: 1px solid rgba(171, 171, 171, 0.5);
    border-radius: 8px;
    -webkit-box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.1);
    .card-bucket__head {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 11px 10px;
        font-size: 14px;
        border-bottom: 1px #e8e8e8 solid;

        .el-button {
            font-size: 12px;
            &::after {
                content: ">>";
            }
        }
    }
    .card-bucket__content {
        display: flex;
        padding: 6px;
        .bucket-image {
            display: flex;
            flex: 2;
            justify-content: center;
            .pot_border {
                position: relative;
                width: 100%;
                height: 200px;
                overflow: hidden;
                .pot {
                    position: absolute;
                    top: 0;
                    z-index: 10;
                    width: 100%;
                    height: 200px;
                    // background: url(./assets/img/ferPotNew.png) no-repeat;
                    background: url("~@/assets/img/ferPotNew.png") no-repeat;
                    background-size: contain;
                }
                .pot_water {
                    position: absolute;
                    bottom: 13px;
                    width: 114px;
                    height: 200px;
                    &_sole {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        overflow: hidden;
                        border-top: none;
                    }
                    &_sole::before,
                    &_sole::after {
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        width: 300px;
                        height: 290px;
                        background-color: #fff;
                        border-radius: 55% 45%;
                        transform: translate(-50%, -70%) rotate(0);
                        content: "";
                    }
                    &_sole::after {
                        border-radius: 55% 45%;
                        transform: translate(70%, -50%) rotate(0);
                        opacity: 0.3;
                    }
                }
                &:hover {
                    .pot_water_sole::after {
                        animation: rotate 5s linear infinite;
                    }
                    .pot_water_sole::before {
                        animation: rotate 4.5s linear infinite;
                    }
                }

                @keyframes rotate {
                    0% {
                        transform: translate(-50%) rotateZ(0deg);
                    }
                    100% {
                        transform: translate(-50%) rotateZ(360deg);
                    }
                }
            }
        }
        .btn-group {
            display: flex;
            flex: 1;
            flex-flow: column;
            justify-content: center;
            .el-button {
                display: inline-block;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin: 0;
                margin-bottom: 14px;
                padding: 8px 16px;
                font-weight: 500;
                font-size: 14px;
                line-height: 1;
            }
        }
    }
    .card-bucket__fotter {
        padding: 10px 10px 0;
        font-weight: 600;
        font-size: 12px;

        > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }
    }
}

.dialog-footer {
    margin-top: 10px;
    text-align: right;
}


</style>
