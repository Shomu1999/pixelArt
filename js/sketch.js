// modal

function createCanvas()
{
    let tabMain = document.createElement("div");
    tabMain.className = "tabMain";
    tabMain.innerHTML = `<div class="pixTab">
            <div class="pixHeader">
                <input type="text" id="pixTitle" placeholder="add Title" />
                <div class="pixFun">
                    <button id="cancelPix"> X </button>
                </div>
            </div>
            <div class="pixSpecs">
                <label for="canvas-width">Width:</label>
                <input type="number" id="canvas-width" min="1" placeholder="Width" value="64" />

                <label for="canvas-height">Height:</label>
                <input type="number" id="canvas-height" min="1" placeholder="Height" value="64" />
            </div>

            <div class="canvasPresets">
                <button class="preset-btn" data-width="16" data-height="16">
                    16x16
                </button>
                <button class="preset-btn" data-width="32" data-height="32">
                    32x32
                </button>
                <button class="preset-btn" data-width="64" data-height="64">
                    64x64
                </button>
                <button class="preset-btn" data-width="124" data-height="124">
                    124x124
                </button>
                <button class="preset-btn" data-width="240" data-height="240">
                    240x240
                </button>
                <button class="preset-btn" data-width="360" data-height="360">
                    360x360
                </button>
                <button class="preset-btn" data-width="480" data-height="480">
                    480x480
                </button>
            </div>
            <div class="pixCreate">
                <button id="create">Create New</button>
            </div>
        </div>`;

    document.body.appendChild(tabMain);

    
    // Add close functionality
    tabMain.querySelector("#cancelPix").addEventListener("click", function() {
        tabMain.remove();
        window.location.href = "../index.html"
    });
    // Add create functionality
    tabMain.querySelector("#create").addEventListener("click", function() {
        const width = document.getElementById('canvas-width').value;
        const height = document.getElementById('canvas-height').value;

        pixCountX = width;
        pixCountY = height;

        pixWidth = mainCanvas.width / pixCountX;
        pixHeight = mainCanvas.height / pixCountY;

        drawGrid();
        tabMain.remove();
    });

    document.querySelectorAll('.preset-btn').forEach(button => {
    button.addEventListener('click', () => {
    const width = button.getAttribute('data-width');
    const height = button.getAttribute('data-height');
    document.getElementById('canvas-width').value = width;
    document.getElementById('canvas-height').value = height;

    pixX= document.getElementById('canvas-width').value
    pixY= document.getElementById('canvas-height').value

    });
    });

    // title
    let title = document.getElementById('pixTitle');

    title.addEventListener('input', function() {
    document.title = title.value || 'Untitled';
});

createLayer();

}

// canvas

// main canvas

const mainCanvas = document.getElementById('mainCanvas');
const c = mainCanvas.getContext('2d', { willReadFrequently: true });

c.imageSmoothingEnabled = false;
mainCanvas.style.imageRendering = "pixelated";

mainCanvas.width = 1920;
mainCanvas.height = 1920;

mainCanvas.style.width = `${window.innerWidth * 0.4}px`;
mainCanvas.style.height = `${window.innerWidth * 0.4}px`;

mainCanvas.style.backgroundColor = "transparent";

// overlay canvas

const overlayCanvas = document.getElementById('overlayCanvas');
const oc = overlayCanvas.getContext('2d', { willReadFrequently: true });

oc.imageSmoothingEnabled = false;
overlayCanvas.style.imageRendering = "pixelated";

overlayCanvas.width = mainCanvas.width;
overlayCanvas.height = mainCanvas.height;

overlayCanvas.style.width = mainCanvas.style.width;
overlayCanvas.style.height = mainCanvas.style.height;

overlayCanvas.style.backgroundColor = "transparent";

// grid canvas

const gridCanvas = document.getElementById('gridCanvas');
const gc = gridCanvas.getContext('2d', { willReadFrequently: true });

gc.imageSmoothingEnabled = false;
gridCanvas.style.imageRendering = "pixelated";

gridCanvas.width = mainCanvas.width;
gridCanvas.height = mainCanvas.height;

