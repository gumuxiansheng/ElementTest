import moment from 'moment'
import Api from '../../api/api';

export default class CommonController {
    _api;
    constructor() {
        if (this._api == null) {
            console.log("new Api()");
            this._api = new Api();
        }

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

    columnName(key) {
        var schema1Map = this._api.getFeedbackConfig().schema["schema1"];
        if (Object.keys(schema1Map).length == 0) {
            return key;
        }
        if (key in schema1Map) {
            return schema1Map[key].name;
        }
        return key;
    }

    visibleColumns(page, data) {
        var schema1Map = this._api.getFeedbackConfig().schema["schema1"];
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

    validStatus() {
        return this._api.getFeedbackConfig().enumerate["status"];
    }

    validTreatmentStatus() {
        return this._api.getFeedbackConfig().enumerate["treatmentStatus"];
    }
}

;

