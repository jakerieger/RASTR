<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
}

body {
  height: 100vh;
}

* {
  font-family: 'Titillium Web';
  color: #8f94ba;
  font-weight: 300;
  box-sizing: border-box;
}

.button {
  height: 40px;
  padding-left: 40px;
  padding-right: 40px;
  background: none;
  border: none;
  outline: none;
  font-size: 12pt;
  border-radius: 8px;
  transition: 250ms;
}

.button:active {
  opacity: 0.6;
}

.button.primary {
  background: #ff3d50;
  color: white;
}

.button.primary:hover {
  background: #ff5162;
  cursor: pointer;
}

.button.secondary {
  background: #1a1c29;
}

.button.secondary:hover {
  background: #2a2d42;
  cursor: pointer;
}
</style>
