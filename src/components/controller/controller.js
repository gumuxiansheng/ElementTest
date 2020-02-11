import XLSX from 'xlsx';
import moment from 'moment'
import Api from "../../api/api";

const _api = new Api();

export default class CommonController {
    dateFormat(row, column) {
        var colName = column.property
        var val = row[colName];
        if (val == undefined) {
            return "";
        }
        if (colName == '提交时间' && moment(val).isValid()) {
            return moment(val).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return val;
        }
    }

    columnName(key) {
        var schema1Map = _api.feedbackConfig.schema["schema1"];
        if (Object.keys(schema1Map).length == 0) {
            return key;
        }
        if (key in schema1Map) {
            return schema1Map[key].name;
        }
        return key;
    }

    visibleColumns(page, data) {
        var schema1Map = _api.feedbackConfig.schema["schema1"];
        var cols = {};
        var key;
        for (key in data[0]) {
            if (
                key in schema1Map &&
                schema1Map[key].display.indexOf(page) != -1
            ) {
                cols[key] = data[0][key];
            }
        }
        return cols;
    }

    validStatus(){
        return _api.feedbackConfig.enumerate["status"];
    }

    validTreatmentStatus(){
        return _api.feedbackConfig.enumerate["treatmentStatus"];
    }
}

export class ExcelController {

    readExcel(fileRaw, successCallback, formatErrorCallback) {
        if (fileRaw.length <= 0) {
            return false;
        } else if (!/\.(xls|xlsx)$/.test(fileRaw.name.toLowerCase())) {
            formatErrorCallback();
            // vm.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
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
                successCallback(ws);
                // vm.tableData = ws;
                // console.log(vm.tableData);
            } catch (e) {
                console.log(e);
                return false;
            }
        };
        fileReader.readAsBinaryString(fileRaw);
    }

};

export class JsonController {

}