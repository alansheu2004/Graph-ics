function getRandomColor() {
    return "hsl(" + 360 * Math.random() + ',' +
        '80%,' + 
        '35%)'
}

function round(value) {
    return Math.round(value*100)/100
}

function ComponentType(name, icon, properties, svg, draggablePoints, equation) {
    this.name = name;
    this.icon = icon;
    this.properties = properties;
    this.svg = svg;
    this.draggablePoints = draggablePoints;
    this.equation = equation;
    this.valueFromPoints = function(propertyName, dragData) {
        for (let property of this.properties) {
            if(propertyName == property.name) {
                return property.valueFromPoints(dragData);
            }
        }
    }
}

function Component(type) {
    thisComponent = this;
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
        thisComponent.svgElement = path;
        return path;
    };
    this.getDraggablePoints = function() {
        return this.type.draggablePoints(this.properties);
    }
    this.getEquation = function() {
        return this.type.equation(this.properties);
    }
}

const LINE = new ComponentType(
    "Line", "line.svg",
    [
        {
            "name" : "Point 1",
            "type" : "point",
            "default" : [-5,-5],
            "double-size" : true,
            "valueFromPoints" : function(points) {return [round(points["Point 1"].x), round(points["Point 1"].y)]}
        },
        {
            "name" : "Point 2",
            "type" : "point",
            "default" : [5,5],
            "double-size" : true,
            "valueFromPoints" : function(points) {return [round(points["Point 2"].x), round(points["Point 2"].y)]}
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
        return {
            "Point 1": {
                "x" : properties["Point 1"][0],
                "y" : properties["Point 1"][1]
            },
            "Point 2": {
                "x" : properties["Point 2"][0],
                "y" : properties["Point 2"][1]
            }
        } 
    },
    function(properties) {
        if(properties["Point 1"][0] - properties["Point 2"][0] == 0) {
            var xTerm = add("x", neg(properties["Point 1"][0]));
            var domain = restrict(
                {"dir":"min", "value":"y", "limit":Math.min(properties["Point 1"][1],properties["Point 2"][1])},
                {"dir":"max", "value":"y", "limit":Math.max(properties["Point 1"][1],properties["Point 2"][1])}
            );
            return multiply(xTerm, domain);
        } else {
            var yTerm = add("y", neg(properties["Point 1"][1]));
            var slope = divide(add(properties["Point 2"][1], neg(properties["Point 1"][1])), add(properties["Point 2"][0], neg(properties["Point 1"][0])));
            var xTerm = par(add("x", neg(properties["Point 1"][0])));
            var domain = restrict(
                {"dir":"min", "value":"x", "limit":Math.min(properties["Point 1"][0],properties["Point 2"][0])},
                {"dir":"max", "value":"x", "limit":Math.max(properties["Point 1"][0],properties["Point 2"][0])}
            );
            return add(yTerm, neg(multiply(slope, xTerm, domain)));
        }
    }
);

const CIRCLE = new ComponentType(
    "Circle", "circle.svg",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0,0],
            "double-size" : true,
            "valueFromPoints" : function(points) {return [round(points["Center"].x), round(points["Center"].y)]}
        },
        {
            "name" : "Radius",
            "type" : "number",
            "default" : 5,
            "double-size" : true,
            "valueFromPoints" : function(points) {return round(Math.hypot(points["Center"].x-points["Radius"].x, points["Center"].y-points["Radius"].y));}
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
        return {
            "Center": {
                "x" : properties["Center"][0],
                "y" : properties["Center"][1],
                "center" : true
            },
            "Radius": {
                "x" : properties["Center"][0] + properties["Radius"],
                "y" : properties["Center"][1]
            }
        } 
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
    "Ellipse", "ellipse.svg",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0,0],
            "valueFromPoints" : function(points) {return [round(points["Center"].x), round(points["Center"].y)]},
            "double-size" : true
        },
        {
            "name" : "r<sub>x</sub>",
            "type" : "number",
            "default" : 5,
            "valueFromPoints" : function(points) {return round(points["XVertex"].x) - round(points["Center"].x)}
        },
        {
            "name" : "r<sub>y</sub>",
            "type" : "number",
            "default" : 3,
            "valueFromPoints" : function(points) {return round(points["YVertex"].y) - round(points["Center"].y)}
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
        return {
            "Center": {
                "x" : properties["Center"][0],
                "y" : properties["Center"][1],
                "center" : true
            },
            "XVertex": {
                "x" : properties["Center"][0] + properties["r<sub>x</sub>"],
                "y" : properties["Center"][1]
            },
            "YVertex": {
                "x" : properties["Center"][0],
                "y" : properties["Center"][1] + properties["r<sub>y</sub>"]
            }
        } 
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
    "Arc", "arc.svg",
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
    "Quadratic", "quadratic.svg",
    [
        {
            "name" : "End 1",
            "type" : "point",
            "default" : [-5,5],
            "valueFromPoints" : function(points) {return [round(points["End 1"].x), round(points["End 1"].y)]},
            "double-size" : true
        },
        {
            "name" : "Control",
            "type" : "point",
            "default" : [0,-8],
            "valueFromPoints" : function(points) {return [round(points["Control"].x), round(points["Control"].y)]},
            "double-size" : true
        },
        {
            "name" : "End 2",
            "type" : "point",
            "default" : [5,5],
            "valueFromPoints" : function(points) {return [round(points["End 2"].x), round(points["End 2"].y)]},
            "double-size" : true
        }
    ],
    function(properties) {
        return createSvg("path", {
            "class" : "component",
            "d" : "M " + toSvgX(properties["End 1"][0]) + " " + toSvgY(properties["End 1"][1]) +
                " Q " + toSvgX(properties["Control"][0]) + " " + toSvgY(properties["Control"][1]) + " " + toSvgX(properties["End 2"][0]) + " " + toSvgY(properties["End 2"][1])
        });
    },
    function(properties) {
        return {
            "End 1": {
                "x" : properties["End 1"][0],
                "y" : properties["End 1"][1]
            },
            "Control": {
                "x" : properties["Control"][0],
                "y" : properties["Control"][1]
            },
            "End 2": {
                "x" : properties["End 2"][0],
                "y" : properties["End 2"][1]
            }
        } 
    },
    function(properties) {
        var x1 = properties["End 1"][0];
        var y1 = properties["End 1"][1];
        var x2 = properties["Control"][0];
        var y2 = properties["Control"][1];
        var x3 = properties["End 2"][0];
        var y3 = properties["End 2"][1];

        var A = y1*y1 - 4*y1*y2 + 2*y1*y3 + 4*y2*y2 - 4*y2*y3 + y3*y3;
        var B = x1*x1 - 4*x1*x2 + 2*x1*x3 + 4*x2*x2 - 4*x2*x3 + x3*x3;
        var C = -2*x1*y1 + 4*x1*y2 - 2*x1*y3 + 4*x2*y1 - 8*x2*y2 + 4*x2*y3 - 2*x3*y1 + 4*x3*y2 - 2*x3*y3;
        var D = 2*x1*y1*y3 - 4*x1*y2*y2 + 4*x1*y2*y3 - 2*x1*y3*y3 + 4*x2*y1*y2 - 8*x2*y1*y3 + 4*x2*y2*y3 - 2*x3*y1*y1 + 4*x3*y1*y2 + 2*x3*y1*y3 - 4*x3*y2*y2;
        var E = -2*x1*x1*y3 + 4*x1*x2*y2 + 4*x1*x2*y3 + 2*x1*x3*y1 - 8*x1*x3*y2 + 2*x1*x3*y3 - 4*x2*x2*y1 - 4*x2*x2*y3 + 4*x2*x3*y1 + 4*x2*x3*y2 - 2*x3*x3*y1;
        var F = x1*x1*y3*y3 - 4*x1*x2*y2*y3 - 2*x1*x3*y1*y3 + 4*x1*x3*y2*y2 + 4*x2*x2*y1*y3 - 4*x2*x3*y1*y2 + x3*x3*y1*y1;
    
        var restriction = restrict(
            {"dir": y2>((y3-y1)/(x3-x1))*(x2-x1)+y1 ? "min" : "max", "value":"y", "limit":add(multiply(divide(add(y3,-y1), add(x3,-x1)),add("x",-x1)),y1)}
        );

        return add(multiply(A, "x^2"), multiply(B, "y2"), multiply(C, "xy"), multiply(D, "x"), multiply(E, "y"), multiply(F, restriction));
    }
);

