<template>
  <div class="layout">
    <router-view></router-view>
  </div>
</template>
<style>

.layout {
  height: 100%;
  width: 100%;
  overflow: auto;
}

</style>


<script>

  import auth from '../../auth.js'
  const isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
  auth.setPhoneType(isIOS)
  export default {

  }

</script>
