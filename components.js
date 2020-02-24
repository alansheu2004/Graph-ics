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
        this.properties[property.name] = JSON.parse(JSON.stringify(property["default"]));
    }
    this.entry = null;
    this.color = getRandomColor();
    this.getSvg = function() {
        var path = this.type.svg(this.properties);
        path.setAttribute("stroke", this.color);
        return path;
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
    function(properties) {
        return createSvg("line", {
            "class" : "component",
            "x1" : toSvgX(properties["Point 1"][0]),
            "y1" : toSvgY(properties["Point 1"][1]),
            "x2" : toSvgX(properties["Point 2"][0]),
            "y2" : toSvgY(properties["Point 2"][1])
        });
    }
);

const CIRCLE = new ComponentType(
    "Circle", "circle.png",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0,0],
            "double-size" : true
        },
        {
            "name" : "Radius",
            "type" : "number",
            "default" : 1,
            "double-size" : true
        }
    ],
    function(properties) {
        return createSvg("circle", {
            "class" : "component",
            "cx" : toSvgX(properties["Center"][0]),
            "cy" : toSvgY(properties["Center"][1]),
            "r" : toSvgDim(properties["Radius"])
        });
    }
);

const ELLIPSE = new ComponentType(
    "Ellipse", "ellipse.png",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0,0],
            "double-size" : true
        },
        {
            "name" : "r<sub>x</sub>",
            "type" : "number",
            "default" : 2
        },
        {
            "name" : "r<sub>y</sub>",
            "type" : "number",
            "default" : 1
        },
    ],
    function(properties) {
        return createSvg("ellipse", {
            "class" : "component",
            "cx" : toSvgX(properties["Center"][0]),
            "cy" : toSvgY(properties["Center"][1]),
            "rx" : toSvgDim(properties["r<sub>x</sub>"]),
            "ry" : toSvgDim(properties["r<sub>y</sub>"])
        });
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
            "name" : "Radius",
            "type" : "number",
            "default" : 1,
            "double-size" : true
        },
        {
            "name" : "Start Angle",
            "type" : "angle",
            "default" : 0,
            "double-size" : true
        },
        {
            "name" : "End Angle",
            "type" : "angle",
            "default" : 360,
            "double-size" : true
        }
    ],
    function(properties) {
        return createSvg("path", {
            "class" : "component",
            "d" : describeArc(toSvgX(properties["Center"][0]), toSvgY(properties["Center"][1]), toSvgDim(properties["Radius"]), properties["Start Angle"], properties["End Angle"])
        });
    }
);

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}

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
    ],
    function(properties) {
        return createSvg("path", {
            "class" : "component",
            "d" : "M " + toSvgX(properties["End 1"][0]) + " " + toSvgY(properties["End 1"][1]) +
                " Q " + toSvgX(properties["Control"][0]) + " " + toSvgY(properties["Control"][1]) + " " + toSvgX(properties["End 2"][0]) + " " + toSvgY(properties["End 2"][1])
        });
    }
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
            "default" : [-1, 1],
            "double-size" : true
        },
        {
            "name" : "Control 2",
            "type" : "point",
            "default" : [1, -1],
            "double-size" : true
        },
        {
            "name" : "End 2",
            "type" : "point",
            "default" : [1,1],
            "double-size" : true
        }
    ],
    function(properties) {
        return createSvg("path", {
            "class" : "component",
            "d" : "M " + toSvgX(properties["End 1"][0]) + " " + toSvgY(properties["End 1"][1]) +
                " C " + toSvgX(properties["Control 1"][0]) + " " + toSvgY(properties["Control 1"][1]) + " " + toSvgX(properties["Control 2"][0]) + " " + toSvgY(properties["Control 2"][1]) + " " + toSvgX(properties["End 2"][0]) + " " + toSvgY(properties["End 2"][1])
        });
    }
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
            "type" : "angle",
            "default" : 0,
            "double-size" : true
        }
    ],
    function(properties) {
        var radius = properties["Side"] * Math.sqrt(2) / 2;
        var radians = properties["Rotate"] * Math.PI / 180;
        console.log(radians);
        return createSvg("path", {
            "class" : "component",
            "d" : "M " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+Math.PI/4)) + 
                " L " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+3*Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+3*Math.PI/4)) + 
                " L " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+5*Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+5*Math.PI/4)) + 
                " L " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+7*Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+7*Math.PI/4)) + 
                " Z"
        });
    }
);

const componentTypes = [LINE, CIRCLE, ELLIPSE, QUADRATIC, CUBIC, SQUARE];