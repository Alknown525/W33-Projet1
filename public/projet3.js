// Projet3.js
// Par Ronald Jean-Julien et Alexandru Burgoci
// Date de remise: 
// Librairie pour projet3.htm

/*
|--------------------------------------------------------------|
| (GLOBAL; AJAX) Déclaration des variables de travail globales |
|--------------------------------------------------------------|
*/
/* Détection automatique du dossier où est entreposé l'application serveur */
// var strNomApplication = 'http://424w.cgodin.qc.ca/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';
var strNomApplication = 'http://192.168.10.6/rjean-julien/Kit_Ajax_projet/gestion-bd-projet3.php';

/*
|---------------------|
| initialiseInterface |
|---------------------|
*/
function initialiseInterface(binIdentificationPresente, binOperationsSuccursalesPresente, divSuccursalesPresente) {
    masqueB('divIdentification', !binIdentificationPresente);
    masqueB('divOperationsSuccursales', !binOperationsSuccursalesPresente);
    masqueB('divSuccursales', !divSuccursalesPresente);
}

/*-----------------------------------------------------------------------------------------------------------*/
/*
         _____             _    _           
        /  __ \           | |  (_)          
        | /  \/ ___   ___ | | ___  ___  ___ 
        | |    / _ \ / _ \| |/ / |/ _ \/ __|
        | \__/\ (_) | (_) |   <| |  __/\__ \
         \____/\___/ \___/|_|\_\_|\___||___/
                                    
*/
/*-----------------------------------------------------------------------------------------------------------*/

/*
|-----------------------|
| initialiseIdentifiant |
|-----------------------|
*/
function initialiseIdentifiant() {
    // A programmer
    b("tbMatricule", recupereCookie("identifiant"))
    b("tbMotDePasse", recupereCookie("motDePasse"))
    if (b("tbMatricule", null) == "")
        document.getElementById("btnNonSouvenir").style.display = 'none'
    else 
        document.getElementById("btnSouvenir").style.display = 'none'
}

/*
|-----------------------|
| enregistreIdentifiant |
|-----------------------|
*/
function enregistreIdentifiant() {
    // A programmer
    enregistreCookie("identifiant", b("tbMatricule", null), null)
    enregistreCookie("motDePasse", b("tbMotDePasse", null), null)
    document.getElementById("btnSouvenir").style.display = 'none'
    document.getElementById("btnNonSouvenir").style.display = 'block'
}

/*
|--------------------|
| detruitIdentifiant |
|--------------------|
*/
function detruitIdentifiant() {
    // A programmer
    enregistreCookie("identifiant", null, -1)
    enregistreCookie("motDePasse", null, -1)
    document.getElementById("btnSouvenir").style.display = 'block'
    document.getElementById("btnNonSouvenir").style.display = 'none'
}

/*
|-------------|
| deconnexion |
|-------------|
*/
function deconnexion() {
    // A programmer
    location.reload()
}

/*
|--------------------------|
| effacerAjoutModification |
|--------------------------|
*/
function effacerAjoutModification() {
    // A programmer
    b("tbVilleAjout", "")
    b("tbBudgetAjout", "")
    b("lblMessageAjout", "")
}

/*
|----------------|
| effacerRetrait |
|----------------|
*/
function effacerRetrait() {
    // A programmer
    b("tbVilleRetrait", "")
    b("lblMessageRetrait", "")
}

/*
|----------------------------|
| effacerBudgetVisualisation |
|----------------------------|
*/
function effacerBudgetVisualisation() {
    // A programmer
    b("tbVilleBudgetVisualisation", "")
    b("lblMessageBudgetVisualisation", "")
    b('lblBudgetVisualisation', "")
}

/*-----------------------------------------------------------------------------------------------------------*/
/*
         $$$$$$\     $$$$$\  $$$$$$\  $$\   $$\ 
        $$  __$$\    \__$$ |$$  __$$\ $$ |  $$ |
        $$ /  $$ |      $$ |$$ /  $$ |\$$\ $$  |
        $$$$$$$$ |      $$ |$$$$$$$$ | \$$$$  / 
        $$  __$$ |$$\   $$ |$$  __$$ | $$  $$<  
        $$ |  $$ |$$ |  $$ |$$ |  $$ |$$  /\$$\ 
        $$ |  $$ |\$$$$$$  |$$ |  $$ |$$ /  $$ |
        \__|  \__| \______/ \__|  \__|\__|  \__|
*/
/*-----------------------------------------------------------------------------------------------------------*/

