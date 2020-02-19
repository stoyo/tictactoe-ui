if (localStorage.getItem("userPayload") !== null) {
    window.location.href = "./index.html";
}

(function () {
    const button = document.getElementsByTagName("button")[0];
    button.addEventListener("click", submit);
}());

function submit(event) {
    event.preventDefault();

    const errorsContainer = document.getElementsByClassName("invalid-feedback")[0];
    errorsContainer.classList.remove("d-block");
    const ul = errorsContainer.getElementsByTagName("ul")[0];
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (xhttp.status === 201) {
                window.location.href = "./login.html";
            } else if (xhttp.status >= 400) {
                let errors = JSON.parse(xhttp.responseText).errors;
                for(const error in errors) {
                    const li = document.createElement("li");
                    li.appendChild(document.createTextNode(errors[error]));
                    ul.appendChild(li);
                }

                errorsContainer.classList.add("d-block");
            }
        }
    };

    const usernameInput = document.getElementsByName("username")[0];
    const passwordInput = document.getElementsByName("password")[0];

    xhttp.open("POST", baseUrl + "/users", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({username: usernameInput.value, password: passwordInput.value}));

    passwordInput.value = "";
}
