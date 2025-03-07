$(document).ready(function() {
    $(document).on('keydown', function(event) {
        if (event.code === 'Space' || event.key === ' ') {
            event.preventDefault();
            startGame();
        }
    });

    $('#startGameBtn').on('click', function() {
        startGame();
    });

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // console.log(data.dinosaures);
            let memorySelected = localStorage.getItem('memorySelected');
            images = data[memorySelected];
        })

    let images = [];

    let rows = localStorage.getItem('memorySize').split("")[0];
    let columns = localStorage.getItem('memorySize').split("")[2];
    let questionImgSrc = 'assets/images/question.svg';
    let nbImage = (rows * columns) / 2;

    // Création du tableau pour une partie
    function startGame() {
        if (!images) alert('Vous devez choisir un type de memory !');

        $('#gameScore').text('Score : 0');
        $('#gameScore').show();

        let table = $('#gameTable');
        // Vide le tableau avant de relancer une game
        table.empty();
        table.css('border', '2px solid black');
        
        // Vérifie que le nombre d'images disponible est supérieur au nombre d'images demandés
        if (nbImage > images.length) {
            alert('Vous devez choisir une taille de memory adéquat');
            return false;
        }

        // Mélange avec 0.5 - Math.random(), c'est pour avoir une plage de -0.5 à 0.5, si inf à 0 alors A avant B, si sup à 0 alors A après B
        // prend les 8 premières images avec .slice(0, 8)
        let selectedImages = images.sort(() => 0.5 - Math.random()).slice(0, nbImage);
        // Duplique le tableau selectedImages
        let gameImages = [...selectedImages, ...selectedImages];
        // Mélange les images
        gameImages.sort(() => 0.5 - Math.random());

        let imgIdex = 0;

        for (let i = 0; i < rows; i++) {
            let tr = $('<tr></tr>');
            
            for (let j = 0; j < columns; j++) {
                let imgSrc = gameImages[imgIdex];
                // data-image="${imgSrc}" attribu l'image à la td sans l'afficher
                let td = $(`<td id="${imgIdex}" data-image="${imgSrc}"></td>`);
                let img = $(`<img src='${questionImgSrc}' alt="hidden">`);

                td.append(img);
                tr.append(td);
                imgIdex++;
            }

            table.append(tr);
        }
    }

    let firstClick = null;
    let secondClick = null;
    let lockBoard = false;
    let score = 0;
    // Écoute des clicks sur la td du tableau
    $('#gameTable').on('click', 'td', function() {
        if (lockBoard) return; // Empêche de cliquer pendant une vérification
        if ($(this).find('img').attr('src') !== questionImgSrc) return; // Empêche de cliquer sur une carte déjà révélée

        // Récupère l'image cachée dans la td
        let clickedImg = $(this).data('image');
        // Affiche l'image réelle
        $(this).find('img').attr('src', clickedImg);

        // Met le score à 0 pour un début de partie
        if ($('#gameScore').text() === 'Score : 0') {
            score = 0;
        }

        if (!firstClick) {
            firstClick = $(this);
        } else {
            secondClick = $(this);
            lockBoard = true; // Bloque les clics pendant la vérification

            setTimeout(() => {
                if (firstClick.data('image') === secondClick.data('image')) {
                    // Trouvé, les cartes restent visibles
                    firstClick = secondClick = null;
                    score++;
                    $('#gameScore').text(`Score : ${score}`);
                    checkGameOver(score);
                } else {
                    // Pas trouvé, les cartes se cachent
                    firstClick.find('img').attr('src', questionImgSrc);
                    secondClick.find('img').attr('src', questionImgSrc);
                    firstClick = secondClick = null;
                    score++;
                    $('#gameScore').text(`Score : ${score}`);
                }
                lockBoard = false;
            }, 1000);
        }
    });    
});

function checkGameOver(score) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let nbQuestionImg = $('#gameTable td img').filter(function() {
        return $(this).attr('src') === 'assets/images/question.svg';
    }).length;

    let scoreId = localStorage.getItem('scoreId');

    if (!scoreId) {
        scoreId = 1;
    } else {
        scoreId++;
    }

    date = new Date();
    let formattedDate = date.getDate().toString().padStart(2, '0') + '/' +
                        (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        date.getFullYear();

    if (nbQuestionImg == 0 && currentUser) {
        console.log('GameOver');
        let scoreHistory = {
            username: currentUser.username,
            score: score,
            size: localStorage.getItem('memorySize'),
            memory: localStorage.getItem('memorySelected'),
            date: formattedDate
        }
        localStorage.setItem(`score${scoreId}`, JSON.stringify(scoreHistory));
        localStorage.setItem('scoreId', scoreId);
    }
}