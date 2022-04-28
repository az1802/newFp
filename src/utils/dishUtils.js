
const CATEGORY_TITLE_HEIGHT = 50;
const DISH_ITEM_HEIGHT = 86 + 24

function isSkuDish(dish) {
  return (dish?.attrList?.length > 0 || dish?.supplyCondiments?.length > 0 || dish?.childDishGroups?.length > 0) || false;;
}

function handleSkuDish(dishes) {

}



export function _processDishes(dishes, dishBaseSellCountMap = {}) {
  // 建立菜品索引
  let dishMap = {}
  let dishNameMap = {}
  dishes.forEach((dishCategory) => {
    dishCategory.dishList.forEach((dish) => {
      dishMap[dish.id] = dish
      if (dish.name in dishNameMap) {
        dishNameMap[dish.name].push(dish)
      } else {
        dishNameMap[dish.name] = [dish]
      }
      // 将菜品的规格属性组移动到第一位
      let skuAttrGroupIndex = dish.attrList.findIndex(attrGroupItem => {
        return attrGroupItem.attrs[0] && attrGroupItem.attrs[0].type == "SPECIFICATION"
      })
      if (skuAttrGroupIndex != -1) {
        let temp = dish.attrList.splice(skuAttrGroupIndex, 1);
        dish.attrList.unshift(...temp);
      }
    })
  })
  // 对于规格类菜品，需要进行多菜品合并(受客如云原始数据格式限制)
  let attrDishMap = {}, needAdjustGroupId = "", needAdjustIndex = "";
  for (var name in dishNameMap) {
    if (dishNameMap[name].length > 1) {
      let attrMap = {}
      dishNameMap[name].forEach((dish, index) => {
        if (index > 0) {
          dish.hidden = true
        } else {
          dish.hidden = false
        }
        dish.attrList.forEach((attrItem) => {
          attrItem.attrs.forEach((attr) => {
            if (attr.type === 'SPECIFICATION') {
              attrDishMap[dish.name + attr.id] = dish
            }
          })
          if (attrItem.groupId in attrMap) {
            if (attrItem.attrs.length > 0 && attrItem.attrs[0].type === 'SPECIFICATION') {
              attrMap[attrItem.groupId] = [...attrMap[attrItem.groupId]];//后续调整该groupId至最前面
              for (let i = 0; i < attrItem.attrs.length; i++) {
                let attrTemp = attrItem.attrs[i] || {};
                let hasAttr = attrMap[attrItem.groupId].some(attrMapItem => {
                  return attrMapItem.id == attrTemp.id
                })
                if (!hasAttr) {
                  attrMap[attrItem.groupId].push(JSON.parse(JSON.stringify(attrTemp)));
                }
              }
              needAdjustGroupId = attrItem.groupId
            }
          } else {
            attrMap[attrItem.groupId] = [...attrItem.attrs]
          }
        })
      })

      dishNameMap[name][0].attrList.forEach((attrItem, index) => {
        attrItem.attrs = attrMap[attrItem.groupId];
        if (needAdjustGroupId == attrItem.groupId) {
          needAdjustIndex = index
        }
      })
      // 将合并的规格属性调整到最前面
      dishNameMap[name][0].attrList.unshift(...dishNameMap[name][0].attrList.splice(needAdjustIndex, 1))
    }
  }



  getApp().globalData.attrDishMap = attrDishMap;








  // this.$storage(`${this.merchantId}-merchant-process-dish`,JSON.parse(JSON.stringify(this.dish)))
  getApp().globalData.processDishes = JSON.parse(JSON.stringify(dishes));



}



// 处理菜品的单选多选问题
function _processDishAttr(dish) {
  if (dish.attrList.length > 0) {
    dish.attrList.forEach((attrGroupItem) => {
      if (attrGroupItem?.attrSelectionType?.type == "NONE") {
        attrGroupItem.selType = attrGroupItem.isMultiSelect ? "MULTI_NOT_MUST" : "SINGLE";
      } else {
        attrGroupItem.selType = attrGroupItem?.attrSelectionType?.type
      }



    })
  }
}

