
import routes from './routes';
export async function navigateTo(path, pageOpts = {}) {
  let pathArr = path.split("/");
  let url = "";

  pathArr.forEach(item => {
    url = url ? url[item] : routes[item]
  });
  let paramsStrs = [];
  for (let key in pageOpts) {
    paramsStrs.push(`${key}=${pageOpts[key]}`);
  }
  console.log('%cparamsStrs: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', paramsStrs);

  if (url) {

    return new Promise(resolve => {
      uni.navigateTo({
        url: paramsStrs.length == 0 ? url : `${url}?${paramsStrs.join("&")}`,
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