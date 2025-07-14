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
const c = mainCanvas.getContext('2d');

c.imageSmoothingEnabled = false;
mainCanvas.style.imageRendering = "pixelated";

mainCanvas.width = 1920;
mainCanvas.height = 1920;

mainCanvas.style.width = `${window.innerWidth * 0.4}px`;
mainCanvas.style.height = `${window.innerWidth * 0.4}px`;

mainCanvas.style.backgroundColor = "transparent";

// overlay canvas

const overlayCanvas = document.getElementById('overlayCanvas');
const oc = overlayCanvas.getContext('2d');

oc.imageSmoothingEnabled = false;
overlayCanvas.style.imageRendering = "pixelated";

overlayCanvas.width = mainCanvas.width;
overlayCanvas.height = mainCanvas.height;

overlayCanvas.style.width = mainCanvas.style.width;
overlayCanvas.style.height = mainCanvas.style.height;

overlayCanvas.style.backgroundColor = "transparent";

// grid canvas

const gridCanvas = document.getElementById('gridCanvas');
const gc = gridCanvas.getContext('2d');

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
let activeLayerIndex = null;

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

    // Thumbnail canvas
    const thumbnail = document.createElement("canvas");
    thumbnail.width = 32;
    thumbnail.height = 32;
    thumbnail.className = "layer-thumb";

    const layerData = {
        name,
        canvas: layerCanvas,
        ctx: layerCanvas.getContext("2d"),
        visible: true,
        locked: false,
        blendMode: "source-over",
        thumbnail // store reference
    };

    // Insert at correct index in layers[]
    if (insertAtIndex !== null && insertAtIndex >= 0 && insertAtIndex <= layers.length) {
        layers.splice(insertAtIndex, 0, layerData);
    } else {
        layers.push(layerData);
    }

    // Insert in DOM at the right stacking order
    const workspace = document.querySelector(".workspace");
    if (insertAtIndex !== null && insertAtIndex < workspace.children.length) {
        const existingLayerCanvas = layers[insertAtIndex + 1]?.canvas;
        workspace.insertBefore(layerCanvas, existingLayerCanvas || null);
    } else {
        workspace.appendChild(layerCanvas);
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
            li.style.backgroundColor = "#4d3030ff";
        } else if (!layer.visible) {
            li.style.color = "#6a6a6a";
            li.style.backgroundColor = "";
        } else if (layer.locked) {
            li.style.color = "";
            li.style.backgroundColor = "#4d3030ff";
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

// add

let addLayer = document.getElementById("addLayer");

addLayer.addEventListener("click", () => {
    const insertAt = activeLayerIndex !== null ? activeLayerIndex + 1 : layers.length;
    createLayer(undefined, insertAt);
    activeLayerIndex = insertAt; // set the new layer as active
    layerList();
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
    layer.canvas.style.display = layer.visible ? "block" : "none";
    layerList(); // optional if you want to show icon change later
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



// color swatches

// color swatch: presets

// color swatch: recent

// color swatch: custom

// tools

function setTool(tool) {
    currentTool = tool;

    document.querySelectorAll(".toolbar > div").forEach(btn => {
        btn.classList.remove("active");
    });

    if (tool === "select") document.querySelector(".select").classList.add("active");
    if (tool === "pencil") document.querySelector(".pencil").classList.add("active");
    if (tool === "brush") document.querySelector(".brush").classList.add("active");
    if (tool === "eraser") document.querySelector(".eraser").classList.add("active");
    if (tool === "fill") document.querySelector(".fill").classList.add("active");
}

// Update your existing listeners:
document.querySelector(".select").addEventListener("click", () => setTool("select"));
document.querySelector(".pencil").addEventListener("click", () => setTool("pencil"));
document.querySelector(".brush").addEventListener("click", () => setTool("brush"));
document.querySelector(".eraser").addEventListener("click", () => setTool("eraser"));
document.querySelector(".fill").addEventListener("click", () => setTool("fill"));

// Keyboard shortcuts with visual update
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


// zoom functionalities


//updateLayerThumbnail(activeLayerIndex); // call this after drawing