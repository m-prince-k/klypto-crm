import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMetadata = {
  "/": {
    title: "Dashboard | Klypto CRM",
    description: "Overview of your CRM activities, metrics, and recent leads.",
  },
  "/leads": {
    title: "Leads Management | Klypto CRM",
    description: "Manage and track your business leads effectively.",
  },
  "/erp": {
    title: "ERP Enterprise | Klypto CRM",
    description: "Comprehensive Enterprise Resource Planning dashboard.",
  },
  "/recruitment": {
    title: "Recruitment & Assessment | Klypto CRM",
    description: "Hiring process, candidate assessment, and recruitment tracking.",
  },
  "/grievances": {
    title: "Grievance Management | Klypto CRM",
    description: "Handle employee and client grievances systematically.",
  },
  "/payroll": {
    title: "Payroll Management | Klypto CRM",
    description: "Manage employee salaries, taxes, and payroll history.",
  },
  "/hrms": {
    title: "HR Management | Klypto CRM",
    description: "Human Resource Management System for staff and operations.",
  },
  "/leave": {
    title: "Leave Management | Klypto CRM",
    description: "Track employee leave requests and attendance.",
  },
  "/settings": {
    title: "Settings | Klypto CRM",
    description: "Configure your application preferences and account settings.",
  },
};

export const usePageSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = pageMetadata[location.pathname] || {
      title: "Klypto CRM | Advanced Open Source CRM",
      description: "Manage your business operations with Klypto CRM.",
    };

    document.title = meta.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", meta.description);
    }
  }, [location]);
};
