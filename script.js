$('#registrationForm').on('submit', function(event) {
    event.preventDefault();

    let username = $('#username').val();
    let email = $('#email').val();
    let password = $('#password').val();

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



$('#testInput').on('input', function() {
    console.log($(this).val());
});



// let test = JSON.parse(localStorage.getItem('user1'));
// console.log(test.username, test.email, test.password);

// localStorage.clear();