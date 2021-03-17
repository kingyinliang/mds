<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2021-03-16 15:22:39
 * @LastEditors: Telliex
 * @LastEditTime: 2021-03-17 18:52:58
-->
<template>
    <el-dialog :title="'权限标识 '+propertyTable" :close-on-click-modal="false" :visible.sync="isDialogShow" width="80%" @close="closeDialog">
        <div class="inner-area">
            <div class="inner-area__title">
                <el-input v-model="searchString" placeholder="请输入权限标识" style="width: 200px; margin-right: 20px;" />
                <el-button v-if="isAuth('')" type="primary" size="small" @click="queryItems(searchString)">
                    查询
                </el-button>
            </div>
            <div class="inner-area__body">
                <el-table class="table-style-light markStyle" :data="currentDataTable" :row-class-name="rowDelFlag" header-row-class-name="tableHead" size="mini" border style="width: 100%;" max-height="300">
                    <el-table-column width="200" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>主键
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.propertyKey" size="small" placeholder="请输入主键" :disabled="!scope.row.isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>父节点
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.propertyParentKey" size="small" placeholder="请输入父节点" :disabled="!scope.row.isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>权限标识
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.privilegeIdentity" size="small" placeholder="请输入权限标识" :disabled="!scope.row.isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>权限标识描述
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.privilegeIdentityName" size="small" placeholder="请输入权限标识描述" :disabled="!scope.row.isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" :disabled="scope.row.isRedact" @click="editFirstDataRow(scope.row)">
                                修改
                            </el-button>
                            <el-button type="text" size="mini" @click="removeFirstDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="j_closeBtn" @click="closeDialog">
                    取消
                </el-button>
                <el-button type="primary" @click="submitDataTable">
                    保存
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import { SYSTEM_API } from 'common/api/api';
    import _ from 'lodash';
    export default {
        name: 'RoleaddAndUpdate',
        data() {
            return {
                searchString: '',
                propertyTable: '',
                isDialogShow: false,
                currentDataTable: [],
                currentDataTableOrg: [],
                currentDataTableC: [],
                ruleForm: {}
            };
        },
        methods: {
            init(obj) {
                console.log(obj)

                this.propertyTable = obj.propertyTable ? obj.propertyTable : '';
                this.queryItems('');

                this.isDialogShow = true;
            },
            submitDataTable() {

                const dataArr = this.currentDataTable.filter(it => it.delFlag !== 1 && it.isRedact === true)
                for (let i = 0; i < dataArr.length; i++) {
                    if (!dataArr[i].propertyKey || !dataArr[i].propertyParentKey || !dataArr[i].privilegeIdentity || !dataArr[i].privilegeIdentityName) {
                        this.$warningToast('请填写必填项');
                        return false
                    }
                }


                const dataTemp = {
                deleteList: [], //
                propertyTable: this.propertyTable, //
                saveList: [] //
                };


                this.currentDataTable.forEach((item, index) => {
                    if (item.delFlag === 1) {
                        dataTemp.deleteList.push(item.propertyKey)
                    } else if (item.isRedact) {
                        const itemTemp = JSON.parse(JSON.stringify(item));
                            delete itemTemp.isRedact
                        const currentData = JSON.parse(JSON.stringify(this.currentDataTableOrg[index]));
                            delete currentData.isRedact
                        if (!_.isEqual(currentData, itemTemp)) {
                            dataTemp.saveList.push(item)
                        }
                    }
                })

                console.log('dataTemp')
                console.log(dataTemp)

                // SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_DATA_SAVE_API(
                //     dataTemp
                // ).then(() => {
                //     this.$emit('refreshDataList');
                //     this.isDialogShow = false;
                // }).catch(() => {
                //     //
                // });


            },
            // 删除
            removeFirstDataRow(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$set(row, 'delFlag', 1)
                    // this.$successToast('删除成功');

                });
            },
            // 重置
            closeDialog() {
                document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
                // this.$refs.currentDataTable.resetFields();
                this.currentDataTable = [];
                this.currentDataTableOrg = [];
                this.isDialogShow = false
            },

            // 编辑
            queryItems(str) {

                SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_DATA_QUERY_API({
                    propertyTableName: this.propertyTable,
                    privilegeIdentity: str
                }).then(({ data }) => {
                    console.log('77777777')
                    console.log(data.data)
                    this.currentDataTable = [];
                    this.currentDataTableOrg = [];
                    if (data.data.length === 0) {
                        this.$infoToast('暂无任何内容');
                        this.totalCount = 0;
                        return false;
                    }
                    this.currentDataTable = JSON.parse(JSON.stringify(data.data));

                    this.currentDataTable.forEach(item => {
                        this.$set(item, 'delFlag', 0)
                        this.$set(item, 'isRedact', false)
                        // item.delFlag = 0;
                        // item.isRedact = false;
                    })
                    this.currentDataTableOrg = JSON.parse(JSON.stringify(this.currentDataTable));

                });
            },
            rowDelFlag({ row }) {
                if (row.delFlag === 1) {
                    return 'rowDel';
                }
                return '';
            },
            editFirstDataRow(row) {
                this.$set(row, 'isRedact', true)
                // row.isRedact = true
            }
        }
    };


</script>

<style lang="scss" scoped>
    .el-form-item {
        margin-bottom: 0;
    }
    .inner-area {
        padding: 10px 5px;
        .inner-area__title {
            display: flex;
            justify-content: flex-end;
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
