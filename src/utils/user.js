/**
 * 用户token的相关操作
 */

// 保存token
export function setToken(token) {
  sessionStorage.setItem("TOKEN", token)
}

// 删除token
export function deleteToken() {
  sessionStorage.removeItem("TOKEN")
}

// 获取token
export function getToken() {
  return sessionStorage.getItem("TOKEN")
}