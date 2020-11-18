<template>
    <div class="header_main">
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_tips">
                        <em class="el-icon-info" />
                        <span>生管审核</span>
                    </div>
                    <div class="redact_btn">
                        <el-button type="primary" size="small" @click="goDetail">
                            编辑
                        </el-button>
                        <el-button type="primary" size="small" @click="goDetail">
                            保存
                        </el-button>
                        <el-button type="primary" size="small" @click="pass()">
                            提交
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class ApplyDetail extends Vue {
        get sidebarFold() {
            return this.$store.state.common.sidebarFold;
        }
    }
</script>

<style scoped>

</style>
