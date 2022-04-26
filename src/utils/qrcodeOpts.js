
import { showToast } from "@utils";
import APT from "@api";
// const sceneMock = "5c0daef6ea47421c908047702b0a35a9";
// const merchantIdMock = "1e543376139b474e97d38d487fa9fbe8";
// 开发用正式环境
// const sceneMock = "09e36b4cd1ea400ba772443f0d2a8747";
// const merchantIdMock = "611e8d6b48e844a186d5ead5a8340ff0";

// const sceneMock = "e162ac24e1a64dd783f8408741c910b1";
// const merchantIdMock = "8ec573585d9645229fb01713e30a2a6d";


async function qrcodeParams(q) {
  let url = decodeURIComponent(q), parseRes = {};
  // 公众号转码的形式 'http://weixin.qq.com/q/02sNbSMf1odA410000g07O
  if (url.indexOf('weixin.qq.com') != -1) {
    let copyUrl = url, index = url.indexOf("weixin.qq.com");
    let qrCodeId = copyUrl.slice(index + 16)
    let res = await API.Merchant.getMpqrcodeTable(qrCodeId);
    if (!res) {
      showToast('网络错误,请重新扫码')
      return false;
    }
    parseRes.scene = res.tableId;
  } else {
    let queryStrs = url.split('?')[1].split('&')
    let queryParams = {}
    queryStrs.forEach((str) => {
      let queryPair = str.split('=')
      queryParams[queryPair[0]] = queryPair[1]
    })
    if ('id' in queryParams) {
      parseRes.scene = queryParams.id
    } else if ('tableId' in queryParams) {
      parseRes.tableId = queryParams.tableId
    } else if ('merchantId' in queryParams) {
      parseRes.merchantId = queryParams.merchantId
    }

    return parseRes;
  }
}

let mockOpts = {
  // scene: "09e36b4cd1ea400ba772443f0d2a8747",
  // scene: "5dc8b5512ab8458c92ff398b258aa09a", //重构是来模式测试点
  // scene: "e162ac24e1a64dd783f8408741c910b1", //飞鹅模式
  // scene:"aae068285dfe46a8afc9452539d7e0c2" // 开发用正式环境
  // merchantId:"611e8d6b48e844a186d5ead5a8340ff0", 

  // package-menu/menu?scene=e162ac24e1a64dd783f8408741c910b1

  // merchantId:"611e8d6b48e844a186d5ead5a8340ff0",
  // tableId:"92d52a15242544e9b24ca97240fc510e",
  // tableName:"6B",
  // id:"92d52a15242544e9b24ca97240fc510e"


  // merchantId: "db4aaa401485499788d310c21ebcf9e5",
  // tableId: "a1ac2b5cb8e445eb816fed75118e43ec",
  // tableName: "6B",
  // id: "92d52a15242544e9b24ca97240fc510e"
}

export async function handleQrcodeParams(opts = mockOpts) {
  console.log('%c菜单页面入参: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', opts);
  let { merchantId, peopleCount, mealType, scene, timestamp, q, tableId, tableName, id } = opts, parseRes = {};
  parseRes.tableId = tableId;
  parseRes.tableName = tableName;
  // 解析二维码参数
  if (q) {
    let parseQRes = await qrcodeParams(q);
    parseRes = {
      ...parseQRes
    }
  }

  if (timestamp && timestamp > 0) {
    let current = new Date()
    let currentUnixTime = parseInt(current.getTime() / 1000)
    if (currentUnixTime - timestamp > 10800) {
      parseRes.codeExpiredModal = true;
      return;
    }
  }

  if (merchantId && peopleCount && mealType) { //首页点击就餐模式进行跳转到点餐页面
    parseRes.merchantId = merchantId
    parseRes.peopleCount = Number(peopleCount)
    parseRes.mealType = mealType
  }

  if (scene) {
    parseRes.scene = scene;
  }

  return parseRes;

}