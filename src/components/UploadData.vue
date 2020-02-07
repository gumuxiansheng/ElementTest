<template>
  <div id="UploadData">
    <el-upload
      class="upload-demo"
      :action="FeedbackFileUploadUrl"
      :on-change="fileChanged"
      :limit="1"
      :on-exceed="fileExceed"
      :accept="SheetJSFT"
      :on-remove="fileRemoved"
      ref="fileupload"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传表格文件</div>
    </el-upload>

    <div>
      <el-table 
        :data="tableData"
        style="width: 100%"
        height="500" >
        <el-table-column
          v-for="(item,key,index) in tableData[0]"
          :key="index"
          :formatter="excelController.dateFormat"
          :prop="key"
          :label="key"
          width="150%"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import ExcelController from './controller/controller'
import Config from '../config/config'

const _SheetJSFT = ["xlsx", "xlsb", "xls"]
  .map(function(x) {
    return "." + x;
  })
  .join(",");

export default {
  name: "UploadData",
  data() {
    return {
      fileList: [],
      tableData: [],
      SheetJSFT: _SheetJSFT,
      excelController: new ExcelController(),
      FeedbackFileUploadUrl: new Config().FeedbackFileUploadUrl
    };
  },
  methods: {
    fileRemoved (file, fileList) {
      this.tableData = []
    },
    fileExceed (file, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          file.length
        } 个文件，共选择了 ${file.length + fileList.length} 个文件`
      );
    },
    fileChanged(file, fileList) {
      this.excelController.readExcel(file.raw, this);
    },
    submitUpload() {
      this.$refs.fileupload.submit();
    }
  }
};
</script>
