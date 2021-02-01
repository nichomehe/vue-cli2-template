// 用户身份标识
export const mapId = {
  filters: {
    mapId(type) {
      let oMap = {
        1: '用户a',
        2: '用户b'
      }
      return oMap[type];
    }
  }
}