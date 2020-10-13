<template>
    <div>
        <mds-card :title="'入曲情况'" :name="'kojiStatus'">
            <el-form ref="kojiIn" :model="kojiInformData" size="small" label-width="120px" :inline="true">
                <el-form-item
                    label="入曲情况："
                    prop="addKojiInfo"
                >
                    <el-input
                        v-model="kojiInformData.addKojiInfo"
                        placeholder="请输入入曲情况"
                        clearable
                        style="width: 180px;"
                        :disabled="!isRedact"
                    />
                </el-form-item>
                <el-form-item
                    label="入曲人："
                    prop="addKojiMans"
                    :rules="[
                        { required: true, message: '请输入入曲人', trigger: 'blur' }
                    ]"
                >
                    <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(kojiInformData.addKojiMans)">
                        <el-tooltip v-if="kojiInformData.addKojiMans&&kojiInformData.addKojiMans!==''" class="item" effect="dark" :content="kojiInformData.addKojiMans" placement="top">
                            <el-input
                                v-if="kojiInformData.addKojiMans&&kojiInformData.addKojiMans!==''"
                                v-model="kojiInformData.addKojiMans"
                                placeholder="请输入入曲人"
                                style="width: 200px;"
                                :disabled="!isRedact"
                            />
                        </el-tooltip>
                        <em v-if="!kojiInformData.addKojiMans">点击选择人员</em>
                    </span>
                </el-form-item>
                <el-form-item
                    label="入曲温度："
                    prop="addKojiTemp"
                    :rules="[
                        { required: true, message: '请输入入曲温度', trigger: 'blur' }
                    ]"
                >
                    <el-input
                        v-model="kojiInformData.addKojiTemp"
                        placeholder=""
                        clearable
                        style="width: 80px;"
                        :disabled="!isRedact"
                    /> °C
                </el-form-item>
                <el-form-item label="入曲标准：" prop="kojiDurationStandard">
                    <el-input
                        v-model="kojiInformData.kojiDurationStandard"
                        readonly
                        :disabled="true"
                        style="width: 100px;"
                    /> H
                </el-form-item>
                <el-form-item
                    label="入曲开始时间："
                    prop="addKojiStart"
                    :rules="[
                        { required: true, message: '请输入入曲开始时间', trigger: 'blur' }
                    ]"
                >
                    <el-date-picker
                        v-model="kojiInformData.addKojiStart"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!isRedact"
                    />
                </el-form-item>
                <el-form-item
                    label="入曲结束时间："
                    prop="addKojiEnd"
                    :rules="[
                        { required: true, message: '请输入入曲结束时间', trigger: 'blur' }
                    ]"
                >
                    <el-date-picker
                        v-model="kojiInformData.addKojiEnd"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!isRedact"
                    />
                </el-form-item>
                <el-form-item label="入曲时长：" prop="addKojiDuration" :style="{color: (Number(kojiInformData.addKojiDuration)-Number(kojiInformData.kojiDurationStandard))>=0?'#f00':'#333'}">
                    {{ addKojiDuration(kojiInformData.addKojiStart,kojiInformData.addKojiEnd) }} H
                </el-form-item>
            </el-form>
        </mds-card>
        <mds-card title="看曲记录" :name="'kojiGuard'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewKojiGuardRow">
                        新增
                    </el-button>
                </div>
            </template>
            <el-form ref="ruleKojiGuardForm" :model="ruleKojiGuardForm">
                <el-table class="newTable" :data="kojiGuardData" :row-class-name="rowDelFlag" max-height="300" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="50" align="center" fixed="left" />
                    <el-table-column label="看曲时间" :show-overflow-tooltip="true" width="210">
                        <template slot="header">
                            <span class="notNull">*</span>看曲时间
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="guardDate">
                                <el-date-picker v-model="scope.row.guardDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 180px;" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="实际风温" :show-overflow-tooltip="true" width="140">
                        <template slot="header">
                            <span class="notNull">*</span>实际风温 °C
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="windTemp">
                                <el-input v-model.trim="scope.row.windTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="设定风温 °C" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.settingWindTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column label="下室温度" :show-overflow-tooltip="true" width="140">
                        <template slot="header">
                            <span class="notNull">*</span>下室温度 °C
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="roomTemp">
                                <el-input v-model.trim="scope.row.roomTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="风速" :show-overflow-tooltip="true" width="140">
                        <template slot="header">
                            <span class="notNull">*</span>风速
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="windSpeed">
                                <el-input v-model.trim="scope.row.windSpeed" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="品温" :show-overflow-tooltip="true" width="140">
                        <template slot="header">
                            <span class="notNull">*</span>品温 °C
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="prodTemp">
                                <el-input v-model.trim="scope.row.prodTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="设定品温 °C" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.settingProdTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column label="探头温度" :show-overflow-tooltip="true">
                        <el-table-column
                            prop="outUpTemp"
                            label="外上"
                            width="100"
                        >
                            <template slot="header">
                                <span class="notNull">*</span>外上
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="outUpTemp">
                                    <el-input v-model.trim="scope.row.outUpTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="outMidTemp"
                            label="外中"
                            width="100"
                        >
                            <template slot="header">
                                <span class="notNull">*</span>外中
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="outMidTemp">
                                    <el-input v-model.trim="scope.row.outMidTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="outDownTemp"
                            label="外下"
                            width="100"
                        >
                            <template slot="header">
                                <span class="notNull">*</span>外下
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="outDownTemp">
                                    <el-input v-model.trim="scope.row.outDownTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="innerUpTemp"
                            label="内上"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-form-item prop="innerUpTemp">
                                    <el-input v-model.trim="scope.row.innerUpTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="innerMidTemp"
                            label="内中"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-form-item prop="innerMidTemp">
                                    <el-input v-model.trim="scope.row.innerMidTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="innerDownTemp"
                            label="内下"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-form-item prop="innerDownTemp">
                                    <el-input v-model.trim="scope.row.innerDownTemp" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="温度计测量" :show-overflow-tooltip="true">
                        <el-table-column
                            prop="testTempOne"
                            label="测量点1"
                            width="100"
                        >
                            <template slot="header">
                                <span class="notNull">*</span>测量点1
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="testTempOne">
                                    <el-input v-model.trim="scope.row.testTempOne" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="testTempTwo"
                            label="测量点2"
                            width="100"
                        >
                            <template slot="header">
                                <span class="notNull">*</span>测量点2
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="testTempTwo">
                                    <el-input v-model.trim="scope.row.testTempTwo" size="small" placeholder="请输入" :disabled="!isRedact" />
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="中间风门" :show-overflow-tooltip="true" width="140">
                        <template slot="header">
                            <span class="notNull">*</span>中间风门
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="windDoor">
                                <el-input v-model.trim="scope.row.windDoor" size="small" placeholder="请输入" :disabled="!isRedact" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="强排" :show-overflow-tooltip="true" width="130">
                        <template slot-scope="scope">
                            <el-form-item prop="forceDrain">
                                <el-select v-model="scope.row.forceDrain" size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                    <el-option
                                        v-for="item in forceDrainOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="换热" :show-overflow-tooltip="true" width="130">
                        <template slot-scope="scope">
                            <el-form-item prop="changeHot">
                                <el-select v-model="scope.row.changeHot" size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                    <el-option
                                        v-for="item in changeHotOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" :disabled="!isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true" />
                    <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeFirstDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div>
                <div style="margin: 10px 5px;">
                    异常情况：
                </div>
                <el-input v-model="kojiDiscExceptionInfo.discGuardExceptionInfo" type="textarea" :rows="7" :disabled="!isRedact" style="width: 80%;" />
            </div>
        </mds-card>

        <mds-card :title="'翻曲记录'" :name="'kojiTurn'">
            <el-table ref="kojiTurn" header-row-class-name="tableHead" class="newTable" max-height="267" :data="kojiDiscTurnData" :row-class-name="rowDelFlag" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" align="center" />
                <el-table-column label="翻曲" prop="turnStageName" width="100" />
                <el-table-column label="翻曲开始时间" prop="turnStart" width="210">
                    <template slot="header">
                        <span class="notNull">* </span>翻曲开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.turnStart"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            placeholder="请选择"
                            clearable
                            style="width: 200px;"
                            :disabled="!isRedact"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="翻曲结束时间" prop="turnEnd" width="210">
                    <template slot="header">
                        <span class="notNull">* </span>翻曲结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.turnEnd"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            placeholder="请选择"
                            clearable
                            style="width: 200px;"
                            :disabled="!isRedact"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="制曲时长" prop="turnDuration" width="80" />
                <el-table-column label="翻曲加水量" prop="turnAddWaterAmount" width="100" />
                <el-table-column label="翻曲人" min-width="140">
                    <template slot="header">
                        <span class="notNull">* </span>翻曲人
                    </template>
                    <template slot-scope="scope">
                        <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(scope.row.turnMans)">
                            <el-tooltip v-if="scope.row.turnMans&&scope.row.turnMans!==''" class="item" effect="dark" :content="scope.row.turnMans" placement="top">
                                <el-input
                                    v-if="scope.row.turnMans&&scope.row.turnMans!==''"
                                    v-model="scope.row.turnMans"
                                    placeholder="请输入翻曲人"
                                    style="width: 200px;"
                                    :disabled="!isRedact"
                                />
                            </el-tooltip>
                            <em v-if="!scope.row.turnMans">点击选择人员</em>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!isRedact" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="changed" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <div style="margin: 10px 5px;">
                    异常情况：
                </div>
                <el-input v-model="kojiDiscExceptionInfo.discTurnExceptionInfo" type="textarea" :rows="7" :disabled="!isRedact" style="width: 80%;" />
            </div>
        </mds-card>

        <mds-card title="曲料生长评价" :name="'kojiEvaluate'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewKojiEvaluateRow">
                        新增
                    </el-button>
                </div>
            </template>
            <el-form ref="ruleKojiEvaluateForm" :model="ruleKojiEvaluateForm">
                <el-table class="newTable" :data="kojiEvaluateData" :row-class-name="rowDelFlag" max-height="300" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                    <el-table-column label="序号" type="index" width="50" fixed="left" align="center" />
                    <el-table-column width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>阶段
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="kojiStage">
                                <el-select v-model="scope.row.kojiStage" size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                    <el-option
                                        v-for="item in kojiStageOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column width="210" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>记录时间
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="startDate">
                                <el-date-picker v-model="scope.row.startDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 180px;" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>生长情况
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="growInfo">
                                <el-select v-model="scope.row.growInfo" size="small" clearable style="width: 100%;" :disabled="!isRedact">
                                    <el-option
                                        v-for="item in kojiEvaluateGrowInfoOptions"
                                        :key="item.optValue"
                                        :label="item.optLabel"
                                        :value="item.optValue"
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="异常描述" :show-overflow-tooltip="true" min-width="200">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.exceptionInfo" size="small" placeholder="输入异常描述" :disabled="!isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="记录人"
                        prop="recordMans"
                        width="150"
                    >
                        <template slot-scope="scope">
                            <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(scope.row.recordMans)">
                                <el-tooltip v-if="scope.row.recordMans&&scope.row.recordMans!==''" class="item" effect="dark" :content="scope.row.recordMans" placement="top">
                                    <el-input
                                        v-if="scope.row.recordMans&&scope.row.recordMans!==''"
                                        v-model="scope.row.recordMans"
                                        placeholder="请输入记录人"
                                        style="width: 200px;"
                                        :disabled="!isRedact"
                                    />
                                </el-tooltip>
                                <em v-if="!scope.row.recordMans">点击选择人员</em>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" :disabled="!isRedact" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true" />
                    <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeFirstDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </mds-card>

        <mds-card :title="'出曲工艺'" :name="'kojiOutCraft'">
            <el-form ref="kojiOutCraft" :model="kojiOutCraftformData" size="small" label-width="120px" :inline="true">
                <el-form-item
                    label="出曲开始时间："
                    prop="outKojiStart"
                    :rules="[
                        { required: true, message: '请输入出曲开始时间', trigger: 'blur' }
                    ]"
                >
                    <el-date-picker
                        v-model="kojiOutCraftformData.outKojiStart"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!isRedact"
                    />
                </el-form-item>
                <el-form-item
                    label="出曲结束时间："
                    prop="outKojiEnd"
                    :rules="[
                        { required: true, message: '请输入出曲结束时间', trigger: 'blur' }
                    ]"
                >
                    <el-date-picker
                        v-model="kojiOutCraftformData.outKojiEnd"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!isRedact"
                    />
                </el-form-item>
                <el-form-item label="出曲时长：" prop="outKojiDuration">
                    {{ addKojiDuration(kojiOutCraftformData.outKojiStart,kojiOutCraftformData.outKojiEnd) }} H
                </el-form-item>
                <el-form-item
                    label="出曲操作人："
                    prop="outKojiMans"
                    :rules="[
                        { required: true, message: '请输入出曲操作人', trigger: 'blur' }
                    ]"
                >
                    <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(kojiOutCraftformData.outKojiMans)">
                        <el-tooltip v-if="kojiOutCraftformData.outKojiMans&&kojiOutCraftformData.outKojiMans!==''" class="item" effect="dark" :content="kojiOutCraftformData.outKojiMans" placement="top">
                            <el-input
                                v-if="kojiOutCraftformData.outKojiMans&&kojiOutCraftformData.outKojiMans!==''"
                                v-model="kojiOutCraftformData.outKojiMans"
                                placeholder="请输入出曲操作人"
                                style="width: 200px;"
                                :disabled="!isRedact"
                            />
                        </el-tooltip>
                        <em v-if="!kojiOutCraftformData.outKojiMans">点击选择人员</em>
                    </span>
                </el-form-item>
                <el-form-item
                    label="出曲温度："
                    prop="outKojiTemp"
                    :rules="[
                        { required: true, message: '请输入出曲温度', trigger: 'blur' }
                    ]"
                >
                    <el-input
                        v-model="kojiOutCraftformData.outKojiTemp"
                        placeholder=""
                        clearable
                        style="width: 80px;"
                        :disabled="!isRedact"
                    /> °C
                </el-form-item>
            </el-form>
        </mds-card>
        <audit-log :table-data="currentAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <loaned-personnel v-if="isLoanedPersonnelStatusDialogShow" ref="loanedPersonnel" @changeUser="changeUser" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber, getDateDiff } from 'utils/utils';
    import { COMMON_API, KOJI_API, AUDIT_API } from 'common/api/api';
    import LoanedPersonnel from 'components/LoanedPersonnel.vue';
    // import _ from 'lodash';

    @Component({
        name: 'DiscCraftControl',
        components: {
            LoanedPersonnel
        }
    })
    export default class DiscCraftControl extends Vue {
        @Prop({ type: Object, default: () => { return {} } }) formHeader: object;
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: '' }) status: string;

        $refs: {
            kojiIn: HTMLFormElement;
            kojiTurn: HTMLFormElement;
            loanedPersonnel: HTMLFormElement;
            kojiOutCraft: HTMLFormElement;
            ruleKojiEvaluateForm: HTMLFormElement;
            ruleKojiGuardForm: HTMLFormElement;
        }


        targetOrderObj: OrderObject={}
        controlManstarget=''

        // 入曲情況
        kojiInformData: KojiInObject= {}
        isLoanedPersonnelStatusDialogShow=false // 入曲人选择弹窗
        orgTree: object[] = [];
        arrList: string[] = [];
        // 出曲工藝
        kojiOutCraftformData: KojiOutCraftObject= {}

        // 翻曲记录
        kojiDiscTurnData: KojiDiscTurn[]=[]

        // 异常情况
        kojiDiscExceptionInfo: KojiDiscExceptionInfo={}

        // 曲料生产评价
        kojiEvaluateData: KojiEvaluate[]=[]
        ruleKojiEvaluateForm= {}
        kojiEvaluateGrowInfoOptions: OptionObj[]=[]
        kojiStageOptions: OptionObj[]=[]

        // 看曲记录
        kojiGuardData: KojiGuard[]=[]
        ruleKojiGuardForm= {}
        forceDrainOptions: OptionObj[]=[]
        changeHotOptions: OptionObj[]=[]


        currentAudit = [];


        init() {
            this.targetOrderObj = this.$store.state.koji.orderKojiInfo
            // 入曲情况
            this.getKojiStatus()
            // 出曲工藝
            this.getKojiOutCraft()
            // 翻曲记录
            this.getKojiDiscTurn()
            // 异常情况
            this.getKojiDiscException()
            // 曲料生长评价
            this.getKojiDiscEvaluate()
            // 看曲记录
            this.getKojiDiscGuard()
            // 审核日志
            this.getAudit(this.targetOrderObj, 'CONTROL');
        }


        addKojiDuration(start, end) {
            let diff = '0';
            if (start && end) {
                diff = getDateDiff(start, end, 'hour')
            }
            this.kojiInformData.addKojiDuration = diff
            return diff
        }

        // 选择人员 内部借调
        selectUser(userList) {
            if (this.isRedact) {

                this.isLoanedPersonnelStatusDialogShow = true;
                let tempUserList = []
                if (userList) {
                    tempUserList = userList.split(',')
                }
                this.$nextTick(() => {
                    this.$refs.loanedPersonnel.init(tempUserList, '内部调借');
                });
            }
        }

        // 员工确认
        changeUser(userId) {
            this.kojiInformData.addKojiMans = userId.toString()
            this.isLoanedPersonnelStatusDialogShow = false;
        }

        // 入曲情况
        getKojiStatus() {
            KOJI_API.KOJI_DISC_QUERY_IN_API({
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.kojiInformData = {}
                if (data.data) {
                    this.kojiInformData = data.data
                }
            })
        }

        // 出曲工藝
        getKojiOutCraft() {
            KOJI_API.KOJI_DISC_QUERY_KOJIOUT_API({
                //kojiOrderNo: '85100000188700120200918162640'
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                console.log('出曲工藝data')
                console.log(data)
                this.kojiOutCraftformData = {}
                if (data.data) {
                    this.kojiOutCraftformData = data.data
                }
            })
        }

        // 翻曲记录
        getKojiDiscTurn() {
            KOJI_API.KOJI_DISC_QUERY_TURN_API({
                kojiOrderNo: '85100000188700120200918162640'
                // kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.kojiDiscTurnData = []
                if (data.data) {
                    this.kojiDiscTurnData[0] = data.data.kojiDiscTurn1
                    this.kojiDiscTurnData[1] = data.data.kojiDiscTurn2
                }
            })
        }

        // 异常情况
        getKojiDiscException() {
            KOJI_API.KOJI_DISC_QUERY_EXCEPTION_API({
                kojiOrderNo: '85100000188700120200918162640'
                // kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.kojiDiscExceptionInfo = {}
                if (data.data) {
                    this.kojiDiscExceptionInfo = data.data
                }
            })
        }

        // 曲料生长评价
        getKojiDiscEvaluate() {
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_SITUATION' }).then(({ data }) => {
                this.kojiEvaluateGrowInfoOptions = []
                data.data.forEach(item => {
                    this.kojiEvaluateGrowInfoOptions.push({ optLabel: item.dictValue, optValue: item.dictCode })
                })

            });

            COMMON_API.DICTQUERY_API({ dictType: 'KOJI_GROWTH_STAGE' }).then(({ data }) => {
                this.kojiStageOptions = []
                data.data.forEach(item => {
                    this.kojiStageOptions.push({ optLabel: item.dictValue, optValue: item.dictCode })
                })

            });

            KOJI_API.KOJI_DISC_QUERY_EVALUATE_API({
                kojiOrderNo: '85100000188700120200918162640'
                // kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.kojiEvaluateData = []
                if (data.data) {
                    this.kojiEvaluateData = data.data
                }
            })
        }

        // 看曲记录
        getKojiDiscGuard() {
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_OPEN_CLOSE' }).then(({ data }) => {
                this.forceDrainOptions = []
                data.data.forEach(item => {
                    this.forceDrainOptions.push({ optLabel: item.dictValue, optValue: item.dictCode })
                })

            });

            COMMON_API.DICTQUERY_API({ dictType: 'KOJI_HEAT_TRANSFER' }).then(({ data }) => {
                this.changeHotOptions = []
                data.data.forEach(item => {
                    this.changeHotOptions.push({ optLabel: item.dictValue, optValue: item.dictCode })
                })

            });


            KOJI_API.KOJI_DISC_QUERY_GUARD_API({
                kojiOrderNo: '85100000188700120200918162640'
                // kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.kojiGuardData = []
                if (data.data) {
                    this.kojiGuardData = data.data
                }
            })
        }


        // [新增]曲料生长评价
        addNewKojiEvaluateRow() {
            const sole: KojiEvaluate = {
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                exceptionInfo: '',
                growInfo: '',
                id: '',
                kojiOrderNo: '',
                kojiStage: '',
                kojiStageName: '',
                orderNo: '',
                recordDate: '',
                recordMans: '',
                remark: '',
                status: '',
                delFlag: 0
            }

            this.kojiEvaluateData.push(sole);
            // this.setValidate(this.firstFormDataGroup, this.ruleFirstForm)
        }

        // [新增]看曲记录
        addNewKojiGuardRow() {
            const sole: KojiGuard = {
                changeHot: '',
                changeHotName: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                forceDrain: '',
                forceDrainName: '',
                guardDate: '',
                id: '',
                innerDownTemp: 0,
                innerMidTemp: 0,
                innerUpTemp: 0,
                kojiOrderNo: '',
                orderNo: '',
                outDownTemp: 0,
                outMidTemp: 0,
                outUpTemp: 0,
                prodTemp: 0,
                remark: '',
                roomTemp: 0,
                settingProdTemp: 0,
                settingWindTemp: 0,
                status: '',
                testTempOne: 0,
                testTempTwo: 0,
                windDoor: 0,
                windSpeed: 0,
                windTemp: 0,
                delFlag: 0
            }

            this.kojiGuardData.push(sole);
        }

        ruleSubmit() {
        //     for (const item of this.currentDataTable.filter(it => it.delFlag !== 1)) {
        //         if (!item.realUseAmount) {
        //             this.$warningToast('请填写物料领用页签包材领用实际用量');
        //             return false
        //         }
        //     }
        //     for (const item of this.materialS.filter(it => it.delFlag !== 1)) {
        //         if (!item.sterilizeStorageNo) {
        //             this.$warningToast('请填写物料领用页签半成品领用使用锅序');
        //             return false
        //         }
        //         if (!item.realUsed) {
        //             this.$warningToast('请填写物料领用页签半成品领用实际用量');
        //             return false
        //         }
        //         if (!item.startDate) {
        //             this.$warningToast('请填写物料领用页签半成品领用开始使用时间');
        //             return false
        //         }
        //     }
        //     return true
        }

        savedData() {
        //     const pkgPackingMaterial: PkgMaterialObj = {
        //         packingMaterialDelete: [],
        //         packingMaterialItemDelete: [],
        //         packingMaterialInsert: [],
        //         packingMaterialUpdate: []
        //     };
        //     const pkgSemiMaterial: PkgMaterialSObj = {
        //         materialCount: this.materialCount,
        //         pkgSemiMaterialDelete: [],
        //         pkgSemiMaterialItemDelete: [],
        //         pkgSemiMaterialInsert: [],
        //         pkgSemiMaterialUpdate: []
        //     };
        //     this.currentDataTable.forEach(item => {
        //         const filterArr1: (any) = pkgPackingMaterial.packingMaterialUpdate.filter(it => it.id === item.mainId);// eslint-disable-line
        //         const filterArr2: (any) = pkgPackingMaterial.packingMaterialInsert.filter(it => it.merge === item.merge);// eslint-disable-line
        //         if (item.materialStatus === '3') {
        //             if (pkgPackingMaterial.packingMaterialDelete.indexOf(item.mainId) === -1) {
        //                 pkgPackingMaterial.packingMaterialDelete.push(item.mainId);
        //             }
        //             if (item.id) {
        //                 pkgPackingMaterial.packingMaterialItemDelete.push(item.id)
        //             }
        //         } else if (item.delFlag === 1) {
        //             if (item.id) {
        //                 pkgPackingMaterial.packingMaterialItemDelete.push(item.id)
        //             }
        //         } else if (item.id) {
        //             const orgObj = this.orgDataTable.filter(it => it.id === item.id)[0];
        //             if (!_.isEqual(orgObj, item)) {
        //                 item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        //                 item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
        //                 if (filterArr1 && filterArr1[0]) {
        //                     item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        //                     item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
        //                     filterArr1[0].item.push(item)
        //                 } else {
        //                     pkgPackingMaterial.packingMaterialUpdate.push({
        //                         factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        //                         merge: item.merge,
        //                         mainId: item.mainId,
        //                         id: item.mainId,
        //                         checkStatus: item.checkStatus,
        //                         delFlag: item.delFlag,
        //                         endStocks: item.endStocks,
        //                         materialType: item.materialType,
        //                         materialCode: item.materialCode,
        //                         materialName: item.materialName,
        //                         materialStatus: item.materialStatus,
        //                         materialUnit: item.materialUnit,
        //                         needNum: item.needNum,
        //                         orderId: item.orderId,
        //                         orderNo: item.orderNo,
        //                         posnr: item.posnr,
        //                         receiveMaterial: item.receiveMaterial,
        //                         startStocks: item.startStocks,
        //                         item: [item]
        //                     })
        //                 }
        //             }
        //         } else if (filterArr2 && filterArr2[0]) {
        //             item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        //             item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
        //             filterArr2[0].item.push(item)
        //         } else {
        //             item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        //             item.realLoss = (item.realLoss === '' || item.realLoss === null ? 0 : item.realLoss);
        //             pkgPackingMaterial.packingMaterialInsert.push({
        //                 factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        //                 merge: item.merge,
        //                 mainId: item.mainId,
        //                 id: item.mainId,
        //                 checkStatus: item.checkStatus,
        //                 delFlag: item.delFlag,
        //                 endStocks: item.endStocks,
        //                 materialType: item.materialType,
        //                 materialCode: item.materialCode,
        //                 materialName: item.materialName,
        //                 materialStatus: item.materialStatus,
        //                 materialUnit: item.materialUnit,
        //                 needNum: item.needNum,
        //                 orderId: item.orderId,
        //                 orderNo: item.orderNo,
        //                 posnr: item.posnr,
        //                 receiveMaterial: item.receiveMaterial,
        //                 startStocks: item.startStocks,
        //                 item: [item]
        //             })
        //         }
        //     });
        //     this.materialS.forEach(item => {
        //         const filterArr1: (any) = pkgSemiMaterial.pkgSemiMaterialUpdate.filter(it => it.id === item.mainId);// eslint-disable-line
        //         const filterArr2: (any) = pkgSemiMaterial.pkgSemiMaterialInsert.filter(it => it.merge === item.merge);// eslint-disable-line
        //         if (item.materialStatus === '3') {
        //             pkgSemiMaterial.pkgSemiMaterialDelete.push(item.mainId);
        //         } else if (item.delFlag === 1) {
        //             if (item.id) {
        //                 pkgSemiMaterial.pkgSemiMaterialItemDelete.push(item.id)
        //             }
        //         } else if (item.id) {
        //             const orgObj = this.orgMaterialS.filter(it => it.id === item.id)[0];
        //             if (!_.isEqual(orgObj, item)) {
        //                 item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        //                 if (filterArr1 && filterArr1[0]) {
        //                     filterArr1[0].item.push(item)
        //                 } else {
        //                     pkgSemiMaterial.pkgSemiMaterialUpdate.push({
        //                         factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        //                         merge: item.merge,
        //                         mainId: item.mainId,
        //                         id: item.mainId,
        //                         checkStatus: item.checkStatus,
        //                         materialType: item.materialType,
        //                         materialCode: item.materialCode,
        //                         materialName: item.materialName,
        //                         materialUnit: item.materialUnit,
        //                         needNum: item.needNum,
        //                         orderId: item.orderId,
        //                         orderNo: item.orderNo,
        //                         posnr: item.posnr,
        //                         item: [item]
        //                     })
        //                 }
        //             }
        //         } else if (filterArr2 && filterArr2[0]) {
        //             item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        //             filterArr2[0].item.push(item)
        //         } else {
        //             item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        //             pkgSemiMaterial.pkgSemiMaterialInsert.push({
        //                 factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
        //                 merge: item.merge,
        //                 mainId: item.mainId,
        //                 id: item.mainId,
        //                 checkStatus: item.checkStatus,
        //                 delFlag: item.delFlag,
        //                 materialType: item.materialType,
        //                 materialCode: item.materialCode,
        //                 materialName: item.materialName,
        //                 materialUnit: item.materialUnit,
        //                 needNum: item.needNum,
        //                 orderId: item.orderId,
        //                 orderNo: item.orderNo,
        //                 posnr: item.posnr,
        //                 item: [item]
        //             })
        //         }
        //     });
        //     return {
        //         pkgPackingMaterial,
        //         pkgSemiMaterial
        //     }
        }

        // 审核日志
        getAudit(formHeader, verifyType) {
            AUDIT_API.AUDIT_LOG_LIST_API({ orderNo: formHeader.orderNo, verifyType: verifyType }).then(({ data }) => {
                this.currentAudit = data.data
            })
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            } else if (row.materialStatus === '3') {
                return 'disabled-row'
            } else if (row.materialStatus === '1' || row.materialStatus === '2') {
                return 'warning-row'
            }
            return '';
        }

        // 删除
        removeFirstDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            });
        }
    }

