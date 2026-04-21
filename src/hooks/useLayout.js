import { useEffect } from "react";

/**
 * useLayout - Ensures the layout shell (sidebar, navbar, etc.) renders instantly.
 * Can be used to trigger layout-specific effects or analytics.
 * Returns nothing, but can be extended for layout-level logic.
 */
export function useLayout() {
  useEffect(() => {
    // Example: log layout mount or trigger analytics
    // console.log("Layout mounted");
    // Add any layout-specific logic here
  }, []);
}