gridCanvas.style.width = mainCanvas.style.width;
gridCanvas.style.height = mainCanvas.style.height;

gridCanvas.style.backgroundColor = "#ffffff";

function drawGrid()
{
    isGrid = true;
    for (let row = 0; row < pixCountY; row++) {
        for (let col = 0; col < pixCountX; col++) {
            
            if ((row + col) % 2 === 0) {
                gc.fillStyle = '#ffffff'; 
            } else {
                gc.fillStyle = '#d9d9d9'; 
            }

            gc.fillRect(col * pixWidth, row * pixHeight, pixWidth, pixHeight);
        }
    }
}

// toggle grid

function removeGrid()
{
    gc.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    isGrid = false;
}
let isGrid = true;

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === ";") {
        if(isGrid){
            removeGrid();
        } else {
            drawGrid();
        }
    }   
});

// layer

const layers = [];
let activeLayerIndex = 0;

function createLayer(name = "Layer " + (layers.length + 1), insertAtIndex = null) {
    const layerCanvas = document.createElement("canvas");
    layerCanvas.width = mainCanvas.width;
    layerCanvas.height = mainCanvas.height;
    layerCanvas.style.width = mainCanvas.style.width;
    layerCanvas.style.height = mainCanvas.style.height;
    layerCanvas.className = "layerCanvas";
    layerCanvas.style.backgroundColor = "transparent";
    layerCanvas.getContext("2d").imageSmoothingEnabled = false;
    layerCanvas.style.imageRendering = "pixelated";
    layerCanvas.style.display = "none";

    // Thumbnail canvas
    const thumbnail = document.createElement("canvas");
    thumbnail.width = 32;
    thumbnail.height = 32;
    thumbnail.className = "layer-thumb";
    thumbnail.style.background = "#ffffff";

    const layerData = {
        name,
        canvas: layerCanvas,
        ctx: layerCanvas.getContext("2d", { willReadFrequently: true }),
        visible: true,
        locked: false,
        blendMode: "source-over",
        opacity: 1,
        thumbnail // store reference
    };

    // Insert at correct index in layers[]
    if (insertAtIndex !== null && insertAtIndex >= 0 && insertAtIndex <= layers.length) {
        layers.splice(insertAtIndex, 0, layerData);
    } else {
        layers.push(layerData);
    }

    // Insert in DOM at the right stacking order
    const canvas = document.querySelector(".canvas");
    if (insertAtIndex !== null && insertAtIndex < canvas.children.length) {
        const existingLayerCanvas = layers[insertAtIndex + 1]?.canvas;
        canvas.insertBefore(layerCanvas, existingLayerCanvas || null);
    } else {
        canvas.appendChild(layerCanvas);
    }

    updateLayerZIndices();
    layerList();
}

function layerList() {
    const list = document.getElementById("layerList");
    list.innerHTML = "";

    layers.forEach((layer, index) => {
        const li = document.createElement("li");
        li.className = "layer-item";
        li.dataset.index = index;

         // Style background color based on lock and visibility state
        
        if (!layer.visible && layer.locked){
            li.style.color = "#6a6a6a";
            li.style.backgroundColor = "#2a2a2a";
        } else if (!layer.visible) {
            li.style.color = "#6a6a6a";
            li.style.backgroundColor = "";
        } else if (layer.locked) {
            li.style.color = "";
            li.style.backgroundColor = "#2a2a2a";
        } else {
            li.style.color = "";
            li.style.backgroundColor = "";
        }

        // Update thumbnail from layer canvas
        const thumbCtx = layer.thumbnail.getContext("2d");
        thumbCtx.clearRect(0, 0, 32, 32);
        thumbCtx.drawImage(layer.canvas, 0, 0, 32, 32);

        const nameSpan = document.createElement("span");
        nameSpan.textContent = layer.name;
        nameSpan.className = "layer-name";
        nameSpan.style.fontFamily = "Roboto Mono";

        
        li.prepend(nameSpan);
        li.prepend(layer.thumbnail);
        list.prepend(li);

        if (index === activeLayerIndex) {
            li.classList.add("active");
        }

        li.addEventListener("click", () => {
            activeLayerIndex = index;
            layerList(); // refresh
            syncLayerControls();
        });

        nameSpan.addEventListener("dblclick", () => {
            if (layer.locked) {
                return
            }
             const newName = prompt("Enter new layer name:", layer.name);
             if (newName !== null && newName.trim() !== "") {
             layer.name = newName.trim();
             layerList(); // refresh UI
            }
            });
    });
}

