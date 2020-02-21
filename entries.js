var components = [new Component(LINE),new Component(LINE),new Component(LINE)];

var sidePanel = document.getElementById("sidePanel");
var entriesDiv = document.getElementById("entries");
var entryTemplate = document.getElementById("entryTemplate");
var propertyTemplate = document.getElementById("propertyTemplate");
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

        var deleteButton = entry.children[1];
        deleteButton.entry = entry;
        deleteButton.addEventListener("click", function(e) {remove(e.target.entry);});

        for(let property of component.type.properties) {
            var propertyDiv = propertyTemplate.cloneNode(true);

            var label = propertyDiv.children[0];
            label.for = property.name;
            label.innerHTML = property.name + ":" ;
            label.component = component;

            var input = propertyDiv.children[1];
            input.name = property.name;
            input.type = "number";
            input.value = component.properties[property.name];
            label.entry = entry;

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