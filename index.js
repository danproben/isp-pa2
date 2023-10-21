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
    newElement.style["color"] = "#000000";
    newElement.style["text-align"] = "center";
	newElement.style["overflow-wrap"] = "anywhere";
    newElement.content = document.getElementById("content").value;
    newElement.pack();

    body.children.push(newElement);
    body.pack();

	// document.getElementById("content").value = '';
    generateTable();
    generatePreview();
}

function updateBackground() {
    const color = document.getElementById("backgroundColor").value
    document.getElementById("preview").style.backgroundColor = color;
    body.style["background-color"] = `${color}`;
}

function updateElement(option, elementid) {

    if (option.name == "color"){
        body.children[elementid].style["color"] = document.getElementById(option.id).value;
    } else if (option.name == "tagnames") {
		body.children[elementid].tagname = document.getElementById(option.id).value;
	} else if (option.name == "hyperlink"){
		const link = document.getElementById(option.id).value;
		body.children[elementid].content = `<a href="${link}" target="_blank">` + body.children[elementid].content + '</a>';
	}


    body.children[elementid].pack()
    generatePreview();
	generateTable();
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
    generatePreview();
}

function generatePreview() {
    var preview = "";

    for (i = 0; i < body.children.length; i++){
        // preview += '<span style="position: absolute;" onmousedown = "grabber(event);">';
        preview += body.children[i].html;
        // preview += "</span>";
    }

    document.getElementById("preview").innerHTML = preview;
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

    table += '<tr><th>Tag</th><th>Content</th><th>Options</th><th>Actions</th></tr>';

    body.children.forEach(item => {

        table += `<tr id="${item.attributes.id}" draggable="true" ondragstart="start()" ondragover="dragover()" ondragend="generateTable()">`

		const dropdownMenu = ["h1", "h2", "h3", "p"];

		table += `<td><select name="tagnames" id="tagnames${item.attributes.id}" onchange="updateElement(this, ${item.attributes.id})">`

		dropdownMenu.forEach(tagnameItem => {
			if (tagnameItem == item.tagname){
				table += `<option value="${tagnameItem}" selected>${tagnameItem}</option>`;
			} else {
				table += `<option value="${tagnameItem}">${tagnameItem}</option>`;
			}
		})

		table += '</select></td>'

        table += `<td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${item.content}</td>`       // content

		table += "<td>";

        switch(item.tagname){
            case "h1":
            case "h2":
            case "h3":
            case "p":
                table += `<input id="colorOption${item.attributes.id}" name="color" type="color" value="${item.style["color"]}" onchange="updateElement(this, ${item.attributes.id})">`
				table += `<input id="hyperlinkOption${item.attributes.id}" style="margin: 2%" name="hyperlink" type="text" placeholder="Add a hyperlink" onchange="updateElement(this, ${item.attributes.id})">`
                break;
            default:
                console.log("Could not add option")
                break;
        }

		table += "</td>";

        table += `<td><button onclick="removeElement(${item.attributes.id})">Remove</button>` // remove element
    })

    table += '</table>';

    document.getElementById("tableContainer").innerHTML = table;
}

const addButton = document.getElementById("addButton");

const contentField = document.getElementById("content");

contentField.addEventListener("keypress", ({key}) => {
    if (key == "Enter"){
		key.preventDefault;
        addButton.click();
		contentField.value = '';
    }
})

// ---------------- drag and drop order

// fix deprecated event by adding event listeners
var row;

function start(){
  row = event.target;
}

function dragover(){
	var e = event;
	e.preventDefault();

	let children = Array.from(e.target.parentNode.parentNode.children);

	if(children.indexOf(e.target.parentNode) > children.indexOf(row)){

		e.target.parentNode.after(row);

		var currentIndex = children.indexOf(row) - 1;
		
		var temp = body.children[currentIndex];

		body.children[currentIndex] = body.children[currentIndex + 1];
		body.children[currentIndex + 1] = temp;

		body.children[currentIndex + 1].attributes.id = currentIndex + 1;
		body.children[currentIndex].attributes.id = currentIndex;

		generatePreview();
	} else if (children.indexOf(e.target.parentNode) < children.indexOf(row)) {
		e.target.parentNode.before(row);

		var currentIndex = children.indexOf(row)  - 1;
		
		var temp = body.children[currentIndex];

		body.children[currentIndex] = body.children[currentIndex - 1];
		body.children[currentIndex - 1] = temp;
		
		body.children[currentIndex - 1].attributes.id = currentIndex - 1;
		body.children[currentIndex].attributes.id = currentIndex;

		generatePreview()
	}
}
