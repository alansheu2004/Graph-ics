var graph = document.getElementById("graph");
var width;
var height;
var originx;
var originy;
var interval;

var zooms = [
    {"unitsOnAxis":2, "smallTick":0.1, "bigTick":0.5},
    {"unitsOnAxis":4, "smallTick":0.25, "bigTick":1},
    {"unitsOnAxis":10, "smallTick":1, "bigTick":5},
    {"unitsOnAxis":20, "smallTick":1, "bigTick":5},
    {"unitsOnAxis":50, "smallTick":5, "bigTick":25}
];
var zoomNum = 2;
var zoom = zooms[zoomNum];
document.getElementById("zoomIn").addEventListener("click", function() {
    zoomNum--;
    zoom = zooms[zoomNum];
    if(zoomNum==0) {
        document.getElementById("zoomIn").disabled = true;
    }
    document.getElementById("zoomOut").disabled = false;
    reloadGraph();
});
document.getElementById("zoomOut").addEventListener("click", function() {
    zoomNum++;
    zoom = zooms[zoomNum];
    if(zoomNum==zooms.length-1) {
        document.getElementById("zoomOut").disabled = true;
    }
    document.getElementById("zoomIn").disabled = false;
    reloadGraph();
});

var grid = document.getElementById("grid");
var componentsGroup = document.getElementById("componentsGroup");
var focusGroup = document.getElementById("focusGroup");

var draggingPoint;
var draggingEntry;
var dragOffsetX;
var dragOffsetY;

function setGraphParameters() {
    width = graph.width.baseVal.value;
    height = graph.height.baseVal.value;
    originx = width/2;
    originy = height/2;
    interval = Math.min(width, height)/(2*zoom.unitsOnAxis);
}

function drawGrid() {
    for(var x = -Math.floor(width/(2*toSvgDim(1)*zoom.smallTick))*zoom.smallTick;
            toSvgDim(x) <= width; x += zoom.smallTick) {
        grid.appendChild(createSvg("line", {
            "x1" : toSvgX(x),
            "y1" : 0,
            "x2" : toSvgX(x),
            "y2" : height,
            "class" : "smallTick"
        }));
    }

    for(var y = -Math.floor(height/(2*toSvgDim(1)*zoom.smallTick))*zoom.smallTick;
            toSvgDim(y) <= height; y += zoom.smallTick) {
        grid.appendChild(createSvg("line", {
            "x1" : 0,
            "y1" : toSvgY(y),
            "x2" : width,
            "y2" : toSvgY(y),
            "class" : "smallTick"
        }));
    }

    for(var x = -Math.floor(width/(2*toSvgDim(1)*zoom.bigTick))*zoom.bigTick;
            toSvgDim(x) <= width; x += zoom.bigTick) {
        grid.appendChild(createSvg("line", {
            "x1" : toSvgX(x),
            "y1" : 0,
            "x2" : toSvgX(x),
            "y2" : height,
            "class" : "bigTick"
        }));
        grid.appendChild(createSvg("text", {
            "x" : toSvgX(x)-3,
            "y" : originy+3,
            "text-anchor" : "end",
            "alignment-baseline" : "hanging",
            "class" : "tickLabel",
            "textContent" : x
        }));
    }

    for(var y = -Math.floor(height/(2*toSvgDim(1)*zoom.bigTick))*zoom.bigTick;
            toSvgDim(y) <= height; y += zoom.bigTick) {
        grid.appendChild(createSvg("line", {
            "x1" : 0,
            "y1" : toSvgY(y),
            "x2" : width,
            "y2" : toSvgY(y),
            "class" : "bigTick"
        }));
        grid.appendChild(createSvg("text", {
            "x" : originx-3,
            "y" : toSvgY(y)+3,
            "text-anchor" : "end",
            "alignment-baseline" : "hanging",
            "class" : "tickLabel",
            "textContent" : y
        }));
    }

    grid.appendChild(createSvg("line", {
        "x1" : 0,
        "y1" : originy,
        "x2" : width,
        "y2" : originy,
        "class" : "axis"
    }));

    grid.appendChild(createSvg("line", {
        "x1" : originx,
        "y1" : 0,
        "x2" : originx,
        "y2" : height,
        "class" : "axis"
    }));
}

function drawComponents() {
    componentsGroup.textContent = "";
    for(let entry of entriesDiv.children) {
        drawComponent(entry);
    }
}

function drawComponent(entry, dragging) {
    var component = entry.component;
    if(componentsGroup.contains(entry.svgElement)) {
        eraseComponent(entry)
    }

    let svg = component.getSvg();
    svg.entry = entry;
    svg.component = component;
    entry.svgElement = svg;
    svg.addEventListener("click", focus);

    componentsGroup.appendChild(svg);

    if(entry == focusedEntry) {
        svg.classList.add("focused");
        drawFocusedComponent(entry, dragging);
    }
    return;
}

