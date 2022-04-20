$(document).ready(function(){
  $(".samediChecks, .dimChecks, .WEChecks, #jour1, #jour2, #jour3, #img-background2").hide();

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
  var modoVertical = false;

  // console.log("modo vertical")
  // console.log(modoVertical)

  // get date pour affiche
  var curr = new Date; // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var sabado = first + 6; // last day is the first day + 6
  var domingo = first + 7; // last day is the first day + 6

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
    ].join('/');
  }

  //checkboxes functionality

  $("#if-samedi").change(function() {
    if(this.checked) {
      $("#jour1").show();
      $("#samediDate").text(formatDate(new Date(curr.setDate(sabado))))
      $(".samediChecks").show();
    } else {
      $("#jour1").hide();
      $(".samediChecks").hide();
    }
  });
  $("#if-dimanche").change(function() {
    if(this.checked) {
      $("#jour2").show();
      $(".dimChecks").show();
      $("#dimancheDate").text(formatDate(new Date(curr.setDate(domingo))))
    } else {
      $("#jour2").hide();
      $(".dimChecks").hide();
    }
  });
  $("#if-WE").change(function() {
    if(this.checked) {
      $("#jour3").show();
      $(".WEChecks").show();
    } else {
      $("#jour3").hide();
      $(".WEChecks").hide();
    }
  });

  // background checkboxes
  $("#backgroundSwitch").change(function() {
    if(this.checked) {
      $("#img-background1").hide();
      $("#img-background2").show();
      $("#affiche-wrapper").attr("style", "grid-template-rows: 50mm 1fr 60mm;")
    } else {
      $("#img-background1").show();
      $("#img-background2").hide();
      $("#affiche-wrapper").attr("style", "grid-template-rows: 70mm 1fr 60mm;")
    }
  });

  // outils

  function ifUndefinedZero(value) {
    if (value) {
      return parseInt(value);
    } else {
      return 0;
    }
  };

  function howManyUnmovableRows(nbEvents, nbDes) {
    console.log("calculating unmovable rows of smth");
    console.log(nbDes + ~~(nbEvents/2) + ((nbEvents - nbDes) % 2));
    return (nbDes + ~~(nbEvents/2) + ((nbEvents - nbDes) % 2));
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
      return ((nb/2)+nb%2);
    }
  };

  function whatsMinRows(nbEvents, nbDes) {
    return parseInt(nbDes) + whatsMinRowsSimple(nbEvents-parseInt(nbDes))
  }

  // CREATE NEW FORMS

  function formCreator(nb, jour) {
    combinedId = String(jour) + String(nb);
    element = "<div id='form" + combinedId + "'>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Nom de levent' type='text' id='fnom" + combinedId + "' name='fnom" + combinedId + "'>\
        <label for='fnom" + combinedId + "'>Nom de l\'event</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Horaire' type='text' id='fhoraire" + combinedId + "' name='fhoraire" + combinedId + "'>\
        <label for='fhoraire" + combinedId + "'>Horaire</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Salle' type='text' id='fsalle" + combinedId + "' name='fsalle" + combinedId + "'>\
        <label for='fsalle" + combinedId + "'>Salle</label>\
      </div>\
      <button class='btn btn-light submitEventForm' type='button' id='btn-" + combinedId + "-false'>Soumettre</button><br><br>\
    </div>";
    return element;
  }

  function formCreatorDes(nb, jour) {
    combinedId = String(jour) + String(nb);
    element = "<div id='form" + combinedId + "'>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Nom de levent' type='text' id='fnom" + combinedId + "' name='fnom" + combinedId + "'>\
        <label for='fnom" + combinedId + "'>Nom de l\'event</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Horaire' type='text' id='fhoraire" + combinedId + "' name='fhoraire" + combinedId + "'>\
        <label for='fhoraire" + combinedId + "'>Horaire</label>\
      </div>\
      <div class='form-floating'>\
        <input class='form-control' placeholder='Salle' type='text' id='fsalle" + combinedId + "' name='fsalle" + combinedId + "'>\
        <label for='fsalle" + combinedId + "'>Salle</label>\
      </div>\
      <div class='form-floating'>\
        <textarea class='form-control' placeholder='Description' id='fDes" + combinedId + "' name='fDes" + combinedId + "'></textarea>\
        <label for='fDes" + combinedId + "'>Description</label>\
      </div>\
      <button class='btn btn-light submitEventForm' type='button' id='btn-" + combinedId + "-true'>Soumettre</button><br><br>\
    </div>";
    return element;
  }

  // ONCLICK: add new forms

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
    console.log("total min rows: " + totalMinRows)
    // crée les forms pour écrire les events sur l'affiche

    function loopThrough(nbEvents, nbEventsDes, jour, domSelector) {
      eventsDesCounter = nbEventsDes;
      for(i = parseInt(nbEvents-1); i >= 0 ; i--){
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

    if (totalMinRows > 4  ){
      console.log("passing to modoVertical true")
      modoVertical = true;
    }

    loopThrough(nbEventsSamedi, nbEventsSamediDes, 1, "#ftitle-samedi");
    loopThrough(nbEventsDimanche, nbEventsDimancheDes, 2, "#ftitle-dimanche");
    loopThrough(nbEventsWE, nbEventsWEDes, 3, "#ftitle-WE");

    $("#events-form").toggle();
    toggleJourText();

    console.log("total events: " + totalEvents);
  });

  // jusqu'a 4 ils peuvent etre tous 100% horizontaux et donc avoir des descriptions.un post avec descrip vaux 2
  // essayer de déterminer layout: pas expandre quand pas d'espace, pas laisser espaces vides

  function setModoVertical() {
    if (totalMinRows > 4  ){
      console.log("passing to modoVertical true")
      modoVertical = true;
    }
  }

  function layoutifier(nbEvents, nbDes, selector){

    console.log("total rows " + String(totalMinRows))
    var jourNb = 0;

    switch (selector) {
      case '.samediClass':
        jourNb = 1;
        break;
      case '.dimancheClass':
        jourNb = 2;
        break;
      case '.WEClass':
        jourNb = 3;
        break;
      default:
        console.log("pb in siwcth")
    }

    //voir combien d'events sans description il y a
    var eventsNoDes = nbEvents - nbDes;
    console.log("desde " + selector)
    console.log("numero de eventos sin descripcion: " + eventsNoDes)

    if (totalMinRows > 4 ) {
      console.log("Il y a trop d'événements ou trop d'événements avec description: on va passer au mode vertical");
      modoVertical = true;
      $("#jours-wrapper").addClass("joursModeVertical");
      $(".des.evenement").removeClass("horizontalDescriptionCard");
    } else {
      if (eventsNoDes == 1 ) {
        $(selector + ".evenement").addClass("accrossHorizontal");
        console.log("FIXED SPACE (1): 1 long")
      } else if(eventsNoDes == 2) {
        console.log("two events, unmovablerows es" + unmovableRows)
        if (unmovableRows >= 3) {
          // nada pq naturalmente va a estar chico?
          console.log("too many unmovable rows, (LONG SPACE(2): 2 long or) SHORT SPACE(1): 2 short")
        } else {
          $(selector + ".noDes.evenement").addClass("accrossHorizontal"); // or horizontalDescriptionCard evnmtMargin
          console.log("enough space, LONG SPACE(2): 2 long or (SHORT SPACE(1): 2 short)")
          unmovableRows++;
        }
      } else if (eventsNoDes == 3) {
        if (unmovableRows <= 1 ) {
          // creo que esto nunca se va a accionar pq pa que quede solo 1 unmovable row necesariamente tiene que haber menos de cinco en total
          $(".noDes.evenement" + selector).addClass("accrossHorizontal");
          unmovableRows++;
          console.log("enough space (SHORT SPACE (2): 2 short and 1 long OR) LONGSPACE (3): 3 long")
        } else {
          $("#evenement" + jourNb + "0").addClass("accrossHorizontal");
          console.log("not enough space SHORT SPACE (2): 2 short and 1 long (OR LONGSPACE (3): 3 long)")
        }
      }

      if (totalEvents <= 4) { //alors tous les evenemts doivent span tout
        $(".evenement").addClass("accrossHorizontal");
      } else if (totalEvents >= 5) { //a partir de la il faut changer les choses
        // tout d'abord, les jours passent au grid
        $("#jours-wrapper").addClass("manyEventsWrapper");
        $(".jour").addClass("accrossHorizontal");
        $("#evenementsDeSam, #evenementsDeDim, #evenementsDeWE").hide();
      }
    }
  }

  $("#layout").click(function(){
    layoutifier(nbEventsSamedi, nbEventsSamediDes, ".samediClass");
    layoutifier(nbEventsDimanche, nbEventsDimancheDes, ".dimancheClass");
    layoutifier(nbEventsWE, nbEventsWEDes, ".WEClass");
    if (totalMinRows > 4 ) {
      alert("Il y a trop d'événements ou trop d'événements avec description: on va passer au mode vertical");
    }
  });