// z-index layer

function updateLayerZIndices() {
    layers.forEach((layer, index) => {
        layer.canvas.style.zIndex = 10 + index;
    });
}

// thumbnail update

function updateLayerThumbnail(index) {
    const layer = layers[index];
    const thumbCtx = layer.thumbnail.getContext("2d");
    thumbCtx.clearRect(0, 0, 32, 32);
    thumbCtx.drawImage(layer.canvas, 0, 0, 32, 32);
}

// layer canvas functionalities

function activeLayer() {
    return layers[activeLayerIndex];
}

// add

let addLayer = document.getElementById("addLayer");

addLayer.addEventListener("click", () => {
    const insertAt = activeLayerIndex !== null ? activeLayerIndex + 1 : layers.length;
    createLayer(undefined, insertAt);
    activeLayerIndex = insertAt; // set the new layer as active
    layerList();
    redrawLayers();
    syncLayerControls();
});

// remove

let removeLayer = document.getElementById("removeLayer");

removeLayer.addEventListener("click", () => {

    if (layers[activeLayerIndex].locked) {
        return;
    }
    deleteLayer(activeLayerIndex);
});

function deleteLayer(index) {
    if (index !== null && index >= 0 && index < layers.length) {
        const layer = layers[index];
        layer.canvas.remove(); // remove from DOM
        layers.splice(index, 1); // remove from array
        activeLayerIndex = Math.max(0, index - 1); // fallback to previous layer
        layerList(); // update UI
        redrawLayers();
    }
}

// visibility

let eye = document.getElementById("visibility");

eye.addEventListener("click", () => {
    visibilityLayer(activeLayerIndex);
});

function visibilityLayer(index) {
    const layer = layers[index];
    if (!layer) return;

    layer.visible = !layer.visible;
    layerList(); // optional if you want to show icon change later
    redrawLayers();
    syncLayerControls();
}

// lock

let lock = document.getElementById("lock");

lock.addEventListener("click", () => {
    lockLayer(activeLayerIndex);
});

function lockLayer(index) {
    const layer = layers[index];
    if (!layer) return;

    layer.locked = !layer.locked;    
    layerList(); 
}

// opacity

let layopacityrange = document.getElementById("layopacityrange");

layopacityrange.addEventListener("input", () => {
    const value = parseInt(layopacityrange.value) / 100;
    layers[activeLayerIndex].opacity = value;
    redrawLayers();
});

// blend mode

const layerBM = document.getElementById("layerStyle");

layerBM.addEventListener("change", () => {
    const mode = layerBM.value;
    layers[activeLayerIndex].blendMode = mode === "normal" ? "source-over" : mode;
    redrawLayers();
});

// sync

function syncLayerControls() {
  const active = layers[activeLayerIndex];
  if (!active) return;

  // Set opacity slider (convert 0–1 to 0–100)
  layopacityrange.value = Math.round(active.opacity * 100);

  // Set blend mode select
  layerBM.value = active.blendMode === "source-over" ? "normal" : active.blendMode;
}




// ~~~~~!initialization~~~~~

window.addEventListener('load', createCanvas);

// change title
 
document.addEventListener('DOMContentLoaded', function() {
    let inputTitle = document.getElementById('title');  
    
    inputTitle.value = document.title;    
    
    inputTitle.addEventListener('input', function() {
        document.title = inputTitle.value || 'Untitled';  
        console.log("Title updated: " + document.title);
    });
});

// properties

const colorPicker = document.getElementsByClassName("colorPicker");
const opacityRange = document.getElementById("opacityRange");
const brushSizeRange = document.getElementById("brushSize");

