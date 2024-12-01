<script setup>
// import { RouterLink, RouterView } from 'vue-router';
import { Icon } from '@iconify/vue';

// import 'bootstrap/js/dist/collapse';
const { $bsCollapse } = useNuxtApp();
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

        <div class="position-relative w-100 w-md-auto">
          <!-- <RouterView /> -->
          <NuxtPage />
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

.logo {
  max-width: 27vw;
}

.w-md-auto {
  @include media-breakpoint-up(md) {
    width: auto !important;
  }
}

@include media-breakpoint-down(md) {
  header {
    max-height: 72px;
  }
}

@include media-breakpoint-down(md) {
  .navbar-toggler {
    z-index: 1;
    visibility: hidden;

    svg {
      transition: opacity 0.3s;
    }

    svg:nth-child(1) {
      position: absolute;
      top: 28px;
      right: 28px;
      opacity: 1;
      visibility: visible;
    }
    svg:nth-child(2) {
      opacity: 0;
      visibility: hidden;
    }
  }
  .navbar-toggler.collapsed {
    svg:nth-child(1) {
      opacity: 0;
      visibility: hidden;
    }
    svg:nth-child(2) {
      opacity: 1;
      visibility: visible;
    }
  }

  .navbar-collapse {
    min-height: 100vh;
    background-color: #140f0a;
    position: fixed;
    inset: 0;
    opacity: 0;
    overflow: hidden;
    transition: opacity 0.05s;
  }
  .navbar-collapse.show {
    opacity: 1;
  }
  .navbar-nav {
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;

    a {
      width: 90vw;
    }
  }
}

.deco-line-group {
  position: absolute;
  top: 192px;
  right: 0;

  @include media-breakpoint-down(md) {
    position: static;
    width: 100%;
  }
}
</style>
