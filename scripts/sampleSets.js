const WINKY = new function() {
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

    return {
        "name" : "Winky",
        "icon" : "winky.png",
        "components" : [head, wink, eye, mouth, tongue, uuhhh]
    }
};

const POKEBALL = new function() {
    var ball = new Component(CIRCLE);
    ball.properties = {"Center": [0,0], "Radius": 5};
    var button = new Component(CIRCLE);
    button.properties = {"Center": [0,0], "Radius": 0.5};
    var toparc = new Component(ARC);
    toparc.properties = {"Center": [0,0], "Radius": 1, "Start Angle": 26.57, "End Angle": 153.43};
    var bottomarc = new Component(ARC);
    bottomarc.properties = {"Center": [0,0], "Radius": 1, "Start Angle": -153.43, "End Angle": -26.57};
    var line1 = new Component(LINE);
    line1.properties = {"Point 1": [0.9,0.5], "Point 2": [4.9,0.5]};
    var line2 = new Component(LINE);
    line2.properties = {"Point 1": [-0.9,0.5], "Point 2": [-4.9,0.5]};
    var line3 = new Component(LINE);
    line3.properties = {"Point 1": [0.9,-0.5], "Point 2": [4.9,-0.5]};
    var line4 = new Component(LINE);
    line4.properties = {"Point 1": [-0.9,-0.5], "Point 2": [-4.9,-0.5]};

    return {
        "name" : "Pokeball",
        "icon" : "pokeball.png",
        "components" : [ball, button, toparc, bottomarc, line1, line2, line3, line4]
    }
};

const CREEPER = new function() {
    var head = new Component(SQUARE);
    head.properties = {"Center": [0,0], "Side": 8, "Rotate": 0};
    var eye1 = new Component(SQUARE);
    eye1.properties = {"Center": [-2,1], "Side": 2, "Rotate": 0};
    var eye2 = new Component(SQUARE);
    eye2.properties = {"Center": [2,1], "Side": 2, "Rotate": 0};
    var line1 = new Component(LINE);
    line1.properties = {"Point 1": [-1,0], "Point 2": [1,0]};
    var line2 = new Component(LINE);
    line2.properties = {"Point 1": [-1,0], "Point 2": [-1,-1]};
    var line3 = new Component(LINE);
    line3.properties = {"Point 1": [1,0], "Point 2": [1,-1]};
    var line4 = new Component(LINE);
    line4.properties = {"Point 1": [-1,-1], "Point 2": [-2,-1]};
    var line5 = new Component(LINE);
    line5.properties = {"Point 1": [1,-1], "Point 2": [2,-1]};
    var line6 = new Component(LINE);
    line6.properties = {"Point 1": [-2,-1], "Point 2": [-2,-4]};
    var line7 = new Component(LINE);
    line7.properties = {"Point 1": [2,-1], "Point 2": [2,-4]};
    var line8 = new Component(LINE);
    line8.properties = {"Point 1": [-1,-4], "Point 2": [-1,-3]};
    var line9 = new Component(LINE);
    line9.properties = {"Point 1": [1,-4], "Point 2": [1,-3]};
    var line10 = new Component(LINE);
    line10.properties = {"Point 1": [1,-3], "Point 2": [-1,-3]};

    return {
        "name" : "Creeper",
        "icon" : "creeper.png",
        "components" : [head, eye1, eye2, line1, line2, line3, line4, line5, line6, line7, line8, line9, line10]
    }
};

const TREBLE = new function() {
    var comp1 = new Component(ARC);
    comp1.properties = {"Center": [0,-4], "Radius": 1, "Start Angle": 180, "End Angle": 360};
    var comp2 = new Component(LINE);
    comp2.properties = {"Point 1": [1,-4], "Point 2": [-1,4]};
    var comp3 = new Component(ARC);
    comp3.properties = {"Center": [0,4], "Radius": 1, "Start Angle": 0, "End Angle": 180};
    var comp4 = new Component(LINE);
    comp4.properties = {"Point 1": [-2,0], "Point 2": [1,4]};
    var comp5 = new Component(ARC);
    comp5.properties = {"Center": [0,-1], "Radius": 2.25, "Start Angle": 153.43, "End Angle": 360};
    var comp6 = new Component(ARC);
    comp6.properties = {"Center": [0.5,-1], "Radius": 1.75, "Start Angle": 0, "End Angle": 250};

    return {
        "name" : "Treble",
        "icon" : "treble.png",
        "components" : [comp1, comp2, comp3, comp4, comp5, comp6]
    }
};

const BASS = new function() {
    var comp1 = new Component(ARC);
    comp1.properties = {"Center": [-2.5,2], "Radius": 0.5, "Start Angle": -180, "End Angle": 0};
    var comp2 = new Component(ARC);
    comp2.properties = {"Center": [-1,2], "Radius": 2, "Start Angle": 0, "End Angle": 180};
    var comp3 = new Component(QUADRATIC);
    comp3.properties = {"End 1": [-3,-4], "Control": [1,-2], "End 2": [1,2]};
    var comp4 = new Component(CIRCLE);
    comp4.properties = {"Center": [2.5,3], "Radius": 0.5};
    var comp5 = new Component(CIRCLE);
    comp5.properties = {"Center": [2.5,1], "Radius": 0.5};

    return {
        "name" : "Bass",
        "icon" : "bass.png",
        "components" : [comp1, comp2, comp3, comp4, comp5]
    }
};

const sampleSets = [WINKY, POKEBALL, CREEPER, TREBLE, BASS];

const glassPane = document.getElementById("glassPane");
const saveDiv = document.getElementById("saveDiv");
const ideasDiv = document.getElementById("ideasDiv");
const tutorialDiv = document.getElementById("tutorialDiv");
const ideaTemplate = document.getElementById("ideaTemplate");

function setUpSampleSets() {
    var ideaList = document.getElementById("ideaList");

    for(let set of sampleSets) {
        let idea = ideaTemplate.cloneNode(true);
        idea.id = "";
        idea.set = set;

        idea.children[0].src = "icons/" + set.icon;
        idea.children[1].textContent = set.name;

        idea.addEventListener("click", function() {
            if(confirm("Are you sure you want to discard your current drawing?")) {
                useSet(set);
                hideGlassPane();
            }
        });

        ideaList.appendChild(idea);
    }
}

function showIdeas() {
    ideasDiv.style.display = "flex";
    tutorialDiv.style.display = "none";
    saveDiv.style.display = "none";
    glassPane.style.display = "flex";
}

function showTutorial() {
    ideasDiv.style.display = "none";
    saveDiv.style.display = "none";
    tutorialDiv.style.display = "flex";
    glassPane.style.display = "flex";
}

function hideGlassPane() {
    glassPane.style.display = "none";
}