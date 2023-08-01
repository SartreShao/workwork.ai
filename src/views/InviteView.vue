<template>
  <div class="invite-container">
    <el-button color="#6040ff" @click="getInviteCode"
      >获取验证码 Get Invite Code</el-button
    >
    <el-text class="text">邀请码：{{ inviteCode }}</el-text>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const n = 10; // 设置最大可获取的邀请码数量
const count = ref(0); // 用来存储当前已获取的邀请码数量
const inviteCode = ref("");

onMounted(() => {
  // 在组件挂载时，尝试从 localStorage 获取已获取的邀请码数量
  const savedCount = localStorage.getItem("inviteCodesCount");
  if (savedCount) {
    count.value = Number(savedCount);
  }
});

const getInviteCode = async () => {
  console.log("shit");
  if (count.value >= n) {
    alert(`最多只能获取${n}个邀请码哦～`);
  } else {
    try {
      const response = await axios.get(
        "https://api.evaai.me/aieye/dev/test/generateInviteCode?count=1"
      );
      if (response.status === 200) {
        count.value += 1;
        localStorage.setItem("inviteCodesCount", count.value);
        console.log(response.data); // 这里可以处理你的邀请码，比如显示到页面上
        inviteCode.value = response.data.data[0];
      }
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style lang="scss" scoped>
.invite-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  flex-direction: column;
}

.text {
  margin-top: 10px;
}
</style>
