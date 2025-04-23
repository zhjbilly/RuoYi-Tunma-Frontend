<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="藏品名称" prop="mingcheng">
        <el-input
            v-model="queryParams.mingcheng"
            placeholder="请输入藏品名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="zhuangtai">
        <el-select v-model="queryParams.zhuangtai" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in liudongleixing"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="借阅类型" prop="jieyueleixing">
        <el-select v-model="queryParams.jieyueleixing" placeholder="请选择借阅类型" clearable>
          <el-option
              v-for="dict in jieyueleixing"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="等级" prop="dengji">
        <el-select v-model="queryParams.dengji" placeholder="请选择等级" clearable>
          <el-option
              v-for="dict in cangpinjibie"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['shenxiu:liudong:add']"
        >新增
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="success"-->
<!--            plain-->
<!--            icon="Edit"-->
<!--            :disabled="single"-->
<!--            @click="handleUpdate"-->
<!--            v-hasPermi="['shenxiu:liudong:edit']"-->
<!--        >修改-->
<!--        </el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['shenxiu:liudong:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['shenxiu:liudong:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="liudongList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id"/>
      <el-table-column label="藏品" align="center" prop="mingcheng"/>
      <el-table-column label="主图" align="center" prop="zhutu" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.zhutu" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" prop="dengji">
        <template #default="scope">
          <dict-tag :options="cangpinjibie" :value="scope.row.dengji"/>
        </template>
      </el-table-column>
      <el-table-column label="目的地" align="center" prop="dest"/>
      <el-table-column label="借阅类型" align="center" prop="jieyueleixing">
        <template #default="scope">
          <dict-tag :options="jieyueleixing" :value="scope.row.jieyueleixing"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="zhuangtai">
        <template #default="scope">
          <dict-tag :options="liudongleixing" :value="scope.row.zhuangtai"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Operation" @click="handleApprove(scope.row)"
                     v-if="scope.row.zhuangtai == 'pending_approval'"
                     v-hasPermi="['shenxiu:liudong:approve']">审核通过
          </el-button>
          <el-button link type="primary" icon="CircleClose" @click="handleReject(scope.row)"
                     v-if="scope.row.zhuangtai == 'pending_approval'"
                     v-hasPermi="['shenxiu:liudong:cancel']">审核拒绝
          </el-button>
          <el-button link type="primary" icon="Plus" @click="handleBack(scope.row)"
                     v-if="scope.row.zhuangtai == 'passed'"
                     v-hasPermi="['shenxiu:liudong:back']">归还审核
          </el-button>
          <el-button link type="primary" icon="Refresh" @click="handleReturned(scope.row)"
                     v-if="scope.row.zhuangtai == 'back_approval'"
                     v-hasPermi="['shenxiu:liudong:returned']">归还
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['shenxiu:liudong:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改藏品流动信息对话框 -->
    <el-dialog :title="title" v-model="open" width="50%" append-to-body>
      <el-form ref="liudongRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="藏品" prop="cangpinId">
          <el-select v-model="form.cangpinId" placeholder="请选择藏品" style="width:30%">
            <el-option
                v-for="dict in seleltCangpinId"
                :key="dict.selectKey"
                :label="dict.selectValue"
                :value="parseInt(dict.selectKey)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目的地" prop="dest">
          <el-input v-model="form.dest" placeholder="目的地" style="width:30%">
          </el-input>
        </el-form-item>
        <el-form-item label="借阅类型" prop="jieyueleixing">
          <el-select v-model="form.jieyueleixing" placeholder="请选择借阅类型" style="width:30%">
            <el-option
                v-for="dict in jieyueleixing"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Liudong">
import {listLiudong, getLiudong, delLiudong, addLiudong, updateLiudong, approveLiudong, rejectLiudong, backLiudong, returnedLiudong, physicalInterface} from "@/api/shenxiu/liudong";
import {getToken} from "@/utils/auth.js";

const {proxy} = getCurrentInstance();
const {liudongleixing, jieyueleixing, cangpinjibie} = proxy.useDict('liudongleixing', 'jieyueleixing', 'cangpinjibie');

const liudongList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const seleltCangpinId = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    cangpinId: null,
    zhuangtai: null,
    jieyueleixing: null,
    mingcheng: null,
    zhutu: null,
    dengji: null,
  },
  rules: {
    cangpinId: [
      { required: true, message: "藏品不能为空", trigger: "change" }
    ],
    dest: [
      { required: true, message: "目的地不能为空", trigger: "blur" }
    ],
    jieyueleixing: [
      { required: true, message: "借阅类型不能为空", trigger: "change" }
    ],
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 查询藏品流动信息列表 */
function getList() {
  loading.value = true;
  listLiudong(queryParams.value).then(response => {
    liudongList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    id: null,
    cangpinId: null,
    zhuangtai: null,
    jieyueleixing: null,
    createTime: null
  };
  proxy.resetForm("liudongRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加藏品流动信息";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["liudongRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateLiudong(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addLiudong(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 审核通过 */
function handleApprove(row){
  const _ids = row.id;
  proxy.$modal.confirm('是否确认审核通过？').then(function () {
    return approveLiudong(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("审核通过");
  }).catch(() => {

  })
}

/** 审核拒绝 */
function handleReject(row){
  const _ids = row.id;
  proxy.$modal.confirm('是否确认审核拒绝？').then(function () {
    return rejectLiudong(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("审核拒绝成功");
  }).catch(() => {

  })
}

/** 归还审核 */
function handleBack(row){
  const _ids = row.id;
  proxy.$modal.confirm('是否确认归还？').then(function () {
    return backLiudong(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("归还审核提交成功");
  }).catch(() => {

  })
}

/** 归还审核成功 */
function handleReturned(row){
  const _ids = row.id;
  proxy.$modal.confirm('是否确认归还成功？').then(function () {
    return returnedLiudong(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("归还成功");
  }).catch(() => {

  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除藏品流动信息编号为"' + _ids + '"的数据项？').then(function () {
    return delLiudong(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('shenxiu/liudong/export', {
    ...queryParams.value
  }, `liudong_${new Date().getTime()}.xlsx`)
}

physicalInterface('/common/selectList/cangpin/id/mingcheng').then(resp => {
  seleltCangpinId.value = resp.data;
});
getList();
</script>
