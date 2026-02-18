
import { createRouter, createWebHistory } from 'vue-router'
import NamazView from '../views/NamazView.vue'
import TrendingView from '../views/TrendingView.vue'
import AddPostView from '../views/AddPostView.vue'
import SettingsView from '../views/SettingsView.vue'
import MasjidDetailView from '../views/MasjidDetailView.vue'
import SeeAllMasjidsView from '../views/SeeAllMasjidsView.vue'
import AddMasjidView from '../views/AddMasjidView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'namaz',
            component: NamazView
        },
        {
            path: '/trending',
            name: 'trending',
            component: TrendingView
        },
        {
            path: '/add-post',
            name: 'add-post',
            component: AddPostView
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsView
        },
        {
            path: '/masjid/:id',
            name: 'masjid-detail',
            component: MasjidDetailView,
            props: true
        },
        {
            path: '/masjids',
            name: 'see-all-masjids',
            component: SeeAllMasjidsView
        },
        {
            path: '/add-masjid',
            name: 'add-masjid',
            component: AddMasjidView
        }
    ]
})

export default router
