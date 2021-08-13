var dog,sadDog,happyDog, database;
var foodS,foodStock;

var addFood;
var foodObj;

var bedroom, garden, washroom

var gameState, readState

//create feed and lastFed variable here
var feed, lastFed

function preload(){
sadDog=loadImage("dogImg.png");
happyDog=loadImage("dogImg.png");

bedroom= loadImage("Bed Room.png")
garden = loadImage("Garden.png")
washroom = loadImage("Wash Room.png")

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  food = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here


  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feed=createButton("Feed The Dog")
  feed.position(700,95)
  feed.mousePressed(feedDog)


  //read game state from database 
  readState=database.ref('gamestate');
  readState.on("value",function(data){
  gameState=data.val();
  });



}

function draw() {

  currentTime= hour()
  if (currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden()
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }

  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4) ){
    update("Bathing");
    foodObj.washroom();
  }

  else{
    update("Hungry");
    foodObj.display();
  }
 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }

  else{
    feed.show()
    addFood.show()
    dog.addImage(sadDog)
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){ 
  dog.addImage(happyDog); 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({ 
    Food:foodObj.getFoodStock(), FeedTime:hour(), gameState:"Hungry" }) }



//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })

}