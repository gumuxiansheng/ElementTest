import XLSX from 'xlsx';
import moment from 'moment'

export default class ExcelController {

    readExcel(fileRaw, vm) {
        if (fileRaw.length <= 0) {
            return false;
        } else if (!/\.(xls|xlsx)$/.test(fileRaw.name.toLowerCase())) {
            vm.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
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
                vm.tableData = ws;

                console.log(vm.tableData);
            } catch (e) {
                console.log(e);
                return false;
            }
        };
        fileReader.readAsBinaryString(fileRaw);
    }

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
};