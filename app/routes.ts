import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard/overview.tsx"),
    route("test-creation", "routes/dashboard/test-creation.tsx"),
    route("test-creation/questions", "routes/dashboard/add-questions.tsx"),
  ]),
] satisfies RouteConfig;
