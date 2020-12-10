$(function () {
  $("#fav-btn").click(function () {
    $("#fav-btn").toggleClass("press", 1000);
  });
});

//Main Variables
var recipehistory = [];
var favoritesrecipes = localStorage.getItem("recipehistory");
if (favoritesrecipes) {
  recipehistory = JSON.parse(favoritesrecipes);

}

// History List
$("#fav-btn").on("click", function (e) {
  $(this).toggleClass("press", 1000).toggleClass("light-blue").toggleClass("accent-2");
  var callrecipe = e.target.innerHTML;
  var recipeId = $(this).attr("data-id");
  console.log(recipeId);

  if (recipehistory.indexOf(recipeId) === -1) {
    $("#fav-icon").text("favorite");
    recipehistory.push(recipeId);
    localStorage.setItem("recipehistory", JSON.stringify(recipehistory));
  } else {
    var index = recipehistory.indexOf(recipeId)
    $("#fav-icon").text("favorite_border");
    console.log(index);
    recipehistory.splice(index, 1);
    console.log(recipehistory);
    localStorage.setItem("recipehistory", JSON.stringify(recipehistory));
  }

  $("#recipe-header").val(callrecipe);
  getRecipe(callrecipe);

});