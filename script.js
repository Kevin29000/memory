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
        alert('L\'email : ' + email + ' est déjà utilisé !' );
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
$('#usernameRegistration').on('input', function() {
    if ($(this).val().length >= 3) {
        $('#usernameRegistrationImg').attr('src', 'assets/images/check.svg')
    } else {
        $('#usernameRegistrationImg').attr('src', 'assets/images/error.svg')
    }
});

// Vérifie l'input email
$('#emailRegistration').on('input', function() {
    const email = $(this).val();

    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(email)) {
        $('#emailRegistrationImg').attr('src', 'assets/images/check.svg')
    } else {
        $('#emailRegistrationImg').attr('src', 'assets/images/error.svg')
    }
    
});

// Vérifie l'input password
$('#passwordRegistration').on('input', function() {
    const password = $('#passwordRegistration').val();
    // console.log('Le mdp est : '+ password);
    let letters = password.split("");

    let hasNumber = false;
    let length = false;
    let hasSpecialChar = false;

    for (let i = 0; i < letters.length; i++) {
        if (!isNaN(letters[i])) {
            hasNumber = true;
            // le ^ à cet endroit veut dire tout sauf min, maj, chiffre, donc un caractère spécial
        } else if (/[^a-zA-Z0-9]/.test(letters[i])) {
            hasSpecialChar = true;
        } 
    }

    if (letters.length >= 6) {length = true}

    if (hasNumber && length && hasSpecialChar) {
        $('#passwordRegistrationImg').attr('src', 'assets/images/check.svg')
    } else {
        $('#passwordRegistrationImg').attr('src', 'assets/images/error.svg')
    }
});


// let test = JSON.parse(localStorage.getItem('user1'));
// console.log(test.username, test.email, test.password);

// localStorage.clear();