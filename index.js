//www.downtok.in
let config;
window.onload = function () {
  $("#spinner").show(); //shows loader
  changeTheme(localStorage.getItem("darkMode")); //select theme
  const urlParams = new URLSearchParams(window.location.search);
  const gameScore = urlParams.get("score");

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
  } else if (window.location.pathname === "/result.html") {
    if (!gameScore) {
      window.location.replace("/pages/404.html");
    }

    $(document).ready(function () {
      //set share links
      var instaLink =
        "intent:#Intent;scheme=http;package=com.instagram.android;end";

      var whatsappLink =
        "https://api.whatsapp.com/send?text=Hey%21%20I%20got%20" +
        gameScore +
        " seconds!%20Can%20you%20beat%20my%20score?%20try%20now%3A%20 https://www.downtok.in";

      var twitterLink =
        "https://twitter.com/share?hashtags=downtok.in&text=Hey%21+I+got+" +
        gameScore +
        " seconds" +
        "%21%20Can+you+beat+my+score?+try+now+%3A";

      var copyLink =
        "Hey! I got " +
        gameScore +
        " seconds! " +
        "Can you beat my score? try now: https://downtok.in";

      //hide loader
      $("#spinner").hide();
      //populate score
      $("h1#score").text(gameScore);
      // set value in share input box
      document.getElementById("share-link").value = copyLink;

      //share buttons
      $("button.share-btn").click(function () {
        switch (this.id) {
          case "whatsapp-link":
            window.open(whatsappLink);
            break;
          case "twitter-link":
            window.open(twitterLink);
            break;
          case "copy-link":
            var copyText = document.getElementById("share-link");
            copyText.select();
            document.execCommand("copy");
            $(".toast").toast("show");
            break;
        }
      });
    });
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
      $("#theme-toggle").prop("checked", false);
      if (deviceWidth < 575) {
        $("body").css("background-color", "#ecf0f3");
      } else {
        $("body").css("background-color", "#ecf0f3");
      }
    }
  });
}
