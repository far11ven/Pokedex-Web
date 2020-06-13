//www.pokedex.downtok.in
let config;

window.onload = function () {
  $("#spinner").show(); //shows loader

  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);

  const searchQuery = urlParams.get("searchtoken");

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
      getPokemonDetails(searchQuery);
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

function getPokemonDetails(searchQuery) {
  // remove attached items & start loader

  $(document).ready(function () {
    $("#errormessage").each(function () {
      $(this).remove();
    });

    $("#downloads").empty();

    $("#spinner").show(); //shows loader
  });

  url =
    "http://pokedex-back-end.herokuapp.com/api/v1/pokemon?searchtoken=" +
    searchQuery;

  fetch(url)
    .then((response) => response.json())

    .then((responseJson) => {
      console.log(responseJson);
    });
}
