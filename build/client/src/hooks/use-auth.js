import { useQuery } from "@tanstack/react-query";
export function useAuth() {
    var _a = useQuery({
        queryKey: ["/api/auth/current-user"],
        retry: 1,
        refetchOnWindowFocus: false,
    }), user = _a.data, isLoading = _a.isLoading, error = _a.error;
    return {
        user: user,
        isLoading: isLoading,
        isAuthenticated: !!user,
        error: error,
    };
}
