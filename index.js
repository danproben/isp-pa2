var page = "<h1>Landing Page for X</h1>";

function openWin() {

    var myWindow = window.open("", "ISP", "width=800, height=168");
    myWindow.document.write(page);
}

function addParagraph() {
    page += "<p>This is a paragraph</p>";
}