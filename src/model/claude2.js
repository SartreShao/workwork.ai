import axios from "axios";


/**
 * 开始对话，返回 conversationId
 */
const startConversation = async (usageType) => {
  console.log("usageType: " + usageType)
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
          usageType: usageType
        }
      }
    })
    console.log("startConversation", response.data.data.conversationId)
    const conversationId = response.data.data.conversationId;
    return conversationId;
  } catch (error) {
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
    console.log("sendMessage", response.data)
    const data = response.data.data;
    return data;
  } catch (error) {
    throw error;
  }
}

export default {
  startConversation, sendMessage
}