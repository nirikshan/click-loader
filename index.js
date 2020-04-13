var io = require('indo-compiler'),
UglifyJS = require("uglify-es"),
JSON5 = require('json5'),
toStyles = require('./Object2css')
ex = require("./HeavyExtraction");

CLICK_COMMUNICATION_PATHWAY = {
    cssInlineStyles: [],
    PatchingStyles: []
};

ComponentSlags =  [];

var compiler = function compiler(x , seperate) {
    var alldata = x,
        mydata = x,
        len = mydata.length;
    var p1,
        p2,
        p = 0;
    for (var j = p; j < len; j++) {

        if(seperate){
            if (mydata.indexOf('view:(') !== -1) {
                var p1 = mydata.indexOf('view:(');
                var p2 = mydata.indexOf('),');
            } else if (mydata.indexOf("view:'")) {
                var p1 = mydata.indexOf("view:'");
                var p2 = mydata.indexOf("',");
            }
        }else{
            if (mydata.indexOf('view:"') !== -1) {
                var p1 = mydata.indexOf('view:"');
                var p2 = mydata.indexOf('",');
                var sign = '"';
            } else if (mydata.indexOf("view:'")) {
                var p1 = mydata.indexOf("view:'");
                var p2 = mydata.indexOf("',");
                var sign = "'";
            }
        }
       
        if (p1 == -1 || p2 == -1) {
            break;
        }
        var str = mydata.substr(p1 + 6, (p2 - p1) - 6).replace(/\\n/g, ''),
            replaceData = mydata.substr(p1 + 6, (p2 - p1) - 6);
        if (str.indexOf('<') !== -1 && str.indexOf('>') !== -1) {
            var compiled = io.Generate(str.replace(/\\/g, ''));
            alldata = alldata.replace((seperate ? replaceData : (sign + replaceData + sign)), compiled);
        }
        var p = p2 + 2,
            mydata = mydata.substr(p),
            len = mydata.length;
    }
    return (alldata);
},
CompileCss = function(Splitcode, AllCode, comp) {
    var styles = {};
    // console.log(Splitcode)
    if (Splitcode !== '{}' && Splitcode !== undefined) {
        var out = JSON5.parse(Splitcode);
        if (typeof out == 'object') {
            var ReplaceTO = `"@css":${Splitcode}`
            var pos = AllCode.indexOf(ReplaceTO);
            if (pos > 0) {
                var ReplaceTO = `"@css":${Splitcode}`,
                    AllCode = AllCode.replace(ReplaceTO, 'css:true');
                var ConvertedToStyle = toStyles(out);
                styles['data'] = ({
                    styles: ConvertedToStyle,
                    Component: comp.name,
                    splitcode: comp.componentTree
                });
            }
        }
    }
    return ([AllCode, styles]);
},
MakeUnique = function(Array){
    return Array.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
},
AddToConfigSlag = function(_this , Compiled_Css_Data , Component_Main_Tree_name) {
    _this.forEach(element => {
       if(element.options && element.options.DataTreeName  == 'Click_Application_Configuration'){
           
         var self           = element.options.styleBag;
         
             if(Compiled_Css_Data !== undefined && Compiled_Css_Data.data !== undefined){
                Component_Name = Compiled_Css_Data.data.Component;
                self[Component_Name] = Compiled_Css_Data.data;
             }else{
                self[Component_Main_Tree_name] = {}
                //  console.log(Component_Main_Tree_name)
             }
             
       }
    });
};


module.exports = function(source, a) {
    var seperate = '';
    var _this = this.loaders;
    for (let index = 0; index < _this.length; index++) {
        const element = _this[index];
        if('options' in element && 'env' in element.options){
            if(element.options.env == '.cl'){
              seperate = true;
              break;
            }else if(element.options.env == '.js'){
              seperate = false;
              break;
            }
        }
    }



    if(seperate){
      var  code  =  compiler(source , seperate),
           code  =  (UglifyJS.minify(code).code);      
    }else{
      var  code  =  (UglifyJS.minify(source).code),
           code  =  compiler(code , seperate);   
    }

    var  tvx            =  ex.WorkDivider(code);  
    if (tvx !== undefined) { 
    var Ins    =  MakeUnique(ComponentSlags.concat(tvx.map(a=>a.name))),
        _this  =  this.loaders;
        
        tvx.forEach((element  , index)=> {
                var Component_Main_Tree       =  element.componentTree,
                    Component_Main_Tree_name  =  element.name,
                    Pure_Css_Object           =  Component_Main_Tree !== undefined ? ex.CssExtraction(Component_Main_Tree) : '{}',
                    Compiled_Css_Data         =  CompileCss(Pure_Css_Object , code , element);
                    AddToConfigSlag(_this  , Compiled_Css_Data[1] , Component_Main_Tree_name);
                    code = Compiled_Css_Data[0];
        });
    }


    return (code);
}