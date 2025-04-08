var mainMenu;
var credits;
var leaderBoard;
var gameOver;
var startButton;
var creditsButton;
var leaderBoardButton;
var backButton1;
var backButton2;
var backButton3;

function MainMenuSetup(onStart) {
    mainMenu = document.getElementById("mainMenu");
    credits = document.getElementById("credits");
    startButton = document.getElementById("startButton");
    creditsButton = document.getElementById("creditsButton");
    backButton1 = document.getElementById("backButton1");
    backButton3 = document.getElementById("backButton3");
    leaderBoardButton = document.getElementById("leaderButton");
    leaderBoard = document.getElementById("leaderBoard");
    gameOver = document.getElementById("gameOver")

    ShowMenu();
    
    startButton.onclick = () => {
        sounds.click.audio.play();
        mainMenu.setAttribute('style', 'top: 720px');
        if (typeof(onStart) !== 'undefined') {
            onStart();
        }
    }

    creditsButton.onclick = () => {
        sounds.click.audio.play();
        ShowCredits();
    }

    leaderBoardButton.onclick = () => {
        sounds.click.audio.play();
        ShowLeaderBoard();
    }

    backButton1.onclick = () => {
        sounds.click.audio.play();
        ShowMenu();
    }

    backButton3.onclick = () => {
        sounds.click.audio.play();
        SaveScore();
    }
}

function ShowMenu(){
    mainMenu.setAttribute('style', 'top: 0px');
    credits.setAttribute('style', 'top: 720px');
    leaderBoard.setAttribute('style', 'left: 1280px');
    gameOver.setAttribute('style', 'top: -720px')
}

function ShowCredits(){
    mainMenu.setAttribute('style', 'top: -720px');
    credits.setAttribute('style', 'top: 0px');
}

function ShowLeaderBoard(){
    mainMenu.setAttribute('style', 'left: -1280px');
    leaderBoard.setAttribute('style', 'left: 0px');
    GetScores();
}

function ShowGameOver() {
    gameOver.setAttribute('style', 'top: 0px');
}

function SaveScore() {
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value.trim();
    
    if (playerName.length !== 5) {
        alert('Please enter a 5-letter name.');
    }else{
        saveTask(playerName,savePunt);
        playerNameInput.value = "";
        ShowMenu();
    }

    
}

function GetScores() {
    getTask().then((querySnapshot) => {
        const leaderboardContent = document.querySelector(".leaderBoard-content");

        leaderboardContent .innerHTML = "";

        const leaderboardData = [];
    
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const playerName = data.name;
            const playerPoints = data.points;

            leaderboardData.push({ name: playerName, points: playerPoints });
        });

        leaderboardData.sort((a, b) => b.points - a.points);

        const top5Data = leaderboardData.slice(0, 5);

        top5Data.forEach((playerData, index) => {
            const playerInfo = document.createElement("h2");
            playerInfo.textContent = `${index + 1}. ${playerData.name}: ${playerData.points}`;
            leaderboardContent.appendChild(playerInfo);
        });
 
        const backButton = document.createElement("div");
        backButton.classList.add("menuButton");
        backButton.id = "backButton2";
        backButton.textContent = "Back";

        leaderboardContent.appendChild(backButton);
    
        backButton.onclick = () => {
            sounds.click.audio.play();
            ShowMenu();
        };
    
    }).catch((error) => {
        console.error('Error al obtener los datos:', error);
    });
}
