<template>
  <div class="task-container">
    <!-- Task ID -->
    <div class="task-id">Task {{ taskId }}</div>

    <!-- Input Container -->
    <div class="input-container">
      <div class="input-title">Input</div>
      <input
        class="csv-input"
        type="file"
        ref="inputCsv"
        @change="inputFileChanged($event)"
        accept=".csv"
      />
      <div class="download_temtplate-btn" @click="clickDownloadInputTemplate">
        Download Input Template
      </div>
    </div>

    <!-- Work Container -->
    <div class="work-container">
      <div class="work-title">Work</div>
      <el-select
        class="work-select"
        v-model="selectedWorkId"
        placeholder="Select Work"
      >
        <el-option
          v-for="item in workSelectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="use-api-btn" @click="click_useAPI">Use API</div>
    </div>

    <!-- Onput Container -->
    <div class="output-container">
      <div class="output-title">Output</div>
      <div class="output-file" @click="click_downloadOutputFile">
        {{ downloadButtonText }}
      </div>
      <div class="view-log-btn" @click="click_viewLog">View Log</div>
    </div>

    <!-- Control Button -->
    <div class="task-button" @click="click_start">{{ buttonStatus }}</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watchEffect } from "vue";
import Papa from "papaparse";
import Api from "@/model/api.js";
import { ElMessage } from "element-plus";
// Input 元素
const inputCsv = ref(null);

// TaskId
const taskId = ref("");

// 选中的 workId
const selectedWorkId = ref("");

// 选中的 work
const selectedWork = computed(() => {
  let targetWork;
  workList.value.forEach(work => {
    if (work.objectId === selectedWorkId.value) {
      targetWork = work;
    }
  });
  return targetWork;
});

// 数据：WorkList
const workList = ref([]);

// 数据：inputData
const inputData = ref("");

// 输出文件下载地址
const outputDownloadUrl = ref("");

// 按钮文字
const buttonStatus = ref("Start");

const downloadButtonText = computed(() =>
  outputDownloadUrl.value
    ? "Click to Download Result.csv"
    : "Output CSV Will Be There"
);

// 点击下载输入模板
const clickDownloadInputTemplate = () => {
  if (selectedWork.value !== "") {
    window.open(selectedWork.value.input_template_url);
  } else {
    ElMessage("Select a work first");
  }
};

// 点击下载输出文件
const click_downloadOutputFile = () => {
  if (outputDownloadUrl.value === "") {
    ElMessage("Nothing to download...");
  } else {
    window.open(outputDownloadUrl.value);
  }
};

// 点击查看日志
const click_viewLog = () => {
  ElMessage("Comming soon...");
};

const click_start = async () => {
  if (buttonStatus.value === "Start") {
    if (selectedWork.value === "") {
      ElMessage("Select a work first");
      return;
    }
    if (inputData.value === "") {
      ElMessage("Upload a input file");
      return;
    }

    try {
      buttonStatus.value = "Working";
      const result = await Api.startTask(inputData.value, selectedWork.value);
      buttonStatus.value = "Start";
      console.log("result", result);
      const csvString = result.csv_data;
      // 创建一个 Blob 实例
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      outputDownloadUrl.value = URL.createObjectURL(blob);

      ElMessage("Work done!");
    } catch (error) {
      buttonStatus.value = "Start";
      ElMessage("error" + error);
    }
  } else if (buttonStatus.value === "Working") {
    ElMessage("I'm working! Don't click me!");
  }
};

// 点击使用 API
const click_useAPI = () => {
  if (selectedWork.value !== "") {
    ElMessage(selectedWork.value.work_api);
  } else {
    ElMessage("Select a work first");
  }
};

// 生命周期函数
onMounted(async () => {
  workList.value = await Api.getWorkList();
});

// 显示在 work-select 上的选项
const workSelectOptions = computed(() =>
  workList.value.map(work => {
    return { value: work.objectId, label: work.name };
  })
);

// 选择的 Work 更新了
watchEffect(() => {
  console.log("selectedWork", selectedWork.value);
  // 清空输入
  inputData.value = "";
});

// 输入事件：上传文件发生改变
const inputFileChanged = async event => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      Papa.parse(e.target.result, {
        header: true,
        complete: function (results) {
          inputData.value = results.data;
          console.log("inputData changed", results.data);
        }
      });
    };
    reader.readAsText(file);
  }
};
</script>

<style lang="scss" scoped>
.task-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .task-id {
    margin-bottom: 15px;
    font-weight: bold;
  }
  .input-container {
    display: flex;
    flex-direction: row;
    width: 600px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .input-title {
      font-weight: bold;
    }
    .download_temtplate-btn {
      background: black;
      color: white;
      cursor: pointer;
      padding: 5px;
      font-size: 13px;
    }
  }

  .work-container {
    display: flex;
    flex-direction: row;
    width: 600px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .work-title {
      font-weight: bold;
    }
    .work-select {
      width: 350px;
    }
    .use-api-btn {
      background: black;
      color: white;
      cursor: pointer;
      padding: 5px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .output-container {
    display: flex;
    flex-direction: row;
    width: 600px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .output-title {
      font-weight: bold;
    }
    .output-file {
      width: 335px;
      border: 1px dashed #dcdcdc;
      cursor: pointer;
      padding: 8px;
      font-size: 13px;
    }
    .view-log-btn {
      background: black;
      color: white;
      cursor: not-allowed;
      padding: 5px;
      font-size: 13px;
    }
  }

  .task-button {
    background: black;
    color: white;
    cursor: pointer;
    padding: 10px;
    font-size: 15px;
    width: 585px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
