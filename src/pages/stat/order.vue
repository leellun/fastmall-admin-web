<template>
  <div class="app-container">
    <v-chart :option='option' />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { _statOrder } from '@/api/home/statApi'
const option = reactive({
  title: {
    text: '订单统计'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['订单量', '下单用户', "订单总额"]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '订单量',
      type: 'line',
      data: []
    },
    {
      name: '下单用户',
      type: 'line',
      data: []
    },
    {
      name: '订单总额',
      type: 'line',
      data: []
    }
  ]
})
_statOrder().then(res => {
  var array1 = new Array<any>()
  var array2 = new Array<any>()
  var array3 = new Array<any>()
  var array4 = new Array<any>()
  res.data.forEach(item => {
    array1.push(item.day)
    array2.push(item.orders as any)
    array3.push(item.customers as any)
    array4.push(item.amount as any)
  })
  option.xAxis.data = array1 as any
  option.series[0].data = array2 as any
  option.series[1].data = array3 as any
  option.series[2].data = array4 as any
})
</script>
