<template>
  <div class="container">
    <h1  class="title">沈绣博物馆藏品与文化遗产档案管理信息系统</h1>
  </div>
</template>

<script setup name="Index">
// 这里可以添加组件的逻辑
</script>

<style scoped lang="scss">.container {
  display: flex;
  justify-content: center; // 水平居中
  height: 100vh;           // 使容器高度为视口高度
  position: relative;      // 使 .title 能够相对于 .container 定位
}

.title {
  position: absolute;
  top: 33.33%;             // 垂直定位在容器的三分之二高度
  transform: translateY(-50%); // 使标题的中心点对齐到三分之二高度
  font-size: 30px;
}
</style>
