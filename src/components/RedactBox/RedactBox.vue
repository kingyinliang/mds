<template>
    <div class="redactBox">
        <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
            <div class="redact clearfix">
                <div class="redact_btn">
                    <slot name="button" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class RedactBox extends Vue {
    get sidebarFold() {
        return this.$store.state.common.sidebarFold;
    }
}
</script>

<style scoped></style>
