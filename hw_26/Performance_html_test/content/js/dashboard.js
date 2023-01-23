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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9090909090909091, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get garage cars"], "isController": false}, {"data": [1.0, 500, 1500, "Get garage cars-0"], "isController": false}, {"data": [1.0, 500, 1500, "Get garage cars-1"], "isController": false}, {"data": [1.0, 500, 1500, "Get car models"], "isController": false}, {"data": [0.0, 500, 1500, "Sign in"], "isController": false}, {"data": [1.0, 500, 1500, "Get car brands"], "isController": false}, {"data": [1.0, 500, 1500, "Get car brands-1"], "isController": false}, {"data": [1.0, 500, 1500, "Get car models-1"], "isController": false}, {"data": [1.0, 500, 1500, "Get car brands-0"], "isController": false}, {"data": [1.0, 500, 1500, "Get expenses"], "isController": false}, {"data": [1.0, 500, 1500, "Get car models-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 330, 0, 0.0, 1411.348484848484, 50, 16050, 173.5, 431.7000000000001, 13518.949999999999, 15825.66, 19.089489211546248, 15.710640582518657, 7.419208617747441], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get garage cars", 30, 0, 0.0, 379.4666666666667, 221, 436, 412.0, 431.7, 435.45, 436.0, 65.50218340611353, 124.991471069869, 39.096615720524014], "isController": false}, {"data": ["Get garage cars-0", 30, 0, 0.0, 133.26666666666665, 111, 150, 135.0, 143.9, 148.35, 150.0, 172.41379310344828, 61.96120689655173, 51.45474137931035], "isController": false}, {"data": ["Get garage cars-1", 30, 0, 0.0, 245.16666666666666, 107, 293, 276.0, 287.9, 293.0, 293.0, 87.46355685131195, 135.4660167638484, 26.102405247813408], "isController": false}, {"data": ["Get car models", 30, 0, 0.0, 244.8, 195, 335, 226.0, 315.8, 330.05, 335.0, 55.65862708719852, 48.59259044526901, 35.3954081632653], "isController": false}, {"data": ["Sign in", 30, 0, 0.0, 13710.033333333333, 11254, 16050, 13705.0, 15870.6, 16045.6, 16050.0, 1.8681113394358304, 1.5310972429790148, 0.5126360218569026], "isController": false}, {"data": ["Get car brands", 30, 0, 0.0, 175.0, 118, 246, 168.0, 228.0, 236.64999999999998, 246.0, 66.96428571428571, 62.255859375, 40.884835379464285], "isController": false}, {"data": ["Get car brands-1", 30, 0, 0.0, 114.1, 64, 171, 110.0, 156.60000000000002, 163.29999999999998, 171.0, 80.42895442359249, 45.319830764075064, 24.55282339142091], "isController": false}, {"data": ["Get car models-1", 30, 0, 0.0, 189.36666666666667, 140, 267, 173.0, 256.8, 261.5, 267.0, 61.60164271047228, 30.439874229979466, 19.587397330595483], "isController": false}, {"data": ["Get car brands-0", 30, 0, 0.0, 60.166666666666664, 53, 89, 57.0, 73.60000000000001, 83.5, 89.0, 103.44827586206897, 37.8838900862069, 31.58001077586207], "isController": false}, {"data": ["Get expenses", 30, 0, 0.0, 218.56666666666666, 117, 289, 235.5, 265.8, 279.09999999999997, 289.0, 68.4931506849315, 55.5837970890411, 21.511130136986303], "isController": false}, {"data": ["Get car models-0", 30, 0, 0.0, 54.90000000000001, 50, 68, 54.0, 63.40000000000001, 67.45, 68.0, 110.7011070110701, 41.94534132841328, 35.1994926199262], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 330, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