const opacityValue = document.getElementById("opacityValue");
const sizeValue = document.getElementById("sizeValue");

// Initial values
opacityValue.textContent = `${opacityRange.value}%`;
sizeValue.textContent = brushSize.value;

// Event listeners
opacityRange.addEventListener("input", () => {
  opacityValue.textContent = `${opacityRange.value}%`;
});

brushSize.addEventListener("input", () => {
  sizeValue.textContent = brushSize.value;
});


// color swatches

// color swatch: recent

let colorSwatchR = 
    ["#000000", "#ffffff", "#795548", "#9e9e9e", "#607d8b"]

// recent function
function renderRecentSwatches() 
{
    let swatchContainer = document.querySelector(".recentSwatches");
    swatchContainer.innerHTML = "";

    colorSwatchR.forEach((color) => {
        
        let cell = document.createElement("div");
        cell.className = "swatch";
        cell.style.backgroundColor = color;
        cell.style.width = "18px";
        cell.style.height = "18px";
        cell.style.display = "inline-block";
        cell.style.margin = "3px";
        cell.style.cursor = "pointer";
        cell.style.userSelect = "none";

        cell.addEventListener("click", () => {

            // Remove .selected from all swatches
            document.querySelectorAll('.swatch').forEach(swatch => {
            swatch.classList.remove('selected');
            });

            // Add .selected to the clicked swatch
            cell.classList.add('selected');

            document.getElementsByClassName("colorPicker").value = color;
        });

        swatchContainer.appendChild(cell);
    })
}

// color swatch: presets

let colorSwatchD = 
   ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373", "#ef5350", "#e53935", "#d32f2f", "#c62828", 
    "#b71c1c", "#ff8a80", "#ff5252", "#ff1744", "#d50000", "#fce4ec", "#f8bbd0", "#f48fb1", 
    "#f06292", "#ec407a", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#ff80ab", "#ff4081", 
    "#f50057", "#c51162", "#f3e5f5", "#e1bee7", "#ce93d8", "#ba68c8", "#ab47bc", "#8e24aa", 
    "#7b1fa2", "#6a1b9a", "#4a148c", "#ea80fc", "#e040fb", "#d500f9", "#aa00ff", "#ede7f6", 
    "#d1c4e9", "#b39ddb", "#9575cd", "#7e57c2", "#5e35b1", "#512da8", "#4527a0", "#311b92", 
    "#b388ff", "#7c4dff", "#651fff", "#6200ea", "#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb", 
    "#5c6bc0", "#3949ab", "#303f9f", "#283593", "#1a237e", "#8c9eff", "#536dfe", "#3d5afe", 
    "#304ffe", "#e3f2fd", "#bbdefb", "#90caf9", "#64b5f6", "#42a5f5", "#1e88e5", "#1976d2", 
    "#1565c0", "#0d47a1", "#82b1ff", "#448aff", "#2979ff", "#2962ff", "#e1f5fe", "#b3e5fc", 
    "#81d4fa", "#4fc3f7", "#29b6f6", "#039be5", "#0288d1", "#0277bd", "#01579b", "#80d8ff", 
    "#40c4ff", "#00b0ff", "#0091ea", "#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da", 
    "#00acc1", "#0097a7", "#00838f", "#006064", "#84ffff", "#18ffff", "#00e5ff", "#00b8d4", 
    "#e0f2f1", "#b2dfdb", "#80cbc4", "#4db6ac", "#26a69a", "#00897b", "#00796b", "#00695c", 
    "#004d40", "#a7ffeb", "#64ffda", "#1de9b6", "#00bfa5", "#e8f5e9", "#c8e6c9", "#a5d6a7", 
    "#81c784", "#66bb6a", "#43a047", "#388e3c", "#2e7d32", "#1b5e20", "#b9f6ca", "#69f0ae", 
    "#00e676", "#00c853", "#f1f8e9", "#dcedc8", "#c5e1a5", "#aed581", "#9ccc65", "#7cb342", 
    "#689f38", "#558b2f", "#33691e", "#ccff90", "#b2ff59", "#76ff03", "#64dd17", "#f9fbe7", 
    "#f0f4c3", "#e6ee9c", "#dce775", "#d4e157", "#c0ca33", "#afb42b", "#9e9d24", "#827717", 
    "#f4ff81", "#eeff41", "#c6ff00", "#aeea00", "#fffde7", "#fff9c4", "#fff59d", "#fff176", 
    "#ffee58", "#fdd835", "#fbc02d", "#f9a825", "#f57f17", "#ffff8d", "#ffff00", "#ffea00", 
    "#ffd600", "#fff8e1", "#ffecb3", "#ffe082", "#ffd54f", "#ffca28", "#ffb300", "#ffa000", 
    "#ff8f00", "#ff6f00", "#ffe57f", "#ffd740", "#ffc400", "#ffab00", "#fff3e0", "#ffe0b2", 
    "#ffcc80", "#ffb74d", "#ffa726", "#fb8c00", "#f57c00", "#ef6c00", "#e65100", "#ffd180", 
    "#ffab40", "#ff9100", "#ff6d00", "#fbe9e7", "#ffccbc", "#ffab91", "#ff8a65", "#ff7043", 
    "#f4511e", "#e64a19", "#d84315", "#bf360c", "#ff9e80", "#ff6e40", "#ff3d00", "#dd2c00", 
    "#efebe9", "#d7ccc8", "#bcaaa4", "#a1887f", "#8d6e63", "#6d4c41", "#5d4037", "#4e342e", 
    "#3e2723", "#fafafa", "#f5f5f5", "#eeeeee", "#e0e0e0", "#bdbdbd", "#757575", "#616161", 
    "#424242", "#212121"]