function eraseComponent(entry) {
    componentsGroup.removeChild(entry.svgElement);
    if(focusedEntry && focusedEntry == entry) {
        focusGroup.textContent = "";
    }
}

function drawFocusedComponent(entry, dragging) {
    focusGroup.textContent = "";
    if (entry) {
        let dashes = entry.component.getDashes();

        for(let dash of dashes) {
            dash.entry = entry;
            dash.component = entry.component;
            dash.style.stroke = hsvToHslText(entry.component.color, 1, 0.9);
            dash.classList.add("dashed");
            focusGroup.appendChild(dash);
        }

        let draggablePoints = entry.component.getDraggablePoints();

        for(let point of Object.keys(draggablePoints)) {
            let svg = createSvg("circle", {
                "cx" : toSvgX(draggablePoints[point].x),
                "cy" : toSvgY(draggablePoints[point].y),
                "fill" : hsvToHslText(entry.component.color, 1, 0.9),
                "stroke" : hsvToHslText(entry.component.color, 1, 0.9),
                "id" : point,
                "class" : "draggablePoint",
                "draggable" : true
            });
            svg.entry = entry;
            svg.component = entry.component;
            svg.addEventListener("mousedown", startDrag);
            if(point == dragging) {
                svg.classList.add("dragging");
            }
            focusGroup.appendChild(svg);
        }
    }
}

function startDrag(e) {
    e.preventDefault();
    draggingPoint = e.target.id;
    draggingEntry = e.target.entry;
    dragOffsetX = (e.clientX - graph.getBoundingClientRect().left) - e.target.getAttributeNS(null, "cx");
    dragOffsetY = (e.clientY - graph.getBoundingClientRect().top) - e.target.getAttributeNS(null, "cy");

    graph.addEventListener("mousemove", moveDrag);
    graph.addEventListener("mouseup", stopDrag);
}

function moveDrag(e) {
    e.preventDefault();

    var newX = (e.clientX - graph.getBoundingClientRect().left) - dragOffsetX;
    var newY = (e.clientY - graph.getBoundingClientRect().top) - dragOffsetY;

    if(e.shiftKey) {
        newX = Math.round((newX-originx)/(interval*zoom.smallTick)) * (interval*zoom.smallTick) + originx;
        newY = Math.round((newY-originy)/(interval*zoom.smallTick)) * (interval*zoom.smallTick) + originy;
    }

    var dragData = getDraggablePointData(draggingEntry, draggingPoint, newX, newY);

    for (let property of Object.keys(draggingEntry.component.properties)) {
        draggingEntry.component.properties[property] = draggingEntry.component.type.valueFromPoints(property, dragData);
    }

    updateEntry(draggingEntry);
    drawComponent(draggingEntry, draggingPoint);
}

function stopDrag(e) {
    e.preventDefault();

    drawComponent(draggingEntry);

    draggingPoint = null;
    draggingEntry = null;

    graph.removeEventListener("mousemove", moveDrag);
    graph.removeEventListener("mouseup", stopDrag);
}

function getDraggablePointData(entry, draggingPoint, newX, newY) {
    let draggablePoints = entry.component.getDraggablePoints();
    
    if (draggablePoints[draggingPoint].center) {
        let dx = toCoorX(newX) - draggablePoints[draggingPoint].x;
        let dy = toCoorY(newY) - draggablePoints[draggingPoint].y;
        for (let point of Object.keys(draggablePoints)) {
            if (draggingPoint != point && !draggablePoints[point].static) {
                draggablePoints[point].x += dx;
                draggablePoints[point].y += dy;
            }
        }
    }
    
    draggablePoints[draggingPoint] = {
        "x" : toCoorX(newX),
        "y" : toCoorY(newY)
    }

    return draggablePoints;
}

function createSvg(tag, attributes) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let attribute of Object.keys(attributes)) {
        var value = attributes[attribute];
        if(typeof value == "number") {
            value = value.toString(10);
        }
        if(attribute == "textContent") {
            element.textContent = value;
        } else {
            element.setAttribute(attribute, value);
        }
    }
    return element;
}

function toSvgX(x) {
    return originx + x*interval;
}
function toSvgY(y) {
    return originy - y*interval;
}
function toCoorX(x) {
    return (x - originx)/interval;
}
function toCoorY(y) {
    return -(y - originy)/interval;
}

function toSvgDim(val) {
    return val*interval;
}

function toCoorDim(val) {
    return val/interval;
}

graph.onload = loadGraph;
window.onresize = reloadGraph;

function loadGraph() {
    setGraphParameters();
    if(width == 0) {
        setTimeout(loadGraph, 100);
    } else {
        drawGrid();
    }
}

function reloadGraph() {
    grid.textContent = "";
    componentsGroup.textContent = "";
    focusGroup.textContent = "";
    setGraphParameters();
    drawGrid();
    drawComponents();
}