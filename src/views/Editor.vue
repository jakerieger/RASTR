<template>
  <div class="editor">
    <Titlebar :title="`RASTR — ${documentName !== '' ? documentName : 'Untitled'}${hasSaved ? '' : ' *'}`"/>
    <div class="editor-container">
      <Toolbar @toolChanged="updateSelectedTool" @colorChanged="updateSelectedColor"/>
      <div class="editor-canvas-container">
        <div class="canvas-layers-container">
          <canvas 
            id="editor-canvas"
            @mousedown="canvasOnMouseDown"
            @mouseup="canvasOnMouseUp"
            @mousemove="canvasOnMouseMove"
            :style="{ cursor: cursor }"
          >
          </canvas>
          <div v-for="layer in layers" :key="layer.id">
            <canvas 
              :id="`canvas-${layer.id}`"
              class="layer-canvas" 
              :width="documentWidth" 
              :height="documentHeight"
              :style="{ 'z-index': -100 + layer.id }"
              v-show="layer.visible"
            />
          </div>
          <canvas 
              class="layer-canvas"
              :width="documentWidth" 
              :height="documentHeight"
              style="z-index: -1000"
              id="checkboard-canvas"
          />
        </div>
      </div>
      <div class="editor-properties-panel">
        <div style="flex: 1;"></div>
        <div class="layers-panel-container">
          <div class="panel-header">
            <div class="panel-title">
              <span><i class="mdi mdi-layers-triple" /></span> Layers
            </div>
            <div class="panel-buttons">
              <a class="icon-button" @click="addLayer">
                <i class="mdi mdi-plus"/>
              </a>
            </div>
          </div>
          <div class="panel-content">
            <div 
              v-for="layer in layers" 
              :key="layer.id" 
              :class="layer.id === selectedLayer ? 'layer-list-item active' : 'layer-list-item'"
              @click="selectedLayer = layer.id"
            >
              <div class="layer-preview"></div>
              <div class="layer-name">
                {{ layer.name }}
              </div>
              <div class="layer-visible">
                <a @click="updateLayerVisible(layer.id)">
                  <i :class=" layer.visible ? 'mdi mdi-eye' : 'mdi mdi-eye-off' "/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '@/components/Titlebar.vue';
import Toolbar from '@/components/Toolbar.vue';
import { Vector2D } from '../modules/math';

