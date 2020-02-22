function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var dark = '89AB';
    var color = '#';
    for (var i = 0; i < 3; i++) {
        color += dark[Math.floor(Math.random() * 4)];
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function ComponentType(name, icon, properties, svg) {
    this.name = name;
    this.icon = icon;
    this.properties = properties;
    this.svg = svg
}

function Component(type) {
    this.type = type;
    this.properties = {};
    for (let property of type.properties) {
        this.properties[property.name] = property["default"];
    }
    this.entry = null;
    this.color = getRandomColor();
    this.getSvg = function() {
        return this.type.svg(this.properties, this.color);
    };
}


const LINE = new ComponentType(
    "Line", "line.png",
    [
        {
            "name" : "Point 1",
            "type" : "point",
            "default" : [0,0],
            "double-size" : true
        },
        {
            "name" : "Point 2",
            "type" : "point",
            "default" : [1,1],
            "double-size" : true
        }
    ],
    function(properties, color) {
        var container = createSvg("g", {
            "class" : "component"
        });
        container.appendChild(createSvg("line", {
            "x1" : toSvgX(properties["Point 1"][0]),
            "y1" : toSvgY(properties["Point 1"][1]),
            "x2" : toSvgX(properties["Point 2"][0]),
            "y2" : toSvgY(properties["Point 2"][1]),
            "stroke" : color
        }));
        return container;
    }
);

const ARC = new ComponentType(
    "Arc", "arc.png",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0,0],
            "double-size" : true
        },
        {
            "name" : "r",
            "type" : "number",
            "default" : 1,
            "double-size" : true
        },
        {
            "name" : "&theta;<sub>1</sub>",
            "type" : "number",
            "default" : 0
        },
        {
            "name" : "&theta;<sub>2</sub>",
            "type" : "number",
            "default" : 360
        }
    ]
);

const QUADRATIC = new ComponentType(
    "Quadratic", "quadratic.png",
    [
        {
            "name" : "End 1",
            "type" : "point",
            "default" : [-1,1],
            "double-size" : true
        },
        {
            "name" : "Control",
            "type" : "point",
            "default" : [0,-1],
            "double-size" : true
        },
        {
            "name" : "End 2",
            "type" : "point",
            "default" : [1,1],
            "double-size" : true
        }
    ]
);

const CUBIC = new ComponentType(
    "Cubic", "cubic.png",
    [
        {
            "name" : "End 1",
            "type" : "point",
            "default" : [-1,-1],
            "double-size" : true
        },
        {
            "name" : "Control 1",
            "type" : "point",
            "default" : [-1, 0],
            "double-size" : true
        },
        {
            "name" : "Control 2",
            "type" : "point",
            "default" : [0, 1],
            "double-size" : true
        },
        {
            "name" : "End 2",
            "type" : "point",
            "default" : [1,1],
            "double-size" : true
        }
    ]
);

const SQUARE = new ComponentType(
    "Square", "square.png",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0, 0],
            "double-size" : true
        },
        {
            "name" : "Side",
            "type" : "number",
            "default" : 1,
            "double-size" : true
        },
        {
            "name" : "Rotate",
            "type" : "number",
            "default" : 0,
            "double-size" : true
        }
    ]
);

const componentTypes = [LINE, ARC, QUADRATIC, CUBIC, SQUARE];