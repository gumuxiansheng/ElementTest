import XLSX from 'xlsx';
export default class ExcelController {
    readExcel(fileRaw, successCallback, formatErrorCallback) {
        if (fileRaw.length <= 0) {
            return false;
        }
        else if (!/\.(xls|xlsx)$/.test(fileRaw.name.toLowerCase())) {
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
            }
            catch (e) {
                console.log(e);
                return false;
            }
        };
        fileReader.readAsBinaryString(fileRaw);
    }
    writeExcel(data) {
        var sheet = XLSX.utils.json_to_sheet(data);
        this.openDownloadDialog(this.sheet2blob(sheet), '导出.xlsx');
    }
    sheet2blob(sheet, sheetName) {
        sheetName = sheetName || 'sheet1';
        var workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet;
        // 生成excel的配置项
        var wopts = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        };
        var wbout = XLSX.write(workbook, wopts);
        var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        // 字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        return blob;
    }
    openDownloadDialog(url, saveName) {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if (window.MouseEvent)
            event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
}
