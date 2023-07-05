import AV from "leancloud-storage";

const Work = AV.Object.extend("Work");

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

export default {
  getWorkList
};
