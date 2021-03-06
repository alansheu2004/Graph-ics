var components = [];

var focusedEntry;

var sidePanel = document.getElementById("sidePanel");
var entriesDiv = document.getElementById("entries");
var newButtonDiv = document.getElementById("newButtonDiv");
var entryTemplate = document.getElementById("entryTemplate");
var newTemplate = document.getElementById("newTemplate");

var titleInput = document.getElementById("titleInput");

function removeEntry(entry) {
    const index = components.indexOf(entry.component);
    if (index > -1) {
        components.splice(index, 1);
        entriesDiv.removeChild(entry);
        handleEmptyEntries();
        eraseComponent(entry);

        if(focusedEntry == entry) {
            focusedEntry = null;
        }
    }
}

function removeAllEntries() {
    while(entriesDiv.children.length > 0) {
        removeEntry(entriesDiv.children[0]);
    }
}

function createEntry(component) {
    let entry = entryTemplate.cloneNode(true);
    entry.entry = entry;
    entry.component = component;

    entry.addEventListener("click", focus);


    entry.children[0].children[0].children[0].src = "icons/" + component.type.icon;
    entry.children[0].children[0].entry = entry;
    entry.children[0].children[0].children[0].entry = entry;

    entry.children[0].children[1].entry = entry;
    let picker = new jscolor(entry.children[0].children[1], {
        "valueElement" : null,
        "mode" : "HSV",
        "onFineChange" : "changeColor(this)"
    });
    picker.fromHSV(component.hsv[0], component.hsv[1]*100, component.hsv[2]*100);
    entry.picker = picker;
    if(!picker.isLight()) {
        if(!entry.classList.contains("invert")) {
            entry.classList.add("invert");
        }
    } else {
        if(entry.classList.contains("invert")) {
            entry.classList.remove("invert");
        }
    }

    entry.children[0].insertBefore(document.createTextNode(component.type.name), entry.children[0].children[1]);
    entry.children[0].entry = entry;
    entry.children[0].component = component;

    entry.children[2].style.backgroundColor = hsvToHslText(component.hsv[0], component.hsv[1], component.hsv[2]);
    entry.children[2].entry = entry;
    entry.children[2].component = component;

    let deleteButton = entry.children[1];
    deleteButton.entry = entry;
    deleteButton.addEventListener("click", function(e) {removeEntry(e.target.entry);});

    for(let property of component.type.properties) {
        let propertyDiv = document.getElementById(property.type + "Template").cloneNode(true);
        propertyDiv.propertyName = property.name;
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
                input.addEventListener("input", function(e) {e.target.component.properties[e.target.propertyName] = Number(e.target.value); drawComponent(e.target.entry);});

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
                input.addEventListener("input", function(e) {e.target.component.properties[e.target.propertyName] = Number(e.target.value); drawComponent(e.target.entry);});

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
                inputx.addEventListener("input", function(e) {e.target.component.properties[e.target.propertyName][0] = Number(e.target.value); drawComponent(e.target.entry);});

                let comma = propertyDiv.children[2];
                comma.innerHTML = ",";
                comma.entry = entry;

                let inputy = propertyDiv.children[3];
                inputy.value = component.properties[property.name][1];
                inputy.entry = entry;
                inputy.component = component;
                inputy.propertyName = property.name;
                inputy.addEventListener("input", function(e) {e.target.component.properties[e.target.propertyName][1] = Number(e.target.value); drawComponent(e.target.entry);});
                break;
        }

        

        propertyDiv.removeAttribute("id");
        entry.appendChild(propertyDiv);
    }

    entry.removeAttribute("id");
    return entry;
}

function addComponentType(type) {
    addComponent(new Component(type));
}

function addComponent(component) {
    components.push(component);
    var entry = createEntry(component);
    entriesDiv.appendChild(entry);
    handleEmptyEntries();
    drawComponent(entry);
}

function updateEntry(entry) {
    let component = entry.component;

    entry.children[2].style.backgroundColor = hsvToHslText(component.hsv[0], component.hsv[1], component.hsv[2]);

    for(let property of entry.component.type.properties) {
        let propertyDiv;
        for(let div of entry.querySelectorAll("div.property")) {
            if(div.propertyName == property.name) {
                propertyDiv = div;
                break;
            }
        }

        switch(property.type) {
            case "number":

                var input = propertyDiv.children[1];
                input.value = component.properties[property.name];
                break;

            case "angle":

                var input = propertyDiv.children[1];
                input.value = component.properties[property.name];
                break;

            case "point":

                let inputx = propertyDiv.children[1];
                inputx.value = component.properties[property.name][0];

                let inputy = propertyDiv.children[3];
                inputy.value = component.properties[property.name][1];

                break;
        }

        

        propertyDiv.removeAttribute("id");
    }
}

function focus(e) {
    if (!e.target.classList.contains("delete")) {
        if(focusedEntry) {
            focusedEntry.classList.remove("focused");
            focusedEntry.svgElement.classList.remove("focused");
        }
        e.target.entry.classList.add("focused");
        focusedEntry = e.target.entry;
        drawComponent(focusedEntry);
        e.stopPropagation();

        if(focusedEntry.offsetTop < entriesDiv.scrollTop || focusedEntry.offsetTop+focusedEntry.offsetHeight > entriesDiv.scrollTop+entriesDiv.offsetHeight) {
            
            entriesDiv.scrollTop = focusedEntry.offsetTop - 20;
        }
    }
}

function blur(e) {
    if(e.target.entry != focusedEntry && focusedEntry && !e.target.classList.contains("delete")) {
        focusedEntry.classList.remove("focused");
        focusedEntry.svgElement.classList.remove("focused");
        focusedEntry = null;
        drawFocusedComponent(null);
    }
}

function update() {
    for(let entry of entriesDiv.children) {
        updateEntry(entry)
    }
}

function useSet(set) {
    while(entriesDiv.children.length>0) {
        removeEntry(entriesDiv.children[0]);
    }
    components = [];

    titleInput.value = set.name;
    for (let component of set.components) {
        addComponent(component);
    }
}

function changeColor(jscolor) {
    jscolor.styleElement.entry.component.hsv = [Math.round(jscolor.hsv[0]), jscolor.hsv[1]/100, jscolor.hsv[2]/100];
    updateEntry(jscolor.styleElement.entry);
    drawComponent(jscolor.styleElement.entry);
}

function handleEmptyEntries() {
    if(entriesDiv.children.length == 0) {
        document.getElementById("emptyEntries").style.display = "initial";
        generateButton.disabled = true;
    } else {
        document.getElementById("emptyEntries").style.display = "none";
        generateButton.disabled = false;
    }
}

window.onload = function() {

    for(let type of componentTypes) {
        let button = newTemplate.cloneNode(true);
        button.componentType = type;
        button.addEventListener("click", function(e) {addComponentType(type);});
        button.children[0].src = "icons/" + type.icon; 

        button.id = "";
        newButtonDiv.appendChild(button);
    }

    setUpHidden();

    setUpSampleSets();

    graph.addEventListener("click", blur);
    entriesDiv.addEventListener("click", blur);

    loadGraph();

    handleEmptyEntries();
}