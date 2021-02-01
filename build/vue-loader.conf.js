'use strict'
var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  postcss: [
    require('postcss-plugin-px2rem')({
      // base on 375px standard.
      rootValue: 37.5,
      // to leave 1px alone.
      minPixelValue: 1.01
    })
  ]
}
