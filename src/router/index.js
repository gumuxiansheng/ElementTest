import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'

import 'element-ui/lib/theme-chalk/index.css'

import HelloWorld from '@/components/HelloWorld'
import UploadData from '@/components/UploadData'

Vue.use(Router)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)

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
    }
  ]
})
