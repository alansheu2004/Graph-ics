var graph = document.getElementById("graph");
var width;
var height;
var originx;
var originy;
var interval;

var componentsGroup = createSvg("g", {"class":"componentGroup"});

function setGraphParameters() {
    width = graph.width.baseVal.value;
    height = graph.height.baseVal.value;
    originx = width/2;
    originy = height/2;
    interval = Math.min(width, height)/20;
}

function drawGraph() {
    for(var x = originx%interval; x <= width; x += interval) {
        graph.appendChild(createSvg("line", {
            "x1" : x,
            "y1" : 0,
            "x2" : x,
            "y2" : height,
            "class" : "smallTick"
        }));
    }

    for(var y = originy%interval; y <= height; y += interval) {
        graph.appendChild(createSvg("line", {
            "x1" : 0,
            "y1" : y,
            "x2" : width,
            "y2" : y,
            "class" : "smallTick"
        }));
    }

    var bigInterval = 5*interval;

    for(var x = originx%bigInterval; x <= width; x += bigInterval) {
        graph.appendChild(createSvg("line", {
            "x1" : x,
            "y1" : 0,
            "x2" : x,
            "y2" : height,
            "class" : "bigTick"
        }));
        graph.appendChild(createSvg("text", {
            "x" : x-3,
            "y" : originy+3,
            "text-anchor" : "end",
            "alignment-baseline" : "hanging",
            "class" : "tickLabel",
            "textContent" : (x-originx)/interval
        }));
    }

    for(var y = originy%bigInterval; y <= height; y += bigInterval) {
        graph.appendChild(createSvg("line", {
            "x1" : 0,
            "y1" : y,
            "x2" : width,
            "y2" : y,
            "class" : "bigTick"
        }));
        graph.appendChild(createSvg("text", {
            "x" : originx-3,
            "y" : y+3,
            "text-anchor" : "end",
            "alignment-baseline" : "hanging",
            "class" : "tickLabel",
            "textContent" : y==originy ? "" : -(y-originy)/interval
        }));
    }

    graph.appendChild(createSvg("line", {
        "x1" : 0,
        "y1" : originy,
        "x2" : width,
        "y2" : originy,
        "class" : "axis"
    }));

    graph.appendChild(createSvg("line", {
        "x1" : originx,
        "y1" : 0,
        "x2" : originx,
        "y2" : height,
        "class" : "axis"
    }));
}

function drawComponents() {
    componentsGroup.textContent = "";
    for(let component of components) {
        componentsGroup.appendChild(component.getSvg());
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