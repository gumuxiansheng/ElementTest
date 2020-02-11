import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import HelloWorld from '@/components/HelloWorld'
import UploadData from '@/components/UploadData'
import DistributeData from '@/components/DistributeData'

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
    }
  ]
})
