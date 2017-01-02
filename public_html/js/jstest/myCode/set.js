function DeepSet(){
    //
}
DeepSet.prototype = Object.create(Set.prototype);
DeepSet.prototype.constructor = DeepSet;
DeepSet.prototype.add = function(o){
    for(let i of this)
        if(deepCompare(o, i))
            throw "Already existed";
    Set.prototype.add.call(this, o);   
};