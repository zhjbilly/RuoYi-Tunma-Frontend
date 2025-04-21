<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类" prop="fenleiId">
        <el-select v-model="queryParams.fenleiId" placeholder="请选择分类">
          <el-option
              v-for="dict in seleltFenleiId"
              :key="dict.selectKey"
              :label="dict.selectValue"
              :value="parseInt(dict.selectKey)"
          ></el-option>
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
      <el-form-item label="掌门人" prop="zhangmenren">
        <el-input
            v-model="queryParams.zhangmenren"
            placeholder="请输入掌门人"
            clearable
            @keyup.enter="handleQuery"
        />
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
            v-hasPermi="['shenxiu:cangchu:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['shenxiu:cangchu:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['shenxiu:cangchu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['shenxiu:cangchu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cangchuList" @selection-change="handleSelectionChange">
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
      <el-table-column label="藏品数量" align="center" prop="cangpinShuliang" />
      <el-table-column label="掌门人" align="center" prop="zhangmenren" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['shenxiu:cangchu:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['shenxiu:cangchu:remove']">删除</el-button>
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

    <!-- 添加或修改仓储信息对话框 -->
    <el-dialog :title="title" v-model="open" width="50%" append-to-body>
      <el-form ref="cangchuRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类" prop="fenleiId">
          <el-select v-model="form.fenleiId" placeholder="请选择分类">
            <el-option
                v-for="dict in seleltFenleiId"
                :key="dict.selectKey"
                :label="dict.selectValue"
                :value="parseInt(dict.selectKey)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置" prop="weizhi">
          <el-input v-model="form.weizhi" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="温度" prop="wendu">
          <el-input v-model="form.wendu" placeholder="请输入温度" />
        </el-form-item>
        <el-form-item label="安全状况" prop="anquan">
          <el-select v-model="form.anquan" placeholder="请选择安全状况">
            <el-option
                v-for="dict in anquanzhuangkuang"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="掌门人" prop="zhangmenren">
          <el-input v-model="form.zhangmenren" placeholder="请输入掌门人" />
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

<script setup name="Cangchu">
import { listCangchu, getCangchu, delCangchu, addCangchu, updateCangchu, physicalInterface } from "@/api/shenxiu/cangchu";
import {getToken} from "@/utils/auth.js";
const { proxy } = getCurrentInstance();
const { anquanzhuangkuang } = proxy.useDict('anquanzhuangkuang');

const cangchuList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const seleltFenleiId = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    fenleiId: null,
    weizhi: null,
    wendu: null,
    anquan: null,
    cangpinShuliang: null,
    zhangmenren: null,
    fenleiMingcheng: null,
  },
  rules: {
    weizhi: [
      { required: true, message: "位置不能为空", trigger: "blur" }
    ],
    wendu: [
      { required: true, message: "温度不能为空", trigger: "blur" }
    ],
    anquan: [
      { required: true, message: "安全状况不能为空", trigger: "change" }
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询仓储信息列表 */
function getList() {
  loading.value = true;
  listCangchu(queryParams.value).then(response => {
    cangchuList.value = response.rows;
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
    fenleiId: null,
    weizhi: null,
    wendu: null,
    anquan: null,
    cangpinShuliang: null,
    zhangmenren: null
  };
  proxy.resetForm("cangchuRef");
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
  title.value = "添加仓储信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCangchu(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改仓储信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cangchuRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCangchu(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCangchu(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除仓储信息编号为"' + _ids + '"的数据项？').then(function() {
    return delCangchu(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('shenxiu/cangchu/export', {
    ...queryParams.value
  }, `cangchu_${new Date().getTime()}.xlsx`)
}

physicalInterface('/common/selectList/cangpin_fenlei/id/fenlei_mingcheng').then(resp => {
  seleltFenleiId.value = resp.data;
});
getList();
</script>
