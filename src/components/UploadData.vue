<template>
  <div id="UploadData">
    <el-upload
      class="upload-demo"
      drag
      :action="FeedbackFileUploadUrl"
      :on-change="fileChanged"
      :limit="1"
      :on-exceed="fileExceed"
      :accept="SheetJSFT"
      :on-remove="fileRemoved"
      :on-error="uploadError"
      :on-preview="filePreview"
      :on-success="uploaded"
      ref="fileupload"
      :auto-upload="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">只能上传表格文件</div>

    <div>
      <el-table :data="tableData" style="width: 100%, height:500px">
        <el-table-column
          v-for="(item,key,index) in tableColumns"
          :key="index"
          :formatter="excelController.dateFormat"
          :prop="key"
          :label="columnName(key)"
          width="150%"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ExcelController from "./controller/controller";
import Config from "../config/config";
import Api from "../api/api";

const _SheetJSFT = ["xlsx", "xlsb", "xls"]
  .map(function(x) {
    return "." + x;
  })
  .join(",");

const _excelController = new ExcelController();
const _api = new Api();

export default {
  name: "UploadData",
  data() {
    return {
      fileList: [],
      tableData: [],
      tableColumns: [],
      SheetJSFT: _SheetJSFT,
      excelController: _excelController,
      FeedbackFileUploadUrl: _api.FeedbackFileUploadUrl
    };
  },
  methods: {
    fileRemoved(file, fileList) {
      this.tableData = [];
    },
    fileExceed(file, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          file.length
        } 个文件，共选择了 ${file.length + fileList.length} 个文件`
      );
    },
    fileChanged(file, fileList) {
      console.log("fileChanged");
    },
    filePreview(file, fileList) {
      this.excelController.readExcel(
        file.raw,
        workbookSheet => {
          this.tableColumns = workbookSheet[0];
          this.tableData = workbookSheet;
        },
        () => {
          this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        }
      );
    },
    submitUpload() {
      this.$refs.fileupload.submit();
    },
    uploadError(res) {
      console.log(res);
      this.$message.error(`出现错误 ${res.data} `);
    },
    uploaded(res, file) {
      var schema1Map = _api.feedbackConfig["schema1"];
      this.$refs.fileupload.clearFiles();
      var cols = {};
      var key;
      for (key in res[0]) {
        if (
          key in schema1Map &&
          schema1Map[key].display.indexOf("upload") != -1
        ) {
          cols[key] = res[0][key];
        }
      }

      this.tableColumns = cols;
      console.log(this.tableColumns);
      this.tableData = res;
      this.$message.success(`${file.name} 上传成功!`);
    },
    columnName(key) {
      var schema1Map = _api.feedbackConfig["schema1"];
      if (Object.keys(schema1Map).length == 0) {
        return key;
      }
      if (key in schema1Map) {
        return schema1Map[key].name;
      }
      return key;
    }
  }
};
</script>
