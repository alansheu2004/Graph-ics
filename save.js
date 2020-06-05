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

    return string.slice(0,-1);
}

function saveCopy() {
    saveText.select();
    saveText.setSelectionRange(0, 99999); //For mobile devices

    document.execCommand("copy");

    saveCopyButton.textContent = "Copied";
    saveCopyButton.disabled = true;
}

function loadCopy() {
    navigator.clipboard.readText()
        .then(text => {
            saveText.value = text
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
}

function parseSaveString(string) {
    var nums = string.split(deliminator);
    var newComponents = [];

    try {
        for (var i = 0; i < nums.length;) {
            let component = new Component(componentTypes[nums[i++]]);
            newComponents.push(component);

            component.color = nums[i++];

            for (let property of component.type.properties) {
                switch(property.type) {
                    case "number":
                        component.properties[property.name] = Number(nums[i++]);
                        break;

                    case "angle":
                        component.properties[property.name] = Number(nums[i++]);
                        break;

                    case "point":
                        component.properties[property.name][0] = Number(nums[i++]);
                        component.properties[property.name][1] = Number(nums[i++]);
                        break;
                }
            }
        }
    } catch {
        if(string != "") {
            alert("The save data seems to have been corrupted");
            return false; //Corrupted
        }
        
    }

    

    removeAllEntries();
    for(let component of newComponents) {
        addComponent(component);
    }
    return true; //Successful
}

const saveFileButton = document.getElementById("saveFile");
const saveFileInput = document.getElementById("saveFileInput");

function saveFile() {
    var blob = new Blob([saveText.value], { type: "txt" });

    var a = document.createElement('a');
    a.download = "sketchGraphSave";
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = ["txt", a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);

    saveFileButton.textContent = "Saved to File";
    saveFileButton.disabled = true;
}

function loadFile() {
    if ('files' in saveFileInput && saveFileInput.files.length > 0) {
        placeFileContent(saveText,
        saveFileInput.files[0])
    }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.value = content;
    }).catch(error => console.log(error));
}

function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    });
}

function confirmSave() {
    if(saveText.value != originalSave) {

        if(!parseSaveString(saveText.value)) {
            return;
        }
    }
    hideGlassPane();
}

var saveText = document.getElementById("saveText");
var saveCopyButton = document.getElementById("saveCopy");

var originalSave = "";

function showSave() {
    saveCopyButton.textContent = "Copy to Clipboard";
    saveCopyButton.disabled = false;
    saveFileButton.textContent = "Save to File";
    saveFileButton.disabled = false;

    saveText.value = saveToString();
    originalSave = (" " + saveText.value).slice(1);

    ideasDiv.style.display = "none";
    tutorialDiv.style.display = "none";
    saveDiv.style.display = "flex";
    glassPane.style.display = "flex";
}