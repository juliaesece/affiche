$(document).ready(function(){
  $(".samediChecks, .dimChecks, .WEChecks, #samedi, #dimanche, #toutLeWE").hide();

  // initializando variables
  var totalEvents = 0;
  var nbEventsSamedi = 0;
  var nbEventsDimanche = 0;
  var nbEventsWE = 0;
  var nbEventsSamediDes = 0;
  var nbEventsDimancheDes = 0;
  var nbEventsWEDes = 0;
  var unmovableRows = 0;
  var totalMinRows = 0;

  //checkboxes functionality

  $("#if-samedi").change(function() {
    if(this.checked) {
      $("#samedi").show();
      $(".samediChecks").show();
    } else {
      $("#samedi").hide();
      $(".samediChecks").hide();
    }
  });
  $("#if-dimanche").change(function() {
    if(this.checked) {
      $("#dimanche").show();
      $(".dimChecks").show();
    } else {
      $("#dimanche").hide();
      $(".dimChecks").hide();
    }
  });
  $("#if-WE").change(function() {
    if(this.checked) {
      $("#toutLeWE").show();
      $(".WEChecks").show();
    } else {
      $("#toutLeWE").hide();
      $(".WEChecks").hide();
    }
  });

  // create new forms

  function formCreator(nb, jour) {
    nb = String(jour) + String(nb);
    element = "<div id='form" + nb + "'>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Nom de l'event' type='text' id='fnom" + nb + "' name='fnom" + nb + "'>\
        <label for='fnom" + nb + "'>Nom de l'event</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Horaire' type='text' id='fhoraire" + nb + "' name='fhoraire" + nb + "'>\
        <label for='fhoraire" + nb + "'>Horaire</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Salle' type='text' id='fsalle" + nb + "' name='fsalle" + nb + "'>\
        <label for='fsalle" + nb + "'>Salle</label>\
      </div>\
      <button class='btn btn-light' onClick='addToAffiche(" + nb + ", " + jour + ", false)' type='button' id='btn" + nb + "'>Submit</button><br><br>\
    </div>";
    return element;
  }

  function formCreatorDes(nb, jour) {
    nb = String(jour) + String(nb);
    element = "<div id='form" + nb + "'>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Nom de l'event' type='text' id='fnom" + nb + "' name='fnom" + nb + "'>\
        <label for='fnom" + nb + "'>Nom de l'event</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Horaire' type='text' id='fhoraire" + nb + "' name='fhoraire" + nb + "'>\
        <label for='fhoraire" + nb + "'>Horaire</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Salle' type='text' id='fsalle" + nb + "' name='fsalle" + nb + "'>\
        <label for='fsalle" + nb + "'>Salle</label>\
      </div>\
      <div class='form-floating'>\
        <textarea class='form-control' placeholder='Description' id='fDes" + nb + "' name='fDes" + nb + "'></textarea>\
        <label for='fDes" + nb + "'>Description</label>\
      </div>\
      <button class='btn btn-light' onClick='addToAffiche(" + nb + ", " + jour + ", true)' type='button' id='btn" + nb + "'> Submit </button><br><br>\
    </div>";
    return element;
  }

  // outils

  function ifUndefinedZero(value) {
    if (value) {
      return parseInt(value);
    } else {
      return 0;
    }
  };

  function howManyUnmovableRows(nbEvents, nbDes) {
    return ((nbEvents - nbDes) % 2) + nbDes
  }

  function whatsMinRowsSimple(nb) {
    if (nb == 0) {
      return 0;
    } else if (nb <= 2) {
      return 1;
    } else if (nb <= 4){
      return 2;
    } else if (nb <= 6){
      return 3;
    } else {
      return 4;
    }
  };

  function whatsMinRows(nbEvents, nbDes) {
    return parseInt(nbDes) + whatsMinRowsSimple(nbEvents-parseInt(nbDes))
  }

  // add new forms

  $("#btnNbEvents").click(function(){
    nbEventsSamedi = ifUndefinedZero($("#fNbEventsSamedi").val());
    nbEventsDimanche = ifUndefinedZero($("#fNbEventsDimanche").val());
    nbEventsWE = ifUndefinedZero($("#fNbEventsWE").val());
    nbEventsSamediDes = ifUndefinedZero($("#fNbEventsSamediDes").val());
    nbEventsDimancheDes = ifUndefinedZero($("#fNbEventsDimancheDes").val());
    nbEventsWEDes = ifUndefinedZero($("#fNbEventsWEDes").val());

    // count events + détermine unmovable Rows (events que vont occuper toute la largeur de toute façon) et le nombre minimum de rows possible si tous les events sont minimisés
    totalEvents = nbEventsSamedi + nbEventsDimanche + nbEventsWE;
    unmovableRows = howManyUnmovableRows(nbEventsSamedi, nbEventsSamediDes) + howManyUnmovableRows(nbEventsDimanche, nbEventsDimancheDes) + howManyUnmovableRows(nbEventsWE, nbEventsWEDes);
    totalMinRows = whatsMinRows(nbEventsSamedi, nbEventsSamediDes) + whatsMinRows(nbEventsDimanche, nbEventsDimancheDes) + whatsMinRows(nbEventsWE, nbEventsWEDes);

    // crée les forms pour écrire les events sur l'affiche

    function loopThrough(nbEvents, nbEventsDes, jour, domSelector) {
      eventsDesCounter = nbEventsDes;
      for(var i = 0; i < (nbEvents); i++){
        if (nbEvents - eventsDesCounter == nbEvents ){
          var content = formCreator((i), jour);
          $(domSelector).after(content);
        } else {
          var content = formCreatorDes((i), jour);
          $(domSelector).after(content);
          eventsDesCounter--
        }
      }
    }

    loopThrough(nbEventsSamedi, nbEventsSamediDes, 1, "#ftitle-samedi");
    loopThrough(nbEventsDimanche, nbEventsDimancheDes, 2, "#ftitle-dimanche");
    loopThrough(nbEventsWE, nbEventsWEDes, 3, "#ftitle-WE");

    console.log("total events" + totalEvents);

  });

  // jusqu'a 4 ils peuvent etre tous 100% horizontaux et donc avoir des descriptions.un post avec descrip vaux 2
  // essayer de déterminer layout: pas expandre quand pas d'espace, pas laisser espaces vides

  function layoutifier(nbEvents, nbDes, selector){

    console.log("total rows " + String(totalMinRows))

    if (totalMinRows > 4 ) {
      alert("Il y a trop d'événements ou trop d'événements avec description: on va passer au mode vertical");
    }

    console.log("nb events " + nbEvents);
    console.log("nb des" + nbDes)
    //voir combien d'events sans description il y a
    var eventsNoDes = nbEvents - nbDes;
    console.log("events no des " + eventsNoDes)

    if (eventsNoDes == 1 ) {
      $(selector + " > .evenement").addClass("accrossHorizontal");
      return "FIXED SPACE (1): 1 long"
    } else if(eventsNoDes == 2) {
      if (unmovableRows >= 3) {
        return "too many unmovable rows, (LONG SPACE(2): 2 long or) SHORT SPACE(1): 2 short"
      } else {
        $(selector + " > .noDes .evenement").addClass("accrossHorizontal"); // or maxThreeEvents evnmtMargin
        unmovableRows++;
        return "enough space, LONG SPACE(2): 2 long or (SHORT SPACE(1): 2 short)"
      }
    } else if (eventsNoDes == 3) {
      if (unmovableRows <= 1 ) {
        // creo que esto nunca se va a accionar pq pa que quede solo 1 unmovable row necesariamente tiene que haber menos de cinco en total
        $(selector + " > .noDes .evenement").addClass("accrossHorizontal");
        unmovableRows++;
        return "enough space (SHORT SPACE (2): 2 short and 1 long OR) LONGSPACE (3): 3 long"
      } else {
        $(selector + " > .noDes:first-child").addClass("accrossHorizontal");
        return "not enough space SHORT SPACE (2): 2 short and 1 long (OR LONGSPACE (3): 3 long)"
      }
    }

    if (totalEvents <= 4) { //alors tous les evenemts doivent span tout
      $(".evenement").addClass("accrossHorizontal");
    } else if (totalEvents >= 5) { //a partir de la il faut changer les choses
      // tout d'abord, les jours passent au grid
      $("#evenementsDeSam, #evenementsDeDim, #evenementsDeWE").addClass("manyEventsWrapper");
    }
  }

  $("#layout").click(function(){
    console.log("desde click, nb events samedi" + nbEventsSamedi)
    layoutifier(nbEventsSamedi, nbEventsSamediDes, "#evenementsDeSam");
    layoutifier(nbEventsDimanche, nbEventsDimancheDes,"#evenementsDeDim");
    layoutifier(nbEventsWE, nbEventsWEDes, "#evenementsDeWE");
  });


});
