// Composables
import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
} from "vue-router";
import { auth } from "../firebase/config";

export enum RoutesNames {
  Home = "Home",
  Room = "Room",
  RoomChat = "Chat",
  Login = "Login",
  Signup = "Signup",
}

const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!auth.currentUser) {
    next({ name: "Login" });
  } else {
    next();
  }
};

const requireNoAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (auth.currentUser) {
    next({ name: "Home" });
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Layout.vue"),
    children: [
      {
        path: "",
        name: RoutesNames.Home,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
    ],
    beforeEnter: requireAuth,
  },
  {
    path: "/room/:id",
    component: () => import("@/layouts/default/Layout.vue"),
    children: [
      {
        path: "",
        name: RoutesNames.Room,
        component: () => import("@/views/Room/index.vue"),
      },
    ],
  },
  {
    path: "/room/:id/chat",
    component: () => import("@/layouts/default/Layout.vue"),
    children: [
      {
        path: "",
        name: RoutesNames.RoomChat,
        component: () => import("@/views/Room/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/layouts/login/Layout.vue"),
    children: [
      {
        path: "",
        name: RoutesNames.Login,
        component: () => import("@/views/Login_SignUp/Login.vue"),
      },
    ],
    beforeEnter: requireNoAuth,
  },
  {
    path: "/signup",
    component: () => import("@/layouts/login/Layout.vue"),
    children: [
      {
        path: "",
        name: RoutesNames.Signup,
        component: () => import("@/views/Login_SignUp/Signup.vue"),
      },
    ],
    beforeEnter: requireNoAuth,
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// handle dynamic import errors
router.onError((error, to) => {
  if (
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed")
  ) {
    if (!to?.fullPath) {
      window.location.reload();
    } else {
      // @ts-ignore
      window.location = to.fullPath;
    }
  }
});

export default router;
