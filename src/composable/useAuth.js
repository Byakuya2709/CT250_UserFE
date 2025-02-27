import { useAuthStore } from "../stores/pina";
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export function useAuth() {
    const authStore = useAuthStore();
    const router = useRouter();
  
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isAdmin = computed(() => authStore.isAdmin);
    const user = computed(() => authStore.user);
  
    const logout = async () => {
      try {
        await authStore.logout();
        router.push('/login').then(() => {
          window.location.reload(); // Reload after redirecting to login
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
  
    return {
      isAuthenticated,
      user,
      isAdmin,
      logout,
    };
}
