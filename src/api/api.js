import axios from 'axios';
import Config from '../config/config';

export default class Api {
    FeedbackFileUploadUrl = Config.FeedbackApiBase + "/upload";
    FeedbackDistributeUrl = Config.FeedbackApiBase + "/distribute";
    FeedbackTreatUrl = Config.FeedbackApiBase + "/treat";
    FeedbackQueryUrl = Config.FeedbackApiBase + "/query";
    FeedbackSchemaConfigUrl = Config.FeedbackApiBase + "/schema_config.json";
    FeedbackEnumerateUrl = Config.FeedbackApiBase + "/enumerate.json";
    feedbackConfig = {
        schema: {
            "schema1": {
                "id": { "name": "主键", "display": [], "editable": false },
                "serialNum": { "name": "序号", "display": ["upload", "query", "edit"], "editable": false },
                "time": { "name": "提交时间", "display": ["upload", "query", "edit"], "editable": false },
                "qaType": { "name": "问卷类型", "display": ["upload", "query", "edit"], "editable": false },
                "source": { "name": "来源", "display": ["upload", "query", "edit"], "editable": false },
                "institutionType": { "name": "涉及大厅类型", "display": ["upload", "query", "edit"], "editable": false },
                "province": { "name": "所属省", "display": ["upload", "query", "edit"], "editable": false },
                "city": { "name": "所属市", "display": ["upload", "query", "edit"], "editable": false },
                "district": { "name": "所属区", "display": ["upload", "query", "edit"], "editable": false },
                "contentType": { "name": "内容类型", "display": ["upload", "query", "edit"], "editable": false },
                "content": { "name": "反馈内容", "display": ["upload", "query", "edit"], "editable": false },
                "contact": { "name": "联系方式", "display": ["upload", "query", "edit"], "editable": false },
                "status": { "name": "状态", "display": ["upload", "query", "edit"], "editable": false },
                "distributed": { "name": "已分发", "display": [], "editable": false },
                "distributeTime": { "name": "分发时间", "display": ["query", "edit"], "editable": false },
                "treatment": { "name": "处理意见", "display": ["query", "edit"], "editable": true },
                "treatmentStatus": { "name": "处理状态", "display": ["query", "edit"], "editable": false },
                "treatmentTime": { "name": "处理时间", "display": ["query", "edit"], "editable": false },
                "treatPerson": { "name": "经手人", "display": ["query", "edit"], "editable": true },
                "fileName": { "name": "上传文件名", "display": ["upload", "query", "edit"], "editable": false }
            }

        },
        enumerate: {
            "status": ["待处理", "已分发", "已处理"],
            "treatmentStatus": ["无法认定", "属实", "不属实"]
        }
    };

    constructor() {
        this.initFeedbackConfig();
    }

    initFeedbackConfig() {
        if (Object.keys(this.feedbackConfig).length != 0) {
            console.log(this.feedbackConfig);
            return;
        }
        //发送get请求
        axios.get(this.FeedbackSchemaConfigUrl).then(res => {
            this.onFeedbackSchemaConfigSuccess(res)
        }, this.onFeedbackSchemaConfigFailed);

        //发送get请求
        axios.get(this.FeedbackEnumerateUrl).then(res => {
            this.onFeedbackEnumerateSuccess(res)
        }, this.onFeedbackEnumerateFailed);
    }

    onFeedbackSchemaConfigSuccess(res) {
        this.feedbackConfig.schema = res.data;
        console.log(this.feedbackConfig);
    }

    onFeedbackSchemaConfigFailed() {
        console.log('请求失败处理');
    }

    onFeedbackEnumerateSuccess(res) {
        this.feedbackConfig.enumerate = res.data;
        console.log(this.feedbackConfig);
    }

    onFeedbackEnumerateFailed() {
        console.log('请求失败处理');
    }
}