<template>
  <div class="welcome">
    <Titlebar title="RASTR"/>
    <div class="container">
      <button class="welcome-button" @click="newDocument">
        <i class="mdi mdi-file"/>
        New
      </button>
      <button class="welcome-button" @click="openDocument">
        <i class="mdi mdi-folder"/>
        Open
      </button>
    </div>
  </div>
</template>

<script>
import { remote, ipcRenderer } from 'electron';
import Titlebar from '@/components/Titlebar';

export default {
  name: 'Welcome',
  components: {
    Titlebar
  },
  mounted() {
    ipcRenderer.on('create-document', (event, args) => {
      this.$router.push({
        name: 'Editor',
        params: args
      });
    });
  },
  methods: {
    newDocument() {
      ipcRenderer.send('new-document');
    },

    openDocument() {

    }
  }
}
</script>

<style>
/* .welcome {
  background: ref;
} */

.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.welcome-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 300px;
  margin: 10px;
  font-size: 20pt;
  outline: none;
  border: 2px solid #4f526d;
  border-radius: 8px;
  background: #1a1c29;
  transition: 250ms;
}

.welcome-button i {
  font-size: 48pt;
}

.welcome-button:hover {
  border: 2px solid #8f94ba;
  cursor: pointer;
}

.welcome-button:active {
  opacity: 0.5;
}
</style>