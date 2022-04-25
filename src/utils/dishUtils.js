
const CATEGORY_TITLE_HEIGHT = 50;
const DISH_ITEM_HEIGHT = 86 + 24

function isSkuDish(dish) {
  return (dish?.attrList?.length > 0 || dish?.supplyCondiments?.length > 0 || dish?.childDishGroups?.length > 0) || false;;
}

function handleSkuDish(dishes) {

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

  // 
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

  // 更新菜品映射表
  dishes.forEach((categoryItem, index) => {
    categoryScrollTops.push(scrollTop);
    scrollTop += CATEGORY_TITLE_HEIGHT;

    categoryItem.dishList.forEach(dishItem => {
      // dishItem.status = 'NOT_IN_TIME_LIMIT_SALE';
      dishesMap[dishItem.id] = dishItem;
      allDishes.push(dishItem);
      dishItem.isSku = isSkuDish(dishItem)
      dishItem.soldNumber += (dishBaseSellCountMap[dishItem.id]?.soldNumber || 0)
      _processDishAttr(dishItem)

      scrollTop += DISH_ITEM_HEIGHT;
      dishSrollTops.push(scrollTop);
      if (dishItem?.childDishGroups?.length > 0) {
        dishItem.childDishGroups.forEach(groupItem => {
          groupItem.childDishes.forEach(childDishItem => {
            let childDishInfo = dishesMap[childDishItem.id]
            if (childDishInfo) {
              let { image, attrList, price, supplyCondiments, supplyCondimentUplimit, selectionType } = childDishInfo
              childDishItem.image = image
              childDishItem.shilaiSkuPirce = price
              childDishItem.supplyCondimentUplimit = supplyCondimentUplimit
              childDishItem.selectionType = selectionType
              childDishItem.attrList = attrList || []
              childDishItem.supplyCondiments = supplyCondiments || []
              childDishItem.isSku = isSkuDish(childDishItem)
              _processDishAttr(childDishItem)
            }
          })
        })
      }
    })
  })





  categoryScrollTops.push(Number.MAX_SAFE_INTEGER)
  // 更新菜品滚动距离表


  getApp().globalData.dishMap = dishesMap;
  getApp().globalData.allDishes = allDishes;
  getApp().globalData.dishSrollTops = dishSrollTops;
  getApp().globalData.categoryScrollTops = categoryScrollTops;

  return dishes;
}
export function getDishInfoById(dishId) {
  let dishesMap = getApp().globalData.dishMap || {};
  return dishesMap[dishId] || "";
}

export function genDishDescribeText(dish) {
  let childDishesText = dish?.childDishes?.map(item => item.name) || [];
  let attrTexts = dish?.attrs?.map((item) => item.name) || [];
  let condimentTexts = dish?.supplyCondiments?.map(item => `${item.name}*${item.quantity}`) || [];
  return [...childDishesText, ...attrTexts, ...condimentTexts].join(",")
}

export function calcSkuDishPrice(dish, type = "discount") {
  let { supplyCondiments = [], attrs = [], childDishes = [], price, quantity = 0, discountPrice } = dish;
  let attrPrice = attrs.reduce((sum, { reprice }) => sum += reprice, 0);
  let condimentPrice = supplyCondiments.reduce((sum, { marketPrice, quantity = 0 }) => sum += marketPrice * quantity, 0);
  let childDishesPrice = childDishes.reduce((sum, { price = 0, addPrice = 0, quantity = 0 }) => sum += quantity * (addPrice + price), 0)
  if (type == "origin") {
    discountPrice = 0
  }
  return ((price - discountPrice) + attrPrice + condimentPrice + childDishesPrice) * quantity;
}