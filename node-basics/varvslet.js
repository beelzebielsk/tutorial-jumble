function varBehavior(){
  console.log("The value of thing is:", thing);
  var thing = 0;
  console.log("The value of thing is:", thing);
}

function letBehavior(){
  console.log("The value of thing is:", thing);
  let thing = 0;
  console.log("The value of thing is:", thing);
}

varBehavior()
letBehavior()
