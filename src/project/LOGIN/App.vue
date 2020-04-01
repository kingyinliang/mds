<template>
    <div id="app">
        <login />
        <div>
            <ul>
                <li>
                    <a href="/MDS">MDS</a>
                </li>
                <li>
                    <a href="/DFMDS">DF-MDS</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Login from './login.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {
        Login
    }
})
export default class Index extends Vue {}
</script>

<style lang="scss">
    html,body{
        margin: 0;
    }
    html,body,#app{
        width: 100%;
        height: 100%;
    }
</style>
