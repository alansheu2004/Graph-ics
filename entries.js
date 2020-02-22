var components = [new Component(LINE)];

var sidePanel = document.getElementById("sidePanel");
var entriesDiv = document.getElementById("entries");
var entryTemplate = document.getElementById("entryTemplate");
var newTemplate = document.getElementById("newTemplate");

function remove(entry) {
    const index = components.indexOf(entry.component);
    if (index > -1) {
        components.splice(index, 1);
    }

    update();
}

function add(type) {
    components.push(new Component(type));
    
    update();
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
        entry.addEventListener("focus", function(e) {if(!e.target.classList.contains("delete")) {e.target.entry.classList.add("focused")}}, true);
        entry.addEventListener("blur", function(e) {e.target.entry.classList.remove("focused")}, true);
        entry.children[2].style.backgroundColor = component.color;

        let deleteButton = entry.children[1];
        deleteButton.entry = entry;
        deleteButton.addEventListener("click", function(e) {remove(e.target.entry);});

        for(let property of component.type.properties) {
            let propertyDiv = document.getElementById(property.type + "Template").cloneNode(true);
            if(property["double-size"]) {
                propertyDiv.classList.add("double");
            }

            let label = propertyDiv.children[0];
            label.innerHTML = property.name + ": (" ;
            label.entry = entry;

            switch(property.type) {
                case "number":

                    let input = propertyDiv.children[1];
                    input.value = component.properties[property.name];
                    input.entry = entry;
                    input.propertyName = property.name;
                    //input.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName] = Number(e.target.value); drawComponents();});

                    break;

                case "point":
                    
                    let inputx = propertyDiv.children[1];
                    inputx.value = component.properties[property.name][0];
                    inputx.entry = entry;
                    inputx.propertyName = property.name;
                    inputx.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName][0] = Number(e.target.value); drawComponents();});

                    let comma = propertyDiv.children[2];
                    comma.innerHTML = ",";
                    comma.entry = entry;

                    let inputy = propertyDiv.children[3];
                    inputy.value = component.properties[property.name][1];
                    inputy.entry = entry;
                    inputy.propertyName = property.name;
                    //inputy.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName][1] = Number(e.target.value); drawComponents();});

                    let close = propertyDiv.children[4];
                    close.innerHTML = ")";
                    close.entry = entry;
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

window.onload = function() {
    setGraphParameters();

    for(let type of componentTypes) {
        let button = newTemplate.cloneNode(true);
        button.componentType = type;
        button.addEventListener("click", function(e) {add(e.target.componentType);});
        button.style.backgroundImage = "url(\"icons/" + type.icon + "\")"; 

        button.id = "";
        sidePanel.appendChild(button);
    }

    drawGraph();
    graph.appendChild(componentsGroup);

    update();
}