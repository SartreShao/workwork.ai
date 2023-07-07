import AV from "leancloud-storage";
import axios from "axios";

const Work = AV.Object.extend("Work");

// 是否为生产环境
const isProdction = true;

const TEST_API = "http://localhost:3000";
const PRODCUTION_API = "https://task.evaai.me";
const SERVER_API = isProdction ? PRODCUTION_API : TEST_API;

const getWorkList = async () => {
  try {
    const workList = await new AV.Query(Work).find();
    const result = workList.map(work => work.toFullJSON());
    console.log("getWorkList success", result);
    return result;
  } catch (error) {
    console.log("getWorkList failure", error);
    throw error;
  }
};

const startTask = async (inputData, work) => {
  try {
    const response = await axios.post(`${SERVER_API}/task`, {
      input_data: inputData,
      work: work
    });
    console.log("startTask success", response.data);
    return response.data;
  } catch (error) {
    console.log("startTask failure", error);
    throw error;
  }
};

export default {
  getWorkList,
  startTask
};
