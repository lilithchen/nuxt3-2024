<script setup>
/* 
  [...slug].vue 讓找不到 route 路徑時, 都進入這個動態網址
  但使用此方式時, 不要在 pages 下建立其他動態路由, [...slug].vue 可能會搶走其他動態路由的優先權
*/
const route = useRoute();
const event = useRequestEvent();
setResponseStatus(event, 400);
</script>

<template>
  <div class="min-vh-100 bg-neutral-120">
    <div class="position-relative d-flex flex-column flex-md-row">
      <img class="d-none d-md-block position-relative z-1 min-vh-100 object-fit-cover" style="max-width: 50%" src="@/assets/images/login-hero.png" alt="login-hero" />

      <div class="d-flex flex-column justify-content-center align-items-center flex-grow-1 pt-18 pt-md-0">
        <picture class="w-100">
          <source srcset="@/assets/images/deco-line-group-horizontal.svg" media="(min-width: 576px)" />
          <img class="deco-line-group" src="@/assets/images/deco-line-group-horizontal-sm.svg" alt="deco-line-group" />
        </picture>

        <div class="position-relative w-100 w-md-auto text-neutral-0 px-10">
          <h1>404 Not Found</h1>
          <p>Page: {{ route.params.slug }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
