import { defineStore } from 'pinia';

export const useSignupStore = defineStore('signup', () => {
  const router = useRouter();

  const sendSignup = async (signupData) => {
    try {
      const res = await $fetch('http://localhost:3005/api/v1/user/signup', {
        method: 'POST',
        body: signupData,
      });

      console.log(res);
      // console.log(res.token);
      router.replace('/');
    } catch (error) {
      console.log(error.response);
    }
  };

  return {
    sendSignup,
  };
});
