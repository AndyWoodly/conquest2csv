var Reader = (function() {

    function readTextFile(file, success, error) {
        if (file) {
            var r = new FileReader();
            r.onload = function(e) {
                var contents = e.target.result;
                var lines = contents.split("\n");
                console.log(
                    "Reading file:\n"
                    +"name: " + file.name + "\n"
                    +"type: " + file.type + "\n"
                    +"size: " + file.size + " bytes\n"
                    +"lines: " + lines.length + "\n"
                );
                if (success) {
                    success(file, lines);
                }
            };
            r.onerror = error;
            r.readAsText(file);
        } else {
            error(new Error("No file selected"));
        }
    }

    return {
        readTextFile: readTextFile
    }

})();
