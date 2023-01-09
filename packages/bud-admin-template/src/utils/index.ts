import { mysqlMaxInt } from '../components/pageTemplate/tablePage/tablePageStore'
import dayjs from 'dayjs'
export const debounce = (fn: Function, delay: number) => {
  return (function () {
    if ((window as any)._$timer) {
      clearTimeout((window as any)._$timer)
    }
    ;(window as any)._$timer = setTimeout(() => {
      fn.apply(null, arguments)
    }, delay)
  })()
}

export const handleTimestamp = (timestamp: number | string): string => {
  if (timestamp === mysqlMaxInt) {
    return '永久'
  }
  timestamp = Number(timestamp)
  if (timestamp.toString().length === 10 || timestamp.toString().length === 9) {
    timestamp *= 1000
  }
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}
