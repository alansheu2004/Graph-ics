const deliminator = "$"

function saveToString() {
    var string = "";

    for (let component of components) {
        string += componentTypes.indexOf(component.type) + deliminator;
        string += component.color + deliminator;

        for (let property of component.type.properties) {
            switch(property.type) {
                case "number":
                    string += component.properties[property.name] + deliminator;
                    break;

                case "angle":
                    string += component.properties[property.name] + deliminator;
                    break;

                case "point":
                    string += component.properties[property.name][0] + deliminator + component.properties[property.name][1] + deliminator;
                    break;
            }
        }
    }

    return string;
}

var saveText = document.getElementById("saveText");

function showSave() {
    saveText.textContent = saveToString();

    ideasDiv.style.display = "none";
    tutorialDiv.style.display = "none";
    saveDiv.style.display = "flex";
    glassPane.style.display = "flex";


}