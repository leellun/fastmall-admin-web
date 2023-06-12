<template>
    <div class="tinymce-container editor-container">
        <editor :init="init" tinymce-script-src="/tinymce/tinymce.min.js" v-model="content" />
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import {_createStorage} from '@/api/pms/storageApi'
const plugins = [
    'advlist', 'anchor', 'autolink', 'autosave', 'code', 'codesample', 'directionality', 'emoticons', 'fullscreen',
    'image', 'importcss', 'insertdatetime', 'link', 'lists', 'media', 'nonbreaking', 'pagebreak', 'preview',
    'save', 'searchreplace', 'table', 'template', 'visualblocks', 'visualchars', 'wordcount'
];
const toolbar = [
  'bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat code',
  'hr bullist numlist link image charmap preview anchor pagebreak fullscreen insertdatetime media table forecolor backcolor'
];
const init = {
    language: "zh-Hans",
    menubar: false,
    plugins: plugins,
    toolbar: toolbar,
    images_upload_handler: function(blobInfo:any, success:any, failure:any) {
            const formData = new FormData()
            formData.append('file', blobInfo.blob())
            _createStorage(formData).then(res => {
              success(res.data.data.url)
            }).catch(() => {
              failure('上传失败，请重新上传')
            })
          }
}
const emit = defineEmits(["update:value"])
const props = withDefaults(defineProps<{
    value: string|undefined|null
}>(), {
    value: ''
})
const content = computed<string>({
    get() {
        return props.value as any
    },
    set(newValue) {
        emit("update:value", newValue)
    }
})
</script>
<style lang="less" scoped>

</style>