let colorSwatchP = 
    ["#a0ddd3", "#6fb0b7", "#577f9d", "#4a5786", "#3e3b66", "#2d1e2f", "#452e3f", "#5d4550", 
     "#7b6268", "#9c807e", "#c3a79c", "#dbc9b4", "#fcecd1", "#aad795", "#64b082", "#488885", 
     "#3f5b74", "#ebc8a7", "#d3a084", "#b87e6c", "#8f5252", "#6a3948", "#c57f79", "#ab597d", 
     "#7c3d64", "#4e2b45", "#7a3b4f", "#a94b54", "#d8725e", "#f09f71", "#f7cf91", "#000000", 
     "#ffffff", "#eceff1", "#cfd8dc", "#b0bec5", "#90a4ae", "#78909c", "#546e7a", "#455a64", 
     "#37474f", "#263238"]

// color swatch: custom

let colorSwatchC = ["#000000", "#ffffff"]

// color swatch: functionality

let swatchesContainer = document.querySelector(".preset");

function swatchFunction(colorSwatch)
{
    colorSwatch.forEach((color) => {
    
    let swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.backgroundColor = color;
    swatch.style.width = "18px";
    swatch.style.height = "18px";
    swatch.style.display = "inline-block";
    swatch.style.margin = "3px";
    swatch.style.cursor = "pointer";
    swatch.style.userSelect = "none";

    swatch.addEventListener("click", () => {

        // Remove .selected from all swatches
        document.querySelectorAll('.swatch').forEach(swatch => {
        swatch.classList.remove('selected');
        });

        // Add .selected to the clicked swatch
        swatch.classList.add('selected');

        document.getElementsByClassName("colorPicker").value = color;

        // recent add
        colorSwatchR = colorSwatchR.filter(c => c !== color);
        
        colorSwatchR.unshift(color);
        
        if (colorSwatchR.length > 16) {
        colorSwatchR.pop();
        }
        // Re-render recent swatches
        renderRecentSwatches();
    });

    swatchesContainer.appendChild(swatch);

    })
}

function clearContainer()
{
    swatchesContainer.innerHTML = "";
}

// select swatch

const swatchSelector = document.getElementById("selectSwatch");

function swatchCall(){
    clearContainer();
    const selected = swatchSelector.value;
    if (selected === "default") swatchFunction(colorSwatchD);
    else if (selected === "pastel") swatchFunction(colorSwatchP);
    else if (selected === "custom") swatchFunction(colorSwatchC);
}

