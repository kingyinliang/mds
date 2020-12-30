<template>
    <div>
        <mds-card :title="'入曲情况'" :name="'kojiStatus'">
            <el-form ref="kojiIn" :model="kojiInformData" size="small" label-width="120px" :inline="true" class="markStyle">
                <el-form-item
                    label="入曲情况："
                >
                    <el-input
                        v-model="kojiInformData.addKojiInfo"
                        placeholder="请输入入曲情况"
                        clearable
                        style="width: 180px;"
                        maxlength="30"
                        :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && kojiInformData.status !== 'C' && kojiInformData.status !== 'D' && kojiInformData.status !== 'P')"
                    />
                </el-form-item>
                <el-form-item
                    label="入曲人："
                    prop="addKojiMans"
                    class="star"
                >
                    <div style="width: 180px;">
                        <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(kojiInformData,'addKojiMans','入曲人')">
                            <el-tooltip v-if="kojiInformData.addKojiMans&&kojiInformData.addKojiMans!==''" class="item" effect="dark" :content="kojiInformData.addKojiMans" placement="top">
                                <el-input
                                    v-if="kojiInformData.addKojiMans&&kojiInformData.addKojiMans!==''"
                                    v-model="kojiInformData.addKojiMans"
                                    placeholder="请输入入曲人"
                                    size="small"
                                    :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& kojiInformData.status !== 'C' && kojiInformData.status !== 'D' && kojiInformData.status !== 'P')"
                                />
                            </el-tooltip>
                            <em v-if="!kojiInformData.addKojiMans" :class="{'like-el-input__inner':isRedact,'input-in-form-disabled':!isRedact}">点击选择人员</em>
                        </span>
                    </div>
                </el-form-item>
                <el-form-item
                    label="入曲温度："
                    prop="addKojiTemp"
                    class="star"
                >
                    <el-input
                        v-model="kojiInformData.addKojiTemp"
                        placeholder="请输入"
                        clearable
                        style="width: 180px;"
                        :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && kojiInformData.status !== 'C' && kojiInformData.status !== 'D' && kojiInformData.status !== 'P')"
                        @input="(val)=>oninput(val,kojiInformData,'addKojiTemp')"
                    >
                        <span slot="suffix">°C</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="入曲标准：">
                    <el-input
                        v-model="kojiInformData.kojiDurationStandard"
                        readonly
                        :disabled="true"
                        style="width: 180px;"
                    >
                        <span slot="suffix">H</span>
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="入曲开始时间："
                    prop="addKojiStart"
                    class="star"
                >
                    <el-date-picker
                        v-model="kojiInformData.addKojiStart"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& kojiInformData.status !== 'C' && kojiInformData.status !== 'D' && kojiInformData.status !== 'P')"
                    />
                </el-form-item>
                <el-form-item
                    label="入曲结束时间："
                    prop="addKojiEnd"
                    class="star"
                >
                    <el-date-picker
                        v-model="kojiInformData.addKojiEnd"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& kojiInformData.status !== 'C' && kojiInformData.status !== 'D' && kojiInformData.status !== 'P')"
                    />
                </el-form-item>
                <el-form-item
                    label="入曲时长："
                    prop="addKojiDuration"
                    class="star"
                    :style="{color: (Number(kojiInformData.addKojiDuration)-Number(kojiInformData.kojiDurationStandard))>0?'#f00':'#333'}"
                >
                    <span :class="{'input-in-form-disabled':true}" style="width: 180px;">{{ addKojiInDuration(kojiInformData.addKojiStart,kojiInformData.addKojiEnd) }} H</span>
                </el-form-item>
            </el-form>
        </mds-card>
        <mds-card title="看曲记录" :name="'kojiGuard'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" @click="addNewKojiGuardRow">
                        新增
                    </el-button>
                </div>
            </template>

            <el-table class="newTable other" :data="kojiGuardData" :row-class-name="rowDelFlag" max-height="300" header-row-class-name="tableHead" border tooltip-effect="dark">
                <el-table-column type="index" :index="index => getIndexMethod(index, kojiGuardData)" label="序号" width="55" fixed />
                <el-table-column label="看曲时间" :show-overflow-tooltip="true" width="210">
                    <template slot="header">
                        <span class="notNull">* </span>看曲时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.guardDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 180px;" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @change="(val)=>kojiStartTimeChange(val,scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="实际风温" :show-overflow-tooltip="true" width="140">
                    <template slot="header">
                        <span class="notNull">* </span>实际风温
                    </template>
                    <template slot-scope="scope">
                        <el-input
                            v-model.trim="scope.row.windTemp"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @input="(val)=>oninput(val,scope.row,'windTemp')"
                        >
                            <span slot="suffix">°C</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="设定风温" :show-overflow-tooltip="true" width="140">
                    <template slot-scope="scope">
                        <el-input
                            v-model.trim="scope.row.settingWindTemp"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @input="(val)=>oninput(val,scope.row,'settingWindTemp')"
                        >
                            <span slot="suffix">°C</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="下室温度" :show-overflow-tooltip="true" width="140">
                    <template slot="header">
                        <span class="notNull">* </span>下室温度
                    </template>
                    <template slot-scope="scope">
                        <el-input
                            v-model.trim="scope.row.roomTemp"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @input="(val)=>oninput(val,scope.row,'roomTemp')"
                        >
                            <span slot="suffix">°C</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="风速" :show-overflow-tooltip="true" width="140">
                    <template slot="header">
                        <span class="notNull">* </span>风速
                    </template>
                    <template slot-scope="scope">
                        <el-input
                            v-model.trim="scope.row.windSpeed"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @input="(val)=>oninput(val,scope.row,'windSpeed')"
                        >
                            <span slot="suffix">m/s</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="品温" :show-overflow-tooltip="true" width="140">
                    <template slot="header">
                        <span class="notNull">* </span>品温
                    </template>
                    <template slot-scope="scope">
                        <el-input
                            v-model.trim="scope.row.prodTemp"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @input="(val)=>oninput(val,scope.row,'prodTemp')"
                        >
                            <span slot="suffix">°C</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="设定品温" :show-overflow-tooltip="true" width="140">
                    <template slot-scope="scope">
                        <el-input
                            v-model.trim="scope.row.settingProdTemp"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @input="(val)=>oninput(val,scope.row,'settingProdTemp')"
                        >
                            <span slot="suffix">°C</span>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="探头温度" :show-overflow-tooltip="true">
                    <el-table-column
                        prop="outUpTemp"
                        label="外上"
                        width="120"
                    >
                        <template slot="header">
                            <span class="notNull">* </span>外上
                        </template>
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.outUpTemp"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'outUpTemp')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="outMidTemp"
                        label="外中"
                        width="120"
                    >
                        <template slot="header">
                            <span class="notNull">* </span>外中
                        </template>
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.outMidTemp"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'outMidTemp')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="outDownTemp"
                        label="外下"
                        width="120"
                    >
                        <template slot="header">
                            <span class="notNull">* </span>外下
                        </template>
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.outDownTemp"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'outDownTemp')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="innerUpTemp"
                        label="内上"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.innerUpTemp"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'innerUpTemp')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="innerMidTemp"
                        label="内中"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.innerMidTemp"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'innerMidTemp')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="innerDownTemp"
                        label="内下"
                        width="120"
                    >
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.innerDownTemp"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'innerDownTemp')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
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
                            <span class="notNull">* </span>测量点1
                        </template>
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.testTempOne"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'testTempOne')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="testTempTwo"
                        label="测量点2"
                        width="100"
                    >
                        <template slot="header">
                            <span class="notNull">* </span>测量点2
                        </template>
                        <template slot-scope="scope">
                            <el-input
                                v-model.trim="scope.row.testTempTwo"
                                size="small"
                                placeholder="请输入"
                                :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                @input="(val)=>oninput(val,scope.row,'testTempTwo')"
                            >
                                <span slot="suffix">°C</span>
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="中间风门" :show-overflow-tooltip="true" width="140">
                    <template slot="header">
                        <span class="notNull">* </span>中间风门
                    </template>
                    <template slot-scope="scope">
                        <el-input
                            v-model.trim="scope.row.windDoor"
                            size="small"
                            placeholder="请输入"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @input="(val)=>oninput(val,scope.row,'windDoor')"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="强排" :show-overflow-tooltip="true" width="130">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.forceDrain" size="small" clearable style="width: 100%;" :disabled="!(isRedact && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')">
                            <el-option
                                v-for="item in forceDrainOptions"
                                :key="item.optValue"
                                :label="item.optLabel"
                                :value="item.optValue"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="换热" :show-overflow-tooltip="true" width="130">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.changeHot" size="small" clearable style="width: 100%;" :disabled="!(isRedact && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')">
                            <el-option
                                v-for="item in changeHotOptions"
                                :key="item.optValue"
                                :label="item.optLabel"
                                :value="item.optValue"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeFirstDataRow(scope.row,'kojiGuardData');">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div>
                <div style="margin: 10px 5px;">
                    异常情况：
                </div>
                <el-input v-model="kojiDiscExceptionInfo.discGuardExceptionInfo" type="textarea" :rows="4" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" style="width: 80%;" />
            </div>
        </mds-card>

        <mds-card :title="'翻曲记录'" :name="'kojiTurn'">
            <el-table ref="kojiTurn" header-row-class-name="tableHead" class="newTable" max-height="267" :data="kojiDiscTurnData" :row-class-name="rowDelFlag" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="55" fixed />
                <el-table-column label="翻曲" prop="turnStageName" width="100" />
                <el-table-column label="翻曲开始时间" prop="turnStart" width="230">
                    <template slot="header">
                        <span class="notNull">* </span>翻曲开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.turnStart"
                            type="datetime"
                            size="small"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            placeholder="请选择"
                            style="width: 200px;"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            @change="(val)=>turnStartTimeChange(val,scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="翻曲结束时间" prop="turnEnd" width="230">
                    <template slot="header">
                        <span class="notNull">* </span>翻曲结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.turnEnd"
                            type="datetime"
                            size="small"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            placeholder="请选择"
                            style="width: 200px;"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="制曲时长：H" prop="turnDuration" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.turnDuration | itemValue }}
                    </template>
                </el-table-column>
                <el-table-column label="翻曲加水量" prop="turnAddWaterAmount" width="100">
                    <template slot-scope="scope">
                        <el-input
                            v-model="scope.row.turnAddWaterAmount"
                            maxlength="30"
                            :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                            size="small"
                            placeholder="请输入"
                            @input="(val)=>oninput(val,scope.row,'turnAddWaterAmount')"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="翻曲人" min-width="230">
                    <template slot="header">
                        <span class="notNull">* </span>翻曲人
                    </template>
                    <template slot-scope="scope">
                        <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(scope.row,'turnMans','翻曲人')">
                            <el-tooltip v-if="scope.row.turnMans&&scope.row.turnMans!==''" class="item" effect="dark" :content="scope.row.turnMans" placement="top">
                                <el-input
                                    v-if="scope.row.turnMans&&scope.row.turnMans!==''"
                                    v-model="scope.row.turnMans"
                                    placeholder="请输入翻曲人"
                                    size="small"
                                    style="width: 200px;"
                                    :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                />
                            </el-tooltip>
                            <em v-if="!scope.row.turnMans" :class="{'like-el-input__inner':isRedact,'input-in-table-disabled':!isRedact}">点击选择人员</em>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="200">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                            <el-input v-model="scope.row.remark" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" size="small" placeholder="请输入" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="180">
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
                <el-input v-model="kojiDiscExceptionInfo.discTurnExceptionInfo" type="textarea" :rows="4" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" style="width: 80%;" />
            </div>
        </mds-card>

        <mds-card title="曲料生长评价" :name="'kojiEvaluate'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P')" @click="addNewKojiEvaluateRow">
                        新增
                    </el-button>
                </div>
            </template>
            <el-form ref="ruleKojiEvaluateForm" :model="ruleKojiEvaluateForm">
                <el-table class="newTable" :data="kojiEvaluateData" :row-class-name="rowDelFlag" max-height="300" header-row-class-name="tableHead" border style="width: 100%; min-height: 90px;">
                    <el-table-column type="index" :index="index => getIndexMethod(index, kojiEvaluateData)" label="序号" width="55" fixed />
                    <el-table-column width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">* </span>阶段
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="kojiStage">
                                <el-select v-model="scope.row.kojiStage" size="small" clearable style="width: 100%;" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')">
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
                            <span class="notNull">* </span>记录时间
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="recordDate">
                                <el-date-picker v-model="scope.row.recordDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" placeholder="选择时间" style="width: 180px;" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">* </span>生长情况
                        </template>
                        <template slot-scope="scope">
                            <el-form-item prop="growInfo">
                                <el-select v-model="scope.row.growInfo" size="small" clearable style="width: 100%;" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @change="val=>scope.row.exceptionInfo=''">
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
                            <el-input v-model.trim="scope.row.exceptionInfo" size="small" placeholder="请输入异常描述" :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P') || scope.row.growInfo==='GOOD'" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="记录人"
                        prop="recordMans"
                        width="230"
                        class="star"
                    >
                        <template slot="header">
                            <span class="notNull">* </span>记录人
                        </template>
                        <template slot-scope="scope">
                            <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(scope.row,'recordMans','记录人')">
                                <el-tooltip v-if="scope.row.recordMans&&scope.row.recordMans!==''" class="item" effect="dark" :content="scope.row.recordMans" placement="top">
                                    <el-input
                                        v-if="scope.row.recordMans&&scope.row.recordMans!==''"
                                        v-model="scope.row.recordMans"
                                        placeholder="请输入记录人"
                                        style="width: 200px;"
                                        size="small"
                                        :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')"
                                    />
                                </el-tooltip>
                                <em v-if="!scope.row.recordMans" :class="{'like-el-input__inner':isRedact,'input-in-table-disabled':!isRedact}">点击选择人员</em>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                        <template slot-scope="scope">
                            <el-tooltip :disabled="!scope.row.remark" effect="dark" :content="scope.row.remark" placement="top">
                                <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" />
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true" />
                    <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeFirstDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </mds-card>

        <mds-card :title="'出曲工艺'" :name="'kojiOutCraft'">
            <el-form ref="kojiOutCraft" :model="kojiOutCraftformData" size="small" label-width="120px" :inline="true" class="markStyle">
                <el-form-item
                    label="出曲开始时间："
                    prop="outKojiStart"
                    class="star"
                >
                    <el-date-picker
                        v-model="kojiOutCraftformData.outKojiStart"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && kojiOutCraftformData.status !== 'C' && kojiOutCraftformData.status !== 'D' && kojiOutCraftformData.status !== 'P')"
                    />
                </el-form-item>
                <el-form-item
                    label="出曲结束时间："
                    prop="outKojiEnd"
                    class="star"
                >
                    <el-date-picker
                        v-model="kojiOutCraftformData.outKojiEnd"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="请选择"
                        clearable
                        style="width: 180px;"
                        :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && kojiOutCraftformData.status !== 'C' && kojiOutCraftformData.status !== 'D' && kojiOutCraftformData.status !== 'P')"
                    />
                </el-form-item>
                <el-form-item
                    label="出曲时长："
                    prop="outKojiDuration"
                    class="star"
                >
                    <span style="width: 180px;" :class="{'input-in-form-disabled':true}">{{ addOutCraftDuration(kojiOutCraftformData.outKojiStart,kojiOutCraftformData.outKojiEnd) }} H</span>
                </el-form-item>
                <el-form-item
                    label="出曲操作人："
                    prop="outKojiMans"
                    class="star"
                >
                    <div style="width: 180px;">
                        <span :style="{cursor:isRedact? 'pointer':'default',color:isRedact? '#333':'#aaa'}" @click="selectUser(kojiOutCraftformData,'outKojiMans','出曲操作人')">
                            <el-tooltip v-if="kojiOutCraftformData.outKojiMans&&kojiOutCraftformData.outKojiMans!==''" class="item" effect="dark" :content="kojiOutCraftformData.outKojiMans" placement="top">
                                <el-input
                                    v-if="kojiOutCraftformData.outKojiMans&&kojiOutCraftformData.outKojiMans!==''"
                                    v-model="kojiOutCraftformData.outKojiMans"
                                    placeholder="请输入出曲操作人"
                                    size="small"
                                    style="width: 200px;"
                                    :disabled="!(isRedact&& isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P' && kojiOutCraftformData.status !== 'C' && kojiOutCraftformData.status !== 'D' && kojiOutCraftformData.status !== 'P')"
                                />
                            </el-tooltip>
                            <em v-if="!kojiOutCraftformData.outKojiMans" :class="{'like-el-input__inner':isRedact,'input-in-form-disabled':!isRedact}">点击选择人员</em>
                        </span>
                    </div>
                </el-form-item>
                <el-form-item
                    label="出曲温度："
                    prop="outKojiTemp"
                    class="star"
                >
                    <el-input
                        v-model="kojiOutCraftformData.outKojiTemp"
                        placeholder="请输入"
                        clearable
                        style="width: 180px;"
                        :disabled="!(isRedact && isStatus !== 'C' && isStatus !== 'D' && isStatus !== 'P'&& kojiOutCraftformData.status !== 'C' && kojiOutCraftformData.status !== 'D' && kojiOutCraftformData.status !== 'P')"
                        @input="(val)=>oninput(val,kojiOutCraftformData,'outKojiTemp')"
                    >
                        <span slot="suffix">°C</span>
                    </el-input>
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
    import _ from 'lodash';

    @Component({
        name: 'DiscCraftControl',
        components: {
            LoanedPersonnel
        },
        filters: {
            itemValue(value: string) {
                return Number(value).toFixed(2)
            }
        }
    })
    export default class DiscCraftControl extends Vue {
        @Prop({ type: Object, default: () => { return {} } }) formHeader: object;
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: 'N' }) isStatus: string;
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
        // 出曲工艺
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
        kojiGuardDataOrg: KojiGuard[]=[]
        ruleKojiGuardForm= {}
        forceDrainOptions: OptionObj[]=[]
        changeHotOptions: OptionObj[]=[]


        currentAudit = [];
        targetUserList={}
        targetUserProp=''


        init() {
            this.targetOrderObj = this.$store.state.koji.orderKojiInfo
            // 入曲情况
            this.getKojiStatus()
            // 出曲工艺
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
            this.getAudit(this.targetOrderObj);
        }


        addKojiInDuration(start, end) {
            let diff = '0';
            if (start && end) {
                diff = getDateDiff(start, end, 'hour')
                this.kojiInformData.addKojiDuration = diff
            }
            return diff
        }

        addOutCraftDuration(start, end) {
            let diff = '0';
            if (start && end) {
                diff = getDateDiff(start, end, 'hour')
                this.kojiOutCraftformData.outKojiDuration = Number(diff)
            }
            return diff
        }

        // 选择人员 内部借调
        selectUser(target, prop, who) {
            if (!(this.isRedact && this.isStatus !== 'C' && this.isStatus !== 'D' && this.isStatus !== 'P' && target['status'] !== 'C' && target['status'] !== 'D' && target['status'] !== 'P')) return;
                this.targetUserList = target
                this.targetUserProp = prop
                this.isLoanedPersonnelStatusDialogShow = true;
                let tempUserList = []
                if (target[prop]) {
                    tempUserList = target[prop].split(',')
                }
                this.$nextTick(() => {
                    this.$refs.loanedPersonnel.init(tempUserList, who);
                });

        }

        // 员工确认
        changeUser(userId) {
            this.targetUserList[this.targetUserProp] = userId.toString();
            this.isLoanedPersonnelStatusDialogShow = false;


        }

        // 入曲情况
        getKojiStatus() {
            KOJI_API.KOJI_DISC_QUERY_IN_API({
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.kojiInformData = {}
                if (data.data) {
                    console.log('入曲情况')
                    console.log(data.data)
                    this.kojiInformData = data.data
                } else {
                    this.$set(this.kojiInformData, 'addKojiDuration', '')
                    this.$set(this.kojiInformData, 'addKojiEnd', '')
                    this.$set(this.kojiInformData, 'addKojiInfo', '')
                    this.$set(this.kojiInformData, 'addKojiMans', '')
                    this.$set(this.kojiInformData, 'addKojiStart', '')
                    this.$set(this.kojiInformData, 'addKojiTemp', '')
                    this.$set(this.kojiInformData, 'status', '')
                }
                this.$set(this.kojiInformData, 'orderNo', this.targetOrderObj.orderNo)
                this.$set(this.kojiInformData, 'kojiOrderNo', this.targetOrderObj.kojiOrderNo)
            })
        }

        // 出曲工艺
        getKojiOutCraft() {
            KOJI_API.KOJI_DISC_QUERY_KOJIOUT_API({
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                console.log('出曲工艺data')
                console.log(data)
                this.kojiOutCraftformData = {}
                if (data.data) {
                    this.kojiOutCraftformData = data.data
                } else {
                    this.$set(this.kojiOutCraftformData, 'outKojiDuration', 0)
                    this.$set(this.kojiOutCraftformData, 'outKojiEnd', '')
                    this.$set(this.kojiOutCraftformData, 'outKojiMans', '')
                    this.$set(this.kojiOutCraftformData, 'outKojiStart', '')
                    this.$set(this.kojiOutCraftformData, 'status', '')
                    this.$set(this.kojiOutCraftformData, 'outKojiTemp', '')

                }
                this.$set(this.kojiOutCraftformData, 'orderNo', this.targetOrderObj.orderNo)
                this.$set(this.kojiOutCraftformData, 'kojiOrderNo', this.targetOrderObj.kojiOrderNo)
            })
        }

        // 翻曲记录
        getKojiDiscTurn() {
            KOJI_API.KOJI_DISC_QUERY_TURN_API({
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                console.log('翻曲记录')
                console.log(data)
                this.kojiDiscTurnData = []
                if (data.data) {
                    this.kojiDiscTurnData[0] = data.data.kojiDiscTurn1
                    this.kojiDiscTurnData[1] = data.data.kojiDiscTurn2

                    this.$set(this.kojiDiscTurnData[0], 'orderNo', this.targetOrderObj.orderNo)
                    this.$set(this.kojiDiscTurnData[0], 'kojiOrderNo', this.targetOrderObj.kojiOrderNo)

                    if (this.kojiDiscTurnData[0].turnStart === null) {
                        this.$set(this.kojiDiscTurnData[0], 'turnStart', '')
                    }
                    if (this.kojiDiscTurnData[0].turnEnd === null) {
                        this.$set(this.kojiDiscTurnData[0], 'turnEnd', '')
                    }

                    if (!this.kojiDiscTurnData[0].id) {
                        this.$set(this.kojiDiscTurnData[0], 'changer', getUserNameNumber())
                        this.$set(this.kojiDiscTurnData[0], 'changed', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'))
                    }

                    this.$set(this.kojiDiscTurnData[1], 'orderNo', this.targetOrderObj.orderNo)
                    this.$set(this.kojiDiscTurnData[1], 'kojiOrderNo', this.targetOrderObj.kojiOrderNo)
                    if (this.kojiDiscTurnData[1].turnStart === null) {
                        this.$set(this.kojiDiscTurnData[1], 'turnStart', '')
                    }
                    if (this.kojiDiscTurnData[1].turnEnd === null) {
                        this.$set(this.kojiDiscTurnData[1], 'turnEnd', '')
                    }
                    if (!this.kojiDiscTurnData[1].id) {
                        this.$set(this.kojiDiscTurnData[1], 'changer', getUserNameNumber())
                        this.$set(this.kojiDiscTurnData[1], 'changed', dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'))
                    }
                }
            })
        }

        // 翻曲开始时间 change
        turnStartTimeChange(val, target) {
            if (val === null) {
                target.turnStart = ''
            }
            this.runCount()
            // if (target.turnStart !== '' && this.kojiGuardData.length !== 0 && Math.min(...timeList) !== Infinity) {
            //     const timeTemp = new Date(val).getTime();
            //     let result = 0
            //     if (this.kojiGuardData.length !== 0) {
            //         const compareTimeList: number[] = []// 时间暂存容器
            //         this.kojiGuardData.forEach(item => {
            //             if (item.guardDate) {
            //                 compareTimeList.push(new Date(item.guardDate).getTime())
            //             }
            //         })
            //         result = Math.min(...compareTimeList)
            //     }
            //     target.turnDuration = (timeTemp - result) / 3600000
            // }
        }

        // 异常情况
        getKojiDiscException() {
            KOJI_API.KOJI_DISC_QUERY_EXCEPTION_API({
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                console.log('异常情况')
                console.log(data)
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
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                console.log('曲料生长情况')
                console.log(data)
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
                kojiOrderNo: this.targetOrderObj.kojiOrderNo
            }).then(({ data }) => {
                this.kojiGuardData = []
                if (data.data) {
                    console.log('看曲情况')
                    console.log(data)
                    this.kojiGuardData = JSON.parse(JSON.stringify(data.data))
                    this.kojiGuardData.forEach(item => {
                        item.delFlag = 0
                    })
                    this.kojiGuardDataOrg = JSON.parse(JSON.stringify(this.kojiGuardData))
                }
            })
        }

        // 看曲时间 change
        kojiStartTimeChange(val, target) {

            // 点击栏位清除扭 vall 变 null
            if (val === null) {
                target.guardDate = ''
            }
            this.runCount();

        }

        runCount() {
            // 将两翻清空，重新计算
            this.kojiDiscTurnData[0].turnDuration = 0
            this.kojiDiscTurnData[1].turnDuration = 0

            const timeList: number[] = [];
            this.kojiGuardData.forEach(item => {
                if (item.guardDate && item.delFlag === 0) {
                    timeList.push(new Date(item.guardDate).getTime())
                }
            })

            console.log('timeList')
            console.log(timeList)

            if (timeList.length !== 0) {
                if (this.kojiDiscTurnData[0] && this.kojiDiscTurnData[0].turnStart !== '' && this.kojiDiscTurnData[0].turnStart !== null) {
                    const timeTemp1 = new Date(this.kojiDiscTurnData[0].turnStart).getTime();
                    let turn1Result = 0
                    turn1Result = Math.min(...timeList)
                    turn1Result = (timeTemp1 - turn1Result) / 3600000
                    this.kojiDiscTurnData[0].turnDuration = turn1Result
                }

                if (this.kojiDiscTurnData[1] && this.kojiDiscTurnData[1].turnStart !== '' && this.kojiDiscTurnData[1].turnStart !== null) {
                    const timeTemp2 = new Date(this.kojiDiscTurnData[1].turnStart).getTime();
                    let turn2Result = 0
                    turn2Result = Math.min(...timeList)
                    turn2Result = (timeTemp2 - turn2Result) / 3600000
                    this.kojiDiscTurnData[1].turnDuration = turn2Result
                }

            }
        }

        // [新增]曲料生长评价
        addNewKojiEvaluateRow() {
            const sole: KojiEvaluate = {
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                exceptionInfo: '',
                growInfo: '',
                id: '',
                kojiOrderNo: this.targetOrderObj.kojiOrderNo,
                kojiStage: '',
                kojiStageName: '',
                orderNo: this.targetOrderObj.orderNo,
                recordDate: '',
                recordMans: '',
                remark: '',
                status: '',
                delFlag: 0
            }
            this.kojiEvaluateData.push(sole);
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
                innerDownTemp: null,
                innerMidTemp: null,
                innerUpTemp: null,
                kojiOrderNo: this.targetOrderObj.kojiOrderNo,
                orderNo: this.targetOrderObj.orderNo,
                outDownTemp: null,
                outMidTemp: null,
                outUpTemp: null,
                prodTemp: null,
                remark: '',
                roomTemp: null,
                settingProdTemp: null,
                settingWindTemp: null,
                status: '',
                testTempOne: null,
                testTempTwo: null,
                windDoor: null,
                windSpeed: null,
                windTemp: null,
                delFlag: 0
            }

            this.kojiGuardData.push(sole);
        }

        ruleSubmit() {
            // 入曲情况
            if (!this.kojiInformData.addKojiMans || !this.kojiInformData.addKojiTemp || !this.kojiInformData.addKojiStart || !this.kojiInformData.addKojiEnd) {
                this.$warningToast('请填写入曲情况必填栏位');
                return false
            }

            for (const item of this.kojiGuardData.filter(it => it.delFlag !== 1)) {
                if (!item.guardDate || !item.windTemp || !item.roomTemp || !item.windSpeed || !item.prodTemp || !item.outUpTemp || !item.outMidTemp || !item.outDownTemp || !item.testTempOne || !item.testTempTwo || !item.windDoor) {
                    this.$warningToast('请填写看曲记录必填项');
                    return false
                }
            }
            for (const item of this.kojiDiscTurnData) {
                if (!item.turnStart || !item.turnEnd || !item.turnMans) {
                    this.$warningToast('请填写翻曲记录必填项');
                    return false
                }
            }
            for (const item of this.kojiEvaluateData) {
                if (!item.kojiStage || !item.recordDate || !item.growInfo || !item.recordMans) {
                    this.$warningToast('请填写曲料生长评价必填项');
                    return false
                }

                if (item.growInfo === 'EXCEPTION' && !item.exceptionInfo) {
                    this.$warningToast('请填写曲料生长评价异常描述');
                    return false
                }
            }


            if (!this.kojiOutCraftformData.outKojiStart || !this.kojiOutCraftformData.outKojiEnd || !this.kojiOutCraftformData.outKojiMans || !this.kojiOutCraftformData.outKojiTemp) {
                this.$warningToast('请填写出曲工艺必填项');
                return false
            }


            return true
        }

        savedData() {
            const discEvaluate: DiscEvaluate = {
                    deleteIds: [], // 曲料生长评价待删除id列表
                    insertList: [], // 曲料生长评价新增列表
                    updateList: [] //曲料生长评价更新列表
            };


            this.kojiEvaluateData.forEach((item: KojiEvaluate, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        discEvaluate.deleteIds.push(item.id)
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.kojiGuardDataOrg[index], item)) {
                        discEvaluate.updateList.push(item)
                    }
                } else {
                    discEvaluate.insertList.push(item)
                }
            })

            const discGuard: DiscGuard = {
                deleteIds: [], // 看曲记录待删除id列表
                insertList: [], // 看曲记录新增列表
                updateList: []// 看曲记录更新列表
            }
            this.kojiGuardData.forEach((item: KojiGuard, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        discGuard.deleteIds.push(item.id)
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.kojiGuardDataOrg[index], item)) {
                        discGuard.updateList.push(item)
                    }
                } else {
                    discGuard.insertList.push(item)
                }
            })

            const discTurn1 = this.kojiDiscTurnData[0]
            const discTurn2 = this.kojiDiscTurnData[1]
            const discIn = this.kojiInformData
            const discOut = this.kojiOutCraftformData
            const discGuardException = this.kojiDiscExceptionInfo.discGuardExceptionInfo
            const discTurnException = this.kojiDiscExceptionInfo.discTurnExceptionInfo
            return {
                discEvaluate,
                discGuard,
                discIn,
                discOut,
                discTurn1,
                discTurn2,
                discGuardException,
                discTurnException
            }
        }

        // 审核日志
        getAudit(formHeader) {
            AUDIT_API.STE_AUDIT_LOG_API({ orderNo: formHeader.orderNo, splitOrderNo: formHeader.kojiOrderNo, verifyType: ['KJ_CONTROL', 'TIMESHEET'] }).then(({ data }) => {
                this.currentAudit = data.data;
            });
        }

        // 处理小数点后两位
        oninput(val, target, prop) {
            // 通过正则过滤小数点后两位
            if (val >= 99.99) {
                this.$errorToast('超过温度限制');
                target[prop] = null
            } else {
                target[prop] = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || null
            }

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
        removeFirstDataRow(row, who) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
                if (who === 'kojiGuardData') {
                    this.runCount()
                }

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
    outKojiDuration?: number;
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
    turnStart: string;
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
    innerDownTemp?: number | null;
    innerMidTemp?: number | null;
    innerUpTemp?: number | null;
    kojiOrderNo?: string;
    orderNo?: string;
    outDownTemp?: number | null;
    outMidTemp?: number | null;
    outUpTemp?: number | null;
    prodTemp?: number | null;
    remark?: string;
    roomTemp?: number | null;
    settingProdTemp?: number | null;
    settingWindTemp?: number | null;
    status?: string;
    testTempOne?: number| null;
    testTempTwo?: number| null;
    windDoor?: number | null;
    windSpeed?: number | null;
    windTemp?: number| null;
    delFlag?: number;
}


