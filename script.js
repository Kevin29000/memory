$(document).ready(function() {

    // Charger le currentUser
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        $('#profilUsername').text(currentUser.username);
        $('#profilEmail').text(currentUser.email);
        loadHistory(currentUser);
    } else {
        $('#profilUsername').text('...');
        $('#profilEmail').text('...');
    }

    // Inscription
    $('#registrationForm').on('submit', function(event) {
        event.preventDefault();
    
        let username = $('#usernameRegistration').val();
        let email = $('#emailRegistration').val();
        let password = $('#passwordRegistration').val();
    
        let user = {
            username: username,
            email: email,
            password: password
        };

        // Vérifie si le username est déjà présent dans le localStorage
        if (findUserByUsername(username)) {
            alert(`Le nom d'utilisateur : ${username} est déjà utilisé !`);
            return;
        }
    
        // Vérifie si l'email est déjà présente dans le localStorage
        if (findUserByEmail(email)) {
            alert(`L'email : ${email} est déjà utilisé !` );
            return;
        }
    
        // userId est une donnée indépendante dans le localStorage est sert uniquement à définir l'id de l'utilisateur
        let userId = localStorage.getItem('userId');
        
        // Définit le userID dans le localStorage
        if (!userId) {
            userId = 1;
        } else {
            userId ++;
        }
    
        localStorage.setItem(`user${userId}`, JSON.stringify(user));
        console.log(`Utilisateur ajouté : user${userId}`, JSON.stringify(user));
        window.location.href = 'login.html';
        // Met à jour la valeur de userId pour la prochaine inscription
        localStorage.setItem('userId', userId);
    });

    // Login
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
    
        let email = $('#loginEmail').val();
        let password = $('#loginPassword').val();
    
        // console.log(email, password);
    
        if (login(email, password)) {
            console.log('User trouvé');
            $('#loginError').text('');
        } else {
            $('#loginError').text('L\'email ou le mot de passe est incorrect !');
        }
    });

    // Logout
    $('#logout').on('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Vérification des inputs de registrationForm
    $('#usernameRegistration').on('input', function() {
        validateUsername($(this).val());
    });

    $('#emailRegistration').on('input', function() {
        validateEmail($(this).val());
    });

    $('#passwordRegistration').on('input', function() {
        validatePassword($(this).val());
    });

    // Attribuer une image pour chaque options du select du memory de Profil
    $('#memoryProfileSelect').on('change', function() {
        let val = $(this).val();
        $('#memoryProfileImg').attr('src', `assets/images/${val}/memory_detail_${val}.png`);
        localStorage.setItem('memorySelected', val);

        // Ajouter la taille du memory dans le select en fonction de l'image selectionné
        let select = $('#memorySizeSelect');
        select.empty();
        select.append("<option value=''>-- Veuillez selectionner une taille --</option>")
        let opt2x5 = $("<option value='2x5'>2 x 5</option>");
        let opt4x4 = $("<option value='4x4'>4 x 4</option>");
        let opt4x5 = $("<option value='4x5'>4 x 5</option>");
        let opt4x6 = $("<option value='4x6'>4 x 6</option>");
        
        switch (val) {
            case 'dinosaures':
                select.append(opt2x5, opt4x4, opt4x5);
                break;
            case 'dinosauresAvecNom':
                select.append(opt2x5, opt4x4, opt4x5);
                break;
            case 'animauxDomestiques':
                select.append(opt2x5, opt4x4, opt4x5);
                break;
            case 'animauxAnimes':
                select.append(opt2x5, opt4x4);
                break;
            case 'legumes':
                select.append(opt2x5);
                break;
            case 'animaux':
                select.append(opt2x5, opt4x4, opt4x5, opt4x6);
                break;
            case 'chiens':
                select.append(opt2x5, opt4x4, opt4x5);
                break;
            case 'alphabetScrabble':
                select.append(opt2x5, opt4x4, opt4x5, opt4x6);
                break;
            default:
                break;
        }
    });

    // Ajout de la taille du memory dans le localStorage via le select dans profil
    $('#memorySizeSelect').on('change', function() {
        let val = $(this).val();
        localStorage.setItem('memorySize', val);
    });

    // Ajout de la taille du memory dans le localStorage pour le ranking
    $('#memoryRankingSelect').on('change', function() {
        let val = $(this).val();
        localStorage.setItem('rankingMemorySize', val);
        loadRanking();
    });
});

