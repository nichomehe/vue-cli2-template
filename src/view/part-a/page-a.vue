<template>
  <div>
    <h1 class="f-12">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'page-a',
  data () {
    return {
      msg: 'Welcome to page-a'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
