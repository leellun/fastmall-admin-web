<template>
  <div class="app-container">
    <v-chart :option='option' />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { _statUser } from '@/api/home/statApi'
const option = reactive({
  title: {
    text: '用户数'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['用户增长数']
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
      name: '用户增长数',
      type: 'line',
      data: []
    }
  ]
})
_statUser().then(res => {
  var array1 = new Array<any>()
  var array2 = new Array<any>()
  res.data.forEach(item => {
    array1.push(item.day)
    array2.push(item.users as any)
  })
  option.xAxis.data = array1 as any
  option.series[0].data = array2 as any
})
</script>