import router from './router'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const needLoginUrls = ['/editor/article']
const loginRoutePath = '/user/login'
const defaultRoutePath = '/index'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (needLoginUrls.includes(to.name)) {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done()
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
