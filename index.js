class Element {
    constructor(tagname) {
        this.tagname = tagname;
        this.attributes = {};
        this.content = "";
        this.style = {
            "color": "#000000",
            "text-align": "center",
            "overflow-wrap": "anywhere"
        };
        this.html = "";
        this.hyperlink = "";
        this.children = [];

        // image related stuff
        this.src;
        this.imgSize = "200";

        Element.prototype.pack = function() {

            var css = "";
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

            // check to see if the attributes dictionary is empty or not to determine if attributes should be added
            if (Object.keys(this.attributes).length) {
                attributes += " ";

            // loop through attributes
                for (let key in this.attributes){
                    // if an attribute is present, add it to the attributes string
                    if (this.attributes[key]) {
                        attributes += `${key}="${this.attributes[key]}"`;
                    }

                    attributes += " ";
                }
            }

            // interpolate the entire html element
            var startTag = `<${ this.tagname }${ attributes }${ css }>`
            var endTag = `</${ this.tagname }>`;

            // if a parent, place immediate children html into content
            if (this.children.length > 0){
                this.content = "";
                for (var i = 0; i < this.children.length; i++){
                    this.content += body.children[i].html;
                }
            }

            this.html = startTag + this.content + endTag;

            if (this.hyperlink != "") {
                this.html = startTag + `<a href="${this.hyperlink}" target="_blank">` + this.content + '</a>' + endTag;
            }
            
            if (this.tagname == "img"){
                this.html = `<div style="text-align: ${this.style["text-align"]}"><img width="${this.imgSize}" id="${this.attributes.id}" src="${this.attributes.src}"></div>`;
            }
        
        }
    }
}

var inputFile = document.getElementById("img");
inputFile.onchange = function() {
    generateTable();
}

var body = new Element("body");

function openWin() {
    var page = "";
    page = generateWebpage();
    var myWindow = document.open("", "ISP", "width=800, height=168");
    myWindow.document.write(page);
}

function checkInputType(option) {
    
    switch(option.value){
        case "h1":
        case "h2": 
        case "h3":
        case "p":
            document.getElementById("text").style.display = "inline";
            document.getElementById("img").style.display = "none"
            break;
        case "img":
            document.getElementById("text").style.display = "none";
            document.getElementById("img").style.display = "block"
            break;
        default:
            break;
        
    }
}

// TODO: Pass the parent in and pack into parent. if no parent is supplied, all new children are added to the body
function addChild(parent, parentID) {

    var newElement = new Element(document.getElementById("tagname").value);

    switch(newElement.tagname){
        case "h1":
        case "h2": 
        case "h3":
        case "p":
            newElement.attributes["id"] = body.children.length;
            newElement.content = document.getElementById("text").value;
            break;
        case "img":
            newElement.attributes["id"] = body.children.length;
            newElement.attributes["src"] = URL.createObjectURL(inputFile.files[0]);
            break;
        default:
            break;
    }

    newElement.pack();

    body.children.push(newElement);
    body.pack();

    generatePreview();
    generateTable();
}

function updateBody(caller) {

    var attributeToUpdate = caller.name;

    switch(attributeToUpdate){
        case "background":
            const color = document.getElementById("backgroundColor").value
            // must do it like this instead of calling generate preview again, since body is not included in preview generatation
            document.getElementById("preview").style.backgroundColor = document.getElementById("backgroundColor").value
            body.style["background-color"] = `${color}`;
            break;
        case "margin":
            const value = document.getElementById("bodyMargin").value + '%';
            document.getElementById("marginPercent").innerHTML = value;
            body.style["margin"] = value;
            break;
        default:
            break;
    }
    generatePreview();
}

