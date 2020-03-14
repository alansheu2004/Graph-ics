function getRandomColor() {
    return "hsl(" + 360 * Math.random() + ',' +
        '80%,' + 
        (25 + 50 * Math.random()) + '%)'
}

function ComponentType(name, icon, properties, svg, equation) {
    this.name = name;
    this.icon = icon;
    this.properties = properties;
    this.svg = svg;
    this.equation = equation;
}

function Component(type) {
    this.type = type;
    this.properties = {};
    for (let property of type.properties) {
        this.properties[property.name] = JSON.parse(JSON.stringify(property["default"]));
    }
    this.entry = null;
    this.svgElement = null;
    this.color = getRandomColor();
    this.getSvg = function() {
        var path = this.type.svg(this.properties);
        path.setAttribute("stroke", this.color);
        this.svgElement = path;
        path.component = this;
        return path;
    };
    this.getEquation = function() {
        return this.type.equation(this.properties);
    }
}


const LINE = new ComponentType(
    "Line", "line.png",
    [
        {
            "name" : "Point 1",
            "type" : "point",
            "default" : [-5,-5],
            "double-size" : true
        },
        {
            "name" : "Point 2",
            "type" : "point",
            "default" : [5,5],
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
    },
    function(properties) {
        var yTerm = add("y", neg(properties["Point 1"][1]));
        var slope = divide(add(properties["Point 2"][1], neg(properties["Point 1"][1])), add(properties["Point 2"][0], neg(properties["Point 1"][0])));
        var xTerm = par(add("x", neg(properties["Point 1"][0])));
        var domain = restrict(
            {"dir":"min", "value":"x", "limit":Math.min(properties["Point 1"][0],properties["Point 2"][0])},
            {"dir":"max", "value":"x", "limit":Math.max(properties["Point 1"][0],properties["Point 2"][0])}
        );
        return add(yTerm, neg(multiply(slope, xTerm, domain)));
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
            "default" : 5,
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
    },
    function(properties) {
        var xTerm = add("x", neg(properties["Center"][0]));
        var yTerm = add("y", neg(properties["Center"][1]));
        if (properties["Center"][0] != 0) {
            xTerm = par(xTerm);
        }
        if (properties["Center"][1] != 0) {
            yTerm = par(yTerm);
        }
        xTerm += "^2";
        yTerm += "^2";
        return add(xTerm, yTerm, neg(Math.pow(properties["Radius"], 2)));
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
            "default" : 5
        },
        {
            "name" : "r<sub>y</sub>",
            "type" : "number",
            "default" : 3
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
    },
    function(properties) {
        var xTerm = divide(add("x", neg(properties["Center"][0])), properties["r<sub>x</sub>"]);
        var yTerm = divide(add("y", neg(properties["Center"][1])), properties["r<sub>y</sub>"]);
        if (properties["Center"][0] != 0 || properties["r<sub>x</sub>"] != 1) {
            xTerm = par(xTerm);
        }
        if (properties["Center"][1] != 0 || properties["r<sub>y</sub>"] != 1) {
            yTerm = par(yTerm);
        }
        xTerm += "^2";
        yTerm += "^2";
        return add(xTerm, yTerm, "-1");
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
            "default" : [-5,5],
            "double-size" : true
        },
        {
            "name" : "Control",
            "type" : "point",
            "default" : [0,-10],
            "double-size" : true
        },
        {
            "name" : "End 2",
            "type" : "point",
            "default" : [5,5],
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
            "default" : [-5,-5],
            "double-size" : true
        },
        {
            "name" : "Control 1",
            "type" : "point",
            "default" : [-5, 10],
            "double-size" : true
        },
        {
            "name" : "Control 2",
            "type" : "point",
            "default" : [5, -10],
            "double-size" : true
        },
        {
            "name" : "End 2",
            "type" : "point",
            "default" : [5,5],
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
            "default" : 10,
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
        return createSvg("path", {
            "class" : "component",
            "d" : "M " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+Math.PI/4)) + 
                " L " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+3*Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+3*Math.PI/4)) + 
                " L " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+5*Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+5*Math.PI/4)) + 
                " L " + toSvgX(properties["Center"][0]+radius*Math.cos(radians+7*Math.PI/4)) + " " + toSvgY(properties["Center"][1]+radius*Math.sin(radians+7*Math.PI/4)) + 
                " Z"
        });
    },
    function(properties) {
        var radius = multiply("{\\sqrt{2} \\over 2}", par(properties["Side"]));
        var radians = properties["Rotate"] * Math.PI / 180;

        var point1 = [add(properties["Center"][0], multiply(radius, "\\cos{"+(properties["Rotate"]+45)+"^{\\circ}}")), add(properties["Center"][1], multiply(radius, "\\sin{"+(properties["Rotate"]+45)+"^{\\circ}}"))];
        var point2 = [add(properties["Center"][0], multiply(radius, "\\cos{"+(properties["Rotate"]+135)+"^{\\circ}}")), add(properties["Center"][1], multiply(radius, "\\sin{"+(properties["Rotate"]+135)+"^{\\circ}}"))];
        var point3 = [add(properties["Center"][0], multiply(radius, "\\cos{"+(properties["Rotate"]-135)+"^{\\circ}}")), add(properties["Center"][1], multiply(radius, "\\sin{"+(properties["Rotate"]-135)+"^{\\circ}}"))];
        var point4 = [add(properties["Center"][0], multiply(radius, "\\cos{"+(properties["Rotate"]-45)+"^{\\circ}}")), add(properties["Center"][1], multiply(radius, "\\sin{"+(properties["Rotate"]-45)+"^{\\circ}}"))];

        var line1 = LINE.equation({"Point 1" : point1, "Point 2" : point2});
        var line2 = LINE.equation({"Point 1" : point2, "Point 2" : point3});
        var line3 = LINE.equation({"Point 1" : point3, "Point 2" : point4});
        var line4 = LINE.equation({"Point 1" : point4, "Point 2" : point1});

        return par(line1) +par(line2) + par(line3) + par(line4);
    }
);

const componentTypes = [LINE, CIRCLE, ELLIPSE, SQUARE];