<script setup>
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { useBookingStore } from '@/stores/booking';

const route = useRoute();
// console.log(route.params.id);
const bookingId = route.params.id;
const cookie = useCookie('auth');

const { data: orderData, error: orderError } = await useFetch(`https://freyja-l47x.onrender.com/api/v1/orders/${bookingId}`, {
  headers: {
    Authorization: `Bearer ${cookie.value}`,
  },
});
// console.log('orderData: ', orderData.value.result);

const bookingStore = useBookingStore();
const { preOrderDays, totalPrice } = storeToRefs(bookingStore);
</script>

<template>
  <main class="overflow-hidden pt-18 pt-md-30 bg-neutral-120">
    <div class="container py-10 py-md-30">
      <div class="row gap-15 gap-md-0">
        <div class="col-12 col-md-7">
          <div class="d-flex flex-column flex-md-row align-items-md-center gap-4 gap-md-10 mb-8 mb-md-10">
            <Icon class="p-2 display-4 text-neutral-0 bg-success-100 rounded-circle" icon="material-symbols:check" />
            <div class="text-neutral-0 fs-1">
              <h1 class="fw-bold">恭喜，{{ orderData.result.userInfo.name }}！</h1>
              <p class="mb-0 fw-bold">您已預訂成功</p>
            </div>
          </div>
          <p class="text-neutral-40 fw-medium">我們已發送訂房資訊及詳細內容至你的電子信箱，入住時需向櫃檯人員出示訂房人證件。</p>

          <hr class="my-10 my-md-20 opacity-100 text-neutral-40" />

          <div class="d-flex flex-column align-items-md-start">
            <h2 class="mb-6 mb-md-10 text-neutral-0 fs-7 fs-md-5 fw-bold">立即查看您的訂單紀錄</h2>
            <NuxtLink :to="`/user/${orderData.result.orderUserId}/order`" class="btn btn-primary-100 px-md-15 py-4 text-neutral-0 fw-bold border-0 rounded-3"
              >前往我的訂單</NuxtLink
            >
          </div>

          <hr class="my-10 my-md-20 opacity-100 text-neutral-40" />

          <h2 class="mb-6 mb-md-10 text-neutral-0 fs-5 fw-bold">訂房人資訊</h2>
          <div class="d-flex flex-column gap-6">
            <div>
              <p class="mb-2 text-neutral-40 fw-medium">姓名</p>
              <span class="text-neutral-0 fw-bold">{{ orderData.result.userInfo.name }}</span>
            </div>
            <div>
              <p class="mb-2 text-neutral-40 fw-medium">手機號碼</p>
              <span class="text-neutral-0 fw-bold"><!-- +886 912 345 678 -->{{ orderData.result.userInfo.phone }}</span>
            </div>
            <div>
              <p class="mb-2 text-neutral-40 fw-medium">電子信箱</p>
              <span class="text-neutral-0 fw-bold">{{ orderData.result.userInfo.email }}</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5">
          <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 mx-auto ms-md-auto bg-neutral-0" style="max-width: 478px">
            <div>
              <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">預訂參考編號： {{ orderData.result._id }}</p>
              <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">即將來的行程</h2>
            </div>

            <img class="img-fluid rounded-3" :src="orderData.result.roomId.imageUrl" alt="room-a" />

            <section class="d-flex flex-column gap-6">
              <h3 class="d-flex align-items-center mb-6 text-neutral-80 fs-8 fs-md-6 fw-bold">
                <p class="mb-0">{{ orderData.result.roomId.name }}，{{ preOrderDays }} 晚</p>
                <span class="d-inline-block mx-4 bg-neutral-80" style="width: 1px; height: 18px" />
                <p class="mb-0">住宿人數：2 位</p>
              </h3>

              <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
                <p class="mb-2">
                  入住：<br /><span v-dateformat="orderData.result.checkInDate"></span>
                  <!-- 6 月 10 日星期二 -->，15:00 可入住
                </p>
                <p class="mb-0">
                  退房：<br /><span v-dateformat="orderData.result.checkOutDate"></span
                  ><!-- 6 月 11 日星期三 -->，12:00 前退房
                </p>
              </div>

              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">NT$ {{ totalPrice.toLocaleString() }}</p>
            </section>

            <hr class="my-0 opacity-100 text-neutral-40" />

            <section>
              <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-8 fs-md-7 fw-bold">房內設備</h3>
              <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
                <li class="flex-item d-flex gap-2" v-for="item in orderData.result.roomId.facilityInfo" :key="item">
                  <Icon class="fs-5 text-primary-100" icon="material-symbols:check" />
                  <p class="mb-0 text-neutral-80 fw-bold">{{ item.title }}</p>
                </li>
              </ul>
            </section>

            <section>
              <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-8 fs-md-7 fw-bold">備品提供</h3>
              <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
                <li class="flex-item d-flex gap-2" v-for="item in orderData.result.roomId.amenityInfo" :key="item">
                  <Icon class="fs-5 text-primary-100" icon="material-symbols:check" />
                  <p class="mb-0 text-neutral-80 fw-bold">{{ item.title }}</p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
    <picture>
      <source srcset="@/assets/images/deco-line-group-horizontal-full.svg" media="(min-width:576px)" />
      <img class="w-100" src="@/assets/images/deco-line-group-horizontal-sm.svg" alt="deco-line-group" />
    </picture>
  </main>
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
  flex: 1 1 25%;
  white-space: nowrap;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}
</style>
