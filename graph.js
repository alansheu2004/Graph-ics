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

function setGraphParameters() {
    width = graph.width.baseVal.value;
    height = graph.height.baseVal.value;
    originx = width/2;
    originy = height/2;
    interval = Math.min(width, height)/(2*zoom.unitsOnAxis);
}

function drawGraph() {
    for(var x = originx%(zoom.smallTick*interval); x <= width; x += zoom.smallTick*interval) {
        grid.appendChild(createSvg("line", {
            "x1" : x,
            "y1" : 0,
            "x2" : x,
            "y2" : height,
            "class" : "smallTick"
        }));
    }

    for(var y = originy%(zoom.smallTick*interval); y <= height; y += zoom.smallTick*interval) {
        grid.appendChild(createSvg("line", {
            "x1" : 0,
            "y1" : y,
            "x2" : width,
            "y2" : y,
            "class" : "smallTick"
        }));
    }

    var bigInterval = (zoom.bigTick*interval);

    for(var x = originx%bigInterval; x <= width; x += bigInterval) {
        grid.appendChild(createSvg("line", {
            "x1" : x,
            "y1" : 0,
            "x2" : x,
            "y2" : height,
            "class" : "bigTick"
        }));
        grid.appendChild(createSvg("text", {
            "x" : x-3,
            "y" : originy+3,
            "text-anchor" : "end",
            "alignment-baseline" : "hanging",
            "class" : "tickLabel",
            "textContent" : (x-originx)/interval
        }));
    }

    for(var y = originy%bigInterval; y <= height; y += bigInterval) {
        grid.appendChild(createSvg("line", {
            "x1" : 0,
            "y1" : y,
            "x2" : width,
            "y2" : y,
            "class" : "bigTick"
        }));
        grid.appendChild(createSvg("text", {
            "x" : originx-3,
            "y" : y+3,
            "text-anchor" : "end",
            "alignment-baseline" : "hanging",
            "class" : "tickLabel",
            "textContent" : y==originy ? "" : -(y-originy)/interval
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

function drawFocusedComponent(entry) {
    draggablePointsGroup.textContent = "";
    if (entry) {
        for(let point of Object.values(entry.component.getDraggablePoints())) {
            let svg = createSvg("circle", {
                "cx" : toSvgX(point.x),
                "cy" : toSvgY(point.y),
                "fill" : entry.component.color,
                "stroke" : entry.component.color,
                "class" : "draggablePoint"
            });
            svg.entry = entry;
            svg.component = entry.component;
            svg.addEventListener("click", focus);
            draggablePointsGroup.appendChild(svg);
        }
    }
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
        drawGraph();
        drawComponents();
    }
}

function reloadGraph() {
    graph.textContent = "";
    setGraphParameters();
    drawGraph();
    graph.appendChild(componentsGroup);
    drawComponents();
}