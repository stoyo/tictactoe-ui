if (localStorage.getItem("userPayload") !== null) {
    addNavItem("a", "nav-play", "./play.html", "Play");
    let li = addNavItem("span", "nav-logout", "#", "Logout");
    li.addEventListener("click", logout);
} else {
    addNavItem("a", "nav-login", "./login.html", "Login");
    addNavItem("a", "nav-register", "./register.html", "Register");
}

function addNavItem(elementType, navItemId, navItemHref, navItemInnerHtml) {
    let li = document.createElement("li");
    li.id = navItemId;
    li.className = "nav-item active";

    let element = document.createElement(elementType);
    element.className = "nav-link";
    if (elementType === "a") {
        element.href = navItemHref;
    } else {
        element.className += " cursor-pointer";
    }
    element.innerHTML = navItemInnerHtml;

    li.appendChild(element);

    let ul = document.getElementsByClassName("navbar-nav ml-auto")[0];
    ul.appendChild(li);

    return li;
}

function logout() {
    handleLogout();
}

function handleLogout(redirectUrl = "./index.html") {
    localStorage.removeItem("userPayload");
    window.location.href = redirectUrl;
}