interface OptionObj {
    optLabel?: string;
    optValue?: string;
}
interface KojiInObject {
    addKojiDuration?: string;
    addKojiEnd?: string;
    addKojiInfo?: string;
    addKojiMans?: string;
    addKojiStart?: string;
    addKojiTemp?: number;
    changed?: string;
    changer?: string;
    id?: string;
    kojiDurationStandard?: string;
    kojiOrderNo?: string;
    orderNo?: string;
    remark?: string;
    status?: string;
}

interface OrderObject{
    orderNoTemp?: string;
    statusName?: string;
    addKojiDate?: string;
    changed?: string;
    changer?: string;
    fermentPotId?: string;
    fermentPotNo?: string;
    id?: string;
    kojiDuration?: string;
    kojiEndTime?: string;
    kojiHouseId?: string;
    kojiHouseNo?: string;
    kojiOrderNo?: string;
    kojiStartTime?: string;
    materialCode?: string;
    materialName?: string;
    orderId?: string;
    orderNo?: string;
    orderType?: string;
    outKojiDate?: string;
    outputUnit?: string;
    outputUnitName?: string;
    planOutput?: number;
    productDate?: string;
    status?: string;
    workShop?: string;
    workShopName?: string;
}
interface KojiOutCraftObject{
    changed?: string;
    changer?: string;
    id?: string;
    kojiOrderNo?: string;
    orderNo?: string;
    outKojiDuration?: string;
    outKojiEnd?: string;
    outKojiMans?: string;
    outKojiStart?: string;
    outKojiTemp?: number;
    remark?: string;
    status?: string;
}
interface KojiDiscTurn{
    changed?: string;
    changer?: string;
    id?: string;
    kojiOrderNo?: string;
    orderNo?: string;
    remark?: string;
    status?: string;
    turnAddWaterAmount?: number;
    turnDuration?: number;
    turnEnd?: string;
    turnMans?: string;
    turnStage?: string;
    turnStageName?: string;
    turnStart?: string;
}
interface KojiDiscExceptionInfo{
    discGuardExceptionInfo?: string;
    discTurnExceptionInfo?: string;
}

