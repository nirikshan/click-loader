var UglifyJS      = require("uglify-es"),
     fs           = require('fs'),
     indo         = require('indo-compiler'),
     ex           = require("./compiler/HeavyExtraction");
     io           = require('./compiler/pull-html-bracket'),
     io2          = require('./compiler/pull-html');

module.exports = function(source, a) {
    
    var isClickFile = ''; /*This is important because The Compilation process is different with different file ext*/
    var _this = this.loaders;
    for (let index = 0; index < _this.length; index++) {
        const element = _this[index];
        if('options' in element && 'env' in element.options){
            if(element.options.env == '.cl'){
               isClickFile = true;
               break;
            }else if(element.options.env == '.js'){
               isClickFile = false;
               break;
            }
        }
    }

    if(isClickFile){
        /*For .cl file because it has different compilation process*/ 
        var ExtractSet = io.ExtractWithBraces(source);
        for (let j = 0; j < ExtractSet.length; j++) {
            const component       =   ExtractSet[j],
                  ExtractHTM      =   io2.pullHTML(component),
                  RenderFunction  =   indo.Generate(ExtractHTM);

                  source = source.replace((new RegExp('@view:', 'g')),'view:');
                  source = source.replace(ExtractHTM, RenderFunction);
        }
    }else{
        /*For .js file*/
        var code  =  (UglifyJS.minify(source)); 
        if(code !== void 0 && code.code.indexOf('click.cl') !== -1){
            source  = code.code; /*Every thing on main stream*/
            var OnlyClickComponentCodes =   source , 
                CodeSplits              =   ex.WorkDivider(OnlyClickComponentCodes);

                CodeSplits !== undefined && CodeSplits.length > 0 && CodeSplits.map(
                    function(item){

                        var IndividualComponent  =  item.componentTree,
                            ExtractHTM           =  io2.pullHTML(IndividualComponent);
                            
                            if(ExtractHTM){
                                var CompilingHTML =  ExtractHTM.replace(/\\n/g, '').replace(/\\/g, '');
                                RenderFunction  =   indo.Generate(CompilingHTML);
                            }

                            /*Correction in minified code because external UglifyJS package may change quots or double quots depending upon code env*/ 
                            if (IndividualComponent.indexOf('view:"') !== -1) {
                                var sign = '"';
                            } else if (IndividualComponent.indexOf("view:'") !== -1) {
                                var sign = "'";
                            }
                            /*Back to next Stream which will send code for next process*/ 
                            source = source.replace(sign + ExtractHTM + sign, RenderFunction);
                    }
                )
        }
    }
    return (source);
}
