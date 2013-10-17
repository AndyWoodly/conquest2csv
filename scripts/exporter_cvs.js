var ExporterCSV = (function() {

    function exportResult(fileName, result) {
        var rowStrings = [];
        result.forEach(function(row) {
            rowStrings.push(row.join(";"));
        });
        var csvString = rowStrings.join("\n");
        var encodedUri = encodeURI(csvString);

        var a = document.createElement('a');
        a.href = 'data:attachment/csv,'+encodedUri;
        a.target = '_blank';
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
    }

    return {
        exportResult: exportResult
    }

})();
