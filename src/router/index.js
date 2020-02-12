import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import HelloWorld from '@/components/HelloWorld'
import UploadData from '@/components/UploadData'
import ExportData from '@/components/ExportData'
import DistributeData from '@/components/DistributeData'
import TreatFeedbacks from '@/components/TreatFeedbacks'
import Summary from '@/components/Summary'

Vue.use(Router)
Vue.use(ElementUI)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/upload',
      name: 'UploadData',
      component: UploadData
    },
    {
      path: '/distribute',
      name: 'DistributeData',
      component: DistributeData
    },
    {
      path: '/treat',
      name: 'TreatFeedbacks',
      component: TreatFeedbacks
    },
    {
      path: '/export',
      name: 'ExportData',
      component: ExportData
    },
    {
      path: '/summary',
      name: 'Summary',
      component: Summary
    }
  ]
})