// custom swatch

const addColor = document.getElementById("addColor");
const removeColor = document.getElementById("removeColor");





// invoke swatch

window.addEventListener("load", (e) => {
  renderRecentSwatches()
  swatchCall();
});

swatchSelector.addEventListener("change", (e) => {
  swatchCall();
});

// tools

function setTool(tool) {
    currentTool = tool;

    document.querySelectorAll(".toolbar > div").forEach(btn => {
        btn.classList.remove("toolbar-active");
    });

    if (tool === "select") document.querySelector(".select").classList.add("toolbar-active");
    if (tool === "pencil") document.querySelector(".pencil").classList.add("toolbar-active");
    if (tool === "brush") document.querySelector(".brush").classList.add("toolbar-active");
    if (tool === "eraser") document.querySelector(".eraser").classList.add("toolbar-active");
    if (tool === "fill") document.querySelector(".fill").classList.add("toolbar-active");
}

document.querySelector(".select").addEventListener("click", () => setTool("select"));
document.querySelector(".pencil").addEventListener("click", () => setTool("pencil"));
document.querySelector(".brush").addEventListener("click", () => setTool("brush"));
document.querySelector(".eraser").addEventListener("click", () => setTool("eraser"));
document.querySelector(".fill").addEventListener("click", () => setTool("fill"));

window.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement.tagName.toLowerCase();
    if (activeTag === "input" || activeTag === "textarea") return;

    if (e.key === "v" || e.key === "V") setTool("select");
    if (e.key === "p" || e.key === "P") setTool("pencil");
    if (e.key === "b" || e.key === "B") setTool("brush");
    if (e.key === "e" || e.key === "E") setTool("eraser");
    if (e.key === "g" || e.key === "G") setTool("fill");
    
});

// tools functionalities :: select, pencil, eraser, fill, brush, shape

let drawnCells = new Set();
let isDrawing = false;

// pencil || eraser

function drawCell(x, y)
{
    //saveState()
    const brushSize = parseInt(brushSizeRange.value);
    const color = colorPicker.value;
    const opacity = parseInt(opacityRange.value) / 100;

    oc.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    oc.globalAlpha = opacity;

    if (currentTool === "pencil") {
        oc.fillStyle = color;
    }

    for (let dx = -Math.floor(brushSize / 2); dx < Math.ceil(brushSize / 2); dx++) {
        for (let dy = -Math.floor(brushSize / 2); dy < Math.ceil(brushSize / 2); dy++) {
            const px = (x + dx) * pixWidth;
            const py = (y + dy) * pixHeight;
            const cellKey = `${px},${py}`;

            if (
                px >= 0 && py >= 0 &&
                px < mainCanvas.width && py < mainCanvas.height &&
                !drawnCells.has(cellKey)
            ) {
                drawnCells.add(cellKey);

                if (currentTool === "eraser") {
                    activeLayer().ctx.clearRect(px, py, pixWidth, pixHeight); 
                } else if (currentTool === "pencil"){
                    oc.fillRect(px, py, pixWidth, pixHeight);
                }
            }
        }
    }

    oc.globalAlpha = 1; // Reset opacity
}

// brush

function patternCell(x, y) 
{
    //saveState()
    const color = colorPicker.value;
    const opacity = parseInt(opacityRange.value) / 100;

    oc.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    let brushPattern = 
    [
    [2, -1, 0.3], [3, -1, 0.3], [-2,0, 0.3], [0, 2, 0.3],    
    [0, -2, 0.6], [-1,-1, 0.6], [2, 0, 0.6], [-1,1, 0.6],
    [0, -1, 1], [-1, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],

    ];

    if (currentTool === "brush") {
        oc.fillStyle = color;
    }

    for (let [dx, dy, alpha] of brushPattern) {
        const px = (x + dx) * pixWidth;
        const py = (y + dy) * pixHeight;

        const cellKey = `${px},${py}`;

        if (px >= 0 && py >= 0 && px < mainCanvas.width && py < mainCanvas.height && !drawnCells.has(cellKey)) {
            drawnCells.add(cellKey);
            oc.globalAlpha = opacity * alpha;
            oc.fillRect(px, py, pixWidth, pixHeight);
        }
    }

    oc.globalAlpha = 1; // Reset opacity
}

