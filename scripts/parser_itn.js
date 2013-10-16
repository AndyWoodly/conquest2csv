var ParserITN = (function() {

    function parse(file, lines, success, error) {
        var TABLE_INDICATOR = /^TABLES OF RESPONSE MODEL PARAMETER ESTIMATES/;
        var TABLE_TERMINATOR = /^-+/;

        var state = undefined;
        var result = [];
        try {
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (state === "readTableBody") {
                    if (line.match(TABLE_TERMINATOR)) {
                        state = undefined;
                    } else {
                        // parse entry
                        var values = line
                                .replace(/\(|\)|,/g,"")
                                .replace(/\s+/g, " ")
                                .trim()
                                .split(" ");
                        // skip first column
                        values.shift();
                        result.push(values);
                    }
                }
                if (state === "readTableHeader") {
                    // parse header
                    var values = line
                            .replace(/\s+/g, " ")
                            .replace(/CI/g, "CI_START CI_END")
                            .trim()
                            .split(" ");
                    result.push(values);

                    state = "readTableBody";
                    i++;
                }
                if (line.match(TABLE_INDICATOR)) {
                    state = "readTableHeader";
                    i += 5;
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
