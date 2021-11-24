<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :model="formHeader" :inline="true" size="small" label-width="75px">
                <el-form-item label="生产工厂：">
                    <el-tooltip class="item" effect="dark" :content="formHeader.factoryName" placement="top-start">
                        <p class="input_bottom">
                            {{ formHeader.factoryName }}
                        </p>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <p class="input_bottom">
                        {{ formHeader.deptName }}
                    </p>
                </el-form-item>
                <el-form-item label="单号：">
                    <p class="input_bottom">
                        {{ formHeader.orderNo }}
                    </p>
                </el-form-item>
                <el-form-item label="杀菌物料：">
                    <el-tooltip class="item" effect="dark" :content="formHeader.materialName + ' ' + formHeader.materialCode" placement="top-start">
                        <p class="input_bottom">
                            {{ formHeader.materialName + ' ' + formHeader.materialCode }}
                        </p>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="备料日期：">
                    <p class="input_bottom">
                        {{ formHeader.allocateDate }}
                    </p>
                </el-form-item>
                <el-form-item label="备料状态：">
                    <p class="input_bottom">
                        {{ formHeader.prepStatusName }}
                    </p>
                </el-form-item>
                <el-form-item label="创建人员：">
                    <p class="input_bottom">
                        {{ formHeader.creator }}
                    </p>
                </el-form-item>
                <el-form-item label="创建时间：">
                    <p class="input_bottom">
                        {{ formHeader.created }}
                    </p>
                </el-form-item>
                <el-form-item label="提交人员：">
                    <p class="input_bottom">
                        {{ formHeader.changer }}
                    </p>
                </el-form-item>
                <el-form-item label="提交时间：">
                    <p class="input_bottom">
                        {{ formHeader.changed }}
                    </p>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="调配物料详情" :pack-up="false" name="materialVisible1" style="margin-top: 5px;">
            <el-table :data="accessoriesDetailList" border class="newTable" header-row-class-name="tableHead" :span-method="spanMethod">
                <el-table-column v-for="(item, index) in accessoriesHead" :key="item" :label="item" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row[index] === '拆分'" :disabled="!isRedact" type="text" size="small" @click="splitDate(scope.row, scope.$index)">
                            拆分
                        </el-button>
                        <el-button v-else-if="scope.row[index] === '删除'" class="delBtn" :disabled="!isRedact" type="text" size="small" @click="delData(scope.row, scope.$index)">
                            删除
                        </el-button>
                        <span v-else-if="scope.$index === accessoriesDetailList.length-1">{{ scope.row[index] }}</span>
                        <el-input v-else-if="index === accessoriesHead.length-1" v-model="scope.row[index]" :disabled="!isRedact" maxlength="10" size="small" style="width: 150px;" />
                        <span v-else>{{ scope.row[index] }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <redact-box>
            <template slot="button">
                <el-button type="primary" size="small" :disabled="formHeader.prepStatusName === '已备料'" @click="isRedact = !isRedact">
                    {{ isRedact === false ? '编辑' : '取消' }}
                </el-button>
                <template v-if="isRedact">
                    <el-button type="primary" size="small" @click="savedForm('SAVED')">
                        保存
                    </el-button>
                    <el-button type="primary" size="small" @click="submitForm()">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { STERILIZED_API } from '@/api/api';

export default {
    name: 'AccessoriesDetail',
    data() {
        return {
            isRedact: false,
            formHeader: this.$store.state.common.accessories,
            accessoriesHead: [],
            accessoriesDetailList: [],
            spanArr: []
        }
    },
    mounted() {
        this.getDetail()
    },
    methods: {
        getDetail() {
            this.$http(`${STERILIZED_API.ACCESSORIES_DETAIL}`, 'GET', { allocateId: this.$store.state.common.accessories.id }).then(({ data }) => {
                if (data.code === 0) {
                    this.formHeader = data.allocate
                    if (data.data && data.data.length) {
                        this.accessoriesHead = data.data[0]
                        this.accessoriesDetailList = data.data.splice(1, data.data.length)
                        this.merge(this.accessoriesDetailList)
                    }
                } else {
                    this.$warningToast(data.msg);
                }
            })
        },
        splitDate(row, index) {
            const data = JSON.parse(JSON.stringify(row));
            data[data.length - 1] = ''
            data[data.length - 2] = '删除'
            this.accessoriesDetailList.splice(index + 1, 0, data)
            this.merge(this.accessoriesDetailList)
        },
        delData(row, index) {
            this.accessoriesDetailList.splice(index, 1)
            this.merge(this.accessoriesDetailList)
        },
        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex < this.accessoriesHead.length - 2) {
                return {
                    rowspan: this.spanArr[rowIndex],
                    colspan: this.spanArr[rowIndex] > 0 ? 1 : 0
                };
            }
        },
        merge(tableData) {
            const spanOneArr = [];
            let concatOne = 0;
            tableData.forEach((item, index) => {
                if (index === 0) {
                    spanOneArr.push(1);
                } else if (item[item.length - 2] === '删除') {
                    spanOneArr[concatOne] += 1;
                    spanOneArr.push(0);
                } else {
                    spanOneArr.push(1);
                    concatOne = index;
                }
            });
            this.spanArr = spanOneArr;
            console.log(this.spanArr)
        },
        submitForm() {
            this.$confirm('确认提交?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedForm('PREPARED')
            })
        },
        savedForm(prepStatus) {
            let list = JSON.parse(JSON.stringify(this.accessoriesDetailList))
            list = list.splice(0, list.length - 1)
            const formDataList = list.map(it => {
                return {
                    allocateId: this.formHeader.id,
                    batch: it[it.length - 1],
                    materialCode: it[0].split(' ')[1],
                    materialName: it[0].split(' ')[0],
                    splitFlag: it[it.length - 2] === '拆分' ? 'N' : 'Y',
                    prepStatus
                }
            })
            console.log(formDataList);
            for (const item of formDataList) {
                if (!item.batch) {
                    this.$warningToast('请填写批次')
                    return
                }
                if (item.batch.length !== 10) {
                    this.$warningToast('批次必须10位')
                    return
                }
            }
            this.$http(`${STERILIZED_API.ACCESSORIES_DETAIL_SAVED_SUBMIT}`, 'POST', formDataList).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({ title: '成功', message: '操作成功', type: 'success' });
                    this.isRedact = false;
                    if (prepStatus === 'PREPARED') {
                        this.$store.state.common.accessories.prepStatusName = '已备料'
                    } else {
                        this.$store.state.common.accessories.prepStatusName = '已保存'
                    }
                    this.getDetail()
                } else {
                    this.$warningToast(data.msg);
                }
            })
        }
    }
};
</script>

<style scoped>

</style>