// fill

function floodCell (startX, startY) {
    const layer = layers[activeLayerIndex];
    const ctx = layer.ctx;
    const w = mainCanvas.width;
    const h = mainCanvas.height;

    const targetX = startX * pixWidth;
    const targetY = startY * pixHeight;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const startIndex = (targetY * w + targetX) * 4;
    const targetColor = [
        data[startIndex],
        data[startIndex + 1],
        data[startIndex + 2],
        data[startIndex + 3]
    ];

    const fillColor = hexToRGBA(colorPicker.value);

    if (colorsMatch(targetColor, fillColor)) return;

    const stack = [[targetX, targetY]];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const i = (y * w + x) * 4;

        const currentColor = [
            data[i],
            data[i + 1],
            data[i + 2],
            data[i + 3]
        ];

        if (!colorsMatch(currentColor, targetColor)) continue;

        // Set new color
        data[i] = fillColor[0];
        data[i + 1] = fillColor[1];
        data[i + 2] = fillColor[2];
        data[i + 3] = fillColor[3];

        // Push neighbors
        if (x + 1 < w) stack.push([x + 1, y]);
        if (x - 1 >= 0) stack.push([x - 1, y]);
        if (y + 1 < h) stack.push([x, y + 1]);
        if (y - 1 >= 0) stack.push([x, y - 1]);
    }

    ctx.putImageData(imgData, 0, 0);
    redrawLayers(); // Re-render if needed
}

function hexToRGBA(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b, 255];
}

function colorsMatch(c1, c2, tolerance = 0) {
    return (
        Math.abs(c1[0] - c2[0]) <= tolerance &&
        Math.abs(c1[1] - c2[1]) <= tolerance &&
        Math.abs(c1[2] - c2[2]) <= tolerance &&
        Math.abs(c1[3] - c2[3]) <= tolerance
    );
}



// select

/*
// zoom functionalities

let scale = 1;
const minScale = 0.6;
const maxScale = 4;
const zoomStep = 0.2;

const canvasWrapper = document.querySelector(".workspace");

const rect = canvasWrapper.getBoundingClientRect();

canvasWrapper.addEventListener("wheel", function (e) {
    e.preventDefault();

    const direction = e.deltaY > 0 ? -1 : 1;
    const zoomAmount = direction * zoomStep;
    const newScale = Math.min(maxScale, Math.max(minScale, scale + zoomAmount));

    if (newScale === scale) return;
   
    // Get mouse position relative to canvas wrapper
    const offsetX = (e.clientX - rect.left);
    const offsetY = (e.clientY - rect.top);

    // Compute zoom origin as percentage
    const originX = (offsetX / rect.width) * 100;
    const originY = (offsetY / rect.height) * 100;

    scale = newScale;
    applyZoom(originX, originY);
}, { passive: false });




function applyZoom(originX = 50, originY = 50) {
    const allCanvases = document.querySelectorAll("#mainCanvas, #overlayCanvas, #gridCanvas, .layerCanvas");

    const canvasRect = canvasWrapper.getBoundingClientRect();

    const centerX = (originX / 100) * canvasRect.width;
    const centerY = (originY / 100) * canvasRect.height;

    const translateX = (1 - scale) * centerX;
    const translateY = (1 - scale) * centerY;

    allCanvases.forEach(canvas => {
        canvas.style.transformOrigin = `${originX} ${originY}`; // always use top-left
        canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        console.log("Workspace size:", rect.width, rect.height);
console.log("Mouse relative to workspace:", e.clientX - rect.left, e.clientY - rect.top);
    });
}
*/

// undo and redo

let undoStack = [];
let redoStack = [];

function saveState()
{
    const currentState = layers.map(layer => {
        return {
            image: layer.canvas.toDataURL(),
            visible: layer.visible,
            locked: layer.locked,
            name: layer.name
        }
    });
    undoStack.push(currentState);
    redoStack = [];
    if (undoStack.length > 24){
        undoStack.shift();
    }
    
}

