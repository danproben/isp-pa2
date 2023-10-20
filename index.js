class Element {
    constructor(tagname) {
        this.tagname = tagname;

        this.attributes = {};

        this.content = "";

        this.style = {};

        this.html = "";

        this.children = [];

        Element.prototype.pack = function() {

            var css = ""
            var attributes = "";

            // check to see if the style dictionary is empty or not to determine if css should be added
            if (Object.keys(this.style).length){
                css += ` style="`;

                // loop through styles to create an inline style for the attribute
                for (let key in this.style){
                    // if a style is present, add it to the css string
                    if (this.style[key]) {
                        css += `${key}: ${this.style[key]};`;
                    }
                }

                css += '"';
            }

            if (Object.keys(this.attributes).length) {
                attributes += " ";

            // loop through attributes
                for (let key in this.attributes){
                    // if an attribute is present, add it to the css string
                    if (this.attributes[key]) {
                        attributes += `${key}="${this.attributes[key]}"`;
                    }

                    attributes += " ";
                }
            }

            // interpolate the entire html element
            var startTag = `<${ this.tagname }${ attributes }${ css }>`
    
            // if a parent, place immediate children html into content
            if (this.children.length > 0){
                this.content = "";
                for (var i = 0; i < this.children.length; i++){
                    this.content += body.children[i].html;
                }
            }

            var endTag = `</${ this.tagname }>`;
            this.html = startTag + this.content + endTag;
            console.log(this.html);
        }
    }
}

var body = new Element("body");

function openWin() {
    var page = "";
    page = generateWebpage();
    var myWindow = document.open("", "ISP", "width=800, height=168");
    myWindow.document.write(page);
}

// TODO: Pass the parent in and pack into parent. if no parent is supplied, all new children are added to the body
function addChild() {
    // these properties need to be added more dynamically if possible.
    var newElement = new Element(document.getElementById("tagname").value);
    newElement.attributes["id"] = body.children.length;
    newElement.style["color"] = "black";
    newElement.style["text-align"] = "center";
    newElement.content = document.getElementById("content").value;
    newElement.pack();

    body.children.push(newElement);
    body.pack();

    generateTable();

    document.getElementById("preview").innerHTML = generatePreview();
}

function updateBackground() {
    const color = document.getElementById("backgroundColor").value
    document.getElementById("preview").style.backgroundColor = color;

    body.style["background-color"] = `${color}`;
}

function updateElement() {

}

function removeElement(clickedId) {

    var index;

    body.children.forEach(item => {
        if (item.attributes.id == clickedId){
            index = body.children.indexOf(item);
        }
    })

    body.children.splice(index, 1);
    body.pack();
    generateTable();
    document.getElementById("preview").innerHTML = generatePreview();
}

function generatePreview() {
    var preview = "";

    for (i = 0; i < body.children.length; i++){
        preview += body.children[i].html;
    }

    return preview;
}

function generateWebpage() {
    var webpage = ""

    var webpageStart = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head>'

    body.pack();

    var webpageEnd = '</html>';

    webpage = webpageStart + body.html + webpageEnd;

    return webpage;
}

function generateTable() {

    let table = '<table>';

    table += '<tr><th>Tag</th><th>ID</th><th>Options</th><th>Actions</th></tr>';

    body.children.forEach(item => {
        table += `<tr><td>${item.tagname}</td>`         // tagname
        table += `<td>${item.attributes.id}</td>`       // id
        table += `<td></td>`                            // options
        table += `<td><button onclick="removeElement(${item.attributes.id})">Remove</button>` // remove element
        table += `<button onclick="addChild(${item.attributes.id})">Add Child</button></td></tr>` // TODO: This will somehow have to indent for children
    })

    table += '</table>';

    document.getElementById("tableContainer").innerHTML = table;
}

const addButton = document.getElementById("addButton");

const contentField = document.getElementById("content");

contentField.addEventListener("keypress", ({key}) => {
    if (key == "Enter"){
        addButton.click();
    }
})
