var ParserITN = (function() {

    function parse(file, lines, success, error) {
        var TABLE_INDICATOR = /^Item \d+/;
        var TABLE_TERMINATOR = /^=+/;

        var ITEM_CASES  = /(Cases for this item)\s+([\d\.-]+)/;
        var ITEM_THRES  = /(Item Threshold\(s\)):\s+([\d\.-]+)/;
        var ITEM_DELTA  = /(Item Delta\(s\)):\s+([\d\.-]+)/;
        var ITEM_DISC   = /(Discrimination)\s+([\d\.-]+)/;
        var ITEM_WEIGHT = /(Weighted MNSQ)\s+([\d\.-]+)/;

        var ItemSummaryMatcher = [
            ITEM_CASES,
            ITEM_THRES,
            ITEM_DELTA,
            ITEM_DISC,
            ITEM_WEIGHT
        ];

        var state = undefined;
        var result = [];
        try {
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if ("readItemSummary" === state) {
                    var headerrow = [];
                    var itemrow = [];
                    for (var offset = 0; offset < 3; offset++) {
                        line = lines[i];
                        ItemSummaryMatcher.forEach(function(matcher) {
                            var m = line.match(matcher);
                            if (m && m.length === 3) {
                                headerrow.push(m[1]);
                                itemrow.push(m[2]);
                            }
                        });
                        i++;
                    }
                    result.push(headerrow);
                    result.push(itemrow);
                    state = "readTableHeader";
                } else if (state === "readTableBody") {
                    if (line.match(TABLE_TERMINATOR)) {
                        state = undefined;
                        result.push([]);
                    } else {
                        // parse entry
                        var values = line
                                .replace(/\(|\)|,/g,"")
                                .replace(/\s+/g, " ")
                                .trim()
                                .split(" ");
                        result.push(values);
                    }
                } else if (state === "readTableHeader") {
                    // parse header
                    var values = line
                            .replace(/\s+/g, " ")
                            .replace(/% of tot/, "%_of_tot")
                            .replace(/Pt Bis/, "Pt_Bis")
                            .replace(/t \(p\)/, "t_(p)")
                            .trim()
                            .split(" ");
                    result.push(values);

                    state = "readTableBody";
                    i++;
                } else if (line.match(TABLE_INDICATOR)) {
                    state = "readItemSummary";
                    i += 2;
                }
            }
            success(result);
        } catch(e) {
            error(e);
        }
    }

    return {
        canHandle: function(fileName, type) {
            return fileName.indexOf(".itn") != -1;
        },
        parse: parse
    }

})();
