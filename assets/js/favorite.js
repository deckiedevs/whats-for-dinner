$(function(){
    $( "a" ).click(function() {
      $( "a,i" ).toggleClass( "press", 1000 );
    });
});

//Main Variables
var recipehistory = [];
 
//Var for getRecipeDetails
var getRecipeDetails = function () {
   var recipestored = JSON.parse(localStorage.getItem("recipe-header"));
   if (recipestored !== null) {
     recipehistory = recipestored;
     for(var i=0;i<recipehistory.length;i++) {
         if(i==8){
             break;
         }
       //  creates links/buttons
       recipelist = $("<a>").attr({
         class: "fav-btn",
         href: "a",
         "fav-btn": i
       });
         // appends history as a button below the search field
         recipelist.text(recipehistory[i]);
         $("recipe-header").append(recipelist);      
     }
   }
};

// Save Recipe Name to LocalStorage 
var saverecipe = function(recipe){
    var inArray = recipehistory.includes(recipe);
    if(!inArray && recipe !==""){
        recipehistory.push(recipe);
        localStorage.setItem("recipe-header", JSON.stringify(recipehistory));
        var recipelist = $("<a>").attr(
            {
                class:"fav-btn",
                href: "a",
                "fav-btn": recipehistory.length
            }
        );
        recipelist.text(recipe);
        $("recipe-header").append(recipelist);

    }
};

//Search Button
$("#recipesearch").on("click",function(){
  var recipe=$("#recipe-header").val(); 
  getRecipe(recipe);
  $("#recipe-header").val("");
});

// History List
$("fav-btn").on("click",function(e){
 var callrecipe = e.target.innerHTML;
 $("#recipe-header").val(callrecipe);
 getRecipe(callrecipe);

});