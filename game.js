$(document).ready(function() {
    $('#startGameBtn').on('click', function() {
        startGame();
    });

    // let images = [
    //     'assets/images/dinosaures/1.jpg', 'assets/images/dinosaures/2.jpg', 'assets/images/dinosaures/3.jpg', 'assets/images/dinosaures/4.jpg',
    //     'assets/images/dinosaures/5.jpg', 'assets/images/dinosaures/6.jpg', 'assets/images/dinosaures/7.jpg', 'assets/images/dinosaures/8.jpg',
    //     'assets/images/dinosaures/9.jpg', 'assets/images/dinosaures/10.jpg'
    // ];

    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // console.log(data.dinosaures);
        images = data.dinosauresAvecNom;
    })

    let images = [];

    let rows = 4;
    let columns = 4;
    let questionImgSrc = 'assets/images/question.svg';

    // Création du tableau pour une partie
    function startGame() {
        let table = $('#gameTable');
        // Vide le tableau avant de relancer une game
        table.empty();

        // Mélange avec 0.5 - Math.random(), c'est pour avoir une plage de -0.5 à 0.5, si inf à 0 alors A avant B, si sup à 0 alors A après B
        // prend les 8 premières images avec .slice(0, 8)
        let selectedImages = images.sort(() => 0.5 - Math.random()).slice(0, 8);
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

                // Si imgScr est null ou undefined alors j'ignore
                // if (!imgSrc) {
                //     continue;
                // }

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
    // Écoute des clicks sur la td du tableau
    $('#gameTable').on('click', 'td', function() {
        if (lockBoard) return; // Empêche de cliquer pendant une vérification
        if ($(this).find('img').attr('src') !== questionImgSrc) return; // Empêche de cliquer sur une carte déjà révélée

        // Récupère l'image cachée dans la td
        let clickedImg = $(this).data('image');
        // Affiche l'image réelle
        $(this).find('img').attr('src', clickedImg);

        if (!firstClick) {
            firstClick = $(this);
        } else {
            secondClick = $(this);
            lockBoard = true; // Bloque les clics pendant la vérification

            setTimeout(() => {
                if (firstClick.data('image') === secondClick.data('image')) {
                    // Trouvé, les cartes restent visibles
                    firstClick = secondClick = null;
                } else {
                    // Pas trouvé, les cartes se cachent
                    firstClick.find('img').attr('src', questionImgSrc);
                    secondClick.find('img').attr('src', questionImgSrc);
                    firstClick = secondClick = null;
                }
                lockBoard = false;
            }, 1000);
        }
    });
});