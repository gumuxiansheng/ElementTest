<template>
  <div id="DistributeData">
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
      <el-button type="primary" @click="distribute">分发已选反馈</el-button>
    </div>
  </div>
</template>

<script>
import CommonController from "./controller/controller";
import Config from "../config/config";
import Api from "../api/api";
import axios from "axios";
import TimeUtil from "../util/time";

const _commonController = new CommonController();
const _api = new Api();
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
          to: to,
          undistributedExclusive: true
        })
        .then(response => {
          this.tableColumns = _commonController.visibleColumns(
            "query",
            response.data
          );
          this.tableData = response.data;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    distribute() {
      let ids = [];
      this.multipleSelection.forEach(element => {
        ids.push(element.id);
      });

      axios.post(_api.FeedbackDistributeUrl, ids).then(
        response => {
          this.datePicked(this.pickedDateTime);
          this.$message.success(`成功分发${ids.length}条数据`);
        },
        _ => {
          this.$message.error(`此次操作失败`);
        }
      );
    }
  },
  mounted() {
    this.datePicked(this.datePickerDefault);
  }
};
</script>

<style>
</style>