<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

const auth = useAuthStore();
const { isLogin } = storeToRefs(auth);
await auth.checkAuth();
if (!isLogin.value) {
  await auth.logout();
}
const userData = ref(null);
userData.value = await auth.getUserData();

const isEditPassword = ref(false);
const isEditProfile = ref(false);

const userStore = useUserStore();
// console.log(userStore.userInfo);

const { confirmPassword } = storeToRefs(userStore);

// 用戶資料 取得預設 & 編輯內容
const editUserData = ref({
  userId: userStore.userInfo._id,
  name: userStore.userInfo.name,
  phone: userStore.userInfo.phone,
  birthday: userStore.userInfo.birthday,
  address: {
    zipcode: userStore.userInfo.address.zipcode,
    detail: userStore.userInfo.address.detail,
  },
  oldPassword: null,
  newPassword: null,
});
// const zipcode = ref(userData.value.result?.address?.zipcode);
const nowAddress = ref({
  city: '',
  county: '',
});

// 取得縣市區域
const getAddress = (zipcode) => {
  const address = userStore.getAddressFromZipcode(zipcode);
  nowAddress.value = {
    city: address.city,
    county: address.county,
  };
};
onMounted(() => {
  getAddress(editUserData.value.address.zipcode);
});
watch(
  () => editUserData.value.address.zipcode,
  (value) => {
    getAddress(value);
  },
  { immediate: true }
);

// 取得完整地址
const fullAddress = computed(() => userStore.getFullAddress);
userStore.setUserInfo(userData.value.result);

// 編輯生日處理
const currentBirth = ref(userData.value.result.birthday);
const addBirth = ref({
  year: new Date(currentBirth.value).getFullYear(),
  month: new Date(currentBirth.value).getMonth() + 1,
  date: new Date(currentBirth.value).getDate(),
});

// 編輯密碼處理
const confirmPw = ref(null);
const pwRes = ref(null);
const profileRes = ref(null);
const sendEditPassword = async () => {
  // console.log('after edit--- ', editUserData.value);
  pwRes.value = '';

  if (editUserData.value.newPassword !== confirmPw.value) {
    pwRes.value = '新密碼與確認密碼不符';
    return;
  } else {
    confirmPassword.value = confirmPw.value;
  }
  const sendData = { ...editUserData.value };

  try {
    const result = await userStore.updateProfile(sendData);
    if (result.success) {
      pwRes.value = '修改完成';
      isEditPassword.value = !isEditPassword;
    } else {
      pwRes.value = result.error;
    }
  } catch (e) {
    console.log(e);
  }
};

