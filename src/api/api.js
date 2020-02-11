import axios from 'axios';
import Config from '../config/config';

export default class Api {
    FeedbackFileUploadUrl = Config.FeedbackApiBase + "/upload";
    FeedbackDistributeUrl = Config.FeedbackApiBase + "/distribute";
    FeedbackTreatUrl = Config.FeedbackApiBase + "/treat";
    FeedbackQueryUrl = Config.FeedbackApiBase + "/query";
    FeedbackSchemaConfigUrl = Config.FeedbackApiBase + "/schema_config.json";
    FeedbackEnumerateUrl = Config.FeedbackApiBase + "/enumerate.json";
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

        //发送get请求
        axios.get(this.FeedbackEnumerateUrl).then(res => {
            this.onFeedbackEnumerateSuccess(res)
        }, this.onFeedbackEnumerateFailed);
    }

    onFeedbackSchemaConfigSuccess (res) {
        this.feedbackConfig.schema = res.data;
        console.log(this.feedbackConfig);
    }

    onFeedbackSchemaConfigFailed () {
        console.log('请求失败处理');
    }

    onFeedbackEnumerateSuccess (res) {
        this.feedbackConfig.enumerate = res.data;
        console.log(this.feedbackConfig);
    }

    onFeedbackEnumerateFailed () {
        console.log('请求失败处理');
    }
}