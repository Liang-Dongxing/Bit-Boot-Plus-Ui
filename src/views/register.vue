<template>
  <el-container class="RegisterApp">
    <el-main>
      <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
        <h3 class="title">{{ appTitle }}</h3>
        <el-form-item v-if="tenantEnabled" prop="tenantId">
          <el-select v-model="registerForm.tenantId" filterable placeholder="请选择/输入公司名称" style="width: 100%">
            <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId">
            </el-option>
            <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
          </el-select>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
            <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter="handleRegister">
            <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="确认密码"
            @keyup.enter="handleRegister">
            <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="captchaEnabled" prop="code">
          <el-input
            v-model="registerForm.code"
            size="large"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleRegister">
            <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
          </el-input>
          <div class="register-code">
            <img :src="codeUrl" class="register-code-img" @click="getCode" />
          </div>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleRegister">
            <span v-if="!loading">注 册</span>
            <span v-else>注 册 中...</span>
          </el-button>
          <div style="float: right">
            <router-link class="router-link" :to="'/login'">使用已有账户登录</router-link>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
    <!--  底部  -->
    <el-footer>
      <GlobalFooter />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { getCodeImg, register, getTenantList } from '@/api/login'
import { RegisterForm, TenantVO } from '@/api/types'
import { FormRules } from 'element-plus'
import { to } from 'await-to-js'
import useSettingsStore from '@/store/modules/settings'

const router = useRouter()
const appTitle = useSettingsStore().appTitle

const registerForm = ref<RegisterForm>({
  tenantId: '',
  username: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: '',
  userType: 'sys_user',
})

// 租户开关
const tenantEnabled = ref(true)

const equalToPassword = (rule: any, value: string, callback: any) => {
  if (registerForm.value.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  tenantId: [{ required: true, trigger: 'blur', message: '请输入您的租户编号' }],
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
  ],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
}
const codeUrl = ref('')
const loading = ref(false)
const captchaEnabled = ref(true)
const registerRef = ref(ElForm)
// 租户列表
const tenantList = ref<TenantVO[]>([])

const handleRegister = () => {
  registerRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const [err] = await to(register(registerForm.value))
      if (!err) {
        const username = registerForm.value.username
        await ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + ' 注册成功！</font>', '系统提示', {
          dangerouslyUseHTMLString: true,
          type: 'success',
        })
        await router.push('/login')
      } else {
        loading.value = false
        if (captchaEnabled) {
          getCode()
        }
      }
    }
  })
}

const getCode = async () => {
  const { data } = await getCodeImg()
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img
    registerForm.value.uuid = data.uuid
  }
}

const initTenantList = async () => {
  const { data } = await getTenantList()
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled
  if (tenantEnabled.value) {
    tenantList.value = data.voList
    if (tenantList.value != null && tenantList.value.length !== 0) {
      registerForm.value.tenantId = tenantList.value[0].tenantId
    }
  }
}

onMounted(() => {
  getCode()
  initTenantList()
})
</script>

<style lang="scss" scoped></style>
