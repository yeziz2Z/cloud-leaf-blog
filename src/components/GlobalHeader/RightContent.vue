<template>
  <div :class="wrpCls">
    <!--    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />-->
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    /* setTimeout(() => {
      this.currentUser = {
        name: 'Serati Ma'
      }
    }, 1500) */
    this.currentUser = {
      name: 'Serati Ma'
    }
  }
}
</script>
