import dayjs from 'dayjs';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('timeformat', {
    mounted(el, biding) {
      // biding 被傳入的時候會自動被多包裝一層, 因此取值時要用 biding.value
      const time = dayjs(biding.value).format('YYYY年MM月DD日'); // 轉換的格式可以改變
      el.innerHTML = time;
    },
    updated(el, binding) {
      const time = dayjs(binding.value).format('YYYY年MM月DD日');
      el.innerHTML = time;
    },
  });

  nuxtApp.vueApp.directive('dateformat', {
    mounted(el, biding) {
      const date = dayjs(biding.value).format('YYYY 年 MM 月 DD 日 dddd');
      el.innerHTML = date;
    },
    updated(el, binding) {
      const date = dayjs(binding.value).format('YYYY 年 MM 月 DD 日 dddd');
      el.innerHTML = date;
    },
  });
});
