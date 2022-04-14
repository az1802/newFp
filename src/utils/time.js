const ONE_SECOND = 1
const ONE_MINUTE = ONE_SECOND * 60
export const ONE_HOUR = ONE_MINUTE * 60
export const ONE_DAY = ONE_HOUR * 24

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/**
 *  日期格式化
 *  @param timeInSecond
 *  @param fmt {String} 格式，如 "yyyy-MM-dd hh-mm-ss"
 *
 */
export function formatTme(timeInSecond, fmt) {
  if (!timeInSecond) { return "" }
  const dateObject = getDateObject(timeInSecond)

  const patternMap = {
    'M+': dateObject.month,
    'd+': dateObject.day,
    'h+': dateObject.hours,
    'm+': dateObject.minutes,
    's+': dateObject.seconds
  }

  let nextFmt = fmt
  if (/(y+)/.test(nextFmt)) {
    nextFmt = nextFmt.replace(RegExp.$1, String(dateObject.year)).substr(4 - RegExp.$1.length)
  }

  if (/(w+)/.test(nextFmt)) {
    nextFmt = nextFmt.replace(RegExp.$1, String(dateObject.week))
  }
  for (const pattern in patternMap) {
    const regexp = new RegExp(`(${pattern})`)
    if (regexp.test(nextFmt)) {
      nextFmt = nextFmt.replace(RegExp.$1, `00${patternMap[pattern]}`.substr(-2))
    }
  }
  return nextFmt
}

export function formatDate(date, fmt) {
  return formatTme(
    parseInt(String(date.getTime() / 1000)),
    fmt
  )
}

/**
 *  获取自定义的 Date 对象
 *
 */
function getDateObject(timeInSecond) {
  // @ts-ignore
  // getDate: Global Variable
  const date = new Date(Number(`${timeInSecond}000`))
  return {
    week: WEEK[Number(date.getDay())],
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  }
}

/**
 * 设置为一天的开始(00:00:00:000)
 *
 */
export function setStartOfDay(date) {
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
}

/**
 *  设置为一天的结束(23:59:59:999)
 *
 */
export function setEndOfDay(date) {
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  date.setMilliseconds(999)
}

// 根据生日的月份和日期，计算星座。
export function getHoroscope(month, day) {
  return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(month * 2 - (day < '102223444433'.charAt(month - 1) - -19) * 2, 2)
}

export function getAge(birth) {
  // 获得今天的时间
  let date = new Date()
  let birthDate = new Date(birth)
  let newDate = date.getTime() - birthDate.getTime()
  // 向下取整  例如 10岁 20天 会计算成 10岁
  // 如果要向上取整 计算成11岁，把floor替换成 ceil
  return Math.floor(newDate / 1000 / 60 / 60 / 24 / 365) || 0
}