/*
|-------------------------------|
| Module ajax_compteSuccursales |
|-------------------------------|
*/
function ajax_compteSuccursales() {
    /*
    |------------------------|
    | recupereReponseServeur |
    |------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        // A programmer
        var tabReponseServeur = strVerdict.split(';')
        b("lblSuccursales", "Nombres de succursale(s): " + tabReponseServeur[0])
        if (tabReponseServeur[0] == 0) {
            // b("lblSuccursales", "Aucune succursale enregistrée...")
            masqueB("btnReinitialiser", true)
            masqueB("tabRetrait", true)
            masqueB("tabVisualisation", true)
        }
        else {
            masqueB("btnReinitialiser", false)
            masqueB("tabRetrait", false)
            masqueB("tabVisualisation", false)
        }
        b("lblReponse", strVerdict)
    }

    /*
    |-------------------------------------------|
    | Module directeur (ajax_compteSuccursales) |
    |-------------------------------------------|
    */
    // A programmer
    let matricule = b("tbMatricule", null)
    let motDePasse = b('tbMotDePasse', null)
    let noMDP = motDePasse.substring(motDePasse.length - 5, motDePasse.length)
    strDonneesTransmises = 'Action=Succursale-Compte&Aut='+matricule+noMDP

    //requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
    
    let objDonnesTransmises = new URLSearchParams({
        "Action=Succursale-Compte&Aut": matricule+noMDP
     })

    b("lblRequete", strNomApplication + '?\n' +strDonneesTransmises)

    let objOptions = {
        method: "POST",
        body: objDonnesTransmises
    }

    fetch(strNomApplication, objOptions)
        .then(response => response.text())
        .then(strReponseServeur => afficheEligibilite(strReponseServeur))
        .catch(error => console.log(error))
}







/*
|-------------------------------------|
| Module ajax_afficheListeSuccursales |
|-------------------------------------|
*/
function ajax_afficheListeSuccursales() {
    /*
    |------------------------|
    | recupereReponseServeur |
    |------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        // A programmer
        var tabReponseServeur = strVerdict.split(';')
        if (tabReponseServeur[0] == "AUCUNE")
            b("lblSuccursales", "Aucune succursale enregistrée...")
        else if (document.getElementById(tablearea)) {}
        else {
            b("lblSuccursales", "")
            var tablearea = document.getElementById('lblSuccursales'),
            table = document.createElement('table')
            table.className = 'sTableauSuccursales'

                // Entete
                var trEntete = document.createElement('tr')

                    // NoSuccursales
                    var th = document.createElement('th')
                    trEntete.appendChild(th)
                    th.className = 'sEnteteTableauSuccursales'
                    trEntete.cells[0].appendChild(document.createTextNode("No"))

                    // Ville
                    var th = document.createElement('th')
                    trEntete.appendChild(th)
                    th.className = 'sEnteteTableauSuccursales'
                    trEntete.cells[1].appendChild(document.createTextNode("Ville"))

                    // Budget
                    var th = document.createElement('th')
                    trEntete.appendChild(th)
                    th.className = 'sEnteteTableauSuccursales'
                    trEntete.cells[2].appendChild(document.createTextNode("Budget"))
                
                table.appendChild(trEntete)

                for (var i = 0; i < tabReponseServeur.length-1; i++) {
                    // Succursales
                    var tr = document.createElement('tr')
                        // NoSuccursale
                        var td = document.createElement('td')
                        tr.appendChild(td)
                        td.className = 'sCorpsTableauSuccursales sCelNoSuccursales'
                        tr.cells[0].appendChild(document.createTextNode(i+1))

                        // Ville
                        var td = document.createElement('td')
                        tr.appendChild(td)
                        td.className = 'sCorpsTableauSuccursales sCelVille'
                        tr.cells[1].appendChild(document.createTextNode(tabReponseServeur[i].split(',')[0]))

                        // Budget
                        var td = document.createElement('td')
                        tr.appendChild(td)
                        td.className = 'sCorpsTableauSuccursales sCelBudget'
                        tr.cells[2].appendChild(document.createTextNode(tabReponseServeur[i].split(',')[1] + " $"))

                    table.appendChild(tr)
                }

            tablearea.appendChild(table)
        }
        b("lblReponse", strVerdict)
    }

    /*
    |-------------------------------------------------|
    | Module directeur (ajax_afficheListeSuccursales) |
    |-------------------------------------------------|
    */
    // A programmer
    let matricule = b("tbMatricule", null)
    let motDePasse = b('tbMotDePasse', null)
    let noMDP = motDePasse.substring(motDePasse.length - 5, motDePasse.length)
    strDonneesTransmises = 'Action=Succursale-Liste&Aut='+matricule+noMDP

    requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
    b("lblRequete", strNomApplication + '?\n' +strDonneesTransmises)
}