// 編輯基本資料處理
const sendEditProfile = async () => {
  profileRes.value = '';
  const { year, month, date } = addBirth.value;
  editUserData.value.birthday = year + '-' + month + '-' + date;

  const { city, county } = nowAddress.value;
  const newZipcode = userStore.setUserZipcode(city, county);
  editUserData.value.address.zipcode = newZipcode;

  // console.log('after edit--- ', editUserData.value);
  const { userId, name, phone, birthday, address } = editUserData.value;

  const sendData = {
    userId: userId,
    name: name,
    phone: phone,
    birthday: birthday,
    address: {
      zipcode: address.zipcode,
      detail: address.detail,
    },
  };

  try {
    const result = await userStore.updateProfile(sendData);
    if (result.success) {
      // console.log(result.data.result);
      currentBirth.value = result.data.result.birthday;
      profileRes.value = '修改完成';
      isEditProfile.value = !isEditProfile;
    } else {
      profileRes.value = result.error;
    }
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
            <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">{{ userData.result.email }}</span>
          </div>

          <div class="d-flex justify-content-between align-items-center" :class="{ 'd-none': isEditPassword }">
            <div>
              <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium"> 密碼 </label>
              <input class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0" type="password" value="**********" />
            </div>

            <button
              class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
              type="button"
              @click="isEditPassword = !isEditPassword"
            >
              重設
            </button>
          </div>

          <div class="d-flex flex-column gap-4 gap-md-6" :class="{ 'd-none': !isEditPassword }">
            <div>
              <label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold">舊密碼</label>
              <input id="oldPassword" type="password" class="form-control p-4 fs-7 rounded-3" placeholder="請輸入舊密碼" v-model="editUserData.oldPassword" />
            </div>

            <div>
              <label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold">新密碼</label>
              <input id="newPassword" type="password" class="form-control p-4 fs-7 rounded-3" placeholder="請輸入新密碼" v-model="editUserData.newPassword" />
            </div>

            <div>
              <label for="confirmPassword" class="form-label fs-8 fs-md-7 fw-bold">確認新密碼</label>
              <input id="confirmPassword" type="password" class="form-control p-4 fs-7 rounded-3" placeholder="請再輸入一次新密碼" v-model="confirmPw" />
            </div>
          </div>

          <button
            :class="{ 'd-none': !isEditPassword }"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="button"
            @click="sendEditPassword()"
          >
            儲存設定
          </button>
          <span v-if="pwRes" class="text-primary-100">{{ pwRes }}</span>
        </div>
      </section>
    </div>

    <div class="col-12 col-md-7">
      <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <label class="form-label" :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }" for="name"> 姓名 </label>
            <input
              id="name"
              name="name"
              class="form-control text-neutral-100 fw-bold"
              :class="{ 'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile }"
              type="text"
              v-model="editUserData.name"
            />
          </div>

          <div class="fs-8 fs-md-7">
            <label class="form-label" :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }" for="phone"> 手機號碼 </label>
            <input
              id="phone"
              name="phone"
              class="form-control text-neutral-100 fw-bold"
              :class="{ 'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile }"
              type="tel"
              v-model="editUserData.phone"
            />
          </div>

          <div class="fs-8 fs-md-7">
            <label class="form-label" :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }" for="birth"> 生日 </label>
            <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0" :class="{ 'd-none': isEditProfile }" v-timeformat="currentBirth"></span>
            <div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
              <select id="birth" class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="addBirth.year">
                <option v-for="year in 65" :key="year" :value="year + 1958">{{ year + 1958 }} 年</option>
              </select>
              <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="addBirth.month">
                <option v-for="month in 12" :key="month" :value="month">{{ month }} 月</option>
              </select>
              <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="addBirth.date">
                <option v-for="day in 30" :key="day" :value="day">{{ day }} 日</option>
              </select>
            </div>
          </div>

          <div class="fs-8 fs-md-7">
            <label class="form-label" :class="{ 'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile }" for="address"> 地址 </label>
            <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0" :class="{ 'd-none': isEditProfile }"
              >{{ editUserData.address.zipcode }} {{ fullAddress }}</span
            >
            <div :class="{ 'd-none': !isEditProfile }">
              <div class="d-flex gap-2 mb-2">
                <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="nowAddress.city">
                  <option value="臺北市">臺北市</option>
                  <option value="臺中市">臺中市</option>
                  <option selected value="高雄市">高雄市</option>
                </select>
                <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="nowAddress.county">
                  <option value="文山區">文山區</option>
                  <option value="前金區">前金區</option>
                  <option value="鹽埕區">鹽埕區</option>
                  <option selected value="新興區">新興區</option>
                </select>
              </div>
              <input id="address" type="text" class="form-control p-4 rounded-3" placeholder="請輸入詳細地址" v-model="userData.result.address.detail" />
            </div>
          </div>
        </div>
        <button :class="{ 'd-none': isEditProfile }" class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3" type="button" @click="isEditProfile = !isEditProfile">
          編輯
        </button>

        <button :class="{ 'd-none': !isEditProfile }" class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3" type="button" @click="sendEditProfile()">
          儲存設定
        </button>
        <span v-if="profileRes" class="text-primary-100">{{ profileRes }}</span>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type='password'] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
