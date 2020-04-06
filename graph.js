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
    reloadGraph();
});
document.getElementById("zoomOut").addEventListener("click", function() {
    zoomNum++;
    zoom = zooms[zoomNum];
    reloadGraph();
});

var grid = document.getElementById("grid");
var componentsGroup = document.getElementById("componentsGroup");
var draggablePointsGroup = document.getElementById("draggablePointsGroup");

var draggablePoints;
var draggingPoint = null;
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
        let svg = entry.component.getSvg();
        svg.entry = entry;
        svg.component = entry.component;
        svg.addEventListener("click", focus);

        if(entry == focusedEntry) {
            svg.classList.add("focused");
            drawFocusedComponent(entry);
        }

        componentsGroup.appendChild(svg);
    }
}

function drawComponent(component) {
    for(let entry of entriesDiv.children) {
        if(entry.component == component) {
            if(componentsGroup.contains(component.svgElement)) {
                componentsGroup.removeChild(component.svgElement);
            }

            let svg = entry.component.getSvg();
            svg.entry = entry;
            svg.component = entry.component;
            svg.addEventListener("click", focus);

            if(entry == focusedEntry) {
                svg.classList.add("focused");
                drawFocusedComponent(entry);
            }

            componentsGroup.appendChild(svg);
            return;
        }
    }
}

function eraseComponent(component) {
    componentsGroup.removeChild(component.svgElement);
}

function drawFocusedComponent(entry) {
    draggablePointsGroup.textContent = "";
    if (entry) {
        let draggablePoints = entry.component.getDraggablePoints();

        for(let point of Object.keys(draggablePoints)) {
            let svg = createSvg("circle", {
                "cx" : toSvgX(draggablePoints[point][0]),
                "cy" : toSvgY(draggablePoints[point][1]),
                "fill" : entry.component.color,
                "stroke" : entry.component.color,
                "id" : point,
                "class" : "draggablePoint",
                "draggable" : true
            });
            svg.entry = entry;
            svg.component = entry.component;
            svg.addEventListener("click", focus);
            svg.addEventListener("mousedown", startDrag);
            draggablePointsGroup.appendChild(svg);
        }
    }
}

function startDrag(e) {
    e.preventDefault();
    draggingPoint = e.target;
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

    draggingPoint.setAttributeNS(null, "cx", newX);
    draggingPoint.setAttributeNS(null, "cy", newY);

    var component = draggingPoint.entry.component;
    var dragData = getDraggablePointData();

    for (let property of Object.keys(component.properties)) {
        component.properties[property] = component.type.valueFromPoints(property, dragData);
    }

    draggingPoint.entry = updateEntry(draggingPoint.entry, true);
    drawComponent(component);
}

function stopDrag(e) {
    e.preventDefault();

    draggingPoint = null;

    graph.removeEventListener("mousemove", moveDrag);
    graph.removeEventListener("mouseup", stopDrag);
}

function getDraggablePointData() {
    var data = {};

    for (let node of draggablePointsGroup.children) {
        data[node.id] = {
            "x" : Math.round(toCoorX(node.getAttributeNS(null, "cx"))*100)/100,
            "y" : Math.round(toCoorY(node.getAttributeNS(null, "cy"))*100)/100
        };
    }

    return data;
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
    draggablePointsGroup.textContent = "";
    setGraphParameters();
    drawGrid();
    drawComponents();
}