const CUBIC = new ComponentType(
    "Cubic", "cubic.svg",
    [
        {
            "name" : "End 1",
            "type" : "point",
            "default" : [-5,-5],
            "valueFromPoints" : function(points) {return [round(points["End 1"].x), round(points["End 1"].y)]},
            "double-size" : true
        },
        {
            "name" : "Control 1",
            "type" : "point",
            "default" : [-5, 10],
            "valueFromPoints" : function(points) {return [round(points["Control 1"].x), round(points["Control 1"].y)]},
            "double-size" : true
        },
        {
            "name" : "Control 2",
            "type" : "point",
            "default" : [5, -10],
            "valueFromPoints" : function(points) {return [round(points["Control 2"].x), round(points["Control 2"].y)]},
            "double-size" : true
        },
        {
            "name" : "End 2",
            "type" : "point",
            "default" : [5,5],
            "valueFromPoints" : function(points) {return [round(points["End 2"].x), round(points["End 2"].y)]},
            "double-size" : true
        }
    ],
    function(properties) {
        return createSvg("path", {
            "class" : "component",
            "d" : "M " + toSvgX(properties["End 1"][0]) + " " + toSvgY(properties["End 1"][1]) +
                " C " + toSvgX(properties["Control 1"][0]) + " " + toSvgY(properties["Control 1"][1]) + " " + toSvgX(properties["Control 2"][0]) + " " + toSvgY(properties["Control 2"][1]) + " " + toSvgX(properties["End 2"][0]) + " " + toSvgY(properties["End 2"][1])
        });
    },
    function(properties) {
        return {
            "End 1": {
                "x" : properties["End 1"][0],
                "y" : properties["End 1"][1]
            },
            "Control 1": {
                "x" : properties["Control 1"][0],
                "y" : properties["Control 1"][1]
            },
            "Control 2": {
                "x" : properties["Control 2"][0],
                "y" : properties["Control 2"][1]
            },
            "End 2": {
                "x" : properties["End 2"][0],
                "y" : properties["End 2"][1]
            }
        } 
    },
    function(properties) {
        return "COMING SOON"
    }
);