export default {
  name: 'Editor',
  components: {
    Titlebar,
    Toolbar
  },
  data: () => ({
    documentName: '',
    documentWidth: 0,
    documentHeight: 0,
    canvas: null,
    context: null,
    currentTool: 0,
    currentColor: '#ffffff',
    selection: null,
    isDragging: false,
    boundingRect: null,
    selectionStart: null,
    cursor: 'default',
    layers: [],
    selectedLayer: 0,
    hasSaved: false,
    tools: [
      { id: 0, name: 'Move' },
      { id: 1, name: 'Select' },
      { id: 2, name: 'Paintbrush' },
      { id: 3, name: 'Paint Bucket' },
      { id: 4, name: 'Crop' },
      { id: 5, name: 'Eraser' },
      { id: 6, name: 'Pen' },
      { id: 7, name: 'Shape' },
      { id: 8, name: 'Text' }
    ]
  }),
  watch: {
    // layers: function() {
    //   this.updateLayers();
    // }
  },
  created() {
    window.addEventListener('resize', this.onWindowResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  mounted() {
    const canvas = document.getElementById('editor-canvas');
    const ctx = canvas.getContext('2d');

    let data = this.$route.params || null;
    
    if (!data.image) {
      this.documentName = data.name;
      this.documentWidth = data.width;
      this.documentHeight = data.height;

      canvas.width = data.width;
      canvas.height = data.height;
    } else if (data.image) {
      // handle loading an image file here;
    }

    this.canvas = canvas;
    this.context = ctx;
    this.boundingRect = canvas.getBoundingClientRect();

    this.$nextTick(async function() {
      // checkerboard canvas
      const checkboardCanvas = document.getElementById('checkboard-canvas');
      const checkboardCtx = checkboardCanvas.getContext('2d');

      console.log(checkboardCanvas, checkboardCtx);

      const GRID_SIZE = 10;
      const blocksX = Math.round(this.documentWidth / GRID_SIZE);
      const blocksY = Math.round(this.documentHeight / GRID_SIZE);

      checkboardCtx.clearRect(0, 0, checkboardCanvas.width, checkboardCanvas.height);
      checkboardCtx.beginPath();
      for (let x = 0; x <= blocksX; x++) {
        for (let y = 0; y <= blocksY; y++) {
          if ((x + y) % 2 === 0) {
            checkboardCtx.fillStyle = 'white';
          } else {
            checkboardCtx.fillStyle = '#eee';
          }

          checkboardCtx.fillRect(GRID_SIZE * x, GRID_SIZE * y, GRID_SIZE, GRID_SIZE);
        }
      }

      this.addLayer();
    });
  },
  methods: {
    onWindowResize() {
      // Update canvas bounding rect

      this.$nextTick(function() {
        this.boundingRect = this.canvas.getBoundingClientRect();
      });
    },

    updateLayerVisible(id) {
      const tmpLayers = this.layers;
      tmpLayers[id].visible = !tmpLayers[id].visible;
      this.layers = [...tmpLayers];
    },

    updateSelectedTool(id) {
      this.currentTool = id;
      this.setToolCursor(id);
    },

    updateSelectedColor(color) {
      this.currentColor = color;  
    },

    addLayer() {
      const layerName = `Layer ${this.layers.length+1}`;

      this.layers.push({
        id: this.layers.length,
        name: layerName,
        canvas: null,
        context: null,
        visible: true
      });

      this.$nextTick(function() {
        this.updateLayers();
      });
    },

    updateLayers() {
      const updatedLayers = [];
      this.layers.forEach(layer => {
        if (layer.canvas === null || layer.context === null) {
          const canvas = document.getElementById(`canvas-${layer.id}`);
          const ctx = canvas.getContext('2d');

          canvas.width = this.documentWidth;
          canvas.height = this.documentHeight;

          updatedLayers.push({
            id: updatedLayers.length,
            name: layer.name,
            canvas: canvas,
            context: ctx,
            visible: layer.visible
          });
        } else {
          updatedLayers.push({
            id: updatedLayers.length,
            name: layer.name,
            canvas: null,
            context: null,
            visible: layer.visible
          });
        }
      });

      this.layers = [...updatedLayers];
    },

    setToolCursor(id) {
      switch(this.tools[id].name) {
        case "Move":
          this.cursor = 'move';
          break;
        case "Select":
          this.cursor = 'crosshair';
          break;
        case "Paintbrush":
          this.cursor = 'default';
          break;
        case "Paint Bucket":
          this.cursor = 'default';
          break;
        case "Crop":
          this.cursor = 'default';
          break;
        case "Eraser":
          this.cursor = 'default';
          break;
        case "Pen":
          this.cursor = 'default';
          break;
        case "Shape":
          this.cursor = 'default';
          break;
        case "Text":
          this.cursor = 'text';
          break;
        default:
          break;
      }
    },

    canvasOnMouseDown(e) {
      switch(this.tools[this.currentTool].name) {
        case "Move":
          break;
        case "Select":
          this.handleSelectMouseDown(e);
          break;
        case "Paintbrush":
          break;
        case "Paint Bucket":
          this.handlePaintBucketMouseDown();
          break;
        case "Crop":
          break;
        case "Eraser":
          break;
        case "Pen":
          break;
        case "Shape":
          break;
        case "Text":
          break;
        default:
          break;
      }
    },

    canvasOnMouseUp(e) {
      switch(this.tools[this.currentTool].name) {
        case "Move":
          break;
        case "Select":
          this.handleSelectMouseUp(e);
          break;
        case "Paintbrush":
          break;
        case "Paint Bucket":
          break;
        case "Crop":
          break;
        case "Eraser":
          break;
        case "Pen":
          break;
        case "Shape":
          break;
        case "Text":
          break;
        default:
          break;
      }
    },

    canvasOnMouseMove(e) {
      switch(this.tools[this.currentTool].name) {
        case "Move":
          break;
        case "Select":
          if (this.isDragging) {
            var mousePos = this.getCursorPos(e);
            var currentPos = {
              x: mousePos.x - this.selectionStart.x,
              y: mousePos.y - this.selectionStart.y
            };

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath();
            this.context.rect(this.selectionStart.x, this.selectionStart.y, currentPos.x, currentPos.y);
            this.context.setLineDash([3, 2]);
            this.context.strokeStyle = 'black';
            this.context.lineWidth = 1;
            this.context.stroke();
          }

          break;
        case "Paintbrush":
          break;
        case "Paint Bucket":
          break;
        case "Crop":
          break;
        case "Eraser":
          break;
        case "Pen":
          break;
        case "Shape":
          break;
        case "Text":
          break;
        default:
          break;
      }
    },

    getCursorPos(e) {
      return {
        x: e.clientX - this.boundingRect.left,
        y: e.clientY - this.boundingRect.top
      };
    },

    handleSelectMouseDown(e) {
      this.selectionStart = null;
      var startPos = this.getCursorPos(e);
      this.selectionStart = startPos;
      this.isDragging = true;
    },

    handleSelectMouseUp(e) {
      var endPos = this.getCursorPos(e);
      var selectionEnd = {
        x: endPos.x - this.selectionStart.x,
        y: endPos.y - this.selectionStart.y
      }

      this.selection = [this.selectionStart, selectionEnd];
      this.isDragging = false;

      // this.context.fillStyle = this.currentColor;
      // this.context.fillRect(endPos.x, endPos.y, 4, 4);
      // this.context.fillRect(this.selectionStart.x, this.selectionStart.y, 4, 4);
    },

    handlePaintBucketMouseDown() {
      if (this.selection === null) {
        this.layers[this.selectedLayer].context.beginPath();
        this.layers[this.selectedLayer].context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.layers[this.selectedLayer].context.fillStyle = this.currentColor;
        this.layers[this.selectedLayer].context.fill();
        this.layers[this.selectedLayer].context.closePath();
      } else {
        // Figure out orientation for rectangle because
        // (0,0) is always top left in canvas but our selection
        // isn't guarenteed to orient that way
        const Sx = this.selection[0].x;
        const Sy = this.selection[0].y;
        const Ex = this.selection[1].x;
        const Ey = this.selection[1].y;

        const vecS = new Vector2D(Sx, Sy);
        const vecE = new Vector2D(Ex, Ey);
        const O = vecS.Subtract(vecE);

        console.log(O.x, O.y);

        var startX, startY, endX, endY;

        if (O.x < 0 && O.y < 0) {
          startX = Sx;
          startY = Sy;
          endX = Ex;
          endY = Ey;
        } else if (O.x >= 0 && O.y >= 0) {
          startX = Ex;
          startY = Ey;
          endX = Sx;
          endY = Sy;
        } else if (O.x >= 0 && O.y < 0) {
          startX = Ex;
          startY = Sy;
          endX = Sx;
          endY = Ey;
        } else if (O.x < 0 && O.y >= 0) {
          startX = Sx;
          startY = Ey;
          endX = Ex;
          endY = Sy;
        }

        this.layers[this.selectedLayer].context.beginPath();
        this.layers[this.selectedLayer].context.rect(startX, startY, endX, endY);
        this.layers[this.selectedLayer].context.fillStyle = this.currentColor;
        this.layers[this.selectedLayer].context.fill();
        this.layers[this.selectedLayer].context.closePath();
      }
    },
  }
}
</script>

<style>
.editor-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.editor-canvas-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.editor-properties-panel {
  width: 300px;
  height: 100vh;
  background: #08090d;
  display: flex;
  flex-direction: column;
}

.layers-panel-container {
  height: 50%;
}

.panel-header {
  font-size: 14pt;
  /* padding: 10px; */
  background: #1a1c29;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}

.panel-title {
  flex: 1;
}

.panel-buttons {

}

#editor-canvas {
  /* background: #aaa; */
  box-shadow: 10px 10px 10px #000000;
}

.icon-button {
  background: none;
  outline: none;
  border: none;
  font-size: 20pt;
  width: 20px;
  height: 20px;
  transition: 250ms;
}

.icon-button:hover {
  opacity: 0.8;
  cursor: pointer;
}

.icon-button:active {
  opacity: 0.5;
}

.layer-list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
}

.layer-list-item.active {
  background: #2a2d42;
}

.layer-preview {
  width: 50px;
  height: 50px;
  border: 1px solid #1a1c29;
  background: white;
  margin-right: 10px;
}

.layer-name {
  font-weight: 400;
  flex: 1;
}

.layer-visible a {
  font-size: 14pt;
}

.layer-visible a:hover {
  opacity: 0.8;
  cursor: pointer;
}

.canvas-layers-container {
  position: relative;
}

.layer-canvas {
  background: transparent;
  position: absolute;
  left: 0;
  top: 0;
}

#checkboard-canvas {
  /* background: red; */
}
</style>