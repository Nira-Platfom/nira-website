import { useAuth } from "@/contexts/AuthContext";

export function usePermissions() {
  const { role, permissions } = useAuth();

  return {
    can: (permission: string) => permissions.includes(permission),
    isOwner: () => role === "owner",
    isAdmin: () => role === "admin",
    isStaff: () => role === "staff",
  };
}
