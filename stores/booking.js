import { defineStore } from 'pinia';

export const useBookingStore = defineStore('booking', () => {
  const cookie = useCookie('auth');

  /* const preOrderData = ref({
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    peopleNum: '1',
    userInfo: {
      address: {
        zipcode: '',
        detail: '',
      },
      name: '',
      phone: '',
      email: '',
    },
  }); */
  const preOrderData = ref({});
  const getOrderData = (data) => {
    preOrderData.value = data;
    console.log(preOrderData.value);
  };

  const preOrderDays = ref(0);
  const setPreOrderDays = (days) => {
    preOrderDays.value = days;
  };

  const roomPrice = ref(0);
  const setRoomPrice = (price) => {
    roomPrice.value = price;
  };

  const totalPrice = ref(0);

  const bookingId = ref('');
  const sendOrder = async (orderData) => {
    try {
      const token = cookie.value;
      if (!token) {
        throw new Error('請先登入會員');
      }
      // console.log(token);

      const res = await $fetch('https://freyja-l47x.onrender.com/api/v1/orders', {
        method: 'POST',
        body: orderData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res) {
        throw new Error('訂單建立失敗');
      } else {
        bookingId.value = res.result._id;
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return {
    preOrderData,
    getOrderData,
    setPreOrderDays,
    preOrderDays,
    roomPrice,
    totalPrice,
    setRoomPrice,
    sendOrder,
    bookingId,
  };
});
