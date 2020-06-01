const FACE = new function() {
    var head = new Component(CIRCLE);
    head.properties = {"Center": [0,0], "Radius": 5};
    var wink = new Component(QUADRATIC);
    wink.properties = {"End 1": [-3,1], "Control": [-2,2], "End 2": [-1,1]};
    var eye = new Component(ELLIPSE);
    eye.properties = {"Center": [2,1.25], "r<sub>x</sub>": 1, "r<sub>y</sub>": 0.5};
    var mouth = new Component(LINE);
    mouth.properties = {"Point 1": [-3,-1], "Point 2": [3,-1]};
    var tongue = new Component(QUADRATIC);
    tongue.properties = {"End 1": [0,-1], "Control": [2,-7], "End 2": [2.5,-1]};
    var uuhhh = new Component(LINE);
    uuhhh.properties = {"Point 1": [1.25,-1], "Point 2": [1.5,-3]};

    return [head, wink, eye, mouth, tongue, uuhhh]
};