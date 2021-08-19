<template>
  <i v-if="icon&&icon.includes('el-icon')"
     :class="[icon, 'sub-el-icon'
     ]"></i>
  <span v-if="title&&sidebar.opened">
    {{title}}
  </span>
</template>
<script>
export default {
  name: 'MenuItem',
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