interface KojiEvaluate {
    changed?: string;
    changer?: string;
    exceptionInfo?: string;
    growInfo?: string;
    id?: string;
    kojiOrderNo?: string;
    kojiStage?: string;
    kojiStageName?: string;
    orderNo?: string;
    recordDate?: string;
    recordMans?: string;
    remark?: string;
    status?: string;
    delFlag?: number;
}

interface KojiGuard{
    changeHot?: string;
    changeHotName?: string;
    changed?: string;
    changer?: string;
    forceDrain?: string;
    forceDrainName?: string;
    guardDate?: string;
    id?: string;
    innerDownTemp?: number;
    innerMidTemp?: number;
    innerUpTemp?: number;
    kojiOrderNo?: string;
    orderNo?: string;
    outDownTemp?: number;
    outMidTemp?: number;
    outUpTemp?: number;
    prodTemp?: number;
    remark?: string;
    roomTemp?: number;
    settingProdTemp?: number;
    settingWindTemp?: number;
    status?: string;
    testTempOne?: number;
    testTempTwo?: number;
    windDoor?: number;
    windSpeed?: number;
    windTemp?: number;
    delFlag?: number;
}
</script>

<style lang="scss" scoped>
    .solerow {
        margin-top: 5px;
        line-height: 33px;
        div {
            float: left;
        }
        .input_bottom {
            margin-right: 50px;
        }
    }
</style>
