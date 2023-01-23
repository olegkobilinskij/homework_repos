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

    var data = {"OkPercent": 45.305164319248824, "KoPercent": 54.694835680751176};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4239289906103286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.007739938080495356, 500, 1500, "Get garage cars"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "Get garage cars-0"], "isController": false}, {"data": [1.0, 500, 1500, "Get garage cars-1"], "isController": false}, {"data": [0.004658385093167702, 500, 1500, "Get car models"], "isController": false}, {"data": [0.0030864197530864196, 500, 1500, "Sign in"], "isController": false}, {"data": [0.010341261633919338, 500, 1500, "Get car brands"], "isController": false}, {"data": [1.0, 500, 1500, "Get car brands-1"], "isController": false}, {"data": [0.45, 500, 1500, "Get car models-1"], "isController": false}, {"data": [0.9922440537745605, 500, 1500, "Get car brands-0"], "isController": false}, {"data": [1.0, 500, 1500, "Get expenses"], "isController": false}, {"data": [0.9922360248447205, 500, 1500, "Get car models-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6816, 3728, 54.694835680751176, 294.54445422535304, 51, 7305, 151.0, 449.0, 937.2499999999945, 3075.83, 35.86896460991975, 14.102729081699776, 11.8065571141955], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get garage cars", 969, 959, 98.96800825593395, 309.08462332301326, 109, 2911, 219.0, 560.0, 1117.5, 1353.3, 5.197103781174578, 1.9507785264145885, 1.573980960042907], "isController": false}, {"data": ["Get garage cars-0", 969, 0, 0.0, 306.8328173374618, 109, 2911, 218.0, 560.0, 1110.0, 1307.599999999999, 5.197103781174578, 1.867709171359614, 1.5579013307857335], "isController": false}, {"data": ["Get garage cars-1", 10, 0, 0.0, 216.20000000000002, 98, 308, 236.5, 307.8, 308.0, 308.0, 0.11057543456145782, 0.1712623429828829, 0.03315103360387456], "isController": false}, {"data": ["Get car models", 966, 956, 98.9648033126294, 147.74223602484486, 51, 2476, 108.0, 193.0, 391.54999999999984, 923.3100000000003, 5.2319724427786864, 2.009190310289546, 1.6878302987261287], "isController": false}, {"data": ["Sign in", 972, 856, 88.06584362139918, 896.69547325103, 189, 7305, 391.0, 2634.8000000000006, 3468.0, 5759.889999999999, 5.11802524260598, 2.5424757920565297, 2.2699163483258475], "isController": false}, {"data": ["Get car brands", 967, 957, 98.96587383660807, 129.50051706308162, 53, 921, 110.0, 180.60000000000014, 304.99999999999955, 569.2399999999996, 5.225191149055737, 1.9439696441115284, 1.618598321873396], "isController": false}, {"data": ["Get car brands-1", 10, 0, 0.0, 144.0, 83, 200, 145.0, 199.5, 200.0, 200.0, 0.11086720326393046, 0.062471070589148324, 0.03399638850085368], "isController": false}, {"data": ["Get car models-1", 10, 0, 0.0, 1354.0, 304, 2362, 1467.5, 2359.9, 2362.0, 2362.0, 0.10839755888697386, 0.05356363749688357, 0.034615236089883254], "isController": false}, {"data": ["Get car brands-0", 967, 0, 0.0, 128.00413650465381, 53, 921, 110.0, 174.20000000000005, 232.5999999999999, 569.2399999999996, 5.225191149055737, 1.9135221493124037, 1.6020289746170264], "isController": false}, {"data": ["Get expenses", 10, 0, 0.0, 116.1, 98, 126, 120.5, 125.9, 126.0, 126.0, 0.10862127021713393, 0.08814870659222489, 0.03426237332044361], "isController": false}, {"data": ["Get car models-0", 966, 0, 0.0, 133.7204968944102, 51, 1300, 107.5, 188.30000000000007, 285.29999999999995, 665.2000000000016, 5.2319724427786864, 1.982427058396612, 1.6705346794198253], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: code expected to match /200/", 1915, 51.36802575107296, 28.095657276995304], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 957, 25.6706008583691, 14.040492957746478], "isController": false}, {"data": ["429/Too Many Requests", 856, 22.96137339055794, 12.55868544600939], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6816, 3728, "Test failed: code expected to match /200/", 1915, "Test failed: code expected to contain /200/", 957, "429/Too Many Requests", 856, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get garage cars", 969, 959, "Test failed: code expected to match /200/", 959, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get car models", 966, 956, "Test failed: code expected to match /200/", 956, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Sign in", 972, 856, "429/Too Many Requests", 856, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get car brands", 967, 957, "Test failed: code expected to contain /200/", 957, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
