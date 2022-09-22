function requeteServeur(strNomApplication, strLigneParametres, fonctionTraitante, binAttente) {
   if (binAttente == undefined) { alert('Paramètre "binAttente" absent !'); }
   this.objPointeur = creeObjetXMLHttpRequest();
   transmetRequeteAuServeur(this.objPointeur, strNomApplication, strLigneParametres, fonctionTraitante);

   /*
   |--------------------------------------------------------------------------------------------|
   | Nom : creeObjetXMLHttpRequest (07-jun-2010)
   | But : Création de l'objet XMLHttpRequest
   |--------------------------------------------------------------------------------------------|
   */
   function creeObjetXMLHttpRequest() {
      var xmlHttp;
      /* IE */
      if (window.ActiveXObject) {
         try { xmlHttp = new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) { xmlHttp = false; }
      }
      /* Mozilla et autres navigateurs */
      else {
         try { xmlHttp = new XMLHttpRequest(); } catch (e) { xmlHttp = false; }
      }
      /* Retourne l'objet créé ou affiche un message d'erreur */
      if (!xmlHttp) {
         alert('L\'objet XMLHttpRequest n\'a pas pu étre créé !');
      }
      else {
         return xmlHttp;
      }
   }
   /*
   |--------------------------------------------------------------------------------------------|
   | Nom : transmetRequeteAuServeur (24-avr-2011; 25-mai-2011)
   | But : Transmet la requête à l'application serveur (exécutée par la fonction porteuse)
   |--------------------------------------------------------------------------------------------|
   */
   function transmetRequeteAuServeur(xmlHttp, strApplication, strLigneParametres, fonctionTraitante, binAttente) {
      /* Poursuite du traitement seulement si l'objet xmlHttp est disponible */
      if (xmlHttp.readyState == 4 || xmlHttp.readyState == 0) {
         /* Préparation de la requête qui sera transmise à l'application serveur */
         xmlHttp.open('POST', strApplication, !binAttente);
         xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         /* Identification de la fonction qui traitera la réponse du serveur et transmission
         du nom de la fonction qui traitera les données */
         xmlHttp.onreadystatechange = function () { recoitInfoServeur(xmlHttp, fonctionTraitante); }
         /* Transmission de la requête au serveur */
         xmlHttp.send(strLigneParametres);
      }
      else {
         /* Si le serveur n'est pas disponible, nouvelle transmission de la requête
         dans une seconde */
         setTimeout('transmetRequeteAuServeur(xmlHttp,strApplication,strLigneParametres,fonctionTraitante)', 1000);
      }
   }
   /*
   |--------------------------------------------------------------------------------------------|
   | Nom : recoitInfoServeur (07-jun-2010)
   | But : Récupère les informations transmises par le serveur pour les traiter, puis exécute
   |       la fonctiontraitante
   |--------------------------------------------------------------------------------------------|
   */
   function recoitInfoServeur(xmlHttp, fonctionTraitante) {
      /* Poursuite du traitement seulement si la transaction est complétée */
      if (xmlHttp.readyState == 4) {
         /* Le statut 200 confirme une transaction compléte réussie */
         if (xmlHttp.status == 200) {
            /* Extrait la réponse du serveur */
            var strChaineRetourneeParServeur = xmlHttp.responseText;
            /* Exécution de la fonction qui traitera la réponse */
            fonctionTraitante(strChaineRetourneeParServeur);
         }
         else {
            alert('Problème d\'accès au serveur : ' + xmlHttp.statusText);
         }
      }
   }
}
/*
SYNTAXE À RESPECTER POUR LA FONCTION TRAITANTE :

function fonctionTraitante(strChaineRetourneeParServeur) {
Insérer le code source ici
}

SYNTAXE POUR L'APPEL :

var strNomApplication = 'Nom de l'application serveur';
var strLigneParametres = 'Liste des paramètres à transmettre';
new requeteServeur(strNomApplication, strLigneParametres, fonctionTraitante);
*/