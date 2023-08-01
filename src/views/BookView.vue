<template>
  <div class="book-container">
    <!-- 顶部标题部分 -->
    <div class="task-title-container">
      <div class="sub-title">Eva Task</div>
      <div class="title">Book Voice Summary</div>
    </div>

    <!-- 一键制作、上传 -->
    <div class="upload-container">
      <div class="selector-container">
        <el-select class="selector" v-model="mode">
          <el-option
            v-for="item in modeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <div class="selected-mode">
          {{ mode }}
        </div>

        <svg
          class="select-icon"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1221_3552)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.2535 4.71448L9.54643 4.00737L6.0109 7.5429L2.47537 4.00737L1.76826 4.71448L5.65732 8.60353C5.65732 8.60353 5.65735 8.60356 6.0109 8.25001L5.65732 8.60353L6.0109 8.95712L10.2535 4.71448Z"
              fill="#4E5969"
            />
          </g>
          <defs>
            <clipPath id="clip0_1221_3552">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div class="upload-btn">上传</div>
    </div>

    <!-- 参数输入 -->
    <div class="params-container">
      <!-- 拆分章节参数 -->
      <div class="params-input-title-container">
        <div class="params-title">拆分章节</div>
      </div>
      <div class="params-input-container">
        <div class="params-text">章节最低字数</div>
        <el-input class="params-input"></el-input>
      </div>

      <div class="params-input-container">
        <div class="params-text">过滤文字水印</div>
        <el-input class="params-input"></el-input>
      </div>

      <!-- 智能改写参数 -->
      <div class="params-input-title-container">
        <div class="params-title">智能改写</div>
      </div>
      <div class="params-input-container">
        <div class="params-text">缩写比例（0～1）</div>
        <el-input class="params-input"></el-input>
      </div>
      <div class="params-input-container">
        <div class="params-text">生成开头 Prompt</div>
        <el-input class="params-input"></el-input>
      </div>
      <div class="params-input-container">
        <div class="params-text">改写 Prompt</div>
        <el-input class="params-input"></el-input>
      </div>

      <!-- 文字转有声书 -->
      <div class="params-input-title-container">
        <div class="params-title">文字转有声书</div>
      </div>
      <div class="params-input-container">
        <div class="params-text">TTS音色</div>
        <el-input class="params-input"></el-input>
      </div>
      <div class="params-input-container">
        <div class="params-text">TTS速度</div>
        <el-input class="params-input"></el-input>
      </div>
      <div class="params-input-container">
        <div class="params-text">背景音乐</div>
        <el-input class="params-input"></el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const mode = ref("一键制作");

const modeOptions = [
  {
    value: "一键制作",
    label: "一键制作"
  },
  {
    value: "拆分章节",
    label: "拆分章节"
  },
  {
    value: "智能改写",
    label: "智能改写"
  },
  {
    value: "文字转有声书",
    label: "文字转有声书"
  }
];
</script>

<style lang="scss" setup>
.book-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9ff;

  // 顶部标题部分
  .task-title-container {
    margin-top: 4.55vh;
    width: 51.48vw;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    .sub-title {
      color: rgba(61, 42, 182, 0.4);
      font-size: 1.95vh;
      font-style: normal;
      line-height: normal;
    }
    .title {
      color: #3d2ab6;
      font-size: 3.12vh;
      font-style: normal;
      margin-top: 0.5vh;
      font-weight: 700;
      line-height: normal;
    }
  }

  // 一键制作、上传
  .upload-container {
    margin-top: 3.9vh;
    width: 51.48vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .selector-container {
      display: flex;
      width: 11.72vw;
      height: 6.49vh;
      justify-content: center;
      align-items: center;
      border-radius: 7.01vh;
      border: 0.13px solid #531dec;
      background: #fff;
      box-shadow: 0px 0.26vh 1.3vh 0px rgba(135, 64, 226, 0.4);
      backdrop-filter: blur(0.91vh);
      overflow: hidden;
      position: relative;

      .selector {
        position: absolute;
        height: 100%;
        width: 100%;
        opacity: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      .selected-mode {
        color: #3d2ab6;
        /* 大按钮 */
        font-size: 2.21vh;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      .select-icon {
        width: 1.56vh;
        height: 1.56vh;
        margin-left: 0.78vw;
      }
    }
    .upload-btn {
      display: flex;
      padding: 1.95vh 11.48vw;
      justify-content: center;
      align-items: center;
      gap: 1.3vh;
      border-radius: 7.01vh;
      background: linear-gradient(28deg, #9d93ef 0%, #725cfd 100%);
      box-shadow: 0px 0.26vh 1.3vh 0px rgba(135, 64, 226, 0.4);
      backdrop-filter: blur(0.91vh);
      color: #fff;
      /* 大按钮 */
      font-family: SF Pro Display;
      font-size: 2.21vh;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      cursor: pointer;
    }
  }

  // 参数输入
  .params-container {
    margin-top: 2.6vh;
    width: 51.48vw;
    flex-shrink: 0;
    padding-bottom: 3vh;
    border-radius: 2.08vh;
    background: #fff;
    box-shadow: 0px 0.52vh 0.52vh 0px rgba(0, 0, 0, 0.01);
    backdrop-filter: blur(3.9vh);

    .params-input-title-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 3vh 2vw 0 2vw;
      .params-title {
        width: 30vw;
        font-size: 2vh;
        color: #3d2ab6;
        font-weight: bold;
      }
    }
    .params-input-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 1.5vh 2vw 0 2vw;

      .params-text {
        width: 30vw;
        font-size: 1.7vh;
        color: #3d2ab6;
      }
    }
  }
}
</style>
