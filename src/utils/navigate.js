
import routes from './routes';
export async function navigateTo(path) {
  let pathArr = path.split("/");
  let url = "";

  pathArr.forEach(item => {
    url = url ? url[item] : routes[item]
  });

  if (url) {
    return new Promise(resolve => {
      uni.navigateTo({
        url,
        success() {
          resolve(true)
        },
        fail() {
          resolve(false)
        }
      })
    })
  } else {
    throw new Error(`路径解析错误${path}`)
  }

}

export async function navigateBack(...args) {
  uni.navigateBack(...args)
}