// 接口基础配置
const isDev = process.env.NODE_ENV === 'development'
export const DEV_HOST = "http://*****"
export const PROD_HOST = "http://******"

export const HOST = isDev ? DEV_HOST : PROD_HOST
export const PAGE_SIZE = 6
export const ROOM_PAGE_SIZE = 20
