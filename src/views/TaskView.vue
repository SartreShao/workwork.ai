<template>
  <div class="task-container">
    <!-- Task ID -->
    <div class="task-id">Task Id {{ taskId }}</div>

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
        v-model="selectedWork"
        placeholder="Select Work"
      >
        <el-option
          v-for="item in workSelectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <!-- Onput Container -->
    <div class="output-container">
      <div class="output-title">Output</div>
      <div class="output-file">Download Output File</div>
      <div class="view-log-btn" @click="click_viewLog">View Log</div>
    </div>

    <!-- Control Button -->
    <div class="task-button">Start</div>
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
const selectedWork = ref("");

// 数据：WorkList
const workList = ref([]);

// 点击下载输入模板
const clickDownloadInputTemplate = () => {
  if (selectedWork.value !== "") {
    window.open(selectedWork.value.input_template_url);
  } else {
    ElMessage("Select a work first");
  }
};

const click_viewLog = () => {
  ElMessage("Comming soon...");
};

// 生命周期函数
onMounted(async () => {
  workList.value = await Api.getWorkList();
});

// 显示在 work-select 上的选项
const workSelectOptions = computed(() =>
  workList.value.map(work => {
    return { value: work, label: work.name };
  })
);

watchEffect(() => {
  console.log("selectedWork", selectedWork.value);
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
          console.log(results.data);
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
      width: 482px;
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
      opacity: 0.15;
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
