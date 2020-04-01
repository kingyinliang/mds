import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('src/layout/main/main.vue'),
        children: [
            {
                path: '/OrgStructure',
                name: 'OrgStructure',
                component: () => import('common/pages/OrgStructure/index.vue'),
                meta: {
                    menuId: 1,
                    title: '组织架构',
                    isTab: true
                }
            }
        ]
    }
]

const router = new VueRouter({
    // mode: 'history',
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
