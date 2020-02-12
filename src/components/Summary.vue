<template>
  <div id="Summary">
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
      <el-select v-model="categorySelection" placeholder="请选择查看类别" @change="onCategorySelected">
        <el-option
          v-for="item in categorySelections"
          :key="item"
          :label="commonController.columnName(item)"
          :value="item"
        ></el-option>
      </el-select>
      <el-table :data="tableData" style="width: 100%" align="left">
        >
        <el-table-column
          v-for="(item, index) in tableColumns"
          :key="index"
          :formatter="commonController.dateFormat"
          :prop="item"
          :label="item"
          width="150"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import CommonController from "./controller/CommonController";
import Config from "../config/config";
import Api from "../api/api";
import axios from "axios";
import TimeUtil from "../util/time";

const _commonController = new CommonController();
const _api = _commonController._api;
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
      categorySelections: [],
      categorySelection: "",
      commonController: _commonController,
      summaries:{}
    };
  },
  methods: {
    datePicked(pickedTime) {
      this.pickedDateTime = pickedTime;
      let from = _timeUtil.formatDate(pickedTime[0]);
      let to = _timeUtil.formatDate(pickedTime[1]);

      axios
        .post(_api.FeedbackQuerySummaryUrl + "?schema=schema1", {
          from: from,
          to: to
        })
        .then(response => {
          this.summaries = response.data["summary"];
          for (let index = 0; index < this.summaries.length; index++) {
            this.categorySelections.push(this.summaries[index].colName);
          }

          this.tableColumns = ["category", "count"];
          if (this.summaries.length == 0){
            this.tableData = [];
          }
        });
    },
    onCategorySelected() {
      this.tableData =
        this.summaries[this.categorySelections.indexOf(this.categorySelection)]["colSummary"];
    }
  },
  mounted() {
    this.datePicked(this.datePickerDefault);
  }
};
</script>

<style>
</style>