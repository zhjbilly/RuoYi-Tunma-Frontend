<template>
  <div class="message-notification">
    <el-popover
      placement="bottom"
      trigger="click"
      :width="320"
      popper-class="message-popover"
      v-model:visible="visible"
    >
      <template #reference>
        <div class="notification-container" @click="getMessages">
          <el-badge :value="unreadCount > 0 ? unreadCount : ''" :max="99" class="badge-item">
            <el-icon><bell /></el-icon>
          </el-badge>
        </div>
      </template>

      <div class="message-header">
        <div class="message-title">消息通知</div>
        <div class="message-action" @click="markAllRead">全部已读</div>
      </div>
      
      <el-scrollbar height="300px">
        <div v-if="messageList.length > 0" class="message-list">
          <div
            v-for="(item, index) in messageList"
            :key="index"
            class="message-item"
            :class="{ 'unread': item.read === 'N' }"
            @click="handleReadMessage(item)"
          >
            <div class="message-item-icon">
              <el-icon v-if="getIconByType(item.messageType) === 'info'"><information-filled /></el-icon>
              <el-icon v-else-if="getIconByType(item.messageType) === 'warning'"><warning-filled /></el-icon>
              <el-icon v-else-if="getIconByType(item.messageType) === 'success'"><success-filled /></el-icon>
              <el-icon v-else><bell /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-item-content">{{ item.messageContent }}</div>
              <div class="message-item-time">{{ formatTime(item.createTime) }}</div>
            </div>
          </div>
        </div>
        <div v-else class="no-message">
          <el-empty description="暂无消息" />
        </div>
      </el-scrollbar>
      
      <div class="message-footer">
        <router-link to="/system/message">查看更多</router-link>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { listMessage, getUnreadCount, markAsRead, markAllAsRead } from '@/api/system/message'
import { ElMessage } from 'element-plus'
import { parseTime } from '@/utils/ruoyi'

const visible = ref(false)
const messageList = ref([])
const unreadCount = ref(0)
const loading = ref(false)
const query = ref({
  pageNum: 1,
  pageSize: 10,
  read: 'N'
})

// 获取消息列表
const getMessages = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const res = await listMessage(query.value)
    messageList.value = res.rows || []
    loading.value = false
  } catch (error) {
    console.error('获取消息列表失败', error)
    loading.value = false
  }
}

// 获取未读消息数量
const getUnreadMessageCount = async () => {
  try {
    const res = await getUnreadCount()
    unreadCount.value = res.data
  } catch (error) {
    console.error('获取未读消息数量失败', error)
  }
}

// 标记消息为已读
const handleReadMessage = async (message) => {
  if (message.read === 'Y') return
  try {
    await markAsRead(message.id)
    // 更新消息状态
    message.read = 'Y'
    // 更新未读数量
    getUnreadMessageCount()
    ElMessage.success('已标记为已读')
  } catch (error) {
    console.error('标记消息已读失败', error)
  }
}

// 标记所有消息为已读
const markAllRead = async () => {
  try {
    await markAllAsRead()
    messageList.value.forEach(item => {
      item.read = 'Y'
    })
    unreadCount.value = 0
    ElMessage.success('已全部标记为已读')
  } catch (error) {
    console.error('标记全部已读失败', error)
  }
}

// 根据消息类型获取图标
const getIconByType = (type) => {
  const typeMap = {
    '1': 'info',     // 系统通知
    '2': 'warning',  // 警告通知
    '3': 'success'   // 成功通知
  }
  return typeMap[type] || 'info'
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  return parseTime(time, '{y}-{m}-{d} {h}:{i}')
}

// 监听刷新消息事件
const handleRefreshMessages = () => {
  getUnreadMessageCount()
  if (visible.value) {
    getMessages()
  }
}

onMounted(() => {
  getUnreadMessageCount()
  window.addEventListener('refreshMessages', handleRefreshMessages)
})

onUnmounted(() => {
  window.removeEventListener('refreshMessages', handleRefreshMessages)
})
</script>

<style lang="scss" scoped>
.message-notification {
  height: 100%;
  display: flex;
  align-items: center;
}

.notification-container {
  display: flex;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  position: relative;
  padding: 0 8px;
  height: 100%;
  
  .badge-item {
    display: flex;
    align-items: center;
  }
  
  :deep(.el-badge__content.is-fixed) {
    position: absolute;
    top: 18px;
    right: 3px;
  }
  
  :deep(.el-badge__content) {
    height: 16px;
    min-width: 16px;
    padding: 0 4px;
    line-height: 16px;
    font-size: 12px;
    font-weight: normal;
    border: none;
    background-color: #f56c6c;
    box-shadow: 0 0 0 1px #fff;
  }
}

.message-popover {
  padding: 0;
  
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    
    .message-title {
      font-weight: bold;
      font-size: 15px;
    }
    
    .message-action {
      color: #409EFF;
      cursor: pointer;
      font-size: 13px;
    }
  }
  
  .message-list {
    .message-item {
      padding: 10px 15px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f7fa;
      }
      
      &.unread {
        background-color: #f0f9ff;
        
        .message-item-content {
          font-weight: bold;
        }
      }
      
      .message-item-icon {
        margin-right: 10px;
        color: #409EFF;
        font-size: 16px;
        padding-top: 2px;
      }
      
      .message-content {
        flex: 1;
        overflow: hidden;
        
        .message-item-content {
          font-size: 13px;
          color: #606266;
          margin-bottom: 5px;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }
        
        .message-item-time {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
  
  .no-message {
    padding: 30px 0;
  }
  
  .message-footer {
    text-align: center;
    padding: 10px 0;
    border-top: 1px solid #eee;
    font-size: 13px;
    
    a {
      color: #409EFF;
      text-decoration: none;
    }
  }
}
</style>
