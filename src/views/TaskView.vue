<template>
  <div class="task-container">
    <!-- Task ID -->
    <div class="task-id">Eva Task {{ taskId }}</div>

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

let book = `第一部分 智人征服世界
人类与其他动物有何不同？
人类如何征服世界？
智人究竟是比较高级的生命形式，还是欺凌其他物种的地痞
流氓？
第1章 人类的新议题
第三个千年开始之际，人类醒来，伸展手脚，揉了揉眼睛，
脑子里依然萦绕着某些可怕的噩梦。“好像有什么铁丝网、巨大
的蘑菇云之类的。但管它的呢，只是个噩梦吧。”人类走进浴
室，洗洗脸，看看镜子里脸上的皱纹，然后冲了一杯咖啡，打开
了记事本。“来瞧瞧今天有什么重要的事吧。”
几千年来，这个问题的答案并没有什么改变。不管是20世纪
的中国人、中世纪的印度人，还是古代的埃及人，都面临着同样
的三大问题：饥荒、瘟疫和战争，它们永远都是人类的心头大
患。一代又一代，人类向所有神明、天使和圣人祈祷膜拜，也发
明了无数的工具、制度和社会系统，但仍然有数百万人死于饥
饿、流行病和暴力。许多思想家和先知于是认为，饥荒、瘟疫和
战争一定是上帝整个宇宙计划的一部分，抑或是由于人类天生的
不完美，除非走到时间尽头，否则永远不可能摆脱。`;

function splitChapters(book) {
  let chapters = book.split(
    /(第\s*[\d|\p{Script=Han}一二三四五六七八九十百千万亿兆]+\s*章)/g
  );
  // 通过正则表达式我们已经可以正确地分割章节，但是我们还需要重新组合章节名和章节内容
  let formattedChapters = [];
  formattedChapters.push(chapters[0]);
  for (let i = 1; i < chapters.length; i += 2) {
    // 第一次循环时，我们跳过开头可能存在的空字符串
    // 将章节名和章节内容重新组合，注意这里我们需要跳过空的章节
    formattedChapters.push(chapters[i] + chapters[i + 1]);
  }
  return formattedChapters;
}

console.log(splitChapters(book));
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