const SQUARE = new ComponentType(
    "Square", "square.svg",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0, 0],
            "valueFromPoints" : function(points) {return [round(points["Center"].x), round(points["Center"].y)]},
            "double-size" : true,
        },
        {
            "name" : "Side",
            "type" : "number",
            "default" : 10,
            "valueFromPoints" : function(points) {return 2*round(Math.hypot(points["Side"].x-points["Center"].x, points["Side"].y-points["Center"].y))},
            "double-size" : true
        },
        {
            "name" : "Rotate",
            "type" : "angle",
            "default" : 0,
            "valueFromPoints" : function(points) {return round((180/Math.PI) * Math.atan2(points["Side"].y-points["Center"].y, points["Side"].x-points["Center"].x))},
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
        return {
            "Center": {
                "x" : properties["Center"][0],
                "y" : properties["Center"][1],
                "center" : true
            },
            "Side": {
                "x" : properties["Center"][0] + (properties["Side"]/2) * Math.cos((Math.PI/180) * properties["Rotate"]),
                "y" : properties["Center"][1] + (properties["Side"]/2) * Math.sin((Math.PI/180) * properties["Rotate"])
            }
        } 
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

const RECTANGLE = new ComponentType(
    "Rectangle", "rectangle.svg",
    [
        {
            "name" : "Center",
            "type" : "point",
            "default" : [0, 0],
            "double-size" : true
        },
        {
            "name" : "Width",
            "type" : "number",
            "default" : 10,
            "double-size" : false
        },
        {
            "name" : "Height",
            "type" : "number",
            "default" : 6,
            "double-size" : false
        },
        {
            "name" : "Rotate",
            "type" : "angle",
            "default" : 0,
            "double-size" : true
        }
    ],
    function(properties) {
        var radius = Math.sqrt(properties["Width"]/2, properties["Height"]/2);
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

const componentTypes = [LINE, QUADRATIC, CIRCLE, ELLIPSE, SQUARE];