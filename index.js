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
	  $("#spinner").show();
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

              $("#result").append(
                `<div id="poke_details">
              <div class="container ">
								<ul class="nav nav-pills nav-justified poke-tab-header" role="tablist" data-tabs="tabs">
									<li class="col-md-6 tab-header"><a href="#details" data-toggle="tab">Basic</a></li>
									<li class="col-md-6 tab-header"><a href="#stats" data-toggle="tab">Stats</a></li>
								</ul>
								<div class="tab-content">
									<div role="tabpanel" class="tab-pane fade show active" id="details">
										<table id="basic" class="table table-striped border-success text-center">
											<thead class="thead-dark">
											</thead>
                      <tbody>
                      <tr>
                      <th scope="col" name="name">Name</th>
                      <td scope="col" name="name">` +
                  searchResult.info.name +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="id">Id</th>
                      <td scope="col" name="id">` +
                  searchResult.info.id +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="species_name">Species Name</th>
                      <td scope="col" name="species_name">` +
                  searchResult.info.species_name +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="type">Type</th>
                      <td scope="col" name="type">` +
                  searchResult.info.types +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="height">Height</th>
                      <td scope="col" name="height">` +
                  searchResult.info.height +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="weight">Weight</th>
                      <td scope="col" name="weight">` +
                  searchResult.info.weight +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="abilities">Abilities</th>
                      <td scope="col" name="abilities">` +
                  searchResult.info.abilities +
                  `</td>
                    </tr>
											</tbody>
										</table>
									</div>
									<div role="tabpanel" class="tab-pane fade" id="stats">
										<table id="stats" class="table table-striped border-success text-center">
											<thead class="thead-dark">
											</thead>
                      <tbody>
                      <tr>
                      <th scope="col" name="hp">HP</th>
                      <td scope="col" name="hp">` +
                  searchResult.info.stats["hp"] +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="attack">Attack</th>
                      <td scope="col" name="attack">` +
                  searchResult.info.stats["attack"] +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="defense">defense</th>
                      <td scope="col" name="defense">` +
                  searchResult.info.stats["defense"] +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="special_attack">Special Attack</th>
                      <td scope="col" name="special_attack">` +
                  searchResult.info.stats["special-attack"] +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="special-defense">Special Defense</th>
                      <td scope="col" name="special-defense">` +
                  searchResult.info.stats["special-defense"] +
                  `</td>
                    </tr>
                    <tr>
                    <th scope="col" name="speed">Speed</th>
                      <td scope="col" name="speed">` +
                  searchResult.info.stats["speed"] +
                  `</td>
                    </tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
              `
              );
			  $("#spinner").hide();
            });
          } else {
            $(document).ready(function () {
              $("#result").append(
                '<span class="error-message"> Pokemon Not found : <span id="poke_name">' +
                  searchQuery +
                  "</span></span>"
              );
			 $("#spinner").hide();
            });
          }
        })
        .catch((err) => {
          $(document).ready(function () {
			  
			$("#spinner").hide();
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
    if (userPref === "false") {
      $(".dark-th").css("color", "rgba(0,0,0,.5)");
      $("#theme-toggle").prop("checked", false);
      if (deviceWidth < 575) {
        $("body").css("background-color", "#ecf0f3");
      } else {
        $("body").css(
          "background-image",
          "url(/assets/pokemon_background.png)"
        );
      }
    } else {
      $(".dark-th").css("color", "#ffffff");
      $("#theme-toggle").prop("checked", true);
      if (deviceWidth < 575) {
        $("body").css("background-color", "#12253c");
      } else {
        $("body").css(
          "background-image",
          "url(/assets/pokemon_background_dark.png)"
        );
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
