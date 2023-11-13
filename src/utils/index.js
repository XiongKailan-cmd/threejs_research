
// 获取路由名字
export function getRouterName (str) {
  const regex = /\/views\/(\w+)\/index\.vue$/;
  return str.match(regex)[1];
}