String.prototype.replaceAt=function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

var indexes = function(string , char){
 var result = []; 
 for(var i = 0 ; i < string.length ; i++ ){
   var pos1 = string.substr( i , char.length);
   if(pos1 == char){
     result.push(i)
   }
 }
 return(result)
}
var maker = function(value){
   var a     =  JSON.stringify(value).replace(/"/g,'').replace(/,/g,'; '),
       index =  indexes(a,'%:')
       index2 =  indexes(a,'};');
      if(index && index.length > 0){
         for(var i  = 0 ; i < index.length ; i++){
           a = a.replaceAt(index[i]+1, " "); 
         }
       }
       if(index2 && index2.length > 0){
         for(var i  = 0 ; i < index2.length ; i++){
           a = a.replaceAt(index2[i]+1,' '); 
         }
       }

       return a;
};

var toStyles = function(object){
var store = '';
Object.keys(object).forEach(name => {
     var value = object[name];
     if(typeof value == 'object'){

     }
     var style = name+' '+maker(value)+'\n';
     store = store + style;
});
return(store)
}

module.exports = toStyles;