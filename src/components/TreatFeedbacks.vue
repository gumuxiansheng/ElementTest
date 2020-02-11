<template>
  <div id="TreatFeedbacks">
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
      <el-table :data="tableData" style="width: 100%" align="left">
        >
        <el-table-column
          v-for="(item,key,index) in tableColumns"
          :key="index"
          :formatter="commonController.dateFormat"
          :prop="key"
          :label="commonController.columnName(key)"
          width="150"
        ></el-table-column>
        <el-table-column label="操作" fixed>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog title="处理意见" :visible.sync="editDialogVisible" @closed="onEditClosed">
        <div>{{currentEditObject.content}}</div>
        <el-select v-model="editStatus" placeholder="情况是否属实">
          <el-option v-for="item in editStatusOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-input type="editContent" :rows="2" placeholder="反馈意见" v-model="editContent"></el-input>
        <el-input type="editPerson" :rows="1" placeholder="操作人" v-model="editPerson"></el-input>
        <el-button type="primary" @click="submitTreatment">提交</el-button>
      </el-dialog>
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
      editStatusOptions: _commonController.validTreatmentStatus(),
      editStatus: "",
      editPerson:"",
      tableData: [],
      tableColumns: [],
      editContent: "",
      editDialogVisible: false,
      commonController: _commonController,
      currentEditObject: {}
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
          distributedExclusive: true
        })
        .then(response => {
          this.tableColumns = _commonController.visibleColumns(
            "edit",
            response.data
          );
          this.tableData = response.data;
        }, _=> {
          this.$message.error("操作出现错误");
        });
    },
    submitTreatment() {
      if (this.editStatus == ""){
        this.$message.error("请确定情况是否属实");
        return;
      }
      let submits = [];
      this.currentEditObject.treatmentStatus = this.editStatus;
      this.currentEditObject.treatment = this.editContent;
      this.currentEditObject.treatPerson = this.editPerson;
      submits.push(this.currentEditObject);

      axios
        .post(_api.FeedbackTreatUrl, submits)
        .then(response => {
          this.datePicked(this.pickedDateTime);
          this.$message.success(`成功处理${submits.length}条数据`);
          this.editDialogVisible = false;
        }, _=> {
          this.$message.error("操作出现错误");
        });
    },
    handleEdit(index, row) {
      this.editStatus = row.treatmentStatus;
      this.editContent = row.treatment;
      this.editPerson = row.treatPerson;
      this.currentEditObject = row;
      this.editDialogVisible = true;
    },
    onEditClosed() {
      this.editStatus = "";
      this.editContent = "";
    }
  },
  mounted() {
    this.datePicked(this.datePickerDefault);
  }
};
</script>

<style>
</style>