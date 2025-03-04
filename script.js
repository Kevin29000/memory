$(document).ready(function() {

    // Charger le currentUser
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        $('#profilUsername').text(currentUser.username);
        $('#profilEmail').text(currentUser.email);
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
        // Met à jour la valeur de userId pour la prochaine inscription
        localStorage.setItem('userId', userId);
    });

    // Login
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
    
        let email = $('#loginEmail').val();
        let password = $('#loginPassword').val();
    
        // console.log(email, password);
    
        if(login(email, password)) {
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

    // Image lié au select du memory dans le profil
    

});

function login(email, password) {
    for (let i = 0; i < localStorage.length; i++) {
        // Récupère la clé à l'index i dans le localSotrage
        let key = localStorage.key(i);

        // Prend le user lié à la clé
        let user = JSON.parse(localStorage.getItem(key));

        if (user.email === email && user.password === password) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'profile.html';
            return true;
        } else {
            return false;
        }
    }
}

function findUserByEmail(email) {
    let foundUser = null;
    for (let i = 0; i < localStorage.length; i++) {
        // Récupère la clé à l'index i dans le localSotrage
        let key = localStorage.key(i);

        // Prend le user lié à la clé
        let user = JSON.parse(localStorage.getItem(key));

        if (user.email === email) {
            foundUser = user;
            break;
        }
    }
    return foundUser;
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