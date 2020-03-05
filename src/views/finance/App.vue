<template>
  <div class="layout">
    <router-view></router-view>
    <div style="height:50px;line-height:50px;">
      备案号：
      <a href="http://www.beian.miit.gov.cn" target="_blank" class="provider">粤ICP备18156081号-1</a>
    </div>
  </div>
</template>


<style>

.layout {
  height: 100%;
  width: 100%;
  position:absolute;
  overflow: auto;
  min-width: 1280px;
}

body {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Customize website's scrollbar like Mac OS
Not supports in Firefox and IE */

/* total width */
body::-webkit-scrollbar {
    background-color:#fff;
    width:16px
}

/* background of the scrollbar except button or resizer */
body::-webkit-scrollbar-track {
    background-color:#fff
}

/* scrollbar itself */
body::-webkit-scrollbar-thumb {
    background-color:#babac0;
    border-radius:16px;
    border:5px solid #fff
}

/* set button(top and bottom of the scrollbar) */
body::-webkit-scrollbar-button {display:none}

.provider {
  color: rgba(0, 0, 0, 0.65);
}
.provider:hover,
.provider:active,
.provider:focus,
.provider:visited {
  text-decoration: none;
}
</style>