export function handleDishList(dishes, dishBaseSellCountMap = {}) {

  let dishesMap = {}, dishNameMap = {}, attrDishMap = {}, hotDishes = [], allDishes = [];
  let dishSrollTops = [], categoryScrollTops = [], scrollTop = 0;

  dishes.forEach((dishCategory) => {
    dishCategory.dishList.forEach((dish) => {
      dishesMap[dish.id] = dish
      if (dish.name in dishNameMap) {
        dishNameMap[dish.name].push(dish)
      } else {
        dishNameMap[dish.name] = [dish]
      }
      // 将菜品的规格属性组移动到第一位
      let skuAttrGroupIndex = dish.attrList.findIndex(attrGroupItem => {
        return attrGroupItem.attrs[0] && attrGroupItem.attrs[0].type == "SPECIFICATION"
      })
      if (skuAttrGroupIndex != -1) {
        let temp = dish.attrList.splice(skuAttrGroupIndex, 1);
        dish.attrList.unshift(...temp);
      }
    })
  })
  // 对于规格类菜品，需要进行多菜品合并(受客如云原始数据格式限制)
  let needAdjustGroupId = "", needAdjustIndex = "";
  for (var name in dishNameMap) {
    if (dishNameMap[name].length > 1) {
      let attrMap = {}
      dishNameMap[name].forEach((dish, index) => {
        if (index > 0) {
          dish.hidden = true
        } else {
          dish.hidden = false
        }
        dish.attrList.forEach((attrItem) => {
          attrItem.attrs.forEach((attr) => {
            if (attr.type === 'SPECIFICATION') {
              attrDishMap[dish.name + attr.id] = dish
            }
          })
          if (attrItem.groupId in attrMap) {
            if (attrItem.attrs.length > 0 && attrItem.attrs[0].type === 'SPECIFICATION') {
              attrMap[attrItem.groupId] = [...attrMap[attrItem.groupId]];//后续调整该groupId至最前面
              for (let i = 0; i < attrItem.attrs.length; i++) {
                let attrTemp = attrItem.attrs[i] || {};
                let hasAttr = attrMap[attrItem.groupId].some(attrMapItem => {
                  return attrMapItem.id == attrTemp.id
                })
                if (!hasAttr) {
                  attrMap[attrItem.groupId].push(JSON.parse(JSON.stringify(attrTemp)));
                }
              }
              needAdjustGroupId = attrItem.groupId
            }
          } else {
            attrMap[attrItem.groupId] = [...attrItem.attrs]
          }
        })
      })

      dishNameMap[name][0].attrList.forEach((attrItem, index) => {
        attrItem.attrs = attrMap[attrItem.groupId];
        if (needAdjustGroupId == attrItem.groupId) {
          needAdjustIndex = index
        }
      })
      // 将合并的规格属性调整到最前面
      dishNameMap[name][0].attrList.unshift(...dishNameMap[name][0].attrList.splice(needAdjustIndex, 1))
    }
  }

  dishes.forEach((categoryItem, index) => {
    categoryItem.dishList.forEach((dish) => {

      dish.name in dishNameMap ? dishNameMap[dish.name].push(dish) : dishNameMap[dish.name] = [dish];

      // 将菜品的规格属性组移动到第一位
      let skuAttrGroupIndex = dish.attrList.findIndex(attrGroupItem => {
        return attrGroupItem.attrs[0] && attrGroupItem.attrs[0].type == "SPECIFICATION"
      })
      if (skuAttrGroupIndex != -1) {
        let temp = dish.attrList.splice(skuAttrGroupIndex, 1);
        dish.attrList.unshift(...temp);
      }
      if (dish.tag == "HOT") {
        hotDishes.push(dish);
      }

    })
  })

  if (hotDishes.length > 0) {
    dishes.unshift({
      category: {
        id: Math.floor(Math.random() * 10000000),
        name: "热销🔥"
      },
      dishList: hotDishes
    })
  }
  dishes.forEach((categoryItem, index) => {
    categoryItem.dishList.forEach(dishItem => {
      dishesMap[dishItem.id] = dishItem;
    })
  })

  // 更新菜品映射表
  dishes.forEach((categoryItem, index) => {
    categoryScrollTops.push(scrollTop);
    scrollTop += CATEGORY_TITLE_HEIGHT;

    categoryItem.dishList.forEach(dishItem => {
      // dishItem.status = 'NOT_IN_TIME_LIMIT_SALE';
      allDishes.push(dishItem);
      dishItem.isSku = isSkuDish(dishItem)
      dishItem.soldNumber += (dishBaseSellCountMap[dishItem.id]?.soldNumber || 0)
      _processDishAttr(dishItem)

      scrollTop += DISH_ITEM_HEIGHT;
      dishSrollTops.push(scrollTop);
      if (dishItem?.childDishGroups?.length > 0) {
        dishItem.childDishGroups.forEach(groupItem => {
          groupItem.childDishes.forEach(childDishItem => {

            let childDishInfo = dishesMap[childDishItem.id];
            // if (groupItem.groupName == "测试固定分组") {
            //   console.log('childDishInfo: ', childDishInfo);

            // }
            if (childDishInfo) {

              let { image, attrList, price, supplyCondiments, supplyCondimentUplimit, selectionType, status } = childDishInfo
              childDishItem.image = image
              childDishItem.shilaiSkuPirce = price
              childDishItem.supplyCondimentUplimit = supplyCondimentUplimit
              childDishItem.selectionType = selectionType
              childDishItem.attrList = attrList || []
              childDishItem.supplyCondiments = supplyCondiments || []
              childDishItem.isSku = isSkuDish(childDishItem)
              childDishItem.status = status
              _processDishAttr(childDishItem)
            }
          })
        })
      }
    })
  })





  categoryScrollTops.push(Number.MAX_SAFE_INTEGER)
  // 更新菜品滚动距离表


  getApp().globalData.dishesMap = dishesMap;
  getApp().globalData.allDishes = allDishes;
  getApp().globalData.dishSrollTops = dishSrollTops;
  getApp().globalData.categoryScrollTops = categoryScrollTops;

  return dishes;
}
export function getDishInfoById(dishId) {
  let dishesMap = getApp().globalData.dishesMap || {};
  return dishesMap[dishId] || "";
}

