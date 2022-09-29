// Projet3.js
// Par Ronald Jean-Julien et Axel Doray-Tardif
// Date de remise: 
// Librairie pour projet3.htm

/*
|----------------------------------------------------------------------------------|
| (GLOBAL; AJAX) Déclaration des variables de travail globales
|----------------------------------------------------------------------------------|
*/
/* Détection automatique du dossier où est entreposé l'application serveur */
var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';

/*
|--------------------------------------------------------------------------------------------------------------|
| initialiseInterface
|--------------------------------------------------------------------------------------------------------------|
*/
function initialiseInterface(binIdentificationPresente, binOperationsSuccursalesPresente, divSuccursalesPresente) {
    masqueB('divIdentification', !binIdentificationPresente);
    masqueB('divOperationsSuccursales', !binOperationsSuccursalesPresente);
    masqueB('divSuccursales', !divSuccursalesPresente);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| initialiseIdentifiant
|--------------------------------------------------------------------------------------------------------------|
*/
function initialiseIdentifiant() {
    var strIdentifiant = recupereCookie('identifiant');
    var strMotDePasse = recupereCookie('motDePasse');
    if(strIdentifiant == null || strMotDePasse == null) {
        masqueB('btnSouvenir', false);
        masqueB('btnNonSouvenir', true);
    }
    else {
        masqueB('btnSouvenir', true);
        masqueB('btnNonSouvenir', false);
        b('tbMatricule', strIdentifiant);
        b('tbMotDePasse', strMotDePasse);
    }
}

/*
|--------------------------------------------------------------------------------------------------------------|
| enregistreIdentifiant
|--------------------------------------------------------------------------------------------------------------|
*/
function enregistreIdentifiant() {
    enregistreCookie('identifiant', b('tbMatricule'), 365);
    enregistreCookie('motDePasse', b('tbMotDePasse'), 365);
    masqueB('btnSouvenir', true);
    masqueB('btnNonSouvenir', false);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| detruitIdentifiant
|--------------------------------------------------------------------------------------------------------------|
*/
function detruitIdentifiant() {
    var strIdentifiant = recupereCookie('identifiant');
    var strMotDePasse = recupereCookie('motDePasse');
    enregistreCookie('identifiant', strIdentifiant, -1);
    enregistreCookie('motDePasse', strMotDePasse, -1);
    masqueB('btnSouvenir', false);
    masqueB('btnNonSouvenir', true);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| deconnexion
|--------------------------------------------------------------------------------------------------------------|
*/
function deconnexion() {
    location.href = location.href;
}

/*
|--------------------------------------------------------------------------------------------------------------|
| effacerAjoutModification
|--------------------------------------------------------------------------------------------------------------|
*/
function effacerAjoutModification() {
    b('tbVilleAjout', '');
    b('tbBudgetAjout', '');
    b('lblMessageAjout', '');
}

/*
|--------------------------------------------------------------------------------------------------------------|
| effacerRetrait
|--------------------------------------------------------------------------------------------------------------|
*/
function effacerRetrait() {
    b('tbVilleRetrait', '');
    b('lblMessageRetrait', '');
}

/*
|--------------------------------------------------------------------------------------------------------------|
| effacerBudgetVisualisation
|--------------------------------------------------------------------------------------------------------------|
*/
function effacerBudgetVisualisation() {
    b('tbVilleBudgetVisualisation', '');
    b('lblBudgetVisualisation', '');
    b('lblMessageBudgetVisualisation', '');
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_compteSuccursales
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_compteSuccursales() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        b('lblReponse', strVerdict);
        strVerdict = strVerdict.split(';')[0];
        b('lblSuccursales', strVerdict);
        if(strVerdict == '0') {
            masqueB('btnReinitialiser', true);
            masqueB('tabRetrait', true);
            masqueB('tabVisualisation', true);
        }
        else {
            masqueB('btnReinitialiser', false);
            masqueB('tabRetrait', false);
            masqueB('tabVisualisation', false);
        }
    }

    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_compteSuccursales)
    |-----------------------------------------------------------------------------------------------------------|
    */
    var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
    var strMotDePasse = b('tbMotDePasse');
    var strAuthorisation = b('tbMatricule') + strMotDePasse.substring(strMotDePasse.length - 5);
    var strDonnees = 'Action=Succursale-Compte&Aut=' + strAuthorisation;
    b('lblRequete', strNomApplication + '?' + strDonnees);

    let objDonnesTransmises = new URLSearchParams({
      "Action": "Succursale-Compte",
      "Aut": strAuthorisation
    })
    let objOptions = {
      method: "POST",
      body: objDonnesTransmises
    }

    /* Envoi de la requête */
    fetch(strNomApplication, objOptions)
        .then(response => response.text())
        .then(responseData => recupereReponseServeur(responseData))
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_afficheListeSuccursales
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_afficheListeSuccursales() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        b('lblReponse', strVerdict);
        var tabVerdict = strVerdict.split(';');
        if (tabVerdict[0] == 'AUCUNE') {
            b('lblSuccursales', 'Aucune succursale enregistrée...');
        }
        else {
            var strFlux = '<table class="sTableauSuccursales"> ';
            strFlux += '<tr class="sEnteteTableauSuccursales"> <td class="sCelNoSuccursale">No</td> <td class="sCelVille">Ville</td> <td class="sCelBudget">Budget</td> </tr> ';
            for(var i = 0; i < tabVerdict.length - 1; i++) {
                var strVille = tabVerdict[i].split(',')[0];
                var strBudget = tabVerdict[i].split(',')[1];
                strFlux += '<tr class="sCorpsTableauSuccursales"> <td class="sCelNoSuccursale">' + i + '</td> ';
                strFlux += '<td class="sCelVille">' + strVille + '</td> ';
                strFlux += '<td class="sCelBudget">' + strBudget + ' $' + '</td> </tr> ';
            }
            strFlux += '</table>';
            b('lblSuccursales', strFlux);
        }
    }
    
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_afficheListeSuccursales)
    |-----------------------------------------------------------------------------------------------------------|
    */
    var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
    var strMotDePasse = b('tbMotDePasse');
    var strAuthorisation = b('tbMatricule') + strMotDePasse.substring(strMotDePasse.length - 5);
    var strDonnees = 'Action=Succursale-Liste&Aut=' + strAuthorisation;
    b('lblRequete', strNomApplication + '?' + strDonnees);

    let objDonnesTransmises = new URLSearchParams({
      "Action": "Succursale-Liste",
      "Aut": strAuthorisation
    })
    let objOptions = {
      method: "POST",
      body: objDonnesTransmises
    }

    /* Envoi de la requête */
    fetch(strNomApplication, objOptions)
        .then(response => response.text())
        .then(responseData => recupereReponseServeur(responseData))
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteConnexion
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_tenteConnexion() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        b('lblReponse', strVerdict);
        var tabVerdict = strVerdict.split(';');
        if (tabVerdict[0] == 'PASOK') {
            b('lblMessageConnexion', 'Utilisateur inconnu!');
        } else if (tabVerdict[0] == 'OK') {
            initialiseInterface(false, true, true);
            b('lblNomComplet', tabVerdict[1] + ' ' + tabVerdict[2]);
            ajax_compteSuccursales();
        }
    }

    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_tenteConnexion)
    |-----------------------------------------------------------------------------------------------------------|
    */
    var strMatricule = b('tbMatricule');
    var strMotDePasse = b('tbMotDePasse');
    var binMatriculeValide = /^\d{7}$/.test(strMatricule);
    var binMotDePasseValide = /^([a-z]|[A-Z]){1,6}\d{5}$/.test(strMotDePasse);

    if (!binMatriculeValide && !binMotDePasseValide) {
        b('lblMessageConnexion', 'Indentifiant et mot de passe invalides!');
    }
    else if (!binMatriculeValide) {
        b('lblMessageConnexion', 'Indentifiant invalide!');
    }
    else if (!binMotDePasseValide) {
        b('lblMessageConnexion', 'Mot de passe invalide!');
    }
    else {
        b('lblMessageConnexion', '');
        var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
        var strDonnees = 'Action=Connexion&Mat=' + strMatricule + '&MDP=' + strMotDePasse;
        b('lblRequete', strNomApplication + '?' + strDonnees);

        let objDonnesTransmises = new URLSearchParams({
          "Action": "Connexion",
          "Mat": strMatricule,
          "MDP": strMotDePasse
        })
        let objOptions = {
          method: "POST",
          body: objDonnesTransmises
        }
  
        /* Envoi de la requête */
        fetch(strNomApplication, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))  
    }
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteAjoutModificationSuccursale
|--------------------------------------------------------------------------------------------------------------|
*/

 function ajax_tenteAjoutModificationSuccursale() {
   /*
   |-----------------------------------------------------------------------------------------------------------|
   | recupereReponseServeur
   |-----------------------------------------------------------------------------------------------------------|
   */
    function recupereReponseServeur(strVerdict) {
        b('lblReponse', strVerdict);
        strVerdict = strVerdict.split(';')[0];
        if (strVerdict == 'PASOK') {
            b('lblMessageAjout', 'Succursale existante!');
        }
        else if (strVerdict == 'OKM') {
            b('lblMessageAjout', 'Succursale modifiée');
        } else if (strVerdict == 'OKI') {
            b('lblMessageAjout', 'Succursale ajoutée');
            ajax_compteSuccursales();
        }
    }
   /*
   |-----------------------------------------------------------------------------------------------------------|
   | Module directeur (ajax_tenteAjoutModificationSuccursale)
   |-----------------------------------------------------------------------------------------------------------|
   */
    var strVille = b('tbVilleAjout');
    var strBudget = b('tbBudgetAjout');
    var expRegVille = /^([a-zA-Z]{1,}|[a-zA-Z]{1,}[-]){1,}$/;
    var expRegBudget = /^\d{3,7}$/;
    if (expRegVille.test(strVille) && expRegBudget.test(strBudget)) {
        if (parseInt(strBudget) >= 500) {
            var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
            var strMotDePasse = b('tbMotDePasse');
            var strAuthorisation = b('tbMatricule') + strMotDePasse.substring(strMotDePasse.length - 5);
            var strDonnees = 'Action=Succursale-Ajout&Aut=' + strAuthorisation;
            strDonnees += '&Ville=' + strVille + '&Budget=' + strBudget;
            b('lblRequete', strNomApplication + '?' + strDonnees);        

            let objDonnesTransmises = new URLSearchParams({
              "Action": "Succursale-Ajout",
              "Aut": strAuthorisation,
              "Ville": strVille,
              "Budget": strBudget
            })
            let objOptions = {
              method: "POST",
              body: objDonnesTransmises
            }
      
            /* Envoi de la requête */
            fetch(strNomApplication, objOptions)
                .then(response => response.text())
                .then(responseData => recupereReponseServeur(responseData))  
        } else {
            b('lblMessageAjout', 'Budget invalide!');
        }
    } else {
        if (!expRegVille.test(strVille) && !expRegBudget.test(strBudget)) {
            b('lblMessageAjout', 'Ville et budget invalides!');
        } else if (!expRegVille.test(strVille)) {
            if (parseInt(strBudget) >= 500) {
                b('lblMessageAjout', 'Ville invalide!');
            }
            else {
                b('lblMessageAjout', 'Ville et budget invalides!');
            }
        } else if (!expRegBudget.test(strBudget)) {
            b('lblMessageAjout', 'Budget invalide!');
        }
    }
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteRetraitSuccursale
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_tenteRetraitSuccursale() {
   /*
   |-----------------------------------------------------------------------------------------------------------|
   | recupereReponseServeur
   |-----------------------------------------------------------------------------------------------------------|
   */
    function recupereReponseServeur(strVerdict) {
        b('lblReponse', strVerdict);
        strVerdict = strVerdict.split(';')[0];
        if(strVerdict == 'PASOK') {
            b('lblMessageRetrait', 'Succursale inconnue!');
        }
        else if(strVerdict == 'OK') {
            b('lblMessageRetrait', 'Succursale retiré!');
            ajax_compteSuccursales();
        }
    }
   /*
   |-----------------------------------------------------------------------------------------------------------|
   | Module directeur (ajax_tenteRetraitSuccursale)
   |-----------------------------------------------------------------------------------------------------------|
   */
    var strVille = b('tbVilleRetrait');
    var expRegVille = /^([a-zA-Z]{1,}|[a-zA-Z]{1,}[-]){1,}$/;
    if (expRegVille.test(strVille)) {
      var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
      var strMotDePasse = b('tbMotDePasse');
      var strAuthorisation = b('tbMatricule') + strMotDePasse.substring(strMotDePasse.length - 5);
      var strDonnees = 'Action=Succursale-Retrait&Aut=' + strAuthorisation + '&Ville=' + strVille;
      b('lblRequete', strNomApplication + '?' + strDonnees);
        
      let objDonnesTransmises = new URLSearchParams({
        "Action": "Succursale-Retrait",
        "Aut": strAuthorisation,
        "Ville": strVille
    })
    let objOptions = {
        method: "POST",
        body: objDonnesTransmises
    }

    /* Envoi de la requête */
    fetch(strNomApplication, objOptions)
        .then(response => response.text())
        .then(responseData => recupereReponseServeur(responseData))  
    } else {
      b('lblMessageRetrait', 'Ville invalide!');
  }
}


/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteVisualisationBudgetSuccursale
|--------------------------------------------------------------------------------------------------------------|
*/

 function ajax_tenteVisualisationBudgetSuccursale() {
   /*
   |-----------------------------------------------------------------------------------------------------------|
   | recupereReponseServeur
   |-----------------------------------------------------------------------------------------------------------|
   */
    function recupereReponseServeur(strVerdict) {
        b('lblReponse', strVerdict);
        strVerdict = strVerdict.split(';')[0];
        if(strVerdict == 'PASOK') {
            b('lblMessageBudgetVisualisation', 'Succursale inconnue!');
            b('lblBudgetVisualisation', '');
        }
        else if (strVerdict == 'ERREUR') {}
        else {
            b('lblMessageBudgetVisualisation', 'Budget affiché');
            b('lblBudgetVisualisation', strVerdict);
        }
    }
   /*
   |-----------------------------------------------------------------------------------------------------------|
   | Module directeur (ajax_tenteVisualisationBudgetSuccursale)
   |-----------------------------------------------------------------------------------------------------------|
   */
    var strVille = b('tbVilleBudgetVisualisation');
    var expRegVille = /^([a-zA-Z]{1,}|[a-zA-Z]{1,}[-]){1,}$/;
    if (expRegVille.test(strVille)) {
        var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
        var strMotDePasse = b('tbMotDePasse');
        var strAuthorisation = b('tbMatricule') + strMotDePasse.substring(strMotDePasse.length - 5);
        var strDonnees = 'Action=Succursale-Budget&Aut=' + strAuthorisation + '&Ville=' + strVille;
        b('lblRequete', strNomApplication + '?' + strDonnees);
        
        let objDonnesTransmises = new URLSearchParams({
            "Action": "Succursale-Budget",
            "Aut": strAuthorisation,
            "Ville": strVille
        })
        let objOptions = {
            method: "POST",
            body: objDonnesTransmises
        }

        /* Envoi de la requête */
        fetch(strNomApplication, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))
    } else {
        b('lblMessageBudgetVisualisation', 'Ville invalide!');
    }
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_reinitialiseSuccursales
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_reinitialiseSuccursales() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        b('lblReponse', strVerdict);
        strVerdict = strVerdict.split(';')[0];
        if (strVerdict == 'OK') {
            effacerAjoutModification();
            effacerRetrait();
            effacerBudgetVisualisation();
            ajax_compteSuccursales();
        }
    }
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_reinitialiseSuccursales)
    |-----------------------------------------------------------------------------------------------------------|
    */
    var confirmation = confirm('Êtes-vous sûr de vouleir réinitialiser?');
    if (confirmation) {
        var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
        var strMotDePasse = b('tbMotDePasse');
        var strAuthorisation = b('tbMatricule') + strMotDePasse.substring(strMotDePasse.length - 5);
        var strDonnees = 'Action=Succursale-Suppression&Aut=' + strAuthorisation;
        b('lblRequete', strNomApplication + '?' + strDonnees);

        let objDonnesTransmises = new URLSearchParams({
            "Action": "Succursale-Suppression",
            "Aut": strAuthorisation
        })
        let objOptions = {
            method: "POST",
            body: objDonnesTransmises
        }

        /* Envoi de la requête */
        //requeteServeur(strNomApplication, strDonneesTransmises, afficheEligibilite, true)
        fetch(strNomApplication, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))
    }
}