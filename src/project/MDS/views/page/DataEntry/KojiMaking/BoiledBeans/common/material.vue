<template>
    <div>
        <mds-card :title="'种曲'" :name="'material'">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addmaterial">
                    + 新增
                </el-button>
            </template>
            <el-table ref="materialTable" class="newTable" border max-height="267" style="margin-top: 10px;" header-row-class-name="tableHead" :data="materialList" :row-class-name="rowDelFlag">
                <el-input type="index" label="序号" fixed />
                <el-table-column min-width="125">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>日期</span>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.materialDate }}
                    </template>
                </el-table-column>
                <el-table-column min-width="180">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>种曲</span>
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.materialCode" placeholder="请选择" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small">
                            <el-option v-for="(item, index) in materialShort" :key="index" :label="item.code + ' ' + item.value" :value="item.code" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="130">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>生产批次</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.productBatch" maxlength="10" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="物料批次" min-width="130">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.materialBatch" maxlength="10" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>数量</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.amount" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="60">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>单位</span>
                    </template>
                    <template slot-scope="scope">
                        {{ scope.row.unitName }}
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" min-width="140" />
                <el-table-column label="操作时间" prop="changed" min-width="160" />
                <el-table-column label="操作" min-width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" @click="delrow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'小麦粉'" :name="'wheat'" :icon-bg="'#ffbf00'">
            <p style="line-height: 30px;">
                小麦粉用量：<span style="display: inline-block; width: 140px; height: 30px; padding-left: 5px; background: #f5f5f5;">{{ wheatUseNum }}</span>
            </p>
            <el-row v-if="percentReadyToShowFromMaiHoldList" style="margin-top: 10px;">
                <el-col v-for="(sole, indexss) in MaiHoldList" :key="indexss" class="box">
                    <div class="boxTitle">
                        {{ sole.holderName }}
                    </div>
                    <div class="boxContent">
                        <div :id="`JM_${sole.holderId}`" class="chart-box" />
                        <!-- <el-progress type="circle" :percentage="sole.percent" :stroke-width="10" :width="135" status="text">{{sole.total}}KG</el-progress> -->
                        <el-popover placement="top" title="标题" width="200" trigger="hover">
                            <div class="boxText">
                                <div v-for="(soles, index) in sole.pici" :key="index">
                                    <div>
                                        批次:{{ soles.batch }}<span>{{ soles.amount }}KG</span>
                                    </div>
                                    <el-progress v-if="(index%3) === 1" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#1890FF" />
                                    <el-progress v-else-if="(index%3) === 2" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#5BD171" />
                                    <el-progress v-else-if="(index%3) === 0" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#F5A623" />
                                </div>
                            </div>
                            <div slot="reference" class="boxText" style="height: 90px;">
                                <div v-for="(soles, index) in sole.pici" :key="index">
                                    <div>
                                        批次:{{ soles.batch }}<span>{{ soles.amount }}KG</span>
                                    </div>
                                    <el-progress v-if="(index%3) === 1" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#1890FF" />
                                    <el-progress v-else-if="(index%3) === 2" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#5BD171" />
                                    <el-progress v-else-if="(index%3) === 0" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#F5A623" />
                                </div>
                            </div>
                        </el-popover>
                    </div>
                    <div style="width: 100%; text-align: center;">
                        <el-button class="boxButton" :disabled="!isRedact" style=" float: initial; width: 75px; height: 30px; margin: 15px 10px; line-height: 30px;" @click="startwheat(sole)">
                            开始领用
                        </el-button>
                        <el-button class="boxButton" :disabled="!isRedact" style=" float: initial; width: 75px; height: 30px; margin: 15px 10px; line-height: 30px;" @click="endwheat(sole)">
                            结束领用
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <el-table ref="wheatTable" class="newTable" max-height="276" border header-row-class-name="tableHead" :data="wheatList" style="margin-top: 10px;" :row-class-name="rowDelFlag" @row-dblclick="editwheat">
                <el-table-column label="日期" prop="useDate" min-width="110" />
                <el-table-column label="物料" prop="materialCode" min-width="160">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode }} {{ scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="麦粉罐" prop="holderName" min-width="140" />
                <el-table-column label="批次" align="center" min-width="120">
                    <template slot-scope="scope">
                        <!-- <span style="display: inline-block; text-align: left;" :style="{width: getContextWidth()+'px'}"><em>{{ scope.row.whtBatch }}</em></span> -->
                        {{ scope.row.whtBatch }}
                    </template>
                </el-table-column>
                <el-table-column label="起始" prop="startWeight" />
                <el-table-column label="结束" prop="endWeight" />
                <el-table-column label="领用数" prop="userWeight" min-width="70" />
                <el-table-column label="单位" prop="unit" min-width="50" />
                <el-table-column label="操作人员" prop="changer" min-width="140" />
                <el-table-column label="操作时间" prop="changed" min-width="160" />
                <el-table-column label="操作" min-width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" @click="delwheatRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'豆粕'" :name="'soy'" :icon-bg="'#5bd171'">
            <p style="line-height: 30px;">
                豆粕用量：<span style="display: inline-block; width: 140px; height: 30px; padding-left: 5px; background: #f5f5f5;">{{ soyUseNum }}</span>
            </p>
            <el-row v-if="percentReadyToShowFromDouHoldList" style="margin-top: 10px;">
                <el-col v-for="sole in DouHoldList" :key="sole.holderid" class="box">
                    <div class="boxTitle">
                        {{ sole.holderName }}
                    </div>
                    <div class="boxContent">
                        <!-- <el-progress type="circle" :percentage="sole.percent" :stroke-width="10" :width="135" status="text">{{sole.total}}KG</el-progress> -->
                        <div :id="`J_${sole.holderId}`" class="chart-box" />
                        <el-popover v-if="sole.pici !== ''" placement="top" title="" width="200" trigger="hover">
                            <div class="boxText">
                                <div v-for="(soles, index) in sole.pici" :key="index">
                                    <div>
                                        批次:{{ soles.batch }}<span>{{ soles.amount }}KG</span>
                                    </div>
                                    <el-progress v-if="(index%3) === 1" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#1890FF" />
                                    <el-progress v-else-if="(index%3) === 2" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#5BD171" />
                                    <el-progress v-else-if="(index%3) === 0" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#F5A623" />
                                </div>
                            </div>
                            <div slot="reference" class="boxText" style="height: 90px;">
                                <div v-for="(soles, index) in sole.pici" :key="index">
                                    <div>
                                        批次:{{ soles.batch }}<span>{{ soles.amount }}KG</span>
                                    </div>
                                    <el-progress v-if="(index%3) === 1" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#1890FF" />
                                    <el-progress v-else-if="(index%3) === 2" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#5BD171" />
                                    <el-progress v-else-if="(index%3) === 0" :percentage="soles.proportion>100?100:soles.proportion" :show-text="false" :text-inside="true" :stroke-width="8" color="#F5A623" />
                                </div>
                            </div>
                        </el-popover>
                    </div>
                    <div style=" width: 140px; margin: 5px auto; overflow: hidden; text-align: center;">
                        <el-button type="button" class="boxButton" :disabled="!isRedact" @click="rusoyM(sole)">
                            入罐
                        </el-button><el-button class="boxButton" :disabled="!isRedact" @click="chusoyM(sole)">
                            出罐
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <el-table ref="pulpTable" class="newTable" border max-height="275" header-row-class-name="tableHead" :data="soyList" :row-class-name="rowDelFlag" style="margin-top: 10px;" @row-dblclick="editsoy">
                <el-table-column label="日期" prop="pulpDate" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="物料" min-width="190" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode }} {{ scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="领用粮仓" prop="foodHolderName" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="豆粕仓" prop="pulpHolderName" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="批次" :show-overflow-tooltip="true" min-width="110">
                    <template slot-scope="scope">
                        <div style="text-align: center;">
                            <!-- <span style="display: inline-block; text-align: left;" :style="{width: getContextWidth()+'px'}"><em>{{ scope.row.batch }}</em></span> -->
                            {{ scope.row.batch }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="起始" prop="startWeight" min-width="70" :show-overflow-tooltip="true" />
                <el-table-column label="结束" prop="endWeight" min-width="70" :show-overflow-tooltip="true" />
                <el-table-column label="数量" prop="useWeight" min-width="70" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="unit" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="入罐/出罐" prop="useType" min-width="90" :show-overflow-tooltip="true" />
                <el-table-column label="操作人员" prop="changer" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="操作时间" prop="changed" min-width="160" :show-overflow-tooltip="true" />
                <el-table-column label="操作" min-width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" size="small" @click="delsoyRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log />
        <el-dialog :close-on-click-modal="false" :title="MTitle" :visible.sync="dialogFormVisibleMai" width="450px" custom-class="dialog__class">
            <div slot="title">
                {{ MTitle }}
            </div>
            <el-form ref="wheatstar" :model="wheat" size="small" :rules="wheatrulestar">
                <el-form-item label="麦粉批次：" :label-width="formLabelWidth" prop="whtBatch">
                    <el-select v-model="wheat.whtBatch" placeholder="请选择" style="width: 100%;">
                        <el-option v-for="sole in wheatPiArray" :key="sole.batch" :value="sole.batch" :label="sole.batch" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料描述：" :label-width="formLabelWidth">
                    <p class="disabled-text">
                        {{ wheat.materialCode }} {{ wheat.materialName }}
                    </p>
                </el-form-item>
                <el-form-item label="起始数：" :label-width="formLabelWidth" prop="startWeight">
                    <el-input v-model.number="wheat.startWeight" type="number" disabled autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="操作时间：" :label-width="formLabelWidth">
                    {{ wheat.changed }}
                </el-form-item>
                <el-form-item label="操作人：" :label-width="formLabelWidth">
                    {{ wheat.changer }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisibleMai = false">
                    取 消
                </el-button>
                <el-button type="primary" size="small" @click="savewheat('wheatstar')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="MTitle" :visible.sync="dialogFormVisibleMai2" width="450px" custom-class="dialog__class">
            <div slot="title">
                {{ MTitle }}
            </div>
            <el-form ref="wheatend" :model="wheat" size="small" :rules="wheatrulend" @submit.native.prevent>
                <el-form-item label="麦粉批次：" :label-width="formLabelWidth" prop="whtBatch">
                    <p class="disabled-text">
                        {{ wheat.whtBatch }}
                    </p>
                </el-form-item>
                <el-form-item label="物料描述：" :label-width="formLabelWidth">
                    <p class="disabled-text">
                        {{ wheat.materialCode }} {{ wheat.materialName }}
                    </p>
                </el-form-item>
                <el-form-item label="结束数：" :label-width="formLabelWidth" prop="endWeight">
                    <el-input v-model.number="wheat.endWeight" type="number" autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="操作时间：" :label-width="formLabelWidth">
                    {{ wheat.changed }}
                </el-form-item>
                <el-form-item label="操作人：" :label-width="formLabelWidth">
                    {{ wheat.changer }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisibleMai2 = false">
                    取 消
                </el-button>
                <el-button type="primary" size="small" @click="savewheat('wheatend')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="MTitle" :visible.sync="dialogFormVisibleMai3" width="450px" custom-class="dialog__class">
            <div slot="title">
                {{ MTitle }}
            </div>
            <el-form ref="wheat" :model="wheat" size="small" :rules="wheatrules" @submit.native.prevent>
                <el-form-item label="麦粉批次：" :label-width="formLabelWidth" prop="whtBatch">
                    <el-select v-model="wheat.whtBatch" placeholder="请选择" style="width: 100%;">
                        <el-option v-for="sole in wheatPiArray" :key="sole.batch" :value="sole.batch" :label="sole.batch" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料描述：" :label-width="formLabelWidth">
                    <p class="disabled-text">
                        {{ wheat.materialCode }} {{ wheat.materialName }}
                    </p>
                </el-form-item>
                <el-form-item label="起始数：" :label-width="formLabelWidth" prop="startWeight">
                    <el-input v-model.number="wheat.startWeight" type="number" disabled autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="结束数：" :label-width="formLabelWidth" prop="endWeight">
                    <el-input v-model.number="wheat.endWeight" type="number" autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="领用数量：" :label-width="formLabelWidth" prop="wheatuseprop">
                    <p class="disabled-text">
                        {{ lnum }}
                    </p>
                </el-form-item>
                <el-form-item label="操作时间：" :label-width="formLabelWidth">
                    {{ wheat.changed }}
                </el-form-item>
                <el-form-item label="操作人：" :label-width="formLabelWidth">
                    {{ wheat.changer }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisibleMai3 = false">
                    取 消
                </el-button>
                <el-button type="primary" size="small" @click="savewheat('wheat')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="DRTitle" :visible.sync="dialogFormVisibleDouRu" width="450px" custom-class="dialog__class">
            <div slot="title">
                {{ DRTitle }}
            </div>
            <el-form ref="rusoy" :model="rusoy" size="small" :rules="rusoyrules" @submit.native.prevent>
                <el-form-item label="领用粮仓：" :label-width="formLabelWidth" prop="foodHolderId">
                    <el-select v-model="rusoy.foodHolderId" style="width: 100%;" @change="changCang()">
                        <el-option v-for="sole in PulpCangList" :key="sole.holderId" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="批次：" :label-width="formLabelWidth" prop="batch">
                    <el-select v-model="rusoy.batch" style="width: 100%;">
                        <el-option v-for="(sole, index) in PulpCangBatchList" :key="index" :value="sole.batch" :label="sole.batch" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领用物料：" :label-width="formLabelWidth">
                    <p class="disabled-text">
                        {{ rusoy.materialCode }} {{ rusoy.materialName }}
                    </p>
                </el-form-item>
                <el-form-item label="剩余数：" :label-width="formLabelWidth">
                    <p class="disabled-text">
                        {{ rusoy.currentQuantity }}
                    </p>
                </el-form-item>
                <el-form-item label="起始数：" :label-width="formLabelWidth" prop="startWeight">
                    <el-input v-model.number="rusoy.startWeight" type="number" autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="结束数：" :label-width="formLabelWidth" prop="endWeight">
                    <el-input v-model.number="rusoy.endWeight" type="number" autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="领用数量：" :label-width="formLabelWidth">
                    <p class="disabled-text">
                        {{ rusoylnum }}
                    </p>
                </el-form-item>
                <el-form-item label="操作时间：" :label-width="formLabelWidth">
                    {{ rusoy.changed }}
                </el-form-item>
                <el-form-item label="操作人：" :label-width="formLabelWidth">
                    {{ rusoy.changer }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisibleDouRu = false">
                    取 消
                </el-button>
                <el-button type="primary" size="small" @click="soydialogrusave('rusoy')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="DCTitle" :visible.sync="dialogFormVisibleDouChu" width="450px" custom-class="dialog__class">
            <div slot="title">
                {{ DCTitle }}
            </div>
            <el-form ref="chusoy" :model="chusoy" size="small" :rules="chusoyrules" @submit.native.prevent>
                <el-form-item label="批次：" :label-width="formLabelWidth" prop="batch">
                    <!-- <el-input v-model="chusoy.batch" autocomplete="off" maxlength="10"></el-input> -->
                    <el-select v-model="chusoy.batch" placeholder="请选择" style="width: 100%;">
                        <el-option v-for="sole in pulpPiArray" :key="sole.batch" :value="sole.batch" :label="sole.batch" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料批次：" :label-width="formLabelWidth">
                    <el-input v-model="chusoy.soyMaterialstr" disabled />
                </el-form-item>
                <el-form-item label="起始数：" :label-width="formLabelWidth">
                    <el-input v-model.number="chusoy.startWeight" type="number" autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="结束数：" :label-width="formLabelWidth" prop="endWeight">
                    <el-input v-model.number="chusoy.endWeight" type="number" autocomplete="off" @mousewheel.native.prevent />
                </el-form-item>
                <el-form-item label="领用数量：" :label-width="formLabelWidth">
                    <p class="disabled-text">
                        {{ chusoylnum }}
                    </p>
                </el-form-item>
                <el-form-item label="操作时间：" :label-width="formLabelWidth">
                    {{ chusoy.changed }}
                </el-form-item>
                <el-form-item label="操作人：" :label-width="formLabelWidth">
                    {{ chusoy.changer }}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisibleDouChu = false">
                    取 消
                </el-button>
                <el-button type="primary" size="small" @click="soydialogchusave('chusoy')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { dateFormat, Readyanimation } from '@/net/validate';
    import { BASICDATA_API, SYSTEMSETUP_API, KJM_API } from '@/api/api';
    import echarts from 'echarts';
    export default {
        name: 'Material',
        components: {
            AuditLog: resolve => {
                require(['@/views/components/AuditLog'], resolve);
            }
        },
        props: {
            isRedact: {
                type: Boolean
            },
            formHeader: {
                type: Object,
                default: () => { return {} }
            }

        },
        data() {
            return {
                percentReadyToShowFromDouHoldList: true,
                percentReadyToShowFromMaiHoldList: true,
                chartLine: null,
                topstatus: '',
                dialogFormVisibleMai: false,
                dialogFormVisibleMai2: false,
                dialogFormVisibleMai3: false,
                dialogFormVisibleDouChu: false,
                dialogFormVisibleDouRu: false,
                formLabelWidth: '100px',
                materialList: [],
                wheatList: [],
                soyList: [],
                GstartTime: '',
                GystartTime: '',
                GendTime: '',
                GychaTime: '',
                form: {
                    name: ''
                },
                wheat: {},
                wheatrulestar: {
                    whtBatch: [{ required: true, message: '请选择批次', trigger: 'change' }],
                    startWeight: [
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', message: '必须为数字' }
                    ]
                },
                wheatrulend: {
                    endWeight: [
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', message: '必须为数字' }
                    ]
                },
                wheatrules: {
                    startWeight: [
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', message: '必须为数字' }
                    ],
                    endWeight: [
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', message: '必须为数字' }
                    ],
                    whtBatch: [{ required: true, message: '请选择批次', trigger: 'change' }]
                },
                chusoy: {},
                chusoyrules: {
                    batch: [
                        { required: true, message: '请选择批次', trigger: 'blur' },
                        { min: 10, max: 10, message: '长度为10位', trigger: 'blur' }
                    ],
                    endWeight: [{ required: true, message: '必填', trigger: 'blur' }]
                },
                MaiHoldList: [],
                DouHoldList: [],
                DCTitle: '', // 豆粕弹框 出罐 title
                DRTitle: '', // 豆粕弹框 入罐 title
                MTitle: '', // 麦弹框 title
                DouCangList: '', // 豆粕粮仓list
                rusoy: {},
                rusoyrules: {
                    foodHolderId: [{ required: true, message: '请选择粮仓', trigger: 'change' }],
                    batch: [{ required: true, message: '请选择批次', trigger: 'change' }],
                    startWeight: [
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', message: '必须为数字' }
                    ],
                    endWeight: [
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', message: '必须为数字' }
                    ]
                },
                materialShort: '',
                wheatliang: '',
                wheatShort: '',
                // soyliang: '',
                soyShort: '',
                pulpListPici: '',
                wheatListPici: '',
                wheatPiArray: [],
                pulpPiArray: [],
                holderIdomg: '',
                PulpCangList: [],
                PulpCangBatchList: []
            };
        },
        computed: {
            lnum: function() {
                return this.wheat.startWeight - this.wheat.endWeight;
            },
            rusoylnum: function() {
                return this.rusoy.endWeight - this.rusoy.startWeight;
            },
            chusoylnum: function() {
                return this.chusoy.startWeight - this.chusoy.endWeight;
            },
            wheatUseNum: function() {
                let num = 0;
                if (this.wheatList) {
                    this.wheatList.map(item => {
                        num += item.userWeight;
                    });
                }
                return num;
            },
            soyUseNum: function() {
                let num = 0;
                if (this.soyList) {
                    this.soyList.map(item => {
                        if (item.useType === '出罐') {
                            num += item.useWeight;
                        }
                    });
                }
                return num;
            }
        },
        watch: {
            'formHeader.workShopName'() {
                this.getDouCangList();
                this.getMaterialZhong();
                this.getWheatZhong();
                this.getSoyZhong();
            },
            MaiHoldList() {
                if (this.MaiHoldList.length > 0) {
                    this.$nextTick(() => {
                        this.MaiHoldList.map(item => {
                            this.drawPie(`JM_${item.holderId}`, item.pici, item.total + 'KG');
                        });
                    });
                }
            },
            DouHoldList() {
                if (this.DouHoldList.length > 0) {
                    this.$nextTick(() => {
                        this.DouHoldList.map(item => {
                            this.drawPie(`J_${item.holderId}`, item.pici, item.total + 'KG');
                        });
                    });
                }
            },
            wheatliang() {
                this.wheatList.map(item => {
                    item.materialCode = this.wheatliang;
                });
            },
            // 'soyliang' () {
            //   this.soyList.map((item) => {
            //     item.materialCode = this.soyliang
            //   })
            // },
            'wheat.whtBatch'() {
                if (this.wheat.whtBatch && this.wheat.whtBatch !== '') {
                    this.wheat.startWeight = this.MaiHoldList.find(item => item.holderId === this.holderIdomg).pici.find(item => item.batch === this.wheat.whtBatch)['amount'];
                    const part = this.MaiHoldList.find(item => item.holderId === this.holderIdomg).pici.find(item => item.batch === this.wheat.whtBatch);
                    this.wheat.materialCode = part['materialCode'];
                    this.wheat.materialName = part['materialName'];
                }
            },
            'chusoy.batch'() {
                if (this.chusoy.batch && this.chusoy.batch !== '') {
                    this.chusoy.startWeight = this.DouHoldList.find(item => item.holderId === this.holderIdomg).pici.find(item => item.batch === this.chusoy.batch)['amount'];
                    const part = this.DouHoldList.find(item => item.holderId === this.holderIdomg).pici.find(item => item.batch === this.chusoy.batch);
                    this.chusoy.materialCode = part['materialCode'];
                    this.chusoy.materialName = part['materialName'];
                    this.chusoy.soyMaterialstr = part['materialCode'] + ' ' + part['materialName'];
                }
            },
            'rusoy.foodHolderId'() {
                if (this.rusoy.foodHolderId && this.rusoy.foodHolderId !== '') {
                    this.PulpCangBatchList = this.PulpCangList.find(item => item.holderId === this.rusoy.foodHolderId).pulpData;
                } else {
                    this.PulpCangBatchList = [];
                }
            },
            'rusoy.batch'() {
                if (this.rusoy.batch && this.rusoy.batch !== '') {
                    const solebig = this.PulpCangBatchList.find(item => item.batch === this.rusoy.batch);
                    this.rusoy.materialCode = solebig.materialCode;
                    this.rusoy.materialName = solebig.materialName;
                    this.rusoy.currentQuantity = solebig.currentQuantity;
                }
            }
        },
        mounted() {
            Readyanimation(this.$);
        },
        activated() {
            if (this.chartPie) {
                this.chartPie.resize();
            }
        },
        methods: {
            getContextWidth: function() {
                let temp = 0;
                this.soyList.forEach(item => {
                    temp = item.batch.length > temp ? item.batch.length : temp
                })
                console.log(temp * 8.5)
                return temp * 8.5
            },
            drawPie(id, piciData, totalkg) {
                const pici = [];
                if (typeof piciData !== 'undefined') {
                    let n = 0;
                    let index = 0;
                    piciData.map(item => {
                        const picisole = {};
                        this.$set(picisole, 'value', item.proportion);
                        this.$set(picisole, 'name', item.batch);
                        if (index % 3 === 0) {
                            this.$set(picisole, 'itemStyle', { normal: { color: '#1890FF' }, emphasis: { color: '#6FAFEA' } });
                        } else if ((index - 1) % 3 === 0) {
                            this.$set(picisole, 'itemStyle', { normal: { color: '#5BD171' }, emphasis: { color: '#46ED64' } });
                        } else if ((index - 2) % 3 === 0) {
                            this.$set(picisole, 'itemStyle', { normal: { color: '#F5A623' }, emphasis: { color: '#FAB748' } });
                        }
                        pici.push(picisole);
                        n = n + item.proportion;
                        index = index + 1;
                    });
                    pici.push({ value: 100 - n, name: '其他', itemStyle: { normal: { color: '#E5E9F2' }, emphasis: { color: '#E5E9F2' } } });
                }
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}({d}%)' // formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        show: false,
                        orient: 'vertical',
                        x: 'left',
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    graphic: {
                        type: 'text', // [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
                        top: 'center', // 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。
                        left: 'center', // 同上
                        style: {
                            text: totalkg, // 文本块文字。可以使用 \n 来换行。[ default: '' ]
                            fill: '#000', // 填充色。
                            fontSize: 18, // 字体大小
                            fontWeight: 'normal' // 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
                        }
                    },
                    series: [
                        {
                            name: '批次',
                            type: 'pie',
                            radius: ['83%', '99%'],
                            hoverAnimation: false,
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '12',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: pici
                            // itemStyle: {
                            //   normal: {
                            //     color: function (params) {
                            //       var colorList = [
                            //         '#1890FF', '#5BD171', '#F5A623'
                            //       ]
                            //       return colorList[params.dataIndex]
                            //     }
                            //   }
                            // }
                            // data: [
                            //   {value: 335, name: '直接访问'}
                            //   {value: 310, name: '邮件营销'},
                            //   {value: 234, name: '联盟广告'},
                            //   {value: 135, name: '视频广告'},
                            //   {value: 1548, name: '搜索引擎'}
                            // ]
                        }
                    ]
                };
                // console.log(document.getElementById(id))
                this.chartPie = echarts.init(document.getElementById(id));
                this.chartPie.setOption(option);
                window.addEventListener('resize', () => {
                    this.chartPie.resize();
                });
            },
            GetrealTime(formHeader) {
                this.$http(`${KJM_API.DOUMATERREALTIME_API}`, 'POST', { workShop: formHeader.workShop }).then(({ data }) => {
                    if (data.code === 0) {
                    this.pulpListPici = data.listInfo
                    } else {
                    this.$notify.error({ title: '错误', message: data.msg })
                    }
                })
            },
            GetrealWheatTime(formHeader) {
                this.$http(`${KJM_API.DOUMATERREALWHEATIME_API}`, 'POST', { workShop: formHeader.workShop }).then(({ data }) => {
                    if (data.code === 0) {
                    this.wheatListPici = data.listInfo
                    } else {
                    this.$notify.error({ title: '错误', message: data.msg })
                    }
                })
            },
            getMaterialZhong() {
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: this.formHeader.factory, type: 'ZQ_MATERIAL_QULIAO' }).then(({ data }) => {
                    if (data.code === 0) {
                        this.materialShort = data.dicList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            getWheatZhong() {
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: this.formHeader.factory, type: 'ZQ_MATERIAL_MAIFEN' }).then(({ data }) => {
                    if (data.code === 0) {
                        this.wheatShort = data.dicList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            getSoyZhong() {
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: this.formHeader.factory, type: 'ZQ_MATERIAL_DOULEI' }).then(({ data }) => {
                    if (data.code === 0) {
                        this.soyShort = data.dicList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            mainrules() {
                let ty = true;
                if (this.materialList.length === 0) {
                    ty = false;
                    this.$warningToast('请填写种曲');
                    return false;
                }
                this.materialList.forEach(item => {
                    if (item.delFlag === '0') {
                        if (!item.materialCode || item.materialCode === '' || !item.amount || item.amount === '' || !item.productBatch || item.productBatch === '') {
                            ty = false;
                            return false;
                        }
                    }
                });
                if (!ty) {
                    this.$warningToast('种曲必填项未填');
                    return false;
                }
                this.materialList.forEach(item => {
                    if (item.delFlag === '0') {
                        if (item.materialBatch.length && item.materialBatch.length !== 10) {
                            ty = false;
                            return false;
                        }
                    }
                });
                if (!ty) {
                    this.$warningToast('种曲批次长度应为10位');
                    return false;
                }
                // if (!this.wheatliang || this.wheatliang === 0 || this.wheatliang.trim() === '') {
                //   this.$message.error('请选择小麦粉物料编码')
                //   return false
                // }
                if (this.wheatList.length === 0) {
                    ty = false;
                    this.$warningToast('请填写小麦粉数据');
                    return false;
                }
                // if (!this.soyliang || this.soyliang === 0 || this.soyliang.trim() === '') {
                //   this.$message.error('请选择豆粕物料编码')
                //   return false
                // }
                if (this.soyList.length === 0) {
                    ty = false;
                    this.$warningToast('请填写豆粕数据');
                    return false;
                }
                let useType = true;
                this.soyList.forEach(it => {
                    if (it.useType === '出罐') {
                        useType = false;
                    }
                    if (Number(it.useWeight) <= 0) {
                        ty = false;
                        this.$warningToast('出罐数量不能为0');
                        return false;
                    }
                });
                if (useType) {
                    ty = false;
                    this.$warningToast('豆粕没有出罐领用数据，请确认');
                    return false;
                }
                return ty;
            },
            // 麦粉罐
            getMaiholdList(formHeader) {
                const replacestr = formHeader.workShopName.replace(/制曲/g, '炒麦');
                // eslint-disable-next-line @typescript-eslint/camelcase
                this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, `POST`, { currPage: 1, holder_type: '009', pageSize: 100, type: 'holder_type', workShopName: replacestr }, false, false, false).then(res => {
                    if (res.data.code === 0) {
                        this.MaiHoldList = res.data.page.list;
                        this.$http(`${KJM_API.DOUMATERREALWHEATIME_API}`, 'POST', { workShop: formHeader.workShop }).then(({ data }) => {
                            if (data.code === 0) {
                                this.wheatListPici = data.listInfo;
                                this.MaiHoldList.map((item, index) => {
                                    const pici = [];
                                    let percent = 0;
                                    let total = 0;
                                    this.wheatListPici.map(items => {
                                        if (item.holderId === items.holderId) {
                                            if (items.proportion < 0) {
                                                items.proportion = 0;
                                            } else {
                                                percent = percent + items.proportion;
                                            }
                                            pici.push(items);
                                            total = total + items.amount;
                                        }
                                    });
                                    if (percent > 100) {
                                        percent = 100;
                                    }
                                    this.$set(this.MaiHoldList[index], 'pici', pici);
                                    this.$set(this.MaiHoldList[index], 'percent', percent);
                                    this.$set(this.MaiHoldList[index], 'total', total);
                                });

                                // this.percentReadyToShowFromMaiHoldList = true
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        this.$errorToast(res.data.msg);
                    }
                });
            },
            // 豆粕罐
            getDouholdList(formHeader) {
                // eslint-disable-next-line @typescript-eslint/camelcase
                this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, `POST`, { currPage: 1, holder_type: '010', pageSize: 100, type: 'holder_type', workShopName: formHeader.workShopName }, false, false, false).then(res => {
                    if (res.data.code === 0) {
                        this.DouHoldList = res.data.page.list;
                        // this
                        this.$http(`${KJM_API.DOUMATERREALTIME_API}`, 'POST', { workShop: formHeader.workShop }).then(({ data }) => {
                            if (data.code === 0) {
                                this.pulpListPici = data.listInfo;
                                this.DouHoldList.map((item, index) => {
                                    const pici = [];
                                    let percent = 0;
                                    let total = 0;
                                    this.pulpListPici.map(items => {
                                        if (item.holderId === items.holderId) {
                                            if (items.proportion < 0) {
                                                items.proportion = 0;
                                            } else {
                                                percent = percent + items.proportion;
                                            }
                                            pici.push(items);
                                            total = total + items.amount;
                                        }
                                    });
                                    if (percent > 100) {
                                        percent = 100;
                                    }
                                    this.$set(this.DouHoldList[index], 'pici', pici);
                                    this.$set(this.DouHoldList[index], 'percent', percent);
                                    this.$set(this.DouHoldList[index], 'total', total);
                                });
                                this.percentReadyToShowFromDouHoldList = true

                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        this.$errorToast(res.data.msg);
                    }
                });
            },
            // 豆粕粮仓 012
            getDouCangList() {
                // eslint-disable-next-line @typescript-eslint/camelcase
                this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, `POST`, { currPage: 1, holder_type: '012', pageSize: 100, type: 'holder_type', workShopName: this.formHeader.workShopName }, false, false, false).then(res => {
                    if (res.data.code === 0) {
                        this.DouCangList = res.data.page.list;
                    } else {
                        this.$errorToast(res.data.msg);
                    }
                });
            },
            addmaterial() {
                this.materialList.push({
                    id: '',
                    orderHouseId: this.formHeader.orderHouseId,
                    status: '',
                    materialDate: this.formHeader.inKjmDate,
                    materialBatch: '',
                    amount: '',
                    unit: 'BOX',
                    unitName: '盒',
                    materialCode: '',
                    materialName: '',
                    productBatch: '',
                    remark: '',
                    delFlag: '0',
                    changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                });
                this.$nextTick(() => {
                    this.$refs.materialTable.bodyWrapper.scrollTop = this.$refs.materialTable.bodyWrapper.scrollHeight;
                });
            },
            delmaterial(row) {
                this.materialList.splice(this.materialList.indexOf(row), 1);
            },
            // 小麦领用
            startwheat(row) {
                let msg = false;
                this.wheatList.forEach((item) => {
                    if (item.holderName === row.holderName) {
                        // 是否有未结束的
                        if (item.endWeight === '' || (!item.endWeight && item.endWeight !== 0)) {
                            msg = true;
                            return false;
                        }
                    }
                });
                if (msg === false) {
                    this.MTitle = row.holderName;
                    this.holderIdomg = row.holderId;
                    // 批次下拉
                    this.wheatPiArray = [];
                    this.wheatListPici.map(item => {
                        if (item.holderId === row.holderId) {
                            this.wheatPiArray.push(item);
                        }
                    });
                    this.wheat = {
                        uid: this.uuid(),
                        id: '',
                        orderHouseId: this.formHeader.orderHouseId,
                        status: this.formHeader.submitStatus,
                        useDate: this.formHeader.inKjmDate,
                        materialCode: row.materialCode,
                        materialName: row.materialName,
                        holderId: row.holderId,
                        holderName: row.holderName,
                        whtBatch: '',
                        startWeight: '',
                        endWeight: '',
                        remark: '',
                        delFlag: '0',
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                        unit: 'KG'
                    };
                    this.dialogFormVisibleMai = true;
                } else {
                    this.$warningToast('请结束后开始');
                }
            },
            endwheat(row) {
                let wheatprop;
                let msg = true;
                this.wheatList.forEach((item) => {
                    if (item.holderName === row.holderName) {
                        // 是否有未结束的
                        if (item.endWeight === '' || (!item.endWeight && item.endWeight !== 0)) {
                            msg = false;
                            wheatprop = item;
                            return false;
                        }
                    }
                });
                if (msg === false) {
                    this.MTitle = row.holderName;
                    this.holderIdomg = row.holderId;
                    // 批次下拉
                    this.wheatPiArray = [];
                    this.wheatListPici.map(item => {
                        if (item.holderId === row.holderId) {
                            this.wheatPiArray.push(item);
                        }
                    });
                    this.wheat = {
                        uid: wheatprop.uid,
                        id: wheatprop.id,
                        orderHouseId: this.formHeader.orderHouseId,
                        status: this.formHeader.submitStatus,
                        useDate: this.formHeader.inKjmDate,
                        materialCode: wheatprop.materialCode,
                        materialName: wheatprop.materialName,
                        holderId: row.holderId,
                        holderName: row.holderName,
                        whtBatch: wheatprop.whtBatch,
                        startWeight: wheatprop.startWeight,
                        endWeight: '',
                        remark: '',
                        delFlag: '0',
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                        changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                        unit: 'KG'
                    };
                    this.dialogFormVisibleMai2 = true;
                } else {
                    this.$warningToast('请先领用');
                }
            },
            // 小麦领用修改
            editwheat(row) {
                if (!this.isRedact || row.status === 'submit' || row.status === 'checked') {
                    return;
                }
                this.dialogFormVisibleMai3 = true;
                // this.wheat = row
                this.wheat = Object.assign({}, row);
            },
            // 小麦领用保存
            savewheat(formName) {
                if (!this.wheat.startWeight || (!this.wheat.endWeight && this.wheat.endWeight !== 0)) {
                    this.$set(this.wheat, 'userWeight', 0);
                } else {
                    this.$set(this.wheat, 'userWeight', this.wheat.startWeight - this.wheat.endWeight);
                }
                if (this.wheat.endWeight > this.wheat.startWeight) {
                    this.$warningToast('结束数不能大于起始数');
                    return;
                }
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisibleMai = false;
                        this.dialogFormVisibleMai2 = false;
                        this.dialogFormVisibleMai3 = false;
                        let currentRecord = [];
                        if (Object.prototype.hasOwnProperty.call(this.wheat, 'uid')) {
                            // 新增行
                            currentRecord = this.wheatList.filter(data => data.uid === this.wheat.uid);
                        } else {
                            // 原有行
                            currentRecord = this.wheatList.filter(data => data.id === this.wheat.id);
                        }
                        if (currentRecord && currentRecord.length > 0) {
                            Object.assign(currentRecord[0], this.wheat);
                        } else {
                            this.wheatList.push(this.wheat);
                            this.$nextTick(() => {
                                this.$refs.wheatTable.bodyWrapper.scrollTop = this.$refs.wheatTable.bodyWrapper.scrollHeight;
                            });
                        }
                        if (formName === 'wheat' || formName === 'wheatend') {
                            this.wheatConfirm();
                        }
                    } else {
                        return false;
                    }
                });
            },
            wheatConfirm() {
                this.formHeader.submitStatus = 'saved';
                const savedWh = new Promise((resolve, reject) => {
                    this.savewheats(resolve, reject);
                });
                savedWh.then(() => {
                    const savedStatus = new Promise((resolve, reject) => {
                        this.savestauts(resolve, reject);
                    });
                    savedStatus.then(() => {
                        this.$emit('HeadUpdate', 'wheat');
                    });
                });
            },
            soyConfirm() {
                this.formHeader.submitStatus = 'saved';
                const savedSoy = new Promise((resolve, reject) => {
                    this.savepulps(resolve, reject);
                });
                savedSoy.then(() => {
                    const savedStatus = new Promise((resolve, reject) => {
                        this.savestauts(resolve, reject);
                    });
                    savedStatus.then(() => {
                        this.$emit('HeadUpdate', 'soy');
                    });
                });
            },
            // 豆 入罐
            rusoyM(row) {
                this.dialogFormVisibleDouRu = true;
                this.DRTitle = row.holderName + '入罐';
                this.rusoy = {
                    uid: this.uuid(),
                    id: '',
                    foodHolderId: '',
                    foodHolderName: '',
                    pulpHolderId: row.holderId,
                    pulpHolderName: row.holderName,
                    batch: '',
                    startWeight: '',
                    endWeight: '',
                    useWeight: '',
                    remark: '',
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
                };
            },
            editsoy(row) {
                if (!this.isRedact || row.status === 'submit' || row.status === 'checked') {
                    return;
                }
                if (row.useType === '入罐') {
                    this.dialogFormVisibleDouRu = true;
                    this.PulpCangBatchList = this.PulpCangList.find(item => item.holderId === row.foodHolderId).pulpData;
                    const solebig = this.PulpCangBatchList.find(item => item.batch === row.batch);
                    if (typeof solebig === 'undefined') {
                        row.currentQuantity = 0;
                    } else {
                        row.currentQuantity = solebig.currentQuantity;
                    }
                    this.rusoy = Object.assign({}, row);
                } else {
                    this.dialogFormVisibleDouChu = true;
                    row.soyMaterialstr = (row.materialCode || '') + ' ' + (row.materialName || '');
                    this.chusoy = Object.assign({}, row);
                }
            },
            // 豆 入罐 弹框 保存
            soydialogrusave(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.rusoylnum <= 0) {
                            this.$warningToast('领用数必须大于0');
                        } else {
                            let soyUsedTotal = 0;
                            let obj = {};
                            obj = this.DouCangList.find(item => {
                                return item.holderId === this.rusoy.foodHolderId;
                            });
                            let currentRecord = [];
                            if (Object.prototype.hasOwnProperty.call(this.rusoy, 'uid')) {
                                // 新增行
                                currentRecord = this.soyList.filter(data => data.uid === this.rusoy.uid);
                            } else {
                                // 原有行
                                currentRecord = this.soyList.filter(data => data.id === this.rusoy.id);
                            }
                            if (this.rusoy.id === '') {
                                this.soyList.map(item => {
                                    if (item.id === '' && item.uid !== this.rusoy.uid) {
                                        soyUsedTotal += item.useWeight;
                                    }
                                });
                                if (soyUsedTotal + (this.rusoy.endWeight - this.rusoy.startWeight) > this.PulpCangBatchList.find(item => item.batch === this.rusoy.batch).currentQuantity) {
                                    this.$warningToast('领用数不能大于剩余量');
                                    return false;
                                }
                            }
                            this.dialogFormVisibleDouRu = false;
                            if (currentRecord && currentRecord.length > 0) {
                                Object.assign(currentRecord[0], {
                                    foodHolderId: this.rusoy.foodHolderId,
                                    foodHolderName: obj.holderName,
                                    batch: this.rusoy.batch,
                                    startWeight: this.rusoy.startWeight,
                                    endWeight: this.rusoy.endWeight,
                                    useWeight: this.rusoy.endWeight - this.rusoy.startWeight,
                                    useType: '入罐',
                                    unit: 'KG',
                                    pulpHolderId: this.rusoy.pulpHolderId,
                                    pulpHolderName: this.rusoy.pulpHolderName,
                                    materialCode: this.rusoy.materialCode,
                                    materialName: this.rusoy.materialName
                                });
                            } else {
                                this.soyList.push({
                                    foodHolderId: this.rusoy.foodHolderId,
                                    foodHolderName: obj.holderName,
                                    batch: this.rusoy.batch,
                                    startWeight: this.rusoy.startWeight,
                                    endWeight: this.rusoy.endWeight,
                                    useWeight: this.rusoy.endWeight - this.rusoy.startWeight,
                                    useType: '入罐',
                                    unit: 'KG',
                                    pulpHolderId: this.rusoy.pulpHolderId,
                                    pulpHolderName: this.rusoy.pulpHolderName,
                                    uid: this.rusoy.uid,
                                    id: '',
                                    orderHouseId: this.formHeader.orderHouseId,
                                    status: this.formHeader.submitStatus,
                                    pulpDate: this.formHeader.inKjmDate,
                                    remark: '',
                                    delFlag: '0',
                                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                                    changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                                    materialCode: this.rusoy.materialCode,
                                    materialName: this.rusoy.materialName
                                });
                                this.$nextTick(() => {
                                    this.$refs.pulpTable.bodyWrapper.scrollTop = this.$refs.pulpTable.bodyWrapper.scrollHeight;
                                });
                            }
                            this.soyConfirm();
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 豆粕 出罐
            chusoyM(row) {
                this.dialogFormVisibleDouChu = true;
                this.DCTitle = row.holderName + '出罐';
                this.holderIdomg = row.holderId;
                this.pulpPiArray = [];
                this.pulpListPici.map(item => {
                    if (row.holderId === item.holderId) {
                        this.pulpPiArray.push(item);
                    }
                });
                this.chusoy = {
                    uid: this.uuid(),
                    id: '',
                    pulpHolderId: row.holderId,
                    pulpHolderName: row.holderName,
                    foodHolderId: '',
                    soyMaterialstr: (row.materialCode || '') + ' ' + (row.materialName || ''),
                    foodHolderName: '',
                    startWeight: '',
                    endWeight: '',
                    useWeight: '',
                    batch: '',
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`
                };
            },
            // 豆粕 出罐 保存
            soydialogchusave(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.chusoylnum <= 0) {
                            this.$warningToast('领用数必须大于0');
                        } else {
                            this.dialogFormVisibleDouChu = false;
                            let currentRecord = [];
                            if (Object.prototype.hasOwnProperty.call(this.chusoy, 'uid')) {
                                // 新增行
                                currentRecord = this.soyList.filter(data => data.uid === this.chusoy.uid);
                            } else {
                                // 原有行
                                currentRecord = this.soyList.filter(data => data.id === this.chusoy.id);
                            }
                            let materstrchai = [];
                            materstrchai = this.chusoy.soyMaterialstr.split(' ');
                            const materstrName = typeof materstrchai[1] === 'undefined' ? '' : materstrchai[1];
                            if (currentRecord && currentRecord.length > 0) {
                                Object.assign(currentRecord[0], {
                                    batch: this.chusoy.batch,
                                    startWeight: this.chusoy.startWeight,
                                    endWeight: this.chusoy.endWeight,
                                    useWeight: this.chusoy.startWeight - this.chusoy.endWeight,
                                    useType: '出罐',
                                    unit: 'KG',
                                    pulpHolderId: this.chusoy.pulpHolderId,
                                    pulpHolderName: this.chusoy.pulpHolderName,
                                    materialCode: materstrchai[0],
                                    materialName: materstrName
                                });
                            } else {
                                this.soyList.push({
                                    uid: this.chusoy.id,
                                    id: '',
                                    orderHouseId: this.formHeader.orderHouseId,
                                    status: this.formHeader.submitStatus,
                                    pulpDate: this.formHeader.inKjmDate,
                                    foodHolderId: '',
                                    foodHolderName: '',
                                    pulpHolderId: this.chusoy.pulpHolderId,
                                    pulpHolderName: this.chusoy.pulpHolderName,
                                    batch: this.chusoy.batch,
                                    startWeight: this.chusoy.startWeight,
                                    endWeight: this.chusoy.endWeight,
                                    useWeight: this.chusoy.startWeight - this.chusoy.endWeight,
                                    useType: '出罐',
                                    unit: 'KG',
                                    remark: '',
                                    delFlag: '0',
                                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                                    changer: this.$store.state.user.realName + `(${this.$store.state.user.name})`,
                                    materialCode: materstrchai[0],
                                    materialName: materstrName
                                });
                                this.$nextTick(() => {
                                    this.$refs.pulpTable.bodyWrapper.scrollTop = this.$refs.pulpTable.bodyWrapper.scrollHeight;
                                });
                            }
                            this.soyConfirm();
                        }
                    } else {
                        return false;
                    }
                });
            },
            submitmains(resolve, reject) {
                this.materialList.map(item => {
                    if (typeof item.materialCode !== 'undefined') {
                        const materstrName = this.materialShort.filter(ite => item.materialCode === ite.code)[0].value;
                        this.$set(item, 'materialName', materstrName);
                    }
                    if (item.status === null || item.status === '' || item.status === 'saved' || item.status === 'noPass') {
                        console.log(this.formHeader.submitStatus);
                        this.$set(item, 'status', this.formHeader.submitStatus);
                    }
                });
                this.$http(`${KJM_API.DOUMATERSUBMITZHONG_API}`, 'POST', this.materialList).then(({ data }) => {
                    if (data.code === 0) {
                        if (resolve) {
                            resolve('resolve');
                        }
                    } else {
                        this.$errorToast(data.msg);
                        if (resolve) {
                            reject('reject');
                        }
                    }
                });
            },
            savemains(resolve, reject) {
                this.materialList.map(item => {
                    if (typeof item.materialCode !== 'undefined') {
                        console.log(item.materialCode);
                        console.log(this.materialShort[0].code);
                        console.log(this.materialShort[0].code === item.materialCode);
                        const materstrName = this.materialShort.filter(ite => item.materialCode === ite.code)[0].value;
                        this.$set(item, 'materialName', materstrName);
                    }
                    if (item.status === null || item.status === '' || item.status === 'saved' || item.status === 'noPass') {
                        console.log(this.formHeader.submitStatus);
                        this.$set(item, 'status', this.formHeader.submitStatus);
                    }
                });
                this.$http(`${KJM_API.DOUMATERZHONG_API}`, 'POST', this.materialList)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            if (resolve) {
                                resolve('resolve');
                            }
                        } else {
                            this.$errorToast(data.msg);
                            if (resolve) {
                                reject('reject');
                            }
                        }
                    })
                    .catch(() => {
                        if (resolve) {
                            reject('reject');
                        }
                    });
            },
            submitwheats(resolve, reject) {
                this.wheatList.map(item => {
                    if (item.status === '' || typeof item.status === 'undefined' || item.status === 'saved' || item.status === 'noPass') {
                        this.$set(item, 'status', this.formHeader.submitStatus);
                    }
                });
                if (this.formHeader.submitStatus === 'submit') {
                    this.$http(`${KJM_API.DOUMATERSUBMITWHEAT_API}`, 'POST', this.wheatList).then(({ data }) => {
                        if (data.code === 0) {
                            if (resolve) {
                                resolve('resolve');
                            }
                        } else {
                            this.$errorToast(data.msg);
                            if (resolve) {
                                reject('reject');
                            }
                        }
                    });
                } else if (resolve) {
                    resolve('resolve');
                }
            },
            savewheats(resolve, reject) {
                this.wheatList.map(item => {
                    if (item.status === '' || typeof item.status === 'undefined' || item.status === 'saved' || item.status === 'noPass') {
                        this.$set(item, 'status', this.formHeader.submitStatus);
                    }
                });
                // if (this.formHeader.submitStatus === 'submit') {
                //   this.$http(`${KJM_API.DOUMATERSUBMITWHEAT_API}`, 'POST', this.wheatList).then(({data}) => {
                //     if (data.code === 0) {
                //     } else {
                //       this.$errorToast(data.msg)
                //     }
                //   })
                // }
                this.$http(`${KJM_API.DOUMATERWHEAT_API}`, 'POST', this.wheatList)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            if (resolve) {
                                resolve('resolve');
                            }
                        } else {
                            this.$errorToast(data.msg);
                            if (resolve) {
                                reject('reject');
                            }
                        }
                    })
                    .catch(() => {
                        if (resolve) {
                            reject('reject');
                        }
                    });
            },
            submitpulps(resolve, reject) {
                this.soyList.map(item => {
                    if (item.status === '' || typeof item.status === 'undefined' || item.status === 'saved' || item.status === 'noPass') {
                        this.$set(item, 'status', this.formHeader.submitStatus);
                    }
                });
                if (this.formHeader.submitStatus === 'submit') {
                    this.$http(`${KJM_API.DOUMATERSUBMITSOY_API}`, 'POST', this.soyList).then(({ data }) => {
                        if (data.code === 0) {
                            if (resolve) {
                                resolve('resolve');
                            }
                        } else {
                            this.$errorToast(data.msg);
                            if (resolve) {
                                reject('reject');
                            }
                        }
                    });
                } else if (resolve) {
                    resolve('resolve');
                }
            },
            savepulps(resolve, reject) {
                this.soyList.map(item => {
                    // if (this.soyliang !== undefined) {
                    //   let materstrchai = []
                    //   materstrchai = this.soyliang.split(' ')
                    //   let materstrName = materstrchai[1] === undefined ? '' : materstrchai[1]
                    //   this.$set(item, 'materialCode', materstrchai[0])
                    //   this.$set(item, 'materialName', materstrName)
                    // }
                    if (item.status === '' || typeof item.status === 'undefined' || item.status === 'saved' || item.status === 'noPass') {
                        this.$set(item, 'status', this.formHeader.submitStatus);
                    }
                });
                // if (this.formHeader.submitStatus === 'submit') {
                //   this.$http(`${KJM_API.DOUMATERSUBMITSOY_API}`, 'POST', this.soyList).then(({data}) => {
                //     if (data.code === 0) {
                //     } else {
                //       this.$errorToast(data.msg)
                //     }
                //   })
                // }
                this.$http(`${KJM_API.DOUMATERPULP_API}`, 'POST', this.soyList)
                    .then(({ data }) => {
                        if (data.code === 0) {
                            if (resolve) {
                                resolve('resolve');
                            }
                        } else {
                            this.$errorToast(data.msg);
                            if (resolve) {
                                reject('reject');
                            }
                        }
                    })
                    .catch(() => {
                        if (resolve) {
                            reject('reject');
                        }
                    });
            },
            savestauts(resolve, reject) {
                this.$http(`${KJM_API.DOUMATERSTATUS_API}`, 'POST', { status: this.formHeader.submitStatus, orderHouseId: this.formHeader.orderHouseId, orderId: this.formHeader.orderId })
                    .then(({ data }) => {
                        if (data.code === 0) {
                            if (resolve) {
                                resolve('resolve');
                            }
                        } else {
                            this.$errorToast(data.msg);
                            if (resolve) {
                                reject('reject');
                            }
                        }
                    })
                    .catch(() => {
                        if (resolve) {
                            reject('reject');
                        }
                    });
            },
            partialUpdates(formHeader, str) {
                let inState = '';
                this.$http(`${KJM_API.DOUMATERLIST_API}`, 'POST', { orderHouseId: formHeader.orderHouseId })
                    .then(({ data }) => {
                        if (data.code === 0) {
                            let no = 0;
                            let sub = 0;
                            let che = 0;
                            let sav = 0;
                            if (str === 'wheat') {
                                this.wheatList = data.wheatList;
                            }
                            if (str === 'soy') {
                                this.soyList = data.pulpList;
                            }
                            this.materialList.map(item => {
                                if (item.status === 'noPass') {
                                    no = no + 1;
                                } else if (item.status === 'submit') {
                                    sub = sub + 1;
                                } else if (item.status === 'checked') {
                                    che = che + 1;
                                } else if (item.status === 'saved') {
                                    sav = sav + 1;
                                }
                            });
                            this.wheatList.forEach(item => {
                                if (item.status === 'noPass') {
                                    no = no + 1;
                                } else if (item.status === 'submit') {
                                    sub = sub + 1;
                                } else if (item.status === 'checked') {
                                    che = che + 1;
                                } else if (item.status === 'saved') {
                                    sav = sav + 1;
                                }
                            });
                            this.soyList.forEach(item => {
                                this.$set(item, 'soyMaterialstr', item.materialCode + ' ' + item.materialName);
                                if (item.status === 'noPass') {
                                    no = no + 1;
                                } else if (item.status === 'submit') {
                                    sub = sub + 1;
                                } else if (item.status === 'checked') {
                                    che = che + 1;
                                } else if (item.status === 'saved') {
                                    sav = sav + 1;
                                }
                            });
                            if (no > 0) {
                                inState = 'noPass';
                            } else if (sub > 0) {
                                inState = 'submit';
                            } else if (sav > 0) {
                                inState = 'saved';
                            } else if (che > 0) {
                                inState = 'checked';
                            }
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .catch(error => {
                        this.$notify.error({ title: '错误', message: error });
                    })
                    .finally(() => {
                        this.$emit('setApplyMaterielState', inState);
                    });
            },
            getList(formHeader) {
                let inState = '';
                this.$http(`${KJM_API.DOUMATERLIST_API}`, 'POST', { orderHouseId: formHeader.orderHouseId })
                    .then(({ data }) => {
                        if (data.code === 0) {
                            let no = 0;
                            let sub = 0;
                            let che = 0;
                            let sav = 0;
                            this.materialList = data.materialList;
                            this.wheatList = data.wheatList;
                            this.soyList = data.pulpList;
                            // if (this.wheatList.length !== 0) {
                            //   this.wheatliang = this.wheatList[0].materialCode + ' ' + this.wheatList[0].materialName
                            // }
                            // if (this.soyList.length !== 0) {
                            //   this.soyliang = this.soyList[0].materialCode + ' ' + this.soyList[0].materialName
                            // }
                            this.materialList.map(item => {
                                if (item.status === 'noPass') {
                                    no = no + 1;
                                } else if (item.status === 'submit') {
                                    sub = sub + 1;
                                } else if (item.status === 'checked') {
                                    che = che + 1;
                                } else if (item.status === 'saved') {
                                    sav = sav + 1;
                                }
                            });
                            this.wheatList.forEach(item => {
                                if (item.status === 'noPass') {
                                    no = no + 1;
                                } else if (item.status === 'submit') {
                                    sub = sub + 1;
                                } else if (item.status === 'checked') {
                                    che = che + 1;
                                } else if (item.status === 'saved') {
                                    sav = sav + 1;
                                }
                            });
                            this.soyList.forEach(item => {
                                this.$set(item, 'soyMaterialstr', item.materialCode + ' ' + item.materialName);
                                if (item.status === 'noPass') {
                                    no = no + 1;
                                } else if (item.status === 'submit') {
                                    sub = sub + 1;
                                } else if (item.status === 'checked') {
                                    che = che + 1;
                                } else if (item.status === 'saved') {
                                    sav = sav + 1;
                                }
                            });
                            if (no > 0) {
                                inState = 'noPass';
                            } else if (sub > 0) {
                                inState = 'submit';
                            } else if (sav > 0) {
                                inState = 'saved';
                            } else if (che > 0) {
                                inState = 'checked';
                            }
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .catch(error => {
                        this.$notify.error({ title: '错误', message: error });
                    })
                    .finally(() => {
                        this.$emit('setApplyMaterielState', inState);
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
            },
            delwheatRow(row) {
                if (row.id === '') {
                    this.wheatList.splice(this.wheatList.indexOf(row), 1);
                } else {
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        row.delFlag = '1';
                        this.wheatConfirm();
                    });
                }
            },
            delsoyRow(row) {
                if (row.id === '') {
                    this.soyList.splice(this.soyList.indexOf(row), 1);
                } else {
                    this.$confirm('是否删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        row.delFlag = '1';
                        this.soyConfirm();
                    });
                }
            },
            GetPuplList(formHeader) {
                this.$http(`${KJM_API.DOUMATERPULPLIST_API}`, 'POST', { factory: formHeader.factory, workShop: formHeader.workShop }).then(({ data }) => {
                    if (data.code === 0) {
                        this.PulpCangList = data.holder;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            proving1() {
                // this.rusoy.startWeight = this.rusoy.startWeight.replace(/[^\.\d]/g, '')
                // this.rusoy.startWeight = this.rusoy.startWeight.replace('.', '')
                this.rusoy.startWeight = this.rusoy.startWeight.replace('-', '');
            },
            changCang() {
                this.rusoy.batch = '';
                this.rusoy.materialCode = '';
                this.rusoy.materialName = '';
                this.rusoy.currentQuantity = '';
            }
        }
    };
</script>

<style>
    .boxContent {
        padding: 12px 10px 0;
        font-size: 12px;
        text-align: center;
    }
    .boxText {
        margin-top: 9px;
        padding-left: 2px;
        overflow: hidden;
        color: rgb(32, 16, 16);
        font-size: 12px;
        line-height: 22px;
        text-align: left;
    }
    .boxText span {
        float: right;
    }
</style>
<style lang="scss" scoped>
    .input_bommom {
        width: 147px;
        overflow: hidden;
        line-height: 32px;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-bottom: solid 1px #d8d8d8;
    }
    .lh32px {
        line-height: 32px;
    }
    .solecontent {
        overflow: hidden;
        p {
            float: left;
        }
    }
    .box {
        width: 207px;
        margin: 0 4px 10px;
        border: 1px solid #e8e8e8;
        .boxTitle {
            padding-left: 10px;
            color: white;
            font-weight: 600;
            line-height: 32px;
            background: #487bff;
            border-radius: 3px 3px 0 0;
        }
        .boxButton {
            float: left;
            width: 50px;
            height: 26px;
            margin: 10px;
            margin-top: 11px;
            padding: 0;
            color: #fff;
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            text-align: center;
            background: #1890ff;
            border-radius: 4px;
            cursor: pointer;
        }
        .boxButton.is-disabled,
        .boxButton.is-disabled:focus,
        .boxButton.is-disabled:hover {
            background-color: #a0cfff;
            border-color: #a0cfff;
            cursor: not-allowed;
        }
    }
    .chart-box {
        min-height: 140px;
    }
    .reqI {
        color: red;
    }
</style>
