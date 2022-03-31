/*
 * @Author: sunjie
 * @Date: 2022-02-16 18:22:48
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 10:39:49
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/storeHooks.js
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

export function useState(moduleName, mapper) {
  let mapperFn = mapState
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn, true)
}

export function useGetters(moduleName, mapper) {
  let mapperFn = mapGetters
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn, true)
}

export function useMutations(moduleName, mapper) {
  let mapperFn = mapMutations
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapMutations
  } else {
    mapper = moduleName
  }

  return useMapper(mapper, mapperFn)
}

export function useActions(moduleName, mapper) {
  let mapperFn = mapActions
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapActions
  } else {
    mapper = moduleName
  }
  return useMapper(mapper, mapperFn)
}