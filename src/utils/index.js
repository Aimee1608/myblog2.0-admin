/**
 * Created by PanJiaChen on 16/11/18.
 */
import Moment from 'moment'
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

export function getDateArr(searchType) {
  let myDate = new Date(); //获取今天日期
  myDate.setDate(myDate.getDate() - Number(searchType - 1));
  let dateArray = [];
  let dateTemp;
  let flag = 1;
  for (let i = 0; i < Number(searchType); i++) {
    dateTemp = (myDate.getFullYear()) + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
    dateArray.push(Moment(new Date(dateTemp)).format('YYYY-MM-DD'));
    myDate.setDate(myDate.getDate() + flag);
  }
  return dateArray;
}

export function getDateArrayBySpace(startDate, endDate, space) {
  if (!endDate) {
    endDate = new Date()
  }
  if (!startDate) {
    startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
  }
  if (!space) {
    space = 30 * 60 * 1000
  } else {
    space = space * 60 * 1000
  }
  var endTime = endDate.getTime()
  var startTime = startDate.getTime()
  var mod = endTime - startTime
  if (mod <= space) {
    alert("时间太短")
    return
  }
  var dateArray = []
  while (mod >= space) {
    var d = new Date()
    d.setTime(startTime + space)
    dateArray.push(d.getTime())
    mod = mod - space
    startTime = startTime + space
  }
  var end = endDate.getTime()
  var start = startDate.getTime()
  // const dt = space === 1440 ? new Date(start).format('MM-DD') : new Date(start).format('MM-DD HH:mm:ss')
  const dt = new Date(start).getTime()
  // console.log('dt=========', dt)
  dateArray.unshift(dt) // 插入开头时间
  return dateArray
}

export function getAllDataByDate(dateArray, dataList) {
  const res = dateArray.map((item) => {
    let mc = 0
    dataList.forEach((a) => {
      if (a.timestamp === item) {
        mc = a.count
      }
    })
    return mc
  })
  return res
}

export function initDate(time, type = 'YYYY-MM-DD HH:mm:ss') {
  return time ? Moment(time).format(type) : '--'
}

export function getPageidByPageuid(list = [], id) {
  const item = list.find(item => item.pageuid === id) || {}
  return item.pageid
}

export function pickerOptions() {
  return [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

}

export function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}