function restoreState(state) {
    state.forEach((layerState, i) => {
        const img = new Image();
        img.onload = () => {
            layers[i].ctx.clearRect(0, 0, layers[i].canvas.width, layers[i].canvas.height);
            layers[i].ctx.drawImage(img, 0, 0);
            layers[i].visible = layerState.visible;
            layers[i].locked = layerState.locked;
            layers[i].name = layerState.name;
            layerList(i);
            updateLayerThumbnail(i);
            redrawLayers();
        };
        img.src = layerState.image;
    });
}

function undo() {
    if (undoStack.length > 0) {
        const currentState = layers.map(layer => ({
            image: layer.canvas.toDataURL(),
            visible: layer.visible,
            locked: layer.locked,
            name: layer.name
        }));
        redoStack.push(currentState);
        if (redoStack.length > 24) {
            redoStack.shift();
        }

        const prevState = undoStack.pop();
        restoreState(prevState);
    }
}

function redo() {
    if (redoStack.length > 0) {
        const currentState = layers.map(layer => ({
            image: layer.canvas.toDataURL(),
            visible: layer.visible,
            locked: layer.locked,
            name: layer.name
        }));
        undoStack.push(currentState);

        const nextState = redoStack.pop();
        restoreState(nextState);
    }
}

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        undo();
    } else if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        redo();
    }
});


// draw

function drawOnOverlay(e)
{
    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = mainCanvas.width / rect.width;
    const scaleY = mainCanvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX / pixWidth);
    const y = Math.floor((e.clientY - rect.top) * scaleY / pixHeight);

    if (currentTool === "pencil" || currentTool === "eraser") {
        drawCell(x, y);    
    } else if (currentTool === "brush") {
        patternCell(x,y);
    } else if (currentTool === "fill") {
        floodCell(x,y)
    } else if (currentTool === "select") {
        selectCell(x,y)
    }       
}

function commitOverlay() 
{
    if (!activeLayer().locked)
    {
    let ctx = activeLayer().ctx;
    ctx.drawImage(overlayCanvas, 0, 0);
    // c.drawImage(overlayCanvas, 0, 0);
    redrawLayers();
    }
}


function redrawLayers() {
    const ctx = mainCanvas.getContext("2d");
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        if (!layer.visible) continue;

        ctx.globalAlpha = layer.opacity ?? 1;
        ctx.globalCompositeOperation = layer.blendMode ?? "source-over";
        ctx.drawImage(layer.canvas, 0, 0);
    }

    // Reset after draw
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
}



// event functions

mainCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    drawnCells.clear();
    oc.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    drawOnOverlay(e);
    commitOverlay(e);
});

mainCanvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {        
        drawOnOverlay(e);
        commitOverlay(e);
        oc.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
});

mainCanvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        commitOverlay();
        oc.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
    // drawGrid();
    updateLayerThumbnail(activeLayerIndex);
    saveState()
    isDrawing = false;
});

mainCanvas.addEventListener('mouseout', () => {
    if (isDrawing) {
        commitOverlay();
        oc.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
    updateLayerThumbnail(activeLayerIndex);
    saveState()
    isDrawing = false;
});

// download

const downloadbtn = document.getElementById("downloadbtn");

downloadbtn.addEventListener("click", (e) =>{

    const format = document.getElementById("downloadF").value;

    for (const layer of layers) {
    if (!layer.visible) continue;

    c.globalAlpha = layer.opacity ?? 1;
    c.globalCompositeOperation = layer.blendMode ?? "source-over";
    c.drawImage(layer.canvas, 0, 0, mainCanvas.width, mainCanvas.height);
    }

    mainCanvas.toBlob(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${document.title}.${format}`;
    a.click();
  }, `image/${format}`);
})

// ~color swatch: recent tabs~
// color swatch: custom
// ~color swatch: overflow~
// ~layer: opacity~
// ~layer: blending mode~
// ~undo & redo~
// ~tool: fill~
// tool: select
// zoom
// ~download function~
// localstorage