function login(email, password) {
    for (let i = 0; i < localStorage.length; i++) {
        // Récupère la clé à l'index i dans le localSotrage
        let key = localStorage.key(i);

        try {
            // Prend le user lié à la clé
            let user = JSON.parse(localStorage.getItem(key));

            if (user.email === email && user.password === password) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'profile.html';
                return true;
            }
        } catch (e) {
            continue;
        }
    }
    return false;
}

function findUserByUsername(username) {
    for (let i = 0; i < localStorage.length; i++) {
        // Récupère la clé à l'index i dans le localSotrage
        let key = localStorage.key(i);

        // Try catch pour éviter les problème lié au objets user et les chaines de caractère dans le localStorage
        try {
            // Prend le user lié à la clé
            let user = JSON.parse(localStorage.getItem(key));

            if(user.username === username) {
                return true;
            }
        } catch (e) {
            continue;
        }
    }
    return false;
}

function findUserByEmail(email) {
    for (let i = 0; i < localStorage.length; i++) {
        // Récupère la clé à l'index i dans le localSotrage
        let key = localStorage.key(i);

        try {
           // Prend le user lié à la clé
            let user = JSON.parse(localStorage.getItem(key));

            if (user.email === email) {
                foundUser = user;
                return true;
            } 
        } catch (e) {
            continue;
        }
    }
    return false;
}

// Vérifie l'input username
function validateUsername(username) {
    let isValid = username.length >= 3;
    updateValidationIcon('#usernameRegistrationImg', isValid);
}

// Vérifie l'input email
function validateEmail(email) {
    let regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    let isValid = regex.test(email);
    updateValidationIcon('#emailRegistrationImg', isValid);
}

// Vérifie l'input password
function validatePassword(password) {
    // /\d/ est la regex pour chercher si la chaine contient un nombre, revient au même que /[0-9]/
    let hasNumber = /\d/.test(password);
    // le ^ à cet endroit veut dire tout sauf min, maj, chiffre, donc un caractère spécial
    let hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    let isValidLength = password.length >= 6;

    let isValid = hasNumber && isValidLength && hasSpecialChar;

    updateValidationIcon('#passwordRegistrationImg', isValid);
}

// Modifie l'image de validation du formulaire
function updateValidationIcon(imgId, isValid) {
    let icon = isValid ? 'assets/images/check.svg' : 'assets/images/error.svg';
    $(imgId).attr('src', icon);
}

// Charger l'historique du joueur dans le tableau du profil
function loadHistory(currentUser) {
    for (let i = 0; i < localStorage.length; i++) {

        let scores = JSON.parse(localStorage.getItem(`score${i}`));
        let table = $('#history');

        if (scores && scores.username === currentUser.username) {
            let tr = $('<tr></tr>');
            let tdScore = $(`<td>${scores.score}</td>`);
            let tdSize = $(`<td>${scores.size}</td>`);
            let tdMemory = $(`<td>${scores.memory}</td>`);
            let tdDate = $(`<td>${scores.date}</td>`);

            tr.append(tdScore);
            tr.append(tdSize);
            tr.append(tdMemory);
            tr.append(tdDate);
            table.append(tr);
        }
    }    
}

// Charger le classement des joueurs en fonction de la taille selectionné
function loadRanking() {
    let memorySize = localStorage.getItem('rankingMemorySize');

    if (!memorySize) return;

    let scoresArray = [];

    for (let i = 0; i < localStorage.length; i++) {
        if (memorySize) {
            let scoreData = JSON.parse(localStorage.getItem(`score${i}`));
            
            // Si les tailles de memory correspondent je le met dans le tableau des scores
            if (scoreData && scoreData.size == memorySize) {
                scoresArray.push(scoreData);
            }
        }
    }

    // Trie des scores par score croissant
    scoresArray.sort((a, b) => a.score - b.score);

    // Prend les 5 premiers
    let topScores = scoresArray.slice(0, 5);
    
    let table = $('#ranking');
    // Comme table.empty(); mais en gardant la première tr (pseudo, score ...)
    $('#ranking tr:not(:first)').remove();

    topScores.forEach((scores) => {
        let tr = $('<tr></tr>');
        let tdUsername = $(`<td>${scores.username}</td>`);
        let tdScore = $(`<td>${scores.score}</td>`);
        let tdSize = $(`<td>${scores.size}</td>`);
        let tdMemory = $(`<td>${scores.memory}</td>`);
        let tdDate = $(`<td>${scores.date}</td>`);

        tr.append(tdUsername);
        tr.append(tdScore);
        tr.append(tdSize);
        tr.append(tdMemory);
        tr.append(tdDate);
        table.append(tr);
    }); 
}