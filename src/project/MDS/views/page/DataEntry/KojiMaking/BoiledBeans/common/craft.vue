<template>
    <div>
        <mds-card :title="'生产时间'" :name="'craftTime'">
            <el-form :inline="true" :model="craftfrom" size="small" labelWidth="130px">
                <el-form-item label="预热开始时间：" :required="true">
                    <el-date-picker
                        v-model="craftfrom.preheatDate"
                        type="datetime"
                        :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')"
                        placeholder="选择日期"
                        size="small"
                        format="yyyy-MM-dd HH:mm"
                        valueFormat="yyyy-MM-dd HH:mm"
                        style="width: 171px;"
                    />
                </el-form-item>
                <el-form-item label="下料开始时间：" :required="true">
                    <el-date-picker
                        v-model="craftfrom.unloadingStartDate"
                        type="datetime"
                        :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')"
                        placeholder="选择日期"
                        size="small"
                        format="yyyy-MM-dd HH:mm"
                        valueFormat="yyyy-MM-dd HH:mm"
                        style="width: 171px;"
                    />
                </el-form-item>
                <el-form-item label="下料结束时间：" :required="true">
                    <el-date-picker
                        v-model="craftfrom.unloadingEndDate"
                        type="datetime"
                        :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')"
                        placeholder="选择日期"
                        size="small"
                        format="yyyy-MM-dd HH:mm"
                        valueFormat="yyyy-MM-dd HH:mm"
                        style="width: 171px;"
                    />
                </el-form-item>
                <el-form-item label="预热时间(min)：" :required="true">
                    <el-input v-model="timecha" disabled style="width: 100px;" />
                </el-form-item>
            </el-form>
        </mds-card>
        <mds-card :title="'煮豆润水参数设置'" :name="'rateRunWater'" :iconBg="'#ffbf00'">
            <el-form :inline="true" size="small" labelWidth="130px" :model="craftfrom">
                <el-form-item label="润水比例：">
                    <el-input v-model="craftfrom.rateRunWater" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="润水变频(HZ)：" :required="true">
                    <el-input v-model="craftfrom.frequenceRunWater" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="实际比例：" :required="true">
                    <el-input v-model="craftfrom.realRate" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="润水总量(L)：" :required="true">
                    <el-input v-model="craftfrom.weightRunWater" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="润水流速(L/h)：" :required="true">
                    <el-input v-model="craftfrom.speedRunWater" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="一次预热变频：" :required="true">
                    <el-input v-model="craftfrom.oncePreheatFrequency" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="二次预热变频：" :required="true">
                    <el-input v-model="craftfrom.secondPreheatFrequency" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="二次预热温度：" :required="true">
                    <el-input v-model="craftfrom.secondPreheatTemp" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="下料速度(KG/H)：" :required="true">
                    <el-input v-model="craftfrom.unloadingSpeed" class="liInputWidth" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
            </el-form>
            <div class="box-card-title clearfix">
                <h3> <i class="title-icon" style="background: #5bd171;" />过程监控数据记录 </h3>
                <el-button type="primary" size="small" style="float: right;" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" @click="addlishui">
                    + 新增
                </el-button>
            </div>
            <el-table ref="runshuiTable" class="newTable" maxHeight="267" border headerRowClassName="tableHead" :data="lishuiList" :rowClassName="rowDelFlag">
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column width="205">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>观察时间</span>
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.guardDate"
                            type="datetime"
                            :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')"
                            placeholder="选择时间"
                            size="small"
                            format="yyyy-MM-dd HH:mm"
                            valueFormat="yyyy-MM-dd HH:mm"
                            style="width: 171px;"
                        />
                    </template>
                </el-table-column>
                <el-table-column width="90">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>润水/°C</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.runWaterTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column width="90">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>预热/°C</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.preheatTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>下料量</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.unloadingWeight" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column width="120">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>润水速度L/h</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.runWaterSpeed" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140" />
                <el-table-column label="操作时间" prop="changed" width="160" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" @click="delrow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="box-card-title clearfix">
                <h3> <i class="title-icon" style="background: #f05c4a;" />异常情况记录 </h3>
            </div>
            <div>
                <el-input v-model="craftfrom.cookingException" type="textarea" class="textarea" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" style="width: 100%; height: 40px;" />
            </div>
        </mds-card>
        <mds-card :title="'连续蒸煮记录'" :name="'lianxu'">
            <el-form :inline="true" size="small" :model="craftfrom">
                <el-form-item label="蒸煮变频(HZ)：" :required="true">
                    <el-input v-model="craftfrom.cookingFrequency" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="上转阀变频(HZ)：" :required="true">
                    <el-input v-model="craftfrom.upFrequency" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
                <el-form-item label="下转阀变频(HZ)：" :required="true">
                    <el-input v-model="craftfrom.downFrequency" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" />
                </el-form-item>
            </el-form>
            <div class="box-card-title clearfix">
                <h3> <i class="title-icon" style="background: #5bd171;" />过程监控数据记录 </h3>
                <el-button type="primary" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" style="float: right;" @click="addzhengzhu">
                    + 新增
                </el-button>
            </div>
            <el-table ref="zhengzhuTable" class="newTable borderTable" maxHeight="267" border headerRowClassName="tableHead" :data="zhengzhuList" :rowClassName="rowDelFlag">
                <el-table-column width="195">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>观察时间</span>
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.guardTime"
                            type="datetime"
                            :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')"
                            placeholder="选择时间"
                            size="small"
                            format="yyyy-MM-dd HH:mm"
                            valueFormat="yyyy-MM-dd HH:mm"
                            style="width: 171px;"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="压力/Mpa">
                    <el-table-column width="110" label="蒸煮数显">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.cookingPress" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column width="110">
                        <template slot="header">
                            <i class="reqI">*</i>
                            <span>蒸煮机械</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.cookingMachinePress" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column width="110">
                        <template slot="header">
                            <i class="reqI">*</i>
                            <span>分汽包</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.separateDrum" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="温度/°C">
                    <el-table-column width="110" label="蒸煮数显">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.cookingTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column width="110">
                        <template slot="header">
                            <i class="reqI">*</i>
                            <span>蒸煮机械</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.cookingMachineTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column width="110" label="上转阀冷却">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.upCooling" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column width="110">
                        <template slot="header">
                            <i class="reqI">*</i>
                            <span>下转阀冷却</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.downCooling" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140" />
                <el-table-column label="操作时间" prop="changed" :showOverflowTooltip="true" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" icon="el-icon-delete" size="small" @click="delrow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="box-card-title clearfix">
                <h3> <i class="title-icon" style="background: #f05c4a;" />异常情况记录 </h3>
            </div>
            <div>
                <el-input v-model="craftfrom.continuousCookingException" type="textarea" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" class="textarea" style="width: 100%; height: 40px;" />
            </div>
        </mds-card>
        <mds-card :title="'混合入曲控制'" :name="'hunhe'">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" style="float: right;" @click="addhunhe">
                    + 新增
                </el-button>
            </template>
            <el-table ref="hunheTable" class="newTable" maxHeight="267" border headerRowClassName="tableHead" :data="hunheList" :rowClassName="rowDelFlag">
                <el-table-column width="205">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>观察时间</span>
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.guardDate"
                            type="datetime"
                            :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')"
                            placeholder="选择时间"
                            size="small"
                            format="yyyy-MM-dd HH:mm"
                            valueFormat="yyyy-MM-dd HH:mm"
                            style="width: 171px;"
                        />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>混合料/°C</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.mixtureTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="">
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>接种/°C</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.inoculationTemp" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <i class="reqI">*</i>
                        <span>煮豆感官</span>
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.cookingFeel" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small">
                            <el-option value="良好" label="良好" />
                            <el-option value="异常" label="异常" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" icon="el-icon-delete" size="small" @click="delrow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="box-card-title clearfix">
                <h3><i class="title-icon" style="background: #f05c4a;" />异常情况记录 </h3>
            </div>
            <div>
                <el-input v-model="craftfrom.blendException" type="textarea" :disabled="!(isRedact && craftfrom.status !== 'submit' && craftfrom.status !== 'checked')" class="textarea" style="width: 100%; height: 40px;" />
            </div>
        </mds-card>
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { KJM_API } from '@/api/api';
export default {
    name: 'Caraft',
    components: {
        // AbnRecord: resolve => {
        //     require(['@/views/components/AbnRecord'], resolve);
        // }
    },
    // props: ['isRedact', 'formHeader'],
    props: {
        isRedact: {
            type: Boolean
        },
        formHeader: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            ids: '',
            craftfrom: {
                id: this.uuid(32, 62),
                orderHouseId: '', // 拿参
                preheatDate: '',
                unloadingStartDate: '',
                unloadingEndDate: '',
                preheatTime: '',
                rateRunWater: '',
                tempRunWater: '',
                frequenceRunWater: '',
                realRate: '',
                weightRunWater: '',
                speedRunWater: '',
                oncePreheatFrequency: '',
                secondPreheatFrequency: '',
                secondPreheatTemp: '',
                unloadingSpeed: '',
                cookingException: '',
                cookingFrequency: '',
                upFrequency: '',
                downFrequency: '',
                continuousCookingException: '',
                blendException: '',
                addOrupdate: '0'
            },
            lishuiList: [],
            zhengzhuList: [],
            hunheList: []
        };
    },
    computed: {
        timecha: function() {
            if (!this.craftfrom.unloadingStartDate || !this.craftfrom.preheatDate) {
                return 0;
            }
                return (new Date(this.craftfrom.unloadingStartDate) - new Date(this.craftfrom.preheatDate)) / 60000;

        }
    },
    mounted() {
        // this.getuuid()
    },
    methods: {
        craftrules() {
            let ty = true;
            if (this.craftfrom.preheatDate === '' || !this.craftfrom.preheatDate) {
                ty = false;
                this.$warningTost('预热开始时间不能为空');
                return false;
            }
            if (this.craftfrom.unloadingStartDate === '' || !this.craftfrom.unloadingStartDate) {
                ty = false;
                this.$warningTost('下料开始时间不能为空');
                return false;
            }
            if (!this.craftfrom.unloadingEndDate || this.craftfrom.unloadingEndDate === '') {
                ty = false;
                this.$warningTost('下料结束时间不能为空');
                return false;
            }
            if (
                !this.craftfrom.frequenceRunWater ||
                !this.craftfrom.realRate ||
                !this.craftfrom.weightRunWater ||
                !this.craftfrom.speedRunWater ||
                !this.craftfrom.oncePreheatFrequency ||
                !this.craftfrom.secondPreheatFrequency ||
                !this.craftfrom.secondPreheatTemp ||
                !this.craftfrom.unloadingSpeed ||
                this.craftfrom.frequenceRunWater === '' ||
                this.craftfrom.realRate === '' ||
                this.craftfrom.weightRunWater === '' ||
                this.craftfrom.speedRunWater === '' ||
                this.craftfrom.oncePreheatFrequency === '' ||
                this.craftfrom.secondPreheatFrequency === '' ||
                this.craftfrom.secondPreheatTemp === '' ||
                this.craftfrom.unloadingSpeed === ''
            ) {
                ty = false;
                this.$warningTost('煮豆润水参数不能为空');
                return false;
            }
            if (this.lishuiList.length === 0) {
                ty = false;
                this.$warningTost('煮豆润水过程监控数据记录未填');
                return false;
            }
            for (const items of this.lishuiList) {
                if (items.delFlag === '0') {
                    if (!items.guardDate || items.guardDate === '' || !items.runWaterTemp || items.runWaterTemp === '' || !items.preheatTemp || items.preheatTemp === '' || !items.unloadingWeight || items.unloadingWeight === '' || !items.runWaterSpeed || items.runWaterSpeed === '') {
                        ty = false;
                        this.$warningTost('煮豆润水过程监控数据必填项不能为空');
                        return false;
                    }
                }
            }
            if (this.craftfrom.cookingFrequency === '' || this.craftfrom.upFrequency === '' || this.craftfrom.downFrequency === '' || !this.craftfrom.cookingFrequency || !this.craftfrom.upFrequency || !this.craftfrom.downFrequency) {
                ty = false;
                this.$warningTost('连续蒸煮参数不能为空');
                return false;
            }
            for (const items of this.zhengzhuList) {
                if (items.delFlag === '0') {
                    if (
                        !items.guardTime ||
                        items.guardTime === '' ||
                        !items.cookingMachinePress ||
                        items.cookingMachinePress === '' ||
                        !items.separateDrum ||
                        items.separateDrum === '' ||
                        !items.cookingMachineTemp ||
                        items.cookingMachineTemp === '' ||
                        !items.downCooling ||
                        items.downCooling === ''
                    ) {
                        ty = false;
                        this.$warningTost('连续蒸煮监控数据必填项不能为空');
                        return false;
                    }
                }
            }
            if (this.zhengzhuList.length === 0) {
                ty = false;
                this.$warningTost('过程监控数据记录未填');
                return false;
            }
            if (this.hunheList.length === 0) {
                ty = false;
                this.$warningTost('混合入曲控制未填');
                return false;
            }
            this.hunheList.forEach(item => {
                if (item.delFlag === '0') {
                    if (!item.guardDate || !item.mixtureTemp || !item.inoculationTemp || !item.cookingFeel || item.guardDate === '' || item.mixtureTemp === '' || item.inoculationTemp === '' || item.cookingFeel === '') {
                        ty = false;
                        return false;
                    }
                }
            });
            if (!ty) {
                this.$warningTost('混合入曲控制必填项未填');
                return false;
            }
            return ty;
        },
        updatezhu(resolve, reject) {
            this.$set(this.craftfrom, 'orderHouseId', this.formHeader.orderHouseId);
            this.$set(this.craftfrom, 'status', this.formHeader.submitStatus);
            this.$set(this.craftfrom, 'preheatTime', this.timecha);
            this.$http(`${KJM_API.DOUGONGYIZHUSAVE_API}`, 'POST', this.craftfrom)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        updatelishui(resolve, reject) {
            this.$http(`${KJM_API.DOUGONGYIRUISAVE_API}`, 'POST', this.lishuiList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        updatezhengzhu(resolve, reject) {
            this.zhengzhuList.beanTechId = this.craftfrom.id;
            this.$http(`${KJM_API.DOUGONGYIZHENGSAVE_API}`, 'POST', this.zhengzhuList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        updatehunhe(resolve, reject) {
            this.hunheList.beanTechId = this.craftfrom.id;
            this.$http(`${KJM_API.DOUGONGYIHUNSAVE_API}`, 'POST', this.hunheList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$error_SHINHO(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        addlishui() {
            this.lishuiList.push({
                id: '',
                beanTechId: this.craftfrom.id,
                guardDate: '',
                runWaterTemp: '',
                preheatTemp: '',
                unloadingWeight: '',
                runWaterSpeed: '',
                delFlag: '0',
                remark: '',
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            });
            this.$nextTick(() => {
                this.$refs.runshuiTable.bodyWrapper.scrollTop = this.$refs.runshuiTable.bodyWrapper.scrollHeight;
            });
        },
        addzhengzhu() {
            this.zhengzhuList.push({
                id: '',
                beanTechId: this.craftfrom.id,
                guardTime: '',
                cookingPress: '',
                cookingMachinePress: '',
                separateDrum: '',
                cookingTemp: '',
                cookingMachineTemp: '',
                upCooling: '',
                downCooling: '',
                remark: '',
                delFlag: '0',
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            });
            this.$nextTick(() => {
                this.$refs.zhengzhuTable.bodyWrapper.scrollTop = this.$refs.zhengzhuTable.bodyWrapper.scrollHeight;
            });
        },
        addhunhe() {
            this.hunheList.push({
                id: '',
                beanTechId: this.craftfrom.id,
                guardDate: '',
                mixtureTemp: '',
                inoculationTemp: '',
                cookingFeel: '',
                remark: '',
                delFlag: '0',
                changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            });
            this.$nextTick(() => {
                this.$refs.hunheTable.bodyWrapper.scrollTop = this.$refs.hunheTable.bodyWrapper.scrollHeight;
            });
        },
        getList(formHeader) {
            this.$http(`${KJM_API.DOUGONGYILISTSAVE_API}`, 'POST', {
                orderHouseId: formHeader.orderHouseId
            })
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.technologyList[0]) {
                            this.craftfrom = data.technologyList[0];
                        }
                        if (data.boiledList.length) {
                            this.lishuiList = data.boiledList;
                        }
                        if (data.cookingList.length) {
                            this.zhengzhuList = data.cookingList;
                        }
                        if (data.blendList) {
                            this.hunheList = data.blendList;
                        }
                        // this.wheatList = data.wheatList
                        // this.soyList = data.pulpList
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                })
                .catch(error => {
                    this.$error_SHINHO(error);
                })
                .finally(() => {
                    this.$emit('setApplyCraftState', this.craftfrom.status);
                });
        },
        delrow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        rowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        }
    }
};
</script>

<style lang="scss" scoped>
.liInputWidth {
    width: 119px;
}

.htitle {
    margin: 0 0 10px;
    overflow: hidden;
}

.audit {
    margin: 10px 0;
    line-height: 32px;

    i {
        float: left;
        font-size: 22px;
    }

    span {
        font-size: 16px;
    }
}

.reqI {
    color: red;
}
</style>
