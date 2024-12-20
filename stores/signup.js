import { defineStore } from 'pinia';

export const useSignupStore = defineStore('signup', () => {
  const router = useRouter();

  const sendSignup = async (signupData) => {
    try {
      const res = await $fetch('https://freyja-l47x.onrender.com/api/v1/user/signup', {
        method: 'POST',
        body: signupData,
      });

      // console.log(res);
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
