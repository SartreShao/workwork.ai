import * as mammoth from "mammoth";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Claude2 from "@/model/claude2.js";

/**
 * 生成压缩包
 * @param {*} chapters 
 * @param {*} fileName 
 */
const generateAndDownloadZip = async (chapters, fileName) => {
  const zip = new JSZip();

  // 将 chapters 数组中的每一个字符串作为单独的.txt文件加入到zip文件
  chapters.forEach((item, index) => {
    console.log(`[${index}] ${item.substring(0, 10)}.txt`);
    zip.file(`[${index}] ${item.substring(0, 10)}.txt`, item);
  });

  // 生成zip文件并在客户端下载
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `章节拆分_${fileName}.zip`);
};

/**
 * 章节字数过滤
 * @param {*} chapters 
 * @param {*} minWordCount 
 * @returns 
 */
const chapterFilter = (chapters, minWordCount) =>
  chapters.filter(chapter => new Blob([chapter]).size >= minWordCount);

/**
 * 拆分章节
 * @param {*} book 书籍字符串
 * @param {*} filterNewlineAfterNonPunctuation 是否过滤非标点符号后的换行符
 * @returns 
 */
function text2Chapters(book) {
  let chapters = book.split(
    /(\s第\s*[\d|\p{Script=Han}一二三四五六七八九十百千万亿兆]+\s*(章|部分))/g
  );
  // 通过正则表达式我们已经可以正确地分割章节，但是我们还需要重新组合章节名和章节内容
  let formattedChapters = [];
  formattedChapters.push(chapters[0]);
  for (let i = 1; i < chapters.length; i += 3) {
    // 第一次循环时，我们跳过开头可能存在的空字符串
    // 将章节名和章节内容重新组合，注意这里我们需要跳过空的章节
    formattedChapters.push(chapters[i] + chapters[i + 2]);
  }
  return formattedChapters;
}


/**
 * 过滤非标点符号后的换行符
 * @param {*} text 
 */
const filterNewlineAfterNonPunctuation = (text) => text.replace(/[\s\r\n]+/g, '');


const readFileContent = async (file) => {
  console.log("file name", file.name);
  const fileType = file.name.split('.').pop().toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async event => {
      if (fileType === 'txt') {
        resolve(event.target.result);
      } else {
        const arrayBuffer = event.target.result;
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: arrayBuffer
          });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      }
    };

    if (fileType === 'txt') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

/**
 * 自动拆分章节
 * @param {*} file 
 * @param {*} minWordCount 
 * @param {*} replaceWord 
 */
const splitChapters = async (file, minWordCount, replaceWord, isFilterNewline) => {
  console.log(minWordCount, replaceWord)
  const result = await readFileContent(file)
  const content = replaceWord.length === 0 ? result : result.replace(new RegExp(replaceWord, 'g'), "");
  let chapters = chapterFilter(text2Chapters(content), minWordCount);
  console.log("result", chapters);

  // 是否过滤非标点符号后的换行符号
  if (isFilterNewline) {
    chapters = chapters.map(chapter => filterNewlineAfterNonPunctuation(chapter))
  }

  generateAndDownloadZip(chapters, file.name);
}

/**
 * 智能改写
 * @param {*} file 文件 
 * @param {*} title 
 * @returns 
 */
const smartRewrite = async (file, title, usageType, rewriteRate) => {
  const text = await readFileContent(file);
  const conversationId = await Claude2.startConversation(usageType)
  console.log("Claude2 会话已建立, conversationId:", conversationId)

  const rewritePrompt = `
  内容：\`\`\`${text}\`\`\`
  
  以上内容来自《${title}》一书，仅以我提供的文件信息作为你的输入信息
  在进行总结概括前请仔细阅读以下要求，要理解并严格执行要求进行回答
  语言要求：中文
  字数要求：全文共${text.length}个汉字，请必须用${Math.floor(rewriteRate * text.length)}个汉字左右进行概括总结。

  文章结构要清晰,内容要有顺序，但尽量避免出现1、2、3、4、5....或者 一、 二、三、四、五...这一类的数字标题。
  采用讲述式的叙事风格,语言通俗易懂。使用第一人称“我们”进行叙述,语气亲切,避免使用过多学术术语。
  讲述过程中添加大量生动具体的例子，增加文章的趣味性。
  对一些观点在描述事实的同时要留有疑问,引导读者思考。
  描述中提到不同要素的特征,增加形象性。
  保持叙事流畅性和连贯性。
  总结开头需要直接进入主题，不需要废话，不需要有类似“这部分内容主要讲了….” “这段内容讲述了…” “本文提出...”等类似的信息作为开始
  回答的标题需要是我提供文本的标题
  `;

  let rewriteResult = ""
  while (rewriteResult === "" && rewriteResult !== null) {
    console.log("开始第一轮重写")
    try {
      rewriteResult = await Claude2.sendMessage(conversationId, rewritePrompt);
      console.log("第一轮结果", rewriteResult)
    } catch (error) {
      console.log("第一轮重写失败", error)
      console.log("重试", error)
    }
  }


  while (rewriteResult.length <= text.length * rewriteRate) {
    try {
      console.log("预期字数", text.length * rewriteRate)
      console.log("实际字数", rewriteResult.length)
      const checkRewritePrompt = `你的回答字数远远不足我的要求，现在的回复是${rewriteResult.length}字，我要求的是${Math.floor(rewriteRate * text.length)}字，我相信原文中一定有很多精彩的内容，丰富的案例和更多可以引人深思的问题值得你添加在你的总结中，你可以继续增加一些信息作为你的回答，希望下一个回答你的字数符合我的要求`

      rewriteResult = await Claude2.sendMessage(conversationId, checkRewritePrompt);
      console.log("改写结果", rewriteResult);
    } catch (error) {
      console.log(error);
      console.log("重试")
    }
  }

  console.log("完成改写，字数以达原文的 1/20", rewriteResult.length)
  await generateAndDownloadZip([rewriteResult], "改写结果")
  return rewriteResult
}

export default {
  splitChapters, smartRewrite
}