// add to affiche from new/added forms
  function addToAffiche(jour, nb, des) {
    var temporaryId = String(jour) + String(nb);
    var nb = parseInt(nb);
    var jourPost = "#jour" + String(jour);

    if (jour == 1) {
      var post = "#evenementsDeSam";
      var dayClass = "samediClass";
    } else if (jour == 2 ) {
      var post = "#evenementsDeDim";
      var dayClass = "dimancheClass";

    } else {
      var post = "#evenementsDeWE";
      var dayClass = "WEClass";
    }
     var titre = $("#fnom"+ temporaryId).val();
     var horaire = $("#fhoraire" + temporaryId).val();
     var salle = $("#fsalle" + temporaryId).val();

     if ($("#evenement" + temporaryId).length) {
       console.log("evenement exists, modifying")
       $("#titre" + temporaryId).text(titre)
       $("#horaire" + temporaryId).text(" " + horaire)
       $("#salle" + temporaryId).text(" " + salle)
       if (des) {
         var description = $("#fDes" + temporaryId).val();
         $("#description" + temporaryId).text(description)
       }
     } else {
       console.log("evenement doesn't exist, creating")
       if (!des) {
         var toInsert = "<div id='evenement" + temporaryId + "' class='noDes evenement " + dayClass + "'>\
              <h2 id='titre" + temporaryId + "' class='titre-d-evenement'> " + titre + " </h2>\
              <p class='horaire'><img src='https://raw.githubusercontent.com/juliaesece/affiche/d1946d5b78e07109c270fbffa170a1a5decd2406/clock.png'  class='iconito'><span id='horaire" + temporaryId + "'> " + horaire + " </span></p>\
              <p class='salle'><img src='https://raw.githubusercontent.com/juliaesece/affiche/d1946d5b78e07109c270fbffa170a1a5decd2406/location.png'  class='iconito'><span id='salle" + temporaryId + "'> " + salle + " </span></p>\
            </div>";
       } else {
         var description = $("#fDes" + temporaryId).val();
         var toInsert = "<div id='evenement" + temporaryId + "' class='des evenement horizontalDescriptionCard evnmtMargin accrossHorizontal " + dayClass + "'>\
              <h2 id='titre" + temporaryId + "' class='titre-d-evenement cardGauche'> " + titre + " </h2>\
              <p class='horaire cardGauche'><img src='https://raw.githubusercontent.com/juliaesece/affiche/d1946d5b78e07109c270fbffa170a1a5decd2406/clock.png'  class='iconito'><span id='horaire" + temporaryId + "'> " + horaire + " </span></p>\
              <p class='salle cardGauche'><img src='https://raw.githubusercontent.com/juliaesece/affiche/d1946d5b78e07109c270fbffa170a1a5decd2406/location.png' class='iconito'><span id='salle" + temporaryId + "'> " + salle + " </span></p>\
              <p class='description cardDroite onlyOneRow' id='description" + temporaryId + "'>" + description + "</p>\
            </div>";
       }

       if (des) {
         $("#btn" + temporaryId + "-false").text("Modifier")
      } else {
         $("#btn" + temporaryId + "-true").text("Modifier")
       }


       if (nb == 0 && modoVertical == true) {
         // console.log("appending bc modo vertical true and first element")
         $(post).append(toInsert);
       } else {
         // console.log("after bc modo vertical false o dps 1")
         $(jourPost).after(toInsert);
       }

     }
  };

 $(document).on('click','.submitEventForm', function(){
    console.log("event form clicked");
    // console.log(this);
    // console.log(this.id);
    let jour = this.id.slice(4, 5)
    // console.log("jour is " + jour)
    let nb = this.id.slice(5, 6)
    // console.log("nb is " + nb)
    let des = this.id.slice(7)
    // console.log(des)
    des = (des === 'true')
    // console.log("des is ")
    // console.log(des)
    addToAffiche(jour, nb, des);
  });

