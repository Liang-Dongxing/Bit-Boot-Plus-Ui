<template>
  <div class="AppMain">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card" shadow="never">
          <template #header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <UserAvatar :user="state.user" />
          <el-descriptions :column="1">
            <el-descriptions-item label="用户名称">
              <template #label>
                <icon-park type="user" />
                用户名称
              </template>
              {{ state.user.userName }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号码">
              <template #label>
                <icon-park type="phone" />
                手机号码
              </template>
              {{ state.user.phonenumber }}
            </el-descriptions-item>
            <el-descriptions-item label="用户邮箱">
              <template #label>
                <icon-park type="email-security" />
                用户邮箱
              </template>
              {{ state.user.email }}
            </el-descriptions-item>
            <el-descriptions-item label="所属部门">
              <template #label>
                <icon-park type="city" />
                所属部门
              </template>
              <span v-if="state.user.dept">{{ state.user.dept.deptName }} / {{ state.postGroup }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="所属角色">
              <template #label>
                <icon-park type="permissions" />
                所属角色
              </template>
              {{ state.roleGroup }}
            </el-descriptions-item>
            <el-descriptions-item label="创建日期">
              <template #label>
                <icon-park type="calendar" />
                创建日期
              </template>
              {{ state.user.createTime }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card shadow="never">
          <template #header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <UserInfo :user="userForm" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <ResetPwd />
            </el-tab-pane>
            <el-tab-pane label="第三方应用" name="thirdParty">
              <ThirdParty :auths="state.auths" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Profile" lang="ts">
import UserAvatar from './UserAvatar.vue'
import UserInfo from './UserInfo.vue'
import ResetPwd from './ResetPwd.vue'
import ThirdParty from './ThirdParty.vue'
import { getAuthList } from '@/api/system/social/auth'
import { getUserProfile } from '@/api/system/user'

const activeTab = ref('userinfo')
const state = ref<{ user: any; roleGroup: string; postGroup: string; auths: any[] }>({
  user: {},
  roleGroup: '',
  postGroup: '',
  auths: [],
})

const userForm = ref({})

const getUser = async () => {
  const res = await getUserProfile()
  state.value.user = res.data.user
  userForm.value = { ...res.data.user }
  state.value.roleGroup = res.data.roleGroup
  state.value.postGroup = res.data.postGroup
}

const getAuths = async () => {
  const res = await getAuthList()
  state.value.auths = res.data
}

onMounted(() => {
  getUser()
  getAuths()
})
</script>
