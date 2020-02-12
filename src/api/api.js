import axios from 'axios';
import Config from '../config/config';

export default class Api {
    configLoaded = false;
    FeedbackFileUploadUrl = Config.FeedbackApiBase + "/upload";
    FeedbackDistributeUrl = Config.FeedbackApiBase + "/distribute";
    FeedbackTreatUrl = Config.FeedbackApiBase + "/treat";
    FeedbackQueryUrl = Config.FeedbackApiBase + "/query";
    FeedbackQuerySummaryUrl = Config.FeedbackApiBase + "/querySummary";
    FeedbackSchemaConfigUrl = Config.FeedbackApiBase + "/schema_config.json";
    FeedbackEnumerateUrl = Config.FeedbackApiBase + "/enumerate.json";
    feedbackConfig = {};

    constructor() {
        this.initFeedbackConfig();
    }

    initFeedbackConfig() {
        if (this.configLoaded) {
            console.log("configure already loaded");
            return;
        }
        //发送get请求
        axios.get(this.FeedbackSchemaConfigUrl).then(res => {
            this.onFeedbackSchemaConfigSuccess(res)
            if (this.feedbackConfig["enumerate"] != null){
                this.configLoaded = true;
            }
        }, this.onFeedbackSchemaConfigFailed);

        //发送get请求
        axios.get(this.FeedbackEnumerateUrl).then(res => {
            this.onFeedbackEnumerateSuccess(res)
            if (this.feedbackConfig["schema"] != null){
                this.configLoaded = true;
            }
        }, this.onFeedbackEnumerateFailed);

    }

    onFeedbackSchemaConfigSuccess(res) {
        this.feedbackConfig["schema"] = res.data;
        console.log(this.feedbackConfig);
    }

    onFeedbackSchemaConfigFailed() {
        this.configLoaded = false;
        console.log('请求失败处理');
    }

    onFeedbackEnumerateSuccess(res) {
        this.feedbackConfig["enumerate"] = res.data;
        console.log(this.feedbackConfig);
    }

    onFeedbackEnumerateFailed() {
        this.configLoaded = false;
        console.log('请求失败处理');
    }

    getFeedbackConfig(){
        return this.feedbackConfig;
    }
}