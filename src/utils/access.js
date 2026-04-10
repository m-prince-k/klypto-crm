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
    key: "pipeline",
    label: "Pipeline",
    route: "/pipeline",
    description: "Sales pipeline",
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
];

export const DEFAULT_ROLE_MODULES = {
  SUPER_ADMIN: DASHBOARD_MODULES.map((module) => module.key),
  ADMIN: [
    "dashboard",
    "leads",
    "pipeline",
    "erp",
    "recruitment",
    "grievances",
    "payroll",
    "hrms",
    "leave",
    "settings",
  ],
  MANAGER: [
    "dashboard",
    "leads",
    "pipeline",
    "recruitment",
    "grievances",
    "leave",
    "settings",
  ],
  HR: ["dashboard", "hrms", "employees", "leave", "settings"],
  EMPLOYEE: ["dashboard", "hrms", "leave", "settings"],
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
