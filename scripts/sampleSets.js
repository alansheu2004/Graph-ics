const WINKY_FACE = new function() {
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
        "name" : "Winky Face",
        "icon" : "winkyface.png",
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

const sampleSets = [WINKY_FACE, POKEBALL];

const glassPane = document.getElementById("glassPane");
const saveDiv = document.getElementById("saveDiv");
const ideasDiv = document.getElementById("ideasDiv");
const tutorialDiv = document.getElementById("tutorialDiv");
const ideaTemplate = document.getElementById("ideaTemplate");

function setUpSampleSets() {
    var ideaList = document.getElementById("ideaList");

    for(let set of sampleSets) {
        let idea = ideaTemplate.cloneNode(true);
        idea.id = null;
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