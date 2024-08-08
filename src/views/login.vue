<template>
  <div class="login">
    <div class="login__top">
      <div class="login--logo">
        <!-- <img src="@/assets/images/logo.png" width="100%" height="100%" /> -->
      </div>
      <div class="login--bg">
        <!-- <img src="@/assets/images/bg.png" width="100%" height="100%" /> -->
      </div>
    </div>
    <div class="login__bottom">
      <div class="login__bottom__title">
        CarCare车辆养护系统
        <span class="login__bottom__title--span">Version 1.0.0</span>
      </div>
      <span class="login__bottom--subTtile">CARCARE VEHICE MAINTENANCE SYSTEM</span>
      <div class="login__bottom--type">
        <div class="login__bottom--li">
          <svg-icon icon-class="team" class-name="login__bottom--icon" />
          <span>专业团队</span>
        </div>
        <div class="login__bottom--li">
          <svg-icon icon-class="order-menu" class-name="login__bottom--icon" />
          <span>订单数据实时更新</span>
        </div>
        <div class="login__bottom--li">
          <svg-icon icon-class="mendian" class-name="login__bottom--icon" />
          <span>智能数据助力终端门店</span>
        </div>
      </div>
    </div>
    <div></div>
    <el-form ref="loginRef" :model="loginForm" label-width="80px" label-position="left" :rules="loginRules" class="login__top__form login-form">
      <h3 class="title">欢迎登录</h3>
      <!-- <el-form-item v-if="tenantEnabled" prop="tenantId">
        <el-select v-model="loginForm.tenantId" filterable placeholder="请选择/输入公司名称" style="width: 100%">
          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId"></el-option>
          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
        </el-select>
      </el-form-item> -->
      <div style="margin-top: 30px">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="请输入用户名">
            <!-- <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="请输入登录密码"
            @keyup.enter="handleLogin"
          >
            <!-- <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template> -->
          </el-input>
        </el-form-item>
        <el-form-item v-if="captchaEnabled" prop="code" label="验证码">
          <el-input
            v-model="loginForm.code"
            size="large"
            auto-complete="off"
            placeholder="请输入验证码"
            style="width: 63%"
            @keyup.enter="handleLogin"
          >
            <!-- <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template> -->
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" class="login-code-img" @click="getCode" />
          </div>
        </el-form-item>
      </div>

      <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">记住密码</el-checkbox> -->
      <!-- <el-form-item style="float: right">
        <el-button circle title="微信登录" @click="doSocialLogin('wechat')">
          <svg-icon icon-class="wechat" />
        </el-button>
        <el-button circle title="MaxKey登录" @click="doSocialLogin('maxkey')">
          <svg-icon icon-class="maxkey" />
        </el-button>
        <el-button circle title="TopIam登录" @click="doSocialLogin('topiam')">
          <svg-icon icon-class="topiam" />
        </el-button>
        <el-button circle title="Gitee登录" @click="doSocialLogin('gitee')">
          <svg-icon icon-class="gitee" />
        </el-button>
        <el-button circle title="Github登录" @click="doSocialLogin('github')">
          <svg-icon icon-class="github" />
        </el-button>
      </el-form-item> -->
      <!-- <el-form-item style="width: 100%; margin-top: 50px"> -->
      <el-button :loading="loading" size="large" type="primary" class="custonBtn" style="width: 100%" @click.prevent="handleLogin">
        <span v-if="!loading">登 录</span>
        <span v-else>登 录 中...</span>
      </el-button>
      <div v-if="register" style="float: right">
        <router-link class="link-type" :to="'/register'">立即注册</router-link>
      </div>
      <!-- </el-form-item> -->
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>辽ICP备2023012415号-1</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCodeImg, getTenantList } from '@/api/login';
import { authBinding } from '@/api/system/social/auth';
import { useUserStore } from '@/store/modules/user';
import { LoginData, TenantVO } from '@/api/types';
import { to } from 'await-to-js';
import { HttpStatus } from '@/enums/RespEnum';

const userStore = useUserStore();
const router = useRouter();

const title = import.meta.env.VITE_APP_TITLE;

