var components = [new Component(LINE)];

var entriesDiv = document.getElementById("entries");
var entryTemplate = document.getElementById("entryTemplate");
var propertyTemplate = document.getElementById("propertyTemplate");

function remove(component) {
    const index = components.indexOf(component);
    if (index > -1) {
        components.splice(index, 1);
    }
}

window.onload = function() {
    for(let component of components) {
        var entry = entryTemplate.cloneNode(true);
        entry.children[0].children[0].src = "icons/" + component.type.icon;
        entry.children[0].innerHTML += component.type.name;

        var deleteButton = entry.children[1];
        deleteButton.addEventListener("click", function() {remove(component);});

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
            label.component = component;

            propertyDiv.id = "";
            entry.appendChild(propertyDiv);
        }

        entry.id = "";
        entriesDiv.appendChild(entry);
    }
}