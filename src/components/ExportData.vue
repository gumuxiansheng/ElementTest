<template>
  <div id="ExportData">
    <div>
      <el-date-picker
        v-model="datePickerDefault"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="center"
        @change="datePicked"
        ref="datePicker"
      ></el-date-picker>
      <el-table
        :data="tableData"
        style="width: 100%"
        align="left"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column
          v-for="(item,key,index) in tableColumns"
          :key="index"
          :formatter="commonController.dateFormat"
          :prop="key"
          :label="commonController.columnName(key)"
          width="150"
        ></el-table-column>
      </el-table>
    </div>
    <div>
      <el-button type="primary" @click="exportSelected">导出已选反馈</el-button>
    </div>
  </div>
</template>

<script>
import CommonController from "./controller/CommonController";
import ExcelController from "./controller/ExcelController";
import Config from "../config/config";
import Api from "../api/api";
import axios from "axios";
import TimeUtil from "../util/time";
import regeneratorRuntime from 'regenerator'

const _commonController = new CommonController();
const _api = _commonController._api;
const _excelController = new ExcelController();
const _timeUtil = new TimeUtil();

export default {
  name: "UploadData",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      datePickerDefault: [
        new Date().getTime() - 3600 * 1000 * 24 * 90,
        new Date()
      ],
      pickedDateTime: [],
      tableData: [],
      tableColumns: [],
      multipleSelection: [],
      commonController: _commonController
    };
  },
  methods: {
    datePicked(pickedTime) {
      this.pickedDateTime = pickedTime;
      let from = _timeUtil.formatDate(pickedTime[0]);
      let to = _timeUtil.formatDate(pickedTime[1]);

      axios
        .post(_api.FeedbackQueryUrl, {
          from: from,
          to: to
        })
        .then(response => {
          this.tableColumns = _commonController.visibleColumns(
            "export",
            response.data
          );
          this.tableData = response.data;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    exportSelected() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择");
        return;
      }
      let selected = [];

      for (let index = 0; index < this.multipleSelection.length; index++) {
        var element = this.multipleSelection[index];
        let item = {};
        for (var colName in element) {
          if (colName in this.tableColumns) {
            item[_commonController.columnName(colName)] = element[colName];
          } else {
          }
        }
        selected.push(item);
      }
      _excelController.writeExcel(selected);
    }
  },
  mounted() {
    this.datePicked(this.datePickerDefault);
  }
};
</script>

<style>
</style>