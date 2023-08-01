import axios from "axios";

const USAGE_TYPE = 10024;

/**
 * 开始对话，返回 conversationId
 */
const startConversation = async () => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://pandora-api.denet.me/pandora/claude/conversation/new',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        baseInfo: {
          token: ""
        },
        params: {
          usageType: USAGE_TYPE
        }
      }
    })

    const conversationId = response.data.conversationId;
    return conversationId;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

/**
 * 向 Claude2 发送消息
 * @param {*} conversationId 
 * @param {*} message 
 * @returns 
 */
const sendMessage = async (conversationId, message) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://pandora-api.denet.me/pandora/claude/chat',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        baseInfo: {
          token: ""
        },
        params: {
          message: message,
          stream: false,
          conversationId: conversationId
        }
      }
    })
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  startConversation, sendMessage
}