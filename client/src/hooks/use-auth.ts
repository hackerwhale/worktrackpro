import { useQuery } from "@tanstack/react-query";

// Define a User interface here if you don't have a shared type
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  // Add other fields as needed
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/current-user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/current-user", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
