//www.pokedex.downtok.in
let config;

window.onload = function () {
  $("#spinner").show(); //shows loader

  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);

  const searchQuery = urlParams.get("searchtoken");

  document.getElementById("search-box").value = searchQuery;

  btnActivation(); //make btn deactivated by deafult, when searchtoken is empty

  saveViewCount(); // save page views

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    fetch("config.json")
      .then((response) => response.json())
      .then((responseJSON) => {
        config = responseJSON;
        getSessionCount();
      });

    if (searchQuery) {
      getPokemonDetails(searchQuery)
        .then((searchResult) => {
          if (searchResult.message === "Pokemon found") {
            $(document).ready(function () {
              $("#result").append(
                '<span class="success-message"> Pokemon found : <span id="poke_name">' +
                  searchResult.info.name +
                  "</span></span>"
              );

              $("#result").append(
                `<div id="image-results" class="image-reel"> </div>`
              );

              for (var i = 0; i < searchResult.info.images.length; i++)
                $("#image-results").append(
                  `<a id="image_link" class="card-link" href="` +
                    searchResult.info.images[i] +
                    `" target="_blank">

                    <img id="pokeimage_` +
                    (i + 1) +
                    `" class="card-thumbnail" src="` +
                    searchResult.info.images[i] +
                    `"/>

                    <div class="card-button">
                     <span> Download</span>
                    </div>
                  </a>
                 `
                );

              $("#result").append(`<div id="poke_details" class=""> </div>`);
            });
          } else {
            $(document).ready(function () {
              $("#result").append(
                '<span class="error-message"> Pokemon Not found : <span id="poke_name">' +
                  searchQuery +
                  "</span></span>"
              );
            });
          }
        })
        .catch((err) => {
          $(document).ready(function () {
            $("#result").append(
              '<span class="error-message"> Pokemon Not found : <span id="poke_name">' +
                err +
                "</span></span>"
            );
          });
        });
    }
  } else {
    window.location.replace("/pages/404.html");
  }
};

function saveViewCount() {
  let sessionBody = { channelType: "web" };

  fetch("https://prod.downgram.in/api/downtok-game/saveviewcount", {
    method: "POST",
    body: JSON.stringify(sessionBody),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      $("#spinner").hide(); //hides loader
    })
    .catch((err) => {
      console.log("err", err);
      $("#spinner").hide(); //hides loader
    });
}

function getSessionCount() {
  fetch("https://prod.downgram.in/api/downtok-game/sessioncount")
    .then((response) => response.json())
    .then((responseJson) => {
      let totalSessions = responseJson.result.$numberDouble;

      $(document).ready(function () {
        $("span.stats").text(totalSessions);
      });

      $("#spinner").hide(); //hides loader
    })
    .catch((err) => {
      console.log("err", err);
      $("#spinner").hide(); //hides loader
    });
}

function themeSelection() {
  let isSelected = document.getElementById("theme-toggle").checked;

  localStorage.setItem("darkMode", !isSelected);
  changeTheme(localStorage.getItem("darkMode"));
}

function changeTheme(userPref) {
  var deviceWidth = Math.max(window.screen.width, window.innerWidth);
  console.log("deviceWidth :", deviceWidth);
  $(document).ready(function () {
    if (userPref === "true") {
      $(".dark-th").css("color", "#ffffff");
      $("#theme-toggle").prop("checked", true);
      if (deviceWidth < 575) {
        $("body").css("background-color", "#12253c");
      } else {
        $("body").css("background-color", "#12253c");
      }
    } else {
      $(".dark-th").css("color", "rgba(0,0,0,.5)");
      $("body").css(
        "background-image",
        " url(assets/pokemon_background - dark.png)"
      );
      $("#theme-toggle").prop("checked", false);
      if (deviceWidth < 575) {
        $("body").css("background-color", "#ecf0f3");
      } else {
        $("body").css("background-color", "#ecf0f3");
      }
    }
  });
}

function btnActivation() {
  if (document.getElementById("search-box").value === "") {
    document.getElementById("search-btn").disabled = true;
  } else {
    document.getElementById("search-btn").disabled = false;
  }
}

getPokemonDetails = (searchQuery) => {
  // remove attached items & start loader

  $(document).ready(function () {
    $("#errormessage").each(function () {
      $(this).remove();
    });

    $("#downloads").empty();

    $("#spinner").show(); //shows loader
  });

  url =
    "https://pokedex-back-end.herokuapp.com/api/v1/pokemon?searchtoken=" +
    searchQuery;

  return fetch(url).then((response) => response.json());
};
