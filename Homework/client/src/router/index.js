import Vue from 'vue'
import Router from 'vue-router'
import Message from '@/components/Message'
import Balance from '@/components/Balance'
import Sign from '@/components/Sign'
import Receipt from '@/components/Receipt'
import Finance from '@/components/Finance'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Message',
      component: Message
    },
    {
      path: '/balance',
      name: 'Balance',
      component: Balance
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/receipt',
      name: 'Receipt',
      component: Receipt
    },
    {
      path: '/finance',
      name: 'Finance',
      component: Finance
    }
  ]
})

