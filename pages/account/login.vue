<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const { $bsModal } = useNuxtApp();
let forgotModal = ref(null);
onMounted(() => {
  forgotModal.value = new $bsModal(document.getElementById('forgotPwModal'));
});

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const user = ref({
  email: '',
  password: '',
  code: '',
  newPassword: '',
});

const sendLogin = async () => {
  const { email, password } = user.value;
  if (!email || !password) {
    alert('請填寫完整資料');
    return;
  }

  await authStore.login({
    email,
    password,
  });
};

const showForgotPwCode = ref(false);
const forgotPw = () => {
  const { email } = user.value;
  console.log(email);

  if (!email) {
    alert('請輸入信箱');
    return;
  } else {
    authStore.generateCode({ email });
    showForgotPwCode.value = true;
  }
};
const clearData = () => {
  user.value.email = '';
  user.value.password = '';
  user.value.code = '';
  user.value.newPassword = '';
  showForgotPwCode.value = false;
};
const sendNewPassword = () => {
  // newPassword 需包含至少 8 個字元
  if (user.value.newPassword.length < 8) {
    alert('新密碼需包含至少 8 個字元');
    return;
  }

  const { email, code, newPassword } = user.value;
  authStore.setNewPassword({ email, code, newPassword });
  forgotModal.value.hide();
};
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">享樂酒店，誠摯歡迎</p>
      <h1 class="text-neutral-0 fw-bold">立即開始旅程</h1>
    </div>

    <form class="mb-10">
      <div class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="email"> 電子信箱 </label>
        <input id="email" class="form-control p-4 text-neutral-100 fw-medium border-neutral-40" placeholder="請輸入信箱" type="email" v-model="user.email" />
      </div>
      <div class="mb-4 fs-8 fs-md-7">
        <label class="mb-2 text-neutral-0 fw-bold" for="password"> 密碼 </label>
        <input id="password" class="form-control p-4 text-neutral-100 fw-medium border-neutral-40" placeholder="請輸入密碼" type="password" v-model="user.password" />
      </div>
      <div class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7">
        <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
          <input id="remember" class="form-check-input" type="checkbox" value="" />
          <label class="form-check-label fw-bold" for="remember"> 記住帳號 </label>
        </div>
        <button class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0" type="button" data-bs-toggle="modal" data-bs-target="#forgotPwModal">
          忘記密碼？
        </button>
      </div>
      <button class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold" type="button" @click="sendLogin">會員登入</button>
    </form>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink to="signup" class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0">
        <span>前往註冊</span>
      </NuxtLink>
    </p>

    <!-- 忘記密碼popup -->
    <div id="forgotPwModal" class="modal fade" title="忘記密碼" hide-footer>
      <div class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearData" />
          </div>

          <div class="modal-body mx-4 my-6 text-neutral-80 fs-8 fs-md-6 fw-bold">
            <div>
              <p class="fs-8 fs-md-7">請輸入您的電子信箱，我們將寄送驗證碼至您的信箱</p>
              <label class="mb-2 fw-bold" for="email"> 電子信箱 </label>
              <input class="form-control p-4 text-neutral-100 fw-medium border-neutral-40" placeholder="請輸入信箱" type="email" v-model="user.email" />
            </div>
            <div v-show="showForgotPwCode" :inert="!showForgotPwCode">
              <label class="my-2 fw-bold" for="code"> 驗證碼 </label>
              <input class="form-control p-4 text-neutral-100 fw-medium border-neutral-40" placeholder="請輸入驗證碼" type="text" v-model="user.code" />

              <label class="my-2 fw-bold" for="newPassword"> 新密碼 </label>
              <input class="form-control p-4 text-neutral-100 fw-medium border-neutral-40" placeholder="請輸入新密碼" type="password" v-model="user.newPassword" />

              <p class="mt-2 fs-8 fs-md-7">
                新密碼需包含至少 8 個字元，並包含至少一個數字、一個大寫字母、一個小寫字母<br />驗證碼將在 5 分鐘後失效<br />若您未收到驗證碼，請檢查垃圾郵件或重新寄送
              </p>
            </div>
          </div>

          <div class="modal-footer d-flex gap-4">
            <button class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold" style="--bs-btn-hover-color: #fff" type="button" data-bs-dismiss="modal" @click="clearData">
              取消
            </button>
            <button v-show="!showForgotPwCode" class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold" type="button" @click="forgotPw">寄送驗證碼</button>
            <button v-show="showForgotPwCode" class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold" type="button" @click="sendNewPassword">確認修改</button>
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

input[type='password'] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
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
