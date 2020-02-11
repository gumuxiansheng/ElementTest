import axios from 'axios';
import Config from '../config/config';

export default class Api {
    FeedbackFileUploadUrl = Config.FeedbackApiBase + "/upload";
    FeedbackDistributeUrl = Config.FeedbackApiBase + "/distribute";
    FeedbackTreatUrl = Config.FeedbackApiBase + "/treat";
    FeedbackQueryUrl = Config.FeedbackApiBase + "/query";
    FeedbackSchemaConfigUrl = Config.FeedbackApiBase + "/schema_config.json";
    feedbackConfig = {};

    constructor(){
        this.initFeedbackConfig();
    }

    initFeedbackConfig() {
        if (Object.keys(this.feedbackConfig).length != 0){
            console.log(this.feedbackConfig);
            return;
        }
        //发送get请求
        axios.get(this.FeedbackSchemaConfigUrl).then(res => {
            this.onFeedbackSchemaConfigSuccess(res)
        }, this.onFeedbackSchemaConfigFailed);
    }

    onFeedbackSchemaConfigSuccess (res) {
        this.feedbackConfig = res.data;
        console.log(this.feedbackConfig);
    }

    onFeedbackSchemaConfigFailed () {
        console.log('请求失败处理');
    }
}