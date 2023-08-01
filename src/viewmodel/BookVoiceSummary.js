import * as mammoth from "mammoth";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
 * @returns 
 */
function split(book) {
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
 * 自动拆分章节
 * @param {*} file 
 * @param {*} minWordCount 
 * @param {*} replaceWord 
 */
const splitChapters = (file, minWordCount, replaceWord) => {
  console.log(minWordCount, replaceWord)
  const reader = new FileReader();
  reader.onload = async event => {
    const arrayBuffer = event.target.result;
    try {
      const result = await mammoth.extractRawText({
        arrayBuffer: arrayBuffer
      });
      const content = replaceWord.length === 0 ? result.value : result.value.replace(new RegExp(replaceWord, 'g'), "");
      const chapters = chapterFilter(split(content), minWordCount);
      console.log("result", chapters); // 将转换结果赋值给 content
      generateAndDownloadZip(chapters, file.name);
    } catch (error) {
      console.error(error);
    }
  };
  reader.readAsArrayBuffer(file);
}

export default {
  splitChapters
}