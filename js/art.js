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

        mainCanvas.width = width;
        mainCanvas.height = height;

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

}

// canvas

// main canvas

const mainCanvas = document.getElementById('mainCanvas');
const c = mainCanvas.getContext('2d');

c.imageSmoothingEnabled = false;
mainCanvas.style.imageRendering = "pixelated";

mainCanvas.style.width = `${window.innerWidth * 0.4}px`;
mainCanvas.style.height = `${window.innerWidth * 0.4}px`;

mainCanvas.style.backgroundColor = "#ffffff";

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

gridCanvas.style.backgroundColor = "transparent";

function drawGrid()
{
    isGrid = true;
    for (let row = 0; row < mainCanvas.height; row++) {
        for (let col = 0; col < mainCanvas.width; col++) {
            gc.strokeStyle = '#d9d9d9';
            gc.lineWidth = 1;
            gc.strokeRect(col, row, 1, 1);
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

// layer canvas functionalities

// ~~~~~!initialization~~~~~

window.addEventListener('load', createCanvas);

// tools

// tools functionalities :: select, pencil, eraser, fill, brush, shape

// properties

// color swatches

// color swatch: presets

// color swatch: recent

// color swatch: custom

// zoom functionalities

// 