// plan B pour quand télécharger ne marche pas: imprimir comme si c'était une page

  $("#downloadAffiche").click(function(){
    $("body").addClass("crema-background");
    $("#forms-wrapper").hide();
  });

// cacher jours form (et toggle après avoir caché)

  var toggleJourText = function(){
    var texte = $("#cacherJours").text();
    if (texte == 'click pour cacher' ) {
      $("#cacherJours").text('click pour montrer');
    } else {
      $("#cacherJours").text('click pour cacher');
    }
  }

  $("#cacherJours").click(function(){
    $("#events-form").toggle();
    toggleJourText();
  });

  window.onload = function () {
    document.getElementById("downloadAffiche2")
        .addEventListener("click", () => {
            // const affiche = this.document.getElementById("affiche-wrapper");
            var affiche = "";
            var download = function(){
              var canvas = document.getElementById('dCanvas');
              var anchor = document.createElement("a");
              anchor.href = canvas.toDataURL("image/png");
              anchor.download = "affiche.png";
              anchor.click();
            }
            $("img").crossOrigin = "anonymous";
            html2canvas(document.querySelector("#affiche-wrapper"), {
              useCORS:true,
              onrendered: function(canvas) {
                var result = canvas.toDataURL();
              }
            }).then(canvas => {
                canvas.setAttribute("id", "dCanvas")
                document.body.appendChild(canvas)
                affiche = canvas;
                // console.log("affiche is")
                // console.log(affiche)
                download();
            });
          });
}

});
