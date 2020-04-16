var found = function found(array) {
    for(var i = 0; i < array.length ; i++){
      if(array[i] == true){
        array[i] = false;
        return(array);
      }
    }
    return(array);
  },
  WorkDivider = function WorkDivider(x , alldata) {
    var p1        =  x.indexOf('new App(');  
        if(p1 !== -1){
            var newstr     =   x.substr(p1),
                allStores  =   [],
                chunk      =   HeavyExtraction(x , allStores);

            if(chunk !== undefined){
              return(chunk);        
            }
        }
  },
  HeavyExtraction = function HeavyExtraction(newstr , allStores = []) {
    var p2        = newstr.indexOf('new App('),
        len1      = newstr.length;
    var quortPosition = p2 + 8;
        quorttype     = newstr.substr(quortPosition, 1),
        positionGain  = 0,
        finalposition = 0;
  
        for (let i = p2 ; i > 0; i--) {
            var el = newstr[i], char3 = newstr.substr(i,3) , char5 = newstr.substr(i , 5);
            if( (el && el == ';')  || (el && el == "'") || (el && el == '"') || (el && el == ",")){
                console.error('Please make sure you have supplied Valid Component Name on your click native component file.');
                return;  
            } 
            if( (char3 && char3.toLocaleLowerCase() === 'var') || (char3 && char3.toLocaleLowerCase() === 'let')){
                positionGain = i + 3;
                break;             
            }
            if((char5 && char5.toLocaleLowerCase() === 'const')){
               positionGain = i + 5;
               break; 
            }
        }

        var name    = newstr.substr(positionGain , (p2 - positionGain) - 1 ),
            starter = quortPosition, 
            state   = {
              parm1:[]
            };
        
        if(name !== void 0){
          name = name.trim();
        }
        if(name.length < 0){
           console.log('Please make sure you have supplied component name' , newstr.substr(quortPosition));
        }

        for (var j = starter + 1; j < len1; j++) {
          var el2 = newstr[j];
          if(el2 == '{'){
            state.parm1.push(true); 
          }
          if(state.parm1.indexOf(true) !== -1){
            if(el2 == '}'){
              found(state.parm1)
            }
          }
          if(state.parm1.indexOf(true) == -1){
            if(el2 == '}'){
              if(newstr[j + 1] == ')'){
                if(finalposition == 0){
                  finalposition = j;
                  componentTree = newstr.substr(starter , finalposition - starter + 1);
                  allStores.push({
                    name:name,
                    componentTree:componentTree,
                    finalposition:finalposition
                  });
                  var lateChunk = newstr.substr(finalposition);
                  if(lateChunk.indexOf('new App(') !== -1){
                      HeavyExtraction(lateChunk , allStores);
                  }else{
                     break;
                  }
                }
              }
            }
          }
        }        
        return(allStores);
  },
  cssfound =  function(state , index){
      for(var i = 0 ; i < state.length ; i++){
        if(state[i] == '{'){
          state[i] = index;
          FirstEntry = true;
          break;
        }
      }
  },
  check = function(state){
    for(var j = 0 ; j < state.length ; j++){
      if(typeof state[j] !== 'number'){
        return(0);
      }
    }
    return(1);
  },
  Extraction = function(a){
    var state      =  [],
        Endpoint   =  -1,
        a   =  a.substr(a.indexOf(':')+1);//.replace(/\s/g,'');
    
    for(var i = 0 ; i < a.length ; i++){
      var el = a[i];
        if(el == '{'){
          state.push(el);   
        }
        if(el == '}'){
          cssfound(state , i);
        }
        if(check(state)){
          Endpoint = i;
          break;
        }
      }
    return(a.substr(0,Endpoint+1));
  },
  CssExtraction = function(a) {
    var csspos  = a.indexOf('@css'),
        text    = a.substr(csspos);   
        if(text.indexOf(':') !== -1){
          return Extraction(text)
        }
  };
  
  module.exports = { WorkDivider:WorkDivider, CssExtraction:CssExtraction}