export function genDishDescribeText(dish) {
  let childDishesText = dish?.childDishes?.map(item => item.name) || [];
  let attrTexts = dish?.attrs?.map((item) => item.name) || [];
  let condimentTexts = dish?.supplyCondiments?.map(item => item.quantity && `${item.name}*${item.quantity}`) || [];
  let arrTemp = [...childDishesText, ...attrTexts, ...condimentTexts];
  arrTemp = arrTemp.filter(item => item != null)

  return arrTemp.length > 0 ? arrTemp.join(",") : '';
}

export function calcSkuDishPrice(dish, type = "discount") {
  let { supplyCondiments = [], attrs = [], childDishes = [], price, quantity = 0, discountPrice } = dish;
  let attrPrice = attrs.reduce((sum, { reprice }) => sum += reprice, 0);
  let condimentPrice = supplyCondiments.reduce((sum, { marketPrice, quantity = 0 }) => sum += marketPrice * quantity, 0);
  let childDishesPrice = childDishes.reduce((sum, { price = 0, addPrice = 0, quantity = 0, isSku }) => sum += isSku ? (quantity * addPrice) : (quantity * (addPrice + price)), 0)
  if (type == "origin") {
    discountPrice = 0
  }
  return ((price - discountPrice) + attrPrice + condimentPrice + childDishesPrice) * quantity;
}



