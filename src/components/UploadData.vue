<template>
  <div id="UploadData">
    <el-upload
      class="upload-demo"
      action
      :on-change="fileChanged"
      :limit="1"
      :on-exceed="fileExceed"
      :accept="SheetJSFT"
      :on-remove="fileRemoved"
      ref="fileupload"
      :auto-upload="false"
    >
      <el-button size="small" type="primary">点击上传</el-button>
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
          :formatter="dateFormat"
          :prop="key"
          :label="key"
          width="150%"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import moment from 'moment'

const _SheetJSFT = ["xlsx", "xlsb", "xls", "csv"]
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
      SheetJSFT: _SheetJSFT
    };
  },
  methods: {
    readExcel(fileRaw) {
      if (fileRaw.length <= 0) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(fileRaw.name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
            cellDates: true
          });
          const wsname = workbook.SheetNames[0]; // 取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {
            range: 1
          }); // 生成json表格内容
          this.tableData = ws;

          console.log(this.tableData);
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      fileReader.readAsBinaryString(fileRaw);
    },
    dateFormat (row, column) {
      var colName = column.property
      var val = row[colName];
      if (val == undefined) {
        return "";
      }
      if(colName == '提交时间' && moment(val).isValid()){
        return moment(val).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return val;
      }

    },
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
      this.readExcel(file.raw);
    }
  }
};
</script>
