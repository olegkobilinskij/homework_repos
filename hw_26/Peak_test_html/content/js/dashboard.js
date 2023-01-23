/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 50.715746421267895, "KoPercent": 49.284253578732105};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4166666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.028517110266159697, 500, 1500, "Get garage cars"], "isController": false}, {"data": [0.8384030418250951, 500, 1500, "Get garage cars-0"], "isController": false}, {"data": [0.1810344827586207, 500, 1500, "Get garage cars-1"], "isController": false}, {"data": [0.11297071129707113, 500, 1500, "Get car models"], "isController": false}, {"data": [0.0, 500, 1500, "Sign in"], "isController": false}, {"data": [0.09631147540983606, 500, 1500, "Get car brands"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "Get car brands-1"], "isController": false}, {"data": [0.8783783783783784, 500, 1500, "Get car models-1"], "isController": false}, {"data": [0.9651639344262295, 500, 1500, "Get car brands-0"], "isController": false}, {"data": [0.15625, 500, 1500, "Get expenses"], "isController": false}, {"data": [0.9518828451882845, 500, 1500, "Get car models-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1956, 964, 49.284253578732105, 799.4867075664629, 50, 9949, 210.0, 2069.0999999999995, 4520.599999999999, 8735.87, 27.6642387384202, 12.332338700410155, 8.370302886995262], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get garage cars", 263, 251, 95.43726235741445, 849.9961977186304, 110, 5410, 348.0, 2120.799999999997, 4251.199999999999, 5333.480000000001, 4.1230325453063275, 2.023089423167367, 1.2580429998589078], "isController": false}, {"data": ["Get garage cars-0", 263, 0, 0.0, 547.5931558935366, 103, 5410, 275.0, 1142.0, 1407.5999999999988, 5333.480000000001, 4.1230325453063275, 1.4817148209694615, 1.1088059764375746], "isController": false}, {"data": ["Get garage cars-1", 58, 46, 79.3103448275862, 1370.8275862068965, 63, 3585, 1223.0, 3564.6, 3573.1, 3585.0, 1.7322740577026463, 1.0313960672898872, 0.284317879756287], "isController": false}, {"data": ["Get car models", 239, 202, 84.51882845188284, 323.67782426778234, 50, 7832, 127.0, 572.0, 818.0, 4764.0, 3.8551496088394224, 1.7556544378578918, 1.2603397955480282], "isController": false}, {"data": ["Sign in", 298, 238, 79.86577181208054, 2556.8825503355706, 187, 9949, 889.0, 8334.1, 8892.25, 9477.409999999996, 4.256413186310918, 2.253505983795635, 1.6697193427555277], "isController": false}, {"data": ["Get car brands", 244, 205, 84.01639344262296, 355.82786885245883, 53, 5270, 128.5, 784.0, 2269.25, 3275.8000000000065, 3.940886699507389, 1.798127346967617, 1.2261486261406767], "isController": false}, {"data": ["Get car brands-1", 39, 0, 0.0, 883.74358974359, 58, 2445, 200.0, 2442.0, 2445.0, 2445.0, 1.1838630361533558, 0.6670790740825062, 0.2122214412014692], "isController": false}, {"data": ["Get car models-1", 37, 0, 0.0, 340.05405405405406, 58, 2081, 140.0, 1009.0000000000035, 2065.7, 2081.0, 1.124961994527212, 0.555889423076923, 0.2185908520826999], "isController": false}, {"data": ["Get car brands-0", 244, 0, 0.0, 214.48770491803282, 53, 5270, 113.5, 370.5, 501.75, 3275.8000000000065, 3.940886699507389, 1.443195812807882, 1.1132323548413148], "isController": false}, {"data": ["Get expenses", 32, 22, 68.75, 826.4374999999998, 60, 6280, 128.0, 4973.299999999997, 6226.7, 6280.0, 0.981866159369151, 0.4830225368966893, 0.19398808336657358], "isController": false}, {"data": ["Get car models-0", 239, 0, 0.0, 270.9665271966527, 50, 7832, 121.0, 445.0, 572.0, 4764.0, 3.8551496088394224, 1.4607402814743125, 1.1443715218969273], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: code expected to match /200/", 407, 42.219917012448136, 20.807770961145195], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 205, 21.265560165975103, 10.480572597137014], "isController": false}, {"data": ["401/Unauthorized", 114, 11.825726141078839, 5.828220858895706], "isController": false}, {"data": ["429/Too Many Requests", 238, 24.688796680497926, 12.167689161554192], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1956, 964, "Test failed: code expected to match /200/", 407, "429/Too Many Requests", 238, "Test failed: code expected to contain /200/", 205, "401/Unauthorized", 114, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get garage cars", 263, 251, "Test failed: code expected to match /200/", 205, "401/Unauthorized", 46, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Get garage cars-1", 58, 46, "401/Unauthorized", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get car models", 239, 202, "Test failed: code expected to match /200/", 202, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Sign in", 298, 238, "429/Too Many Requests", 238, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get car brands", 244, 205, "Test failed: code expected to contain /200/", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get expenses", 32, 22, "401/Unauthorized", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
