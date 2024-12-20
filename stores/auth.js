import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const cookie = useCookie('auth');
  const isLogin = ref(false);

  const login = async ({ email, password }) => {
    try {
      const res = await $fetch('http://localhost:3005/api/v1/user/login', {
        method: 'POST',
        body: { email, password },
      });
      cookie.value = res.token;
      isLogin.value = true;
      await router.push('/');
      window.location.reload();
    } catch (error) {
      console.log(error.response);
    }
  };

  const checkAuth = async () => {
    try {
      if (!cookie.value) {
        isLogin.value = false;
        return;
      }
      const res = await $fetch('http://localhost:3005/api/v1/user/check', {
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      });
      isLogin.value = res.status;
      return res.status;
    } catch (error) {
      console.log('驗證失敗');
      isLogin.value = false;
      // 清除無效cookie
      cookie.value = null;
      router.push('/account/login');
    }
  };

  const getUserData = async () => {
    try {
      const res = await $fetch('http://localhost:3005/api/v1/user', {
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      });
      // console.log(res);
      return res;
    } catch (error) {
      console.log('取得用戶資料失敗');
      return null;
    }
  };

  const logout = async () => {
    try {
      cookie.value = null;
      isLogin.value = false;
      await router.replace('/');
      window.location.reload();
    } catch (error) {
      console.error('登出時發生錯誤:', error);
    }
  };

  return {
    isLogin,
    login,
    checkAuth,
    getUserData,
    logout,
  };
});
