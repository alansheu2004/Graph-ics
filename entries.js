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
    entriesDiv.textContent = "";

    for(let component of components) {
        var entry = entryTemplate.cloneNode(true);
        entry.component = component;

        entry.children[0].children[0].src = "icons/" + component.type.icon;
        entry.children[0].innerHTML += component.type.name;
        entry.addEventListener("focus", function(e) {e.target.entry.children[2].classList.add("focused")}, true);
        entry.addEventListener("blur", function(e) {e.target.entry.children[2].classList.remove("focused")}, true);

        var deleteButton = entry.children[1];
        deleteButton.entry = entry;
        deleteButton.addEventListener("click", function(e) {remove(e.target.entry);});

        for(let property of component.type.properties) {
            var propertyDiv = document.getElementById(property.type + "Template").cloneNode(true);
            if(property["double-size"]) {
                propertyDiv.classList.add("double");
            }

            switch(property.type) {
                case "number":
                    var label = propertyDiv.children[0];
                    label.for = property.name;
                    label.innerHTML = property.name + ":" ;
                    label.entry = entry;

                    var input = propertyDiv.children[1];
                    input.name = property.name;
                    input.value = component.properties[property.name];
                    input.entry = entry;
                    input.propertyName = property.name;
                    input.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName] = parseInt(e.target.value,10)});

                    break;

                case "point":
                    var label = propertyDiv.children[0];
                    label.for = property.name;
                    label.innerHTML = property.name + ": (" ;
                    label.entry = entry;

                    var inputx = propertyDiv.children[1];
                    inputx.name = property.name + " x";
                    inputx.value = component.properties[property.name][0];
                    inputx.entry = entry;
                    inputx.propertyName = property.name;
                    inputx.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName][0] = parseInt(e.target.value,10)});

                    var comma = propertyDiv.children[2];
                    comma.for = property.name;
                    comma.innerHTML = ",";
                    comma.entry = entry;

                    var inputy = propertyDiv.children[3];
                    inputy.name = property.name + " y";
                    inputy.value = component.properties[property.name][1];
                    inputy.entry = entry;
                    inputy.propertyName = property.name;
                    inputy.addEventListener("input", function(e) {e.target.entry.component.properties[e.target.propertyName][1] = parseInt(e.target.value,10)});

                    var close = propertyDiv.children[4];
                    close.for = property.name;
                    close.innerHTML = ")";
                    close.entry = entry;
                    break;
            }

            

            propertyDiv.id = "";
            entry.appendChild(propertyDiv);
        }

        entry.id = "";
        entriesDiv.appendChild(entry);
    }
}

window.onload = function() {
    for(let type of componentTypes) {
        var button = newTemplate.cloneNode(true);
        button.componentType = type;
        button.addEventListener("click", function(e) {add(e.target.componentType);});
        button.style.backgroundImage = "url(\"icons/" + type.icon + "\")"; 

        button.id = "";
        sidePanel.appendChild(button);
    }

    update();
}