function updateElement(option, elementid) {

    var value = document.getElementById(option.id).value;

    if (option.name == "color"){
        body.children[elementid].style["color"] = value;
    } else if (option.name == "tagnames") {
		body.children[elementid].tagname = value;
	} else if (option.name == "hyperlink"){
		const link = value;
		body.children[elementid].hyperlink = link;
	} else if (option.name == "alignment"){
        body.children[elementid].style["text-align"] = value;
    } else if (option.name == "imgSize") {
        body.children[elementid].imgSize = value;
    }

    body.children[elementid].pack()
    body.pack();
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
    var preview = `<div style="background-color: ${body.style["background-color"]}; margin: ${body.style["margin"]};">`;

    for (i = 0; i < body.children.length; i++){
        preview += body.children[i].html;
    }

    preview += "</div>"

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

    let images = [];

    body.children.forEach(item => {

        // ---------------- Tag
        var tagname = item.tagname;
        table += `<tr id="${item.attributes.id}" draggable="true" ondragstart="start()" ondragover="dragover()" ondragend="generateTable()">`



        if (tagname != "img"){

            table += `<td><select name="tagnames" id="tagnames${item.attributes.id}" onchange="updateElement(this, ${item.attributes.id})">`

            const tagnameDropDownMenu = ["h1", "h2", "h3", "p"];
            tagnameDropDownMenu.forEach(tagnameItem => {
                if (tagnameItem == item.tagname){
                    table += `<option value="${tagnameItem}" selected>${tagnameItem}</option>`;
                } else {
                    table += `<option value="${tagnameItem}">${tagnameItem}</option>`;
                }
            })
            table += '</select></td>'
        } else {
            table += "<td><p>img</p></td>"
        }


        // ---------------- Content

        table += `<td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">`
        table += item.tagname != "img" ? item.content : `<img width="100px" id="img${item.attributes.id}" src="${item.attributes.src}">` // if the tagname is an image, set the content of the "content" to an img tag
        table += `</td>`       // content

        // ----------------- Options
		table += "<td>";
        switch(item.tagname){
            case "h1":
            case "h2":
            case "h3":
            case "p":
                // text color
                table += `<input id="colorOption${item.attributes.id}" name="color" type="color" value="${item.style["color"]}" onchange="updateElement(this, ${item.attributes.id})">`
				// add a hyperlink
                table += `<input id="hyperlinkOption${item.attributes.id}" value="${item.hyperlink}" style="margin: 2%" name="hyperlink" type="text" placeholder="Add a hyperlink" onchange="updateElement(this, ${item.attributes.id})">`

                // alignment options
                table += `<select name="alignment" id="alignmentOption${item.attributes.id}" onchange="updateElement(this, ${item.attributes.id})">`
                table += `<option value="left" ${item.style["text-align"] == "left" ? "selected" : ""}>Align left</option>`;
                table += `<option value="center" ${item.style["text-align"] == "center" ? "selected" : ""}>Align center</option>`
                table += `<option value="right" ${item.style["text-align"] == "right" ? "selected" : ""}>Align right</option>`
                table += `</select>`
                break;
            case "img":
                // image size in px
                table += `<p>Image size: </p><input type="text" id="imgSize" name="imgSize" value="${item.imgSize}" onchange="updateElement(this, ${item.attributes.id})">`

                // alignment options
                table += `<select name="alignment" id="alignmentOption${item.attributes.id}" onchange="updateElement(this, ${item.attributes.id})">`
                table += `<option value="left" ${item.style["text-align"] == "left" ? "selected" : ""}>Align left</option>`;
                table += `<option value="center" ${item.style["text-align"] == "center" ? "selected" : ""}>Align center</option>`
                table += `<option value="right" ${item.style["text-align"] == "right" ? "selected" : ""}>Align right</option>`
                table += `</select>`
                break;
            default:
                break;
        }

		table += "</td>";

        // -------------------- Actions
        table += `<td><button onclick="removeElement(${item.attributes.id})">Remove</button>` // remove element
    })

    table += '</table>';

    document.getElementById("tableContainer").innerHTML = table;
}

const addButton = document.getElementById("addButton");

const contentField = document.getElementById("text");

contentField.addEventListener("keypress", ({key}) => {
    if (key == "Enter"){
		key.preventDefault;
        addButton.click();
		contentField.value = '';
    }
})

// ---------------- drag and drop order

// TODO: fix deprecated event by adding event listeners
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
