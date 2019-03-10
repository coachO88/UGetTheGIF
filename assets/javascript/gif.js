let animals = [
  "Dogs", "Cats", "Wolfs", "Snakes", "Lizards",
  "Sharks", "Scorpions", "Coyotes", "Monkeys", "Horses",
];

let favorites = [];

let searchAnimal = "";
let animalsId = 0;
let limit = 10;
let ratingQuery = "G"
let webResponse = "";
let paused = true;
let topicJSON = "";
let responsePos = null;

function setUp () {
   if (localStorage.getItem("topic") === null) {
      for (animalsId = 0; animalsId <  animals.length; animalsId++ ) {
          setupButton ( animals);
      } 
  } else {
      animals = JSON.parse(localStorage.getItem("topic"));
      for (animalsId = 0; animalsId < animals.length; animalsId++ ) {
          setupButton (animals);
      };
  }

  if (localStorage.getItem("favorites") !== null) {
      favorites = JSON.parse(localStorage.getItem("favorites"));
  };
  
  displayGIF ();
  addButton ();
  clearLocalStorage ();
  ratingSetting ();
  
};

function ratingSetting () {
  $(".RatingSetting").on("click", function(event) {
      ratingQuery = event.currentTarget.innerText;
  });
};  

function clearLocalStorage () {
  $("#resetArray").on("click", function() {
      localStorage.clear();
  });
}

function addButton () {
  $("#find-char").on("click", function() {
      if ($("#charName").val() !== "") {
          let charName = $("#charName").val();
          animals.push(charName);
          topicJSON = JSON.stringify (animals);
          localStorage.setItem ("topic",topicJSON);
          appendAnimalButton();
          $("#charName").val("");
      } else {
          alert("Please Enter Character Name!")
      }
  });
}    

function getResults () {
  let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=2RY8YHlNYX8yKSGzWLcLUwu7fPvEjdp5&q=" +
        searchAnimal + "&limit=" +
        limit + "&offset=0&rating=" +
        ratingQuery + "&lang=en";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        for (let i = (limit-10); i < response.data.length; i++) {
            webResponse = response
            let rating = response.data[i].rating;
            let stillImg = response.data[i].images.fixed_height_still.url;
            let animeImg = response.data[i].images.fixed_height.url;

            let gifIdString = "gif" + i;
            $("#gifsDiv").append("<div id='" + gifIdString + "' class='gifImage'></div>");
  
            let gifRating = $("<h2>");
            gifRating.text("Rating: " + rating);

            let imgIdString = "img" + i;

            let gifImg = $("<img>");
            gifImg.attr('id', imgIdString );
            gifImg.attr('class', "gifImgFrame");
            gifImg.attr('src', stillImg);

            let appendgifId = "#" + gifIdString;
            $(appendgifId).append(gifRating);
            $(appendgifId).append(gifImg);
          }
      GIF();
  });
}

function favReset () {
  favorites = [];
  favJSON = JSON.stringify(favorites);
  localStorage.setItem ("favorites", favJSON);
  $(".favImage").remove();


}

function displayGIF () {
  $(".button").on("click", function() {
       if (searchAnimal !== $(this).text()) {
      $("#gifsDiv").remove();
      $("#placeHolder").append("<div id='gifsDiv'></div>");
      $("#more").remove();
      searchAnimal = $(this).text();
      getResults();
      }
      
  });   
}

function GIF () {
  $(".gifImgFrame").on("click", function(event) {
      gifId = event.currentTarget.id;
      let i = gifId.match(/\d/g);
      i = i.join("");
      gifAnimeIdString = "#img" + i;

      if (paused === true) {
          let animeImg = webResponse.data[i].images.fixed_height.url;
          $(gifAnimeIdString).attr('src', animeImg);
          paused = false;
      } else {
          let stillImg = webResponse.data[i].images.fixed_height_still.url;
          $(gifAnimeIdString).attr('src', stillImg);
          paused = true;
      }
  });
}

function appendAnimalButton () {
  animals = JSON.parse(localStorage.getItem("topic"));
  setupButton(animals);
  animalsId++;
  displayGIF();
}

function setupButton (animals) {

  let buttonName = $("<button>");
  buttonName.attr('class', "button hover");
  buttonName.text(animals[animalsId]);
  $("#buttonDiv").append(buttonName);
}

