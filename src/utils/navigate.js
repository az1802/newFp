
import routes from './routes';

function parsePath(path) {
  let pathArr = path.split("/");
  let url = "";

  pathArr.forEach(item => {
    url = url ? url[item] : routes[item]
  });

  return url;

}
function genParamsStrs(pageOpts = {}) {
  let paramsStrs = [];
  for (let key in pageOpts) {
    paramsStrs.push(`${key}=${pageOpts[key]}`);
  }
  return paramsStrs;
}
export async function navigateTo(path, pageOpts = {}) {
  let url = parsePath(path);
  let paramsStrs = genParamsStrs(pageOpts);

  if (url) {
    return new Promise(resolve => {
      uni.navigateTo({
        url: paramsStrs.length == 0 ? url : `${url}?${paramsStrs.join("&")}`,
        success() {
          resolve(true)
        },
        fail(err) {
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


export async function reLaunch(path, pageOpts = {}) {
  let url = parsePath(path);
  let paramsStrs = genParamsStrs(pageOpts);
  return new Promise((resolve, reject) => {
    uni.reLaunch({
      url: paramsStrs.length == 0 ? url : `${url}?${paramsStrs.join("&")}`,
      success() {
        resolve(true)
      },
      fail() {
        resolve(false)
      }
    })
  })
}
export async function reLaunchUrl(url) {

  return new Promise((resolve, reject) => {
    uni.reLaunch({
      url,
      success() {
        resolve(true)
      },
      fail() {
        resolve(false)
      }
    })
  })
}


export async function redirectTo(path, pageOpts) {
  let url = parsePath(path);
  let paramsStrs = genParamsStrs(pageOpts);

  if (url) {
    return new Promise(resolve => {
      uni.redirectTo({
        url: paramsStrs.length == 0 ? url : `${url}?${paramsStrs.join("&")}`,
        success() {
          resolve(true)
        },
        fail(err) {
          resolve(false)
        }
      })
    })
  } else {
    throw new Error(`路径解析错误${path}`)
  }
}







export async function switchTab(url) {

  return new Promise((resolve, reject) => {
    uni.switchTab({
      url,
      success() {
        resolve(true)
      },
      fail() {
        resolve(false)
      }
    })
  })
}