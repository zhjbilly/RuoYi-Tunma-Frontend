<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="仓储" prop="cangchuId">
        <el-select v-model="queryParams.cangchuId" placeholder="请选择仓储">
          <el-option
              v-for="dict in seleltCangchuId"
              :key="dict.selectKey"
              :label="dict.selectValue"
              :value="parseInt(dict.selectKey)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="藏品名称" prop="mingcheng">
        <el-input
            v-model="queryParams.mingcheng"
            placeholder="请输入藏品名称"
            clearable
            @keyup.enter="handleQuery"
        />
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

      <el-form-item label="位置" prop="weizhi">
        <el-input
            v-model="queryParams.weizhi"
            placeholder="请输入位置"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="安全状况" prop="anquan">
        <el-select v-model="queryParams.anquan" placeholder="请选择安全状况" clearable>
          <el-option
              v-for="dict in anquanzhuangkuang"
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
            v-hasPermi="['shenxiu:cangpin:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['shenxiu:cangpin:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['shenxiu:cangpin:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['shenxiu:cangpin:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cangpinList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="分类" align="center" prop="fenleiMingcheng" />
      <el-table-column label="位置" align="center" prop="weizhi" />
      <el-table-column label="温度" align="center" prop="wendu" />
      <el-table-column label="安全状况" align="center" prop="anquan">
        <template #default="scope">
          <dict-tag :options="anquanzhuangkuang" :value="scope.row.anquan"/>
        </template>
      </el-table-column>
      <el-table-column label="藏品名称" align="center" prop="mingcheng" />
      <el-table-column label="主图" align="center" prop="zhutu" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.zhutu" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="尺寸" align="center" prop="chicun" />
      <el-table-column label="重量" align="center" prop="zhongliang" />
      <el-table-column label="等级" align="center" prop="dengji">
        <template #default="scope">
          <dict-tag :options="cangpinjibie" :value="scope.row.dengji"/>
        </template>
      </el-table-column>
      <el-table-column label="色调" align="center" prop="sediao" />
      <el-table-column label="研究文献" align="center" prop="yanjiuwenxian" />
      <el-table-column label="文件资料" align="center" prop="wenjian" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['shenxiu:cangpin:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['shenxiu:cangpin:remove']">删除</el-button>
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

    <!-- 添加或修改藏品信息对话框 -->
    <el-dialog :title="title" v-model="open" width="50%" append-to-body>
      <el-form ref="cangpinRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="仓储" prop="cangchuId">
          <el-select v-model="form.cangchuId" placeholder="请选择仓储">
            <el-option
                v-for="dict in seleltCangchuId"
                :key="dict.selectKey"
                :label="dict.selectValue"
                :value="parseInt(dict.selectKey)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="藏品名称" prop="mingcheng">
          <el-input v-model="form.mingcheng" placeholder="请输入藏品名称" />
        </el-form-item>
        <el-form-item label="主图" prop="zhutu">
          <image-upload v-model="form.zhutu"/>
        </el-form-item>
        <el-form-item label="尺寸" prop="chicun">
          <el-input v-model="form.chicun" placeholder="请输入尺寸" />
        </el-form-item>
        <el-form-item label="重量" prop="zhongliang">
          <el-input v-model="form.zhongliang" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="等级" prop="dengji">
          <el-select v-model="form.dengji" placeholder="请选择等级">
            <el-option
                v-for="dict in cangpinjibie"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="色调" prop="sediao">
          <el-input v-model="form.sediao" placeholder="请输入色调" />
        </el-form-item>
        <el-form-item label="研究文献">
          <editor v-model="form.yanjiuwenxian" :min-height="192"/>
        </el-form-item>
        <el-form-item label="文件资料" prop="wenjian">
          <file-upload v-model="form.wenjian"/>
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

<script setup name="Cangpin">
import { listCangpin, getCangpin, delCangpin, addCangpin, updateCangpin, physicalInterface } from "@/api/shenxiu/cangpin";
import {getToken} from "@/utils/auth.js";
const { proxy } = getCurrentInstance();
const { cangpinjibie ,anquanzhuangkuang,dengji} = proxy.useDict('cangpinjibie','anquanzhuangkuang','dengji');

const cangpinList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const seleltCangchuId = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    cangchuId: null,
    mingcheng: null,
    zhutu: null,
    chicun: null,
    zhongliang: null,
    dengji: null,
    sediao: null,
    yanjiuwenxian: null,
    wenjian: null,
    weizhi: null,
    wendu: null,
    anquan: null,
    fenleiMingcheng: null,
  },
  rules: {
    cangchuId: [
      { required: true, message: "仓储不能为空", trigger: "change" }
    ],
    mingcheng: [
      { required: true, message: "藏品名称不能为空", trigger: "blur" }
    ],
    zhutu: [
      { required: true, message: "主图不能为空", trigger: "blur" }
    ],
    dengji: [
      { required: true, message: "等级不能为空", trigger: "change" }
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询藏品信息列表 */
function getList() {
  loading.value = true;
  listCangpin(queryParams.value).then(response => {
    cangpinList.value = response.rows;
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
    cangchuId: null,
    mingcheng: null,
    zhutu: null,
    chicun: null,
    zhongliang: null,
    dengji: null,
    sediao: null,
    yanjiuwenxian: null,
    wenjian: null
  };
  proxy.resetForm("cangpinRef");
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
  title.value = "添加藏品信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCangpin(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改藏品信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cangpinRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCangpin(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCangpin(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除藏品信息编号为"' + _ids + '"的数据项？').then(function() {
    return delCangpin(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('shenxiu/cangpin/export', {
    ...queryParams.value
  }, `cangpin_${new Date().getTime()}.xlsx`)
}

physicalInterface('/common/selectList/cangchu/id/weizhi').then(resp => {
  seleltCangchuId.value = resp.data;
});
getList();
</script>
