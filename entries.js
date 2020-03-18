var components = [new Component(LINE)];

var sidePanel = document.getElementById("sidePanel");
var entriesDiv = document.getElementById("entries");
var newButtonDiv = document.getElementById("newButtonDiv");
var entryTemplate = document.getElementById("entryTemplate");
var newTemplate = document.getElementById("newTemplate");

function remove(entry) {
    const index = components.indexOf(entry.component);
    if (index > -1) {
        components.splice(index, 1);
    }

    update();
}

function addCom(type) {
    components.push(new Component(type));
    
    update();
}

function focus(e) {
    if(!e.target.classList.contains("delete")) {
        e.target.entry.classList.add("focused");
        e.target.component.svgElement.classList.add("focused");
    }
}

function blur(e) {
    if(!e.target.classList.contains("delete")) {
        e.target.entry.classList.remove("focused");
        e.target.component.svgElement.classList.remove("focused");
    } 
}

function update() {
    while (entriesDiv.firstChild) {
        entriesDiv.removeChild(entriesDiv.lastChild);
    }

    for(let component of components) {
        let entry = entryTemplate.cloneNode(true);
        entry.component = component;

        entry.children[0].children[0].src = "icons/" + component.type.icon;
        entry.children[0].innerHTML += component.type.name;
        entry.addEventListener("focus", function(e) {focus(e)}, true);
        entry.addEventListener("blur", function(e) {blur(e)}, true);
        entry.children[2].style.backgroundColor = component.color;

        let deleteButton = entry.children[1];
        deleteButton.entry = entry;
        deleteButton.addEventListener("click", function(e) {remove(e.target.entry);});

        for(let property of component.type.properties) {
            let propertyDiv = document.getElementById(property.type + "Template").cloneNode(true);
            if(property["double-size"]) {
                propertyDiv.classList.add("double");
            }

            switch(property.type) {
                case "number":

                    var label = propertyDiv.children[0];
                    label.innerHTML = property.name + ":";
                    label.entry = entry;

                    var input = propertyDiv.children[1];
                    input.value = component.properties[property.name];
                    input.entry = entry;
                    input.component = component;
                    input.propertyName = property.name;
                    input.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName] = Number(e.target.value); drawComponents();});

                    break;

                case "angle":

                    var label = propertyDiv.children[0];
                    label.innerHTML = property.name + ":";
                    label.entry = entry;

                    var input = propertyDiv.children[1];
                    input.value = component.properties[property.name];
                    input.entry = entry;
                    input.component = component;
                    input.propertyName = property.name;
                    input.style.marginRight = "0";
                    input.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName] = Number(e.target.value); drawComponents();});

                    break;

                case "point":

                    var label = propertyDiv.children[0];
                    label.innerHTML = property.name + ": (" ;
                    label.entry = entry;
                    
                    let inputx = propertyDiv.children[1];
                    inputx.value = component.properties[property.name][0];
                    inputx.entry = entry;
                    inputx.component = component;
                    inputx.propertyName = property.name;
                    inputx.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName][0] = Number(e.target.value); drawComponents();});

                    let comma = propertyDiv.children[2];
                    comma.innerHTML = ",";
                    comma.entry = entry;

                    let inputy = propertyDiv.children[3];
                    inputy.value = component.properties[property.name][1];
                    inputy.entry = entry;
                    inputy.component = component;
                    inputy.propertyName = property.name;
                    inputy.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName][1] = Number(e.target.value); drawComponents();});
                    break;
            }

            

            propertyDiv.removeAttribute("id");
            entry.appendChild(propertyDiv);
        }

        entry.removeAttribute("id");
        entriesDiv.appendChild(entry);
    }

    drawComponents();
}

function addDefaultComponents() {
    var head = new Component(CIRCLE);
    head.properties = {"Center": [0,0], "Radius": 5};
    var wink = new Component(QUADRATIC);
    wink.properties = {"End 1": [-3,1], "Control": [-2,2], "End 2": [-1,1]};
    var eye = new Component(ELLIPSE);
    eye.properties = {"Center": [2,1.25], "r<sub>x</sub>": 1, "r<sub>y</sub>": 0.5};
    var mouth = new Component(LINE);
    mouth.properties = {"Point 1": [-3,-1], "Point 2": [3,-1]};
    var tongue = new Component(CUBIC);
    tongue.properties = {"End 1": [0,-1], "Control 1": [0,-5], "Control 2": [3,-5], "End 2": [2.5,-1]};
    var uuhhh = new Component(LINE);
    uuhhh.properties = {"Point 1": [1.25,-1], "Point 2": [1.5,-3]};

    components = [uuhhh];
}

window.onload = function() {

    for(let type of componentTypes) {
        let button = newTemplate.cloneNode(true);
        button.componentType = type;
        button.addEventListener("click", function(e) {addCom(e.target.componentType);});
        button.children[0].src = "icons/" + type.icon; 

        button.id = "";
        newButtonDiv.appendChild(button);
    }

    setUpHiddenDiv();
    addDefaultComponents();
    update();
}