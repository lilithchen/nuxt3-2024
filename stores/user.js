import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore();
  const cookie = useCookie('auth');

  // 台灣郵遞區號對照表
  const zipCodeList = {
    116: { city: '臺北市', county: '文山區' },
    800: { city: '高雄市', county: '新興區' },
    801: { city: '高雄市', county: '前金區' },
    802: { city: '高雄市', county: '苓雅區' },
  };

  const userInfo = ref({});

  const getUserInfo = async () => {
    try {
      const res = await $fetch('https://freyja-l47x.onrender.com/api/v1/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookie.value}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log(res);
      // console.log(res.result);
      userInfo.value = res.result;
      // console.log(userInfo.value);
      return res.result;
    } catch (error) {
      console.log(error.response);
    }
  };

  // 由郵遞區號取得縣市資訊
  const getAddressFromZipcode = (zipcode) => {
    return zipCodeList[zipcode] || { city: '', county: '' };
  };

  // 取得用戶縣市
  const getUserCounty = computed(() => {
    const zipcode = userInfo.value?.address?.zipcode;
    return getAddressFromZipcode(zipcode).county || '';
  });

  const getUserCity = computed(() => {
    const zipcode = userInfo.value?.address?.zipcode;
    return getAddressFromZipcode(zipcode).city || '';
  });

  // 縣市資訊反推郵遞區號
  const setUserZipcode = (city, county) => {
    for (const [zipcode, { city: cityValue, county: countyValue }] of Object.entries(zipCodeList)) {
      if (city === cityValue && county === countyValue) {
        return zipcode;
      }
    }
  };

  // 取得完整地址
  const getFullAddress = computed(() => {
    const { zipcode, detail } = userInfo.value?.address || {};
    const { city, county } = getAddressFromZipcode(zipcode);
    return zipcode ? `${city}${county}${detail}` : '';
  });

  // 送出修改資料
  const passwordError = ref({
    message: '',
    status: '',
  });

  const updateProfile = async (userData) => {
    // console.log(userData);

    try {
      const res = await $fetch('https://freyja-l47x.onrender.com/api/v1/user', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${cookie.value}` },
        body: userData,
      });

      userInfo.value = res.result;

      return { success: true, data: res };
    } catch (error) {
      console.log(error.response?._data?.message);
      return {
        success: false,
        error: error.response?._data?.message,
      };
    }
  };

  const setUserInfo = (data) => {
    userInfo.value = data;
    // console.log(userInfo.value);
  };

  return {
    userInfo,
    getUserInfo,
    getUserCounty,
    getUserCity,
    getFullAddress,
    setUserInfo,
    getAddressFromZipcode,
    updateProfile,
    passwordError,
    setUserZipcode,
  };
});
