var getAllindex = function(str, char) {
    var regexp = new RegExp(char, "g");
    var match, matches = [];
    while ((match = regexp.exec(str)) != null) {
        matches.push(match.index);
    }
    return [matches, char];
},
ExtractWithBraces = function ExtractWithBraces(x) {
    var source = x;
    var ComponentExtractionCollection = [];
    var component = ([]),
        componentLength = component.length - 1;
    if (componentLength < 0) {
        component = (getAllindex(x, '@view:') || []), componentLength = component.length - 1;
    }

    var AllIndex = component[0];
    for (let j = 0; j < AllIndex.length; j++) {
        var ele = AllIndex[j],
            eleNext = AllIndex[j + 1] || x.length;
        source = x.substr(ele, eleNext - ele);

        chunk = NodeExtraction(source);
        ComponentExtractionCollection.push(chunk);
    }
    return ComponentExtractionCollection;
},
NodeExtraction = function NodeExtraction(newstr, allStores = []) {
    var p2 = newstr.indexOf('@view:'),
        len1 = newstr.length;
    var quortPosition = p2;
    quorttype = '(',
        positionGain = 0,
        finalposition = 0,
        endFound = false,
        validEnd = false,
        EndNotFound = false;

    for (let i = quortPosition + 1; i < len1; i++) {
        var el = newstr[i];
        if (el == quorttype) {
            positionGain = i;
            break;
        }
    }
    var starter = positionGain;
    for (var j = starter + 1; j < len1; j++) {
        var el22 = newstr[j];
        if (el22 == ')') {
            for (let u = j; u < newstr.length; u++) {
                const ele3 = newstr[u],
                    ele4 = newstr[u + 1];
                if (ele3 == '<' && ele4 == '/') {
                    endFound = false;
                    break;
                }
                if (ele3 == '}' || ele3 == ',') {
                    endFound = j;
                }
            }
            if (endFound) {
                if (finalposition == 0) {
                    finalposition = endFound;
                    componentTree = newstr.substr(starter, finalposition - starter + 1);
                    allStores = componentTree
                }
            }
        }
    }
    return (allStores);
};

module.exports = { ExtractWithBraces }