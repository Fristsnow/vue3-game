import {createRouter, createWebHistory} from 'vue-router'
import Index from '../views/Index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Index
        },
        {
            path: '/editor-map',
            name: 'editor-map',
            component: () => import('../views/EditorMap.vue')
        },
        {
            path: '/plot-content',
            name: 'plot-content',
            component: () => import('../views/PlotContent.vue')
        }
    ]
})

export default router
