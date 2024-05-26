import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue"
import cookies from 'vue-cookies'
import axios from "axios";
import {baseApiUrl} from "../../config.js";

const title = 'Sales Invoices'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {
                title: title + ' | Home',
                auth: true
            }
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
            meta: {
                title: title + ' | About',
                auth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {
                title: title + ' | Login',
                afterLogin: '/'
            }
        },
        {
            path: '/invoices',
            name: 'invoices',
            component: () => import('../views/InvoicesView.vue'),
            meta: {
                title: title + ' | Invoices',
                auth: true
            }
        },
        {
            path: '/invoices/create',
            name: 'invoices-create',
            component: () => import('../views/InvoiceCreateView.vue'),
            meta: {
                title: title + ' | Create Invoice',
                auth: true
            }
        },
        {
            path: '/invoices/:invoiceId',
            name: 'invoices-details',
            component: () => import('../views/InvoiceDetailsView.vue'),
            meta: {
                title: title + ' | Details',
                auth: true
            }
        },
        {
            path: '/customers',
            name: 'customers',
            component: () => import('../views/CustomerView.vue'),
            meta: {
                title: title + ' | Inventory',
                auth: true
            }
        },
        {
            path: '/inventory',
            name: 'inventory',
            component: () => import('../views/InventoryView.vue'),
            meta: {
                title: title + ' | Inventory',
                auth: true
            }
        },

        // This route is a catch-all for any other route that doesn't exist
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../views/NotFoundView.vue'),
            meta: {
                title: title + ' | Not Found'
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    let title = to.meta.title
    if (title) {
        document.title = to.meta.title
    }

    // check if the route requires authentication and the user is not logged in
    if (to.meta.auth) {
        const token = cookies.get('token')
        if (!token) {
            next('/login');
            return;
        } else {
            // get dashboard data using axios
            axios.get(`${baseApiUrl}dashboard`, {
                headers: {'Authorization': 'Bearer ' + token}
            }).catch(() => cookies.remove('token'))

        }
    }

    // if access /login and user is already logged in, redirect to home
    if (to.name === 'login' && cookies.get('token')) {
        next('/')
        return
    }
    next()
})

export default router