/*
|----------------------------|
| Module ajax_tenteConnexion |
|----------------------------|
*/
function ajax_tenteConnexion() {
    /*
    |------------------------|
    | recupereReponseServeur |
    |------------------------|
    */
    function recupereReponseServeur(strVerdict) {

        var tabReponseServeur = strVerdict.split(';')
            
        /* Affichage du verdict */
        switch (tabReponseServeur[0]) {
            case 'OK':
                masqueB('divIdentification', true)
                masqueB('divSuccursales', false)
                masqueB('divOperationsSuccursales', false)

                b('lblNomComplet', tabReponseServeur[1] + ' ' + tabReponseServeur[2])
                b('lblReponse', tabReponseServeur)
                ajax_compteSuccursales()
                break;
            case 'PASOK' :
                b('lblMessageConnexion', 'Utilisateur inconnu!')
                b('lblReponse', tabReponseServeur)
                break;
        }
    }

    /*
    |----------------------------------------|
    | Module directeur (ajax_tenteConnexion) |
    |----------------------------------------|
    */
    
    let matricule = b("tbMatricule", null)
    let motDePasse = b('tbMotDePasse', null)
    var expRegMDP = /^[A-Z]{1,6}\d{5}$/i
    var matValide = estUnMatricule(matricule)
    var mDPValide = expRegMDP.test(motDePasse)

    strDonneesTransmises = 'Action=Connexion&Mat='+matricule+'&MDP='+motDePasse

    if (!matValide && !mDPValide) {
        b('lblMessageConnexion', 'Identifiant et mot de passe invalide')
    }
    else if (!matValide && mDPValide) {
        b('lblMessageConnexion', 'Identifiant invalide')
    }
    else if (matValide && !mDPValide) {
        b('lblMessageConnexion', 'Mot de passe invalide')
    }
    else {
        b('lblMessageConnexion', '')
        requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        b("lblRequete", strNomApplication + '?\n' +strDonneesTransmises)
    }
}

/*
|----------------------------------------------|
| Module ajax_tenteAjoutModificationSuccursale |
|----------------------------------------------|
*/

 function ajax_tenteAjoutModificationSuccursale() {
   /*
   |------------------------|
   | recupereReponseServeur |
   |------------------------|
   */
    function recupereReponseServeur(strVerdict) {
        // A programmer

        var tabReponseServeur = strVerdict.split(';')
            
        /* Affichage du verdict */
        switch (tabReponseServeur[0]) {
            case 'PASOK':
                b("lblMessageAjout", "Succursale existante!")
                break;
            case 'OKM':
                b("lblMessageAjout", "Succursale modifiée!")
                break;
            case 'OKI':
                b("lblMessageAjout", "Succursale ajoutée!")
                ajax_compteSuccursales();
                break;
        }
        b('lblReponse', tabReponseServeur)
    }
   /*
   |----------------------------------------------------------|
   | Module directeur (ajax_tenteAjoutModificationSuccursale) |
   |----------------------------------------------------------|
   */
    // A programmer

    let ville = b("tbVilleAjout", null)
    let budget = b("tbBudgetAjout", null)
    var expRegVille = /^[A-Z]+(\-[A-Z]+)*$/i
    var expRegBudget = /^\d{3,7}$/
    var villeValide = expRegVille.test(ville)
    var budgetValide = expRegBudget.test(budget) && (parseInt(budget) >= 500)

    let matricule = b("tbMatricule", null)
    let motDePasse = b('tbMotDePasse', null)
    let noMDP = motDePasse.substring(motDePasse.length - 5, motDePasse.length)
    strDonneesTransmises = 'Action=Succursale-Ajout&Aut=' + matricule + noMDP + "&Ville=" + ville + 
                            "&Budget=" + budget

    if (!villeValide && !budgetValide)
        b("lblMessageAjout", "Ville et budget invalides!")
    else if (!villeValide && budgetValide)
        b("lblMessageAjout", "Ville invalide!")
    else if (villeValide && !budgetValide)
        b("lblMessageAjout", "Budget invalide!")
    else {
        b("lblMessageAjout", "")
        requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        b("lblRequete", strNomApplication + '?\n' +strDonneesTransmises)
    }
}

