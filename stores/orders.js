import { defineStore } from 'pinia';

export const useOrdersStore = defineStore('orders', () => {
  // const currentOrders = ref([]);
  // const historicalOrders = ref([]);

  const orderList = ref([]);
  const historyOrders = ref([]);
  const cookie = useCookie('auth');

  const fetchOrders = async () => {
    try {
      const { data: orderData, error: orderError } = await useFetch('https://freyja-l47x.onrender.com/api/v1/orders/', {
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      });
      orderList.value = orderData.value?.result?.filter((order) => order.status === 0) || [];
      historyOrders.value = orderList.value.slice(0, orderList.value.length - 1);
    } catch (error) {
      console.log(error.response);
    }
  };

  const countDays = (checkInDate, checkOutDate) => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalPrice = (price, days) => {
    return price * days;
  };

  const cancelOrder = async (orderId) => {
    try {
      const { data: cancelData, error: cancelError } = await useFetch(`https://freyja-l47x.onrender.com/api/v1/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      });
      // console.log(cancelData.value);
      return cancelData;
    } catch (error) {
      console.log(error.response);
    }
  };

  // const orderCount = computed(() => currentOrders.value.length + historicalOrders.value.length);

  return {
    // currentOrders,
    // historicalOrders,
    orderList,
    historyOrders,
    fetchOrders,
    countDays,
    getTotalPrice,
    cancelOrder,
    // orderCount,
  };
});
