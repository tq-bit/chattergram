import { validate } from 'vee-validate';
import {
  createRouter,
  createWebHistory,
  RouterOptions,
  NavigationGuardWithThis,
  RouteLocationNormalized,
} from 'vue-router';
import Home from './pages/Home.vue';
import useSession from './store/session';

const { logout, validateLocalUserState } = useSession();
export interface AppNavigationItem {
  name: string;
  requiresLogin: boolean;
  isInternalPath: boolean;
  path?: string;
  fn?: Function;
}

const verifyUserState = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: any,
) => {
  const [response, error] = await validateLocalUserState();
  if (error) {
    next('/login');
  } else {
    next();
  }
};

export const navigation: AppNavigationItem[] = [
  {
    path: '/',
    name: 'Home',
    requiresLogin: false,
    isInternalPath: true,
  },
  {
    path: '/login',
    name: 'Login',
    requiresLogin: false,
    isInternalPath: true,
  },
  {
    path: '/signup',
    name: 'Signup',
    requiresLogin: false,
    isInternalPath: true,
  },
  {
    path: '/chat',
    name: 'Chat',
    requiresLogin: true,
    isInternalPath: true,
  },
  {
    path: '/profile',
    name: 'Profile',
    requiresLogin: true,
    isInternalPath: true,
  },
  {
    path: '/about',
    name: 'About',
    requiresLogin: false,
    isInternalPath: true,
  },
  {
    name: 'Logout',
    requiresLogin: true,
    isInternalPath: false,
    fn: logout,
  },
];

export const routes: RouterOptions['routes'] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/login',
    component: () => import('./pages/Login.vue'),
  },
  {
    path: '/signup',
    component: () => import('./pages/Signup.vue'),
  },
  {
    path: '/chat',
    component: () => import('./pages/Chat.vue'),
    beforeEnter: verifyUserState,
  },

  {
    path: '/profile',
    component: () => import('./pages/Profile.vue'),
  },

  {
    path: '/about',
    component: () => import('./pages/About.vue'),
  },
  {
    path: '/*',
    component: () => import('./pages/Error.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
