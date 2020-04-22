<template>
    <div class="header_main" style=" margin: 10px; padding: 15px; background: #fff;">
        <div style="overflow: hidden;">
            <div class="titleLeft">
                (单位:罐)
            </div>
            <el-button v-if="isAuth('ReportForms:production:fermentationStatusExport')" type="primary" size="small" style="float: right;" @click="FormExportExcel(true)">
                导出
            </el-button>
        </div>
        <el-table :data="dataList" border header-row-class-name="tableHead" style="margin-top: 10px;">
            <el-table-column label=" " prop="type" />
            <el-table-column label="<30" prop="ltThirty" />
            <el-table-column label="30≤N<60" prop="ltSixty" />
            <el-table-column label="60≤N<90" prop="ltNinety" />
            <el-table-column label="90≤N<130" prop="ltOneHundredAndThree" />
            <el-table-column label="130≤N<150" prop="ltOneHundredAndFive" />
            <el-table-column label="150≤N<180" prop="ltOneHundredAndEight" />
            <el-table-column label="180≤N<200" prop="ltTwoHundred" />
            <el-table-column label="200≤N" prop="gtTwoHundred" />
        </el-table>
    </div>
</template>

<script>
import { exportFile } from '@/net/validate';
import { REP_API } from '@/api/api';
export default {
    name: 'Fermentation',
    components: {},
    data() {
        return {
            dataList: []
        };
    },
    computed: {},
    mounted() {
        this.GetList();
    },
    methods: {
        GetList() {
            this.$http(`${REP_API.FERMENTATION_LIST_API}`, 'POST', {}).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.fermentationStatus;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        FormExportExcel() {
            exportFile(`${REP_API.FERMENTATION_EXPORT_API}`, '发酵一览表报表', this);
        }
    }
};
</script>

<style scoped>
.titleLeft {
    float: left;
    font-weight: 600;
    line-height: 32px;
}
</style>
