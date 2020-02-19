let header = document.createElement("header");

let navbar = document.createElement("div");
navbar.className = "navbar navbar-dark bg-dark shadow-sm";

let container = document.createElement("div");
container.className = "container d-flex justify-content-between";

let ul = document.createElement("ul");
ul.className = "navbar-nav ml-auto";

let a = document.createElement("a");
a.className = "navbar-brand d-flex align-items-center";
a.setAttribute("href", "./index.html");

let strong = document.createElement("strong");
strong.innerText = "3D tic-tac-toe";

a.appendChild(strong);
container.appendChild(a);
container.appendChild(ul);
navbar.appendChild(container);
header.appendChild(navbar);
document.body.insertBefore(header, document.body.firstChild);
