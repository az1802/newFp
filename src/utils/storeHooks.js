/*
 * @Author: sunjie
 * @Date: 2022-02-11 17:18:28
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-14 16:10:51
 * @FilePath: /new-fanpiao-uniapp/src/utils/storeHooks.js
 */
import { computed } from 'vue'
import { mapGetters, mapState, useStore, createNamespacedHelpers, mapMutations, mapActions } from 'vuex'


const useMapper = (mapper, mapFn, useComputed = false) => {
  const store = useStore()

  const storeStateFns = mapFn(mapper)
  const storeState = {}
  Object.keys(storeStateFns).forEach((keyFn) => {
    const fn = storeStateFns[keyFn].bind({ $store: store })
    storeState[keyFn] = useComputed && computed(fn) || fn
  })
  return storeState
}

export const useState = (moduleName, mapper) => {
  let mapperFn = mapState
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn, true)
}

export const useGetters = (moduleName, mapper) => {
  let mapperFn = mapGetters
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn, true)
}

export const useMutations = (moduleName, mapper) => {
  let mapperFn = mapMutations
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapMutations
  } else {
    mapper = moduleName
  }

  return useMapper(mapper, mapperFn)
}

export const useActions = (moduleName, mapper) => {
  let mapperFn = mapActions
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapActions
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn)
}