export const DASHBOARD_MODULES = [
  {
    key: "dashboard",
    label: "Dashboard",
    route: "/",
    description: "Executive summary",
  },
  {
    key: "leads",
    label: "Leads",
    route: "/leads",
    description: "Lead management",
  },
  {
    key: "erp",
    label: "ERP Portal",
    route: "/erp",
    description: "ERP workflows",
  },
  {
    key: "recruitment",
    label: "Recruitment",
    route: "/recruitment",
    description: "Hiring workflows",
  },
  {
    key: "grievances",
    label: "Grievances",
    route: "/grievances",
    description: "Employee grievances",
  },
  {
    key: "payroll",
    label: "Payroll",
    route: "/payroll",
    description: "Compensation and payroll",
  },
  { key: "hrms", label: "HRMS", route: "/hrms", description: "HR operations" },
  {
    key: "employees",
    label: "Employees",
    route: "/employees",
    description: "Employee master",
  },
  {
    key: "leave",
    label: "Leave",
    route: "/leave",
    description: "Leave management",
  },
  {
    key: "settings",
    label: "Settings",
    route: "/settings",
    description: "Profile and preferences",
  },
  {
    key: "roles-access",
    label: "Roles & Access",
    route: "/roles-access",
    description: "Role administration",
  },
  {
    key: "users",
    label: "User Management",
    route: "/users",
    description: "Provision employee accounts",
  },
];

export const DEFAULT_ROLE_MODULES = {
  SUPER_ADMIN: DASHBOARD_MODULES.map((module) => module.key),
  ADMIN: [
    "dashboard",
    "leads",
    "erp",
    "recruitment",
    "grievances",
    "payroll",
    "hrms",
    "leave",
    "settings",
    "users",
  ],
  MANAGER: [
    "dashboard",
    "leads",
    "erp",
    "recruitment",
    "grievances",
    "leave",
    "settings",
  ],
  HR: [
    "dashboard",
    "erp",
    "hrms",
    "employees",
    "leave",
    "payroll",
    "users",
    "settings",
  ],
  EMPLOYEE: ["dashboard", "employees", "leave", "grievances", "settings"],
};

export const getModuleLabel = (moduleKey) =>
  DASHBOARD_MODULES.find((module) => module.key === moduleKey)?.label ||
  moduleKey;

export const getModuleRoute = (moduleKey) =>
  DASHBOARD_MODULES.find((module) => module.key === moduleKey)?.route || "/";

export const normalizeModules = (modules = []) => [
  ...new Set(modules.map((module) => String(module).trim()).filter(Boolean)),
];

export const hasModuleAccess = (access, moduleKey) => {
  if (!access) return false;
  if (access.isSuperAdmin) return true;
  const modules = normalizeModules(access.dashboardModules || []);
  return modules.includes(moduleKey);
};

export const getAccessibleModules = (access) => {
  if (!access) return [];
  if (access.isSuperAdmin) return DASHBOARD_MODULES.map((module) => module.key);
  return normalizeModules(access.dashboardModules || []);
};

export const getDefaultModulesForRole = (roleName) =>
  DEFAULT_ROLE_MODULES[String(roleName || "").toUpperCase()] || ["dashboard"];
