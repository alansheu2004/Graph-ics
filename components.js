function ComponentType(name, icon, properties) {
    this.name = name;
    this.icon = icon;
    this.properties = properties;
}

function Component(type) {
    this.type = type;
    this.properties = {};
    for (let property of type.properties) {
        this.properties[property.name] = property["default"];
    }
    this.entry = null;
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
    ]
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