interface DiscEvaluate {
    deleteIds: string[];
    insertList: KojiGuard[];
    updateList: KojiGuard[];
}

interface DiscGuard {
    deleteIds: string[];
    insertList: KojiEvaluate[];
    updateList: KojiEvaluate[];
}
</script>

<style scoped>
    .other >>> .el-table__header th {
        outline: 1px #6892f1 solid;
    }


    .markStyle >>> .star .el-form-item__label::before {
        margin-right: 4px;
        color: #f56c6c;
        content: "*";
    }
    .other >>> .el-input__suffix {
        line-height: 32px;
    }


</style>
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

    .like-el-input__inner {
        display: inline-block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        padding: 0 14px;
        color: #606266;
        font-size: 13px;
        line-height: 32px;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        outline: 0;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        -webkit-appearance: none;
    }

    .input-in-form-disabled {
        display: inline-block;
        width: 100%;
        padding: 0 14px;
        overflow: hidden;
        color: #bbb;
        font-weight: 500;
        font-size: 13px;
        background-color: #f5f5f5;
        border: none;
        border-radius: 4px;
    }

    .input-in-table-disabled {
        width: 100%;
        padding: 0 14px;
        overflow: hidden;
        color: #bbb;
        font-weight: 500;
        font-size: 13px;
        background-color: none;
        border: none;
        border-radius: 4px;
    }
</style>