const loginForm = ref<LoginData>({
  tenantId: '',
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const loginRules: ElFormRules = {
  tenantId: [{ required: true, trigger: 'blur', message: '请输入您的租户编号' }],
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
};

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 租户开关
const tenantEnabled = ref(true);

// 注册开关
const register = ref(false);
const redirect = ref(undefined);
const loginRef = ref<ElFormInstance>();
// 租户列表
const tenantList = ref<TenantVO[]>([]);

watch(
  () => router.currentRoute.value,
  (newRoute: any) => {
    redirect.value = newRoute.query && newRoute.query.redirect;
  },
  { immediate: true }
);

const handleLogin = () => {
  loginRef.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        localStorage.setItem('tenantId', String(loginForm.value.tenantId));
        localStorage.setItem('username', String(loginForm.value.username));
        localStorage.setItem('password', String(loginForm.value.password));
        localStorage.setItem('rememberMe', String(loginForm.value.rememberMe));
      } else {
        // 否则移除
        localStorage.removeItem('tenantId');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
      }
      // 调用action的登录方法
      const [err] = await to(userStore.login(loginForm.value));
      if (!err) {
        const redirectUrl = redirect.value || '/';
        await router.push(redirectUrl);
        loading.value = false;
      } else {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

/**
 * 获取验证码
 */
const getCode = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    loginForm.value.uuid = data.uuid;
  }
};

const getLoginData = () => {
  const tenantId = localStorage.getItem('tenantId');
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const rememberMe = localStorage.getItem('rememberMe');
  loginForm.value = {
    tenantId: tenantId === null ? String(loginForm.value.tenantId) : tenantId,
    username: username === null ? String(loginForm.value.username) : username,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === null ? false : Boolean(rememberMe)
  } as LoginData;
};

/**
 * 获取租户列表
 */
const initTenantList = async () => {
  const { data } = await getTenantList();
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
    if (tenantList.value != null && tenantList.value.length !== 0) {
      loginForm.value.tenantId = tenantList.value[0].tenantId;
    }
  }
};

/**
 * 第三方登录
 * @param type
 */
const doSocialLogin = (type: string) => {
  authBinding(type, loginForm.value.tenantId).then((res: any) => {
    if (res.code === HttpStatus.SUCCESS) {
      // 获取授权地址跳转
      window.location.href = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};

onMounted(() => {
  getCode();
  initTenantList();
  getLoginData();
});
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  min-width: 1400px;
  min-height: 700px;
  position: relative;
  &--logo {
    position: absolute;
    top: 30px;
    left: 30px;
    width: 100px;
    height: 100px;
    background-image: url('@/assets/images/logo.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
  &--bg {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 70%;
    height: 100%;
    background-image: url('@/assets/images/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // background-image: url('../assets/images/login-background.jpg');
  }
  &__top {
    width: 100%;
    height: 60%;
    position: relative;
    &__form {
      position: absolute;
      top: 25%;
      left: 10%;
    }
  }
  &__bottom {
    background: #1d2635;
    width: 100%;
    height: 40%;
    position: relative;
    &__title {
      position: absolute;
      left: 40%;
      padding: 10px 0;
      color: white;
      font-size: 3rem;
      border-bottom: 1px solid rgb(255, 255, 255, 0.5);
      overflow: hidden;
      white-space: nowrap;
      &--span {
        margin-left: 60px;
        font-size: 16px;
      }
    }
    &--subTtile {
      position: absolute;
      top: calc(3rem + 40px);
      left: 40%;
      padding: 10px 0;
      color: white;
      font-size: 1.5rem;
      overflow: hidden;
      white-space: nowrap;
    }
    &--type {
      position: absolute;
      top: calc(5rem + 80px);
      left: 40%;
      color: white;
      display: flex;
      align-items: center;
    }
    &--li {
      display: flex;
      align-items: center;
      span {
        margin-left: 10px;
        margin-right: 40px;
      }
    }
    &--icon {
      width: 30px;
      height: 30px;
    }
  }
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #1d2635;
  font-size: 32px;
  font-weight: bold;
}

.login-form {
  border-radius: 8px;
  background: #ffffff;
  width: 370px;
  padding: 50px 30px;
  box-shadow: 0px 0px 2px 2px rgba(212, 212, 212, 0.5);
  .el-input {
    border: 0px;

    padding: 10px;
    input {
      height: 40px;
    }
  }
  :deep(.el-input__wrapper) {
    border: 0px;
    box-shadow: none;
    padding: 0;
  }
  :deep(.el-input__wrapper:hover) {
    border: 0px;
    box-shadow: none;
  }
  :deep(.is-focus) {
    border: 0px;
    box-shadow: none !important;
  }
  :deep(.el-form-item) {
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #c0c4cc;
  }
  :deep(.el-form-item__label) {
    font-size: 18px;
    color: #333333;
  }
  :deep(.el-form-item__label::before) {
    display: none;
  }
  :deep(.el-form-item__error) {
    margin-top: -18px;
    margin-left: 10px;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }

  .custonBtn {
    background-color: #295cb7;
    border-color: #295cb7;
  }
  .custonBtn:hover {
    transition: 0.3s;
    background-color: rgb(41, 92, 183, 0.9);
    border-color: rgb(41, 92, 183, 0.9);
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 37%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.login-code-img {
  position: relative;
  width: 100%;
  height: 40px;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 12px;
}
</style>