export function transformDetailDishList(detailInfo) {
  if (detailInfo.isPhoneMemberPay) {
    detailInfo.payMethod = "PHONE_MEMBER_PAY"
  }
  if (detailInfo.dishList) {
    let dishList = detailInfo.dishList || []
    // 按菜品收取打包费,过滤出打包盒菜
    if (detailInfo.packageBoxType == "KRY_BOX_QTY" && detailInfo.packagingBoxDishId) {
      detailInfo.dishList = dishList.filter(dish => {
        return dish.id !== detailInfo.packagingBoxDishId
      })
    }
    detailInfo.dishList.forEach((dish) => {
      dish.priceText = Math.abs(Number((dish.totalFee / 100).toFixed(2)))
    })
  }
  detailInfo.dishList && detailInfo.dishList.forEach((dish) => {
    if (dish.isChildDish) {
      let index = detailInfo.dishList.findIndex((item) => item.uuid === dish.parentUuid)
      if (!detailInfo.dishList[index].childDishes) {
        detailInfo.dishList[index].childDishes = [dish]
      } else {
        detailInfo.dishList[index].childDishes.push(dish)
      }
    }
  })
}


export function checkChildDishGroupCount(dishInfo, selChildDishesTemp) {
  const { childDishGroups } = dishInfo;
  for (let key in selChildDishesTemp) {
    let selGroupDishes = selChildDishesTemp[key];
    let groupInfoIndex = childDishGroups.findIndex(
      (item) => item.id == key
    );
    childDishGroups[groupInfoIndex]?.childDishes?.forEach(childDishItem => {
      if (childDishItem.isMust) {
        let isMustSel = selGroupDishes.some(item => {
          item.id == childDishItem.id;
        })
        if (!isMustSel) {
          return false;
        }
      }
    })



    let { orderMin, orderMax, isFixed } = childDishGroups[groupInfoIndex];
    if (
      !isFixed &&
      (selGroupDishes.length < orderMin || selGroupDishes.length > orderMax)
    ) {
      return false;
    }
  }

  return true;
}

function hasAttrId(foodInfo = {}, attrId) {
  let attrMap = {};
  foodInfo.attrList && foodInfo.attrList.forEach(attrgroupItem => {
    attrgroupItem.attrs && attrgroupItem.attrs.forEach(attrItem => {
      attrMap[attrItem.id] = true;
    })
  })
  return attrMap[attrId];
}

export function handleStorageDishes(storageDishes, dishMap) {

  let validSelectedDishes = [];
  storageDishes.forEach(item => {
    let isValid = true
    let newDishInfo = dishMap[item.id];
    if (newDishInfo && newDishInfo.status == 'NORMAL') {
      // 商家折扣有可能发生了更改，需要同步最新的折扣立减金额
      item.discountPrice = newDishInfo.discountPrice;
      // 菜品属性组进行校验
      item.attrs && item.attrs.forEach((attrItem) => {
        if (!hasAttrId(newDishInfo, attrItem.id)) {
          isValid = false;
          return
        }
      })

      if (item.childDishGroups && item.childDishGroups.length > 0) {
        item.childDishGroups.forEach((dishGroup) => {
          dishGroup.childDishes.forEach((dish) => {
            if (!(dish.id in dishMap)) {
              isValid = false
            } else {
              dish.discountPrice = dishMap[dish.id].discountPrice
              // 菜品属性组进行校验
              let newDishInfo = dishMap[dish.id];
              dish.attrs && dish.attrs.forEach((attrItem) => {
                if (!hasAttrId(newDishInfo, attrItem.id)) {
                  isValid = false;
                }
              })
            }
          })
        })
      }


    } else {
      isValid = false;
    }

    if (isValid) {
      validSelectedDishes.push(item)
    }
  })


  return validSelectedDishes
}