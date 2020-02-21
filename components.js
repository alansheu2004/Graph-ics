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
            "name" : "x<sub>1</sub>",
            "type" : "number",
            "default" : 0
        },
        {
            "name" : "y<sub>1</sub>",
            "type" : "number",
            "default" : 1
        },
        {
            "name" : "x<sub>2</sub>",
            "type" : "number",
            "default" : 0
        },
        {
            "name" : "y<sub>2</sub>",
            "type" : "number",
            "default" : 1
        }
    ],
);

const ARC = new ComponentType(
    "Arc", "arc.png",
    [
        {
            "name" : "c<sub>x</sub>",
            "type" : "number",
            "default" : 0
        },
        {
            "name" : "c<sub>y</sub>",
            "type" : "number",
            "default" : 0
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
        },
        {
            "name" : "r",
            "type" : "number",
            "default" : 1
        }
    ],
);

const QUADRATIC = new ComponentType(
    "Quadratic", "quadratic.png",
    [
        {
            "name" : "c<sub>x</sub>",
            "type" : "number",
            "default" : 0
        },
        {
            "name" : "c<sub>y</sub>",
            "type" : "number",
            "default" : 0
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
        },
        {
            "name" : "r",
            "type" : "number",
            "default" : 1
        }
    ],
);

const componentTypes = [LINE, ARC, QUADRATIC];