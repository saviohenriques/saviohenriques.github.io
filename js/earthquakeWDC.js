(function () {
    var myConnector = tableau.makeConnector();
 
   myConnector.getSchema = function (schemaCallback) {
    var cols = [
        { id : "mag", alias : "magnitude", dataType : tableau.dataTypeEnum.float },
        { id : "title", alias : "title", dataType : tableau.dataTypeEnum.string },
        { id : "url", alias : "url", dataType : tableau.dataTypeEnum.string },
        { id : "lat", alias : "latitude", dataType : tableau.dataTypeEnum.float },
        { id : "lon", alias : "longitude", dataType : tableau.dataTypeEnum.float }
    ];

    var tableInfo = {
        id : "earthquakeFeed",
        alias : "Earthquakes with magnitude greater than 4.5 in the last seven days",
        columns : cols
    };

    schemaCallback([tableInfo]);
};
 
    myConnector.getData = function (table, doneCallback) {
    var tableData = [],
        mag = 0,
        title = "",
        url = "",
        lat = 0,
        lon = 0;

    $.getJSON("http://cors.io/?u=https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function (resp) {
        var feat = resp.features; 

        for (var i = 0, len = feat.length; i < len; i++) {
            mag = feat[i].properties.mag;
            title = feat[i].properties.title;
            url = feat[i].properties.url;
            lon = feat[i].geometry.coordinates[0];
            lat = feat[i].geometry.coordinates[1];

            tableData.push({
                "mag" : mag,
                "title" : title,
                "url" : url,
                "lon" : lon,
                "lat" : lat
            });
        }

        table.appendRows(tableData);

        doneCallback();
    });
};
    tableau.registerConnector(myConnector);
	
	$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "USGS Earthquake Feed";
        tableau.submit();
    });
});
	
})();
