<script setup>
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
const { isLogin } = storeToRefs(auth);
await auth.checkAuth();

import { useOrdersStore } from '@/stores/orders';
const ordersStore = useOrdersStore();
await ordersStore.fetchOrders();
const { orderList, historyOrders } = storeToRefs(ordersStore);
const { countDays, getTotalPrice, cancelOrder } = ordersStore;
// console.log(orderList.value);

const lastOrder = ref({});
const getCountDays = ref(0);
if (orderList.value.length > 0) {
  lastOrder.value = orderList.value[orderList.value.length - 1];
  getCountDays.value = countDays(lastOrder.value.checkInDate, lastOrder.value.checkOutDate);
}

const { $bsModal } = useNuxtApp();
let cancelModal = ref(null);
onMounted(() => {
  cancelModal.value = new $bsModal(document.getElementById('cancelModal'));
});
const sendCancelOrder = async (id) => {
  try {
    await cancelOrder(id);
    cancelModal.value.hide();
    await ordersStore.fetchOrders();
    lastOrder.value = orderList.value[orderList.value.length - 1];
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div>
    <div v-if="isLogin && orderList.length > 0" class="row gap-6 gap-md-0">
      <div class="col-12 col-md-7">
        <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0" style="max-width: 730px">
          <div>
            <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">預訂參考編號： {{ lastOrder._id }}</p>
            <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">即將來的行程</h2>
          </div>

          <img class="img-fluid rounded-3" :src="lastOrder.roomId.imageUrl" :alt="lastOrder.roomId.name" />

          <section class="d-flex flex-column gap-6">
            <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
              <p class="mb-0">{{ lastOrder.roomId.name }}，{{ getCountDays }} 晚</p>
              <span class="d-inline-block mx-4 bg-neutral-80" style="width: 1px; height: 18px" />
              <p class="mb-0">住宿人數：{{ lastOrder.peopleNum }} 位</p>
            </h3>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
              <p class="title-deco mb-2">
                入住：<span v-dateformat="lastOrder.checkInDate"></span
                ><!-- 6 月 10 日星期二 -->，15:00 可入住
              </p>
              <p class="title-deco mb-0">
                退房：<span v-dateformat="lastOrder.checkOutDate"></span
                ><!-- 6 月 11 日星期三 -->，12:00 前退房
              </p>
            </div>

            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
              NT$ {{ getTotalPrice(lastOrder.roomId.price, countDays(lastOrder.checkInDate, lastOrder.checkOutDate)).toLocaleString() }}
            </p>
          </section>

          <hr class="my-0 opacity-100 text-neutral-40" />

          <section>
            <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">房內設備</h3>
            <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
              <li class="flex-item d-flex gap-2" v-for="item in lastOrder.roomId.facilityInfo" :key="item">
                <Icon class="fs-5 text-primary-100" icon="material-symbols:check" />
                <p class="mb-0 text-neutral-80 fw-bold">{{ item.title }}</p>
              </li>
            </ul>
          </section>

          <section>
            <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">備品提供</h3>
            <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
              <li class="flex-item d-flex gap-2" v-for="item in lastOrder.roomId.amenityInfo" :key="item">
                <Icon class="fs-5 text-primary-100" icon="material-symbols:check" />
                <p class="mb-0 text-neutral-80 fw-bold">{{ item.title }}</p>
              </li>
            </ul>
          </section>

          <div class="d-flex gap-4">
            <button data-bs-toggle="modal" data-bs-target="#cancelModal" class="btn btn-outline-primary-100 w-50 py-4 fw-bold" style="--bs-btn-hover-color: #fff" type="button">
              取消預訂
            </button>
            <NuxtLink :to="`/rooms/${lastOrder.roomId._id}`" class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold" type="button"> 查看詳情 </NuxtLink>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-5">
        <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0">
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>

          <div v-for="(order, index) in historyOrders" :key="order._id">
            <div class="d-flex flex-column flex-lg-row gap-6">
              <img class="img-fluid object-fit-cover rounded-3" style="max-width: 120px; height: 80px" :src="order.roomId.imageUrl" :alt="order.roomId.name" />
              <section class="d-flex flex-column gap-4">
                <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">預訂參考編號： {{ order._id }}</p>

                <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
                  {{ order.roomId.name
                  }}<!-- 尊爵雙人房 -->
                </h3>

                <div class="text-neutral-80 fw-medium">
                  <p class="mb-2">住宿天數： {{ countDays(order.checkInDate, order.checkOutDate) }} 晚</p>
                  <p class="mb-0">住宿人數：{{ order.peopleNum }} 位</p>
                </div>

                <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                  <p class="mb-2">
                    入住：<br /><span v-dateformat="order.checkInDate"></span
                    ><!-- 6 月 10 日星期二 -->，<br />15:00 可入住
                  </p>
                  <p class="mb-0">
                    退房：<br /><span v-dateformat="order.checkOutDate"></span
                    ><!-- 6 月 11 日星期三 -->，<br />12:00 前退房
                  </p>
                </div>
                <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                  NT$ {{ getTotalPrice(order.roomId.price, countDays(order.checkInDate, order.checkOutDate)).toLocaleString() }}
                </p>
              </section>
            </div>
            <hr v-if="index !== historyOrders.length - 1" class="mt-10 w-100 opacity-100 text-neutral-40" />
          </div>

          <button class="btn btn-outline-primary-100 py-4 fw-bold" style="--bs-btn-hover-color: #fff" type="button">查看更多</button>
        </div>
      </div>
    </div>
    <div v-else class="px-8"><p class="text-white">您目前還沒有任何訂單</p></div>

    <div id="cancelModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold">確定要取消此房型的預訂嗎？</div>
          <div class="modal-footer d-flex gap-4">
            <button type="button" class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold" style="--bs-btn-hover-color: #fff" data-bs-dismiss="modal">關閉視窗</button>
            <button @click="sendCancelOrder(lastOrder._id)" type="button" class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold">確定取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/mixins/breakpoints';

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #bf9d7d;
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
