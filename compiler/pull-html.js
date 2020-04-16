var find = function find(track, source) {
    var sourceLength = source.length;
    for (let i = 0; i < sourceLength; i++) {
        const e1 = source[i];
        if (source.indexOf('<') !== -1 && source.indexOf('>') !== -1 && (source.indexOf('</') !== -1 || source.indexOf('/>') !== -1)) {
            if (e1 == '<') {
                /**now end up finding it's end < because this may be comperator sign of js*/
                for (let j = i; j < sourceLength; j++) {
                    const el2 = source[j];
                    if (el2 == '>') {
                        var LengthOfTag = j - (i + 1);
                        if (track.gainFirst) {
                            track.first = i;
                            track.gainFirst = false;
                        }
                        if (!track.isNotpending) {
                            track.nextPoint = j;
                            track.isNotpending = true;
                            break;
                        }
                    }
                }
            }
            if (track.isNotpending) {
                var chunk = source.substr(track.nextPoint + 1);
                track.foundChunk = chunk;
                track.isNotpending = false;
                return find(track, chunk);
            }
        } else {
            track.end = i;
            var endChunk = track.foundChunk;
            return (track.mainChunk.substr(track.first, (track.mainChunk.length - endChunk.length) - track.first));
        }
    }
};
var pullHTML = function($data) {
    var track = {
        first: 0,
        last: 0,
        nextPoint: 0,
        gainFirst: true,
        isNotpending: false,
        foundChunk: $data,
        mainChunk: $data,
        end: 0
    };
    return find(track, $data);
}


module.exports = { pullHTML }