<template>
  <el-upload :action="uploadPath" :show-file-list="false" :headers="headers" :on-success="uploadPicUrl" fit="cover"
    :class="'avatar-uploader ' + (props.uploadClass ? props.uploadClass : '')" accept=".jpg,.jpeg,.png,.gif">
    <img v-if="props.value" :src="props.value" class="avatar img" :title="props.title">
    <el-icon v-else :class="'avatar-uploader-icon ' + (props.uploadClass ? (props.uploadClass + '-icon') : '')">
      <Plus />
    </el-icon>
  </el-upload>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { _createStorage, uploadPath } from '@/api/pms/storageApi'
import { useUserStore } from '@/store/user'
const emit = defineEmits(['update:value'])
var props = withDefaults(defineProps<{
  value: string | null | undefined,
  uploadClass?: string,
  title?: string
}>(), { uploadClass: 'img-uploader', title: '' })
const uploadPicUrl = (response: any) => {
  emit('update:value', response.data.url)
}
const userStore = useUserStore()
const headers = computed(() => {
  return { Authorization: `Bearer ${userStore.token}` }
})
</script>
<style type="scss"></style>
<style  scoped>
.avatar-uploader .avatar {
  display: block;
}

.img-uploader .avatar {
  width: 145px;
  height: 145px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader .img {
  max-width: 100%;
  max-height: 100%;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.el-icon.img-uploader-icon {
  width: 145px;
  height: 145px;
}
</style>
