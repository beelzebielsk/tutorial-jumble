"use strict"

class Dog1 {
    constructor(name, species) {
        console.log(`This from planet Dog1: ${JSON.stringify(this)}`);
        this.name = name;
        this.species = species;
    }
    bark() {
        console.log(`From ${this.name}: Yo. Bark. Lemme alone.`);
    }
}

function Dog2(name, species) {
    console.log(`This from planet Dog2: ${JSON.stringify(this)}`);
    this.name = name;
    this.species = species;
}

Dog2.prototype.bark = function() {
    console.log(`From ${this.name}: Yo. Bark. Lemme alone.`);
}

let classTypeDog = new Dog1("doggoline", "mutt");
let oldTypeDog = new Dog2("doggorella", "muttisse");

classTypeDog.bark()
oldTypeDog.bark()

console.log("----------------------------------------");

console.log("Object itself:"      , classTypeDog)
console.log("Name:"               , classTypeDog.name)
console.log("Species:"            , classTypeDog.species)
console.log("Object's Prototype:" , Object.getPrototypeOf(classTypeDog))
console.log("Class' Prototype:"   , Dog1.prototype)
//console.log(Object.keys(Dog1.prototype))

console.log("----------------------------------------");

console.log("Object itself:"      , oldTypeDog)
console.log("Name:"               , oldTypeDog.name)
console.log("Species:"            , oldTypeDog.species)
console.log("Object's Prototype:" , Object.getPrototypeOf(oldTypeDog))
console.log("Class' Prototype:"   , Dog2.prototype)
//console.log(Object.keys(Dog2.prototype))

console.log("----------------------------------------");

console.log(oldTypeDog.toString);
console.log(Dog2.prototype.prototype);
