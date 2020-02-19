if (localStorage.getItem("userPayload") === null) {
    window.location.href = "login.html";
}

let userPayload = JSON.parse(localStorage.getItem("userPayload"));
window.onload = function () {
    showLastUnfinishedGameIfPresent();
};

(function () {
    const button = document.getElementById("new-game-button");
    button.addEventListener("click", submit);
}());

function submit(event) {
    event.preventDefault();
    clearErrors();
    createGame(document.getElementById("n").value);
}

function showGame(game) {
    const gameTable = document.getElementById("game");
    if (gameTable != null) {
        gameTable.parentNode.removeChild(gameTable);
    }

    const main = document.getElementsByClassName("row")[0];
    const div = document.createElement("div");
    div.id = "game";
    div.className = "col-md-4 offset-md-2";

    for (let i = 0; i < game.n; i++) {
        const table = document.createElement("table");
        for (let j = 0; j < game.n; j++) {
            const tr = document.createElement("tr");
            for (let k = 0; k < game.n; k++) {
                const td = document.createElement("td");

                let classes = "";
                if (k === 0) {
                    classes = classes.concat("left ")
                }

                if (j === 0) {
                    classes = classes.concat("top ")
                }

                classes = classes.concat("right bottom");

                td.className = classes;

                const tileIndex = i * game.n * game.n + j * game.n + k;
                if (game.board.charAt(tileIndex) !== "_") {
                    td.innerHTML = game.board.charAt(tileIndex);
                }

                td.setAttribute("data-tile-id", tileIndex);
                td.setAttribute("data-tile-game-id", game.id);
                td.addEventListener("click", moveEventListener);

                tr.appendChild(td);
                table.appendChild(tr);
            }
        }
        div.appendChild(table);
        main.insertBefore(div, main.firstChild);
    }
}

function moveEventListener(event) {
    if (event.target.innerHTML !== "") {
        return;
    }

    disableTileClickEvents();
    event.target.innerHTML = userSign;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            enableTileClickEvents();

            if (xhttp.status === 200) {
                let updatedGame = JSON.parse(xhttp.responseText);
                showMove(updatedGame);

                if (updatedGame.nextTurn == null) {
                    highlightWinner(updatedGame.winningTilesIndexes);
                }
            } else if (xhttp.status === 401) {
                handleLogout("./login.html");
            } else if (xhttp.status >= 400) {
                clearErrors();
                showErrors(JSON.parse(xhttp.responseText).errors);
            }

            if (xhttp.status !== 200) {
                event.target.innerHTML = "";
            }
        }
    };

    xhttp.open("PATCH", baseUrl + "/games/" + event.target.getAttribute("data-tile-game-id"), true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer " + userPayload.token);
    xhttp.send(JSON.stringify({move: parseInt(event.target.getAttribute("data-tile-id"))}));
}

function highlightWinner(winningTilesIndexes) {
    Object.values(winningTilesIndexes).forEach(function(winningTileIndex) {
        const td = document.querySelectorAll('[data-tile-id="' + winningTileIndex + '"]')[0];
        td.style.color = "#ff0000";
    });
}

function showMove(game) {
    for (let i = 0; i < game.n; i++) {
        for (let j = 0; j < game.n; j++) {
            for (let k = 0; k < game.n; k++) {
                const tileIndex = i * game.n * game.n + j * game.n + k;
                const td = document.querySelectorAll('[data-tile-id="' + tileIndex + '"]')[0];
                if (game.board.charAt(tileIndex) !== "_") {
                    td.innerHTML = game.board.charAt(tileIndex);
                }
            }
        }
    }
}

function showLastUnfinishedGameIfPresent() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (xhttp.status === 200) {
                let games = JSON.parse(xhttp.responseText);

                let gameIndex = -1;
                for (let i = 0; i < games.length; i++) { // games are sorted desc by default
                    if (games[i].nextTurn != null) {
                        gameIndex = i;
                        break;
                    }
                }

                if (gameIndex !== -1) {
                    showGame(games[gameIndex]);
                }
            } else if (xhttp.status === 401) {
                handleLogout("./login.html");
            } else if (xhttp.status >= 400) {
                showErrors(JSON.parse(xhttp.responseText).errors);
            }
        }
    };

    xhttp.open("GET", baseUrl + "/games", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer " + userPayload.token);
    xhttp.send();
}

function createGame(n) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (xhttp.status === 201) {
                showGame(JSON.parse(xhttp.responseText));
            } else if (xhttp.status === 401) {
                handleLogout("./login.html");
            } else if (xhttp.status >= 400) {
                showErrors(JSON.parse(xhttp.responseText).errors);
            }
        }
    };

    xhttp.open("POST", baseUrl + "/games", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", "Bearer " + userPayload.token);
    xhttp.send(JSON.stringify({n: n}));
}

function clearErrors() {
    const errorsContainer = document.getElementsByClassName("invalid-feedback")[0];
    errorsContainer.classList.remove("d-block");
    const ul = errorsContainer.getElementsByTagName("ul")[0];
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
}

function showErrors(errors) {
    const errorsContainer = document.getElementsByClassName("invalid-feedback")[0];
    const ul = errorsContainer.getElementsByTagName("ul")[0];
    Object.values(errors).forEach(function(error) {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(error));
        ul.appendChild(li);
    });

    errorsContainer.classList.add("d-block");
}

function disableTileClickEvents() {
    document.querySelectorAll('[data-tile-id]').forEach((tile) => {
        tile.style.cursor = "progress"
    });

    document.addEventListener("click", disableTileClickEventListener, true);
}

function enableTileClickEvents() {
    document.querySelectorAll('[data-tile-id]').forEach((tile) => {
        tile.style.cursor = "pointer"
    });

    document.removeEventListener("click", disableTileClickEventListener, true);
}

function disableTileClickEventListener(e) {
    if (e.currentTarget.hasAttribute("data-tile-id")) {
        e.stopPropagation();
        e.preventDefault();
    }
}