/*
|------------------------------------|
| Module ajax_tenteRetraitSuccursale |
|------------------------------------|
*/
function ajax_tenteRetraitSuccursale() {
   /*
   |------------------------|
   | recupereReponseServeur |
   |------------------------|
   */
    function recupereReponseServeur(strVerdict) {
        // A programmer 
        var tabReponseServeur = strVerdict.split(';')
            
        /* Affichage du verdict */
        switch (tabReponseServeur[0]) {
            case 'PASOK':
                b("lblMessageRetrait", "Succursale inconnue!")
                break;
            case 'OK':
                b("lblMessageRetrait", "Succursale retirée!")
                ajax_compteSuccursales();
                break;
        }
        b('lblReponse', tabReponseServeur)
    }
   /*
   |------------------------------------------------|
   | Module directeur (ajax_tenteRetraitSuccursale) |
   |------------------------------------------------|
   */
    // A programmer
    let ville = b("tbVilleRetrait", null)
    var expRegVille = /^[A-Z]+(\-[A-Z]+)*$/i
    var villeValide = expRegVille.test(ville)

    let matricule = b("tbMatricule", null)
    let motDePasse = b('tbMotDePasse', null)
    let noMDP = motDePasse.substring(motDePasse.length - 5, motDePasse.length)
    strDonneesTransmises = 'Action=Succursale-Retrait&Aut=' + matricule + noMDP + "&Ville=" + ville

    if (!villeValide && budgetValide)
        b("lblMessageRetrait", "Ville invalide!")
    else {
        b("lblMessageRetrait", "")
        requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        b("lblRequete", strNomApplication + '?\n' +strDonneesTransmises)
    }
}


/*
|------------------------------------------------|
| Module ajax_tenteVisualisationBudgetSuccursale |
|------------------------------------------------|
*/

 function ajax_tenteVisualisationBudgetSuccursale() {
   /*
   |------------------------|
   | recupereReponseServeur |
   |------------------------|
   */
    function recupereReponseServeur(strVerdict) {
        // A programmer 
        var tabReponseServeur = strVerdict.split(';')

        if (tabReponseServeur[0] == "PASOK") 
            b('lblMessageBudgetVisualisation', "Succursale inconnue!")
        else {
            b('lblMessageBudgetVisualisation', "Budget affiché")
            b('lblBudgetVisualisation', tabReponseServeur[0])
        }
        b('lblReponse', tabReponseServeur)
    }
   /*
   |------------------------------------------------------------|
   | Module directeur (ajax_tenteVisualisationBudgetSuccursale) |
   |------------------------------------------------------------|
   */
    // A programmer
    let ville = b("tbVilleBudgetVisualisation", null)
    var expRegVille = /^[A-Z]+(\-[A-Z]+)*$/i
    var villeValide = expRegVille.test(ville)

    let matricule = b("tbMatricule", null)
    let motDePasse = b('tbMotDePasse', null)
    let noMDP = motDePasse.substring(motDePasse.length - 5, motDePasse.length)
    strDonneesTransmises = 'Action=Succursale-Budget&Aut=' + matricule + noMDP + "&Ville=" + ville

    if (!villeValide && budgetValide)
        b("lblMessageBudgetVisualisation", "Ville invalide!")
    else {
        b("lblMessageBudgetVisualisation", "")
        requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        b("lblRequete", strNomApplication + '?\n' +strDonneesTransmises)
    }
}

/*
|-------------------------------------|
| Module ajax_reinitialiseSuccursales |
|-------------------------------------|
*/
function ajax_reinitialiseSuccursales() {
    /*
    |------------------------|
    | recupereReponseServeur |
    |------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        // A programmer
        effacerAjoutModification()
        effacerRetrait()
        effacerBudgetVisualisation()
        ajax_compteSuccursales()

        b('lblReponse', tabReponseServeur)
    }
    /*
    |-------------------------------------------------|
    | Module directeur (ajax_reinitialiseSuccursales) |
    |-------------------------------------------------|
    */
    // A programmer

    if (!confirm("Cliquez sur OK pour confirmer la suppression de toutes les succursales enregistrées.")) {}
    else {
        let matricule = b("tbMatricule", null)
        let motDePasse = b('tbMotDePasse', null)
        let noMDP = motDePasse.substring(motDePasse.length - 5, motDePasse.length)
        strDonneesTransmises = 'Action=Succursale-Suppression&Aut=' + matricule + noMDP

        requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        b("lblRequete", strNomApplication + '?\n' +strDonneesTransmises)
    }
}