// 获取菜单第一项
export const getFirstMenu = (obj: any, result: any) => {
    if (obj.children && obj.children.length) {
        obj.children.forEach((item:any) => {
            getFirstMenu(item, result)
        });
    } else {
        result.defaltActive = obj.index;
        result.breadList.push(obj)
        result.tagList.push(obj)
    }
}

// 浏览器前进后退: 根据index定位菜单
export const forIndexGetTitle = (data: any[], index: string, arr: string[]) => {
    for (var i = 0; i < data.length; i++) {
      if (data[i].children && data[i].children.length) {
        arr.push(data[i]);
        forIndexGetTitle(data[i].children, index, arr);
      } else {
        if (data[i].index == index) {
          arr.push(data[i]);
          return;
        }
      }
    }
};
// NOTE: 这里的缩略图只用于阿里云存储。
// 开发者可以参考其他云存储的缩略图参数。
export function thumbnail(src:string) {
  return src + '?x-oss-process=image/resize,m_lfit,h_250,w_250'
}

export function toPreview(item:any, url:string) {
  item.preview = [url]
  return item.preview
}