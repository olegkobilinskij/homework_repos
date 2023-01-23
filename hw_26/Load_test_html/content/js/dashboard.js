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

    var data = {"OkPercent": 40.89442411364262, "KoPercent": 59.10557588635738};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.40062172903632, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008069336521219366, 500, 1500, "Get garage cars"], "isController": false}, {"data": [0.9808726838015541, 500, 1500, "Get garage cars-0"], "isController": false}, {"data": [0.03141091658084449, 500, 1500, "Get garage cars-1"], "isController": false}, {"data": [0.010654261704681874, 500, 1500, "Get car models"], "isController": false}, {"data": [8.908685968819599E-4, 500, 1500, "Sign in"], "isController": false}, {"data": [0.011022795440911818, 500, 1500, "Get car brands"], "isController": false}, {"data": [0.91875, 500, 1500, "Get car brands-1"], "isController": false}, {"data": [0.90625, 500, 1500, "Get car models-1"], "isController": false}, {"data": [0.9991001799640072, 500, 1500, "Get car brands-0"], "isController": false}, {"data": [0.03503348789283874, 500, 1500, "Get expenses"], "isController": false}, {"data": [0.998874549819928, 500, 1500, "Get car models-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50826, 30041, 59.10557588635738, 317.65472396018, 49, 66078, 123.0, 307.0, 400.0, 3369.920000000013, 19.313123698075984, 7.75034905492476, 5.314372807129623], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get garage cars", 6692, 6617, 98.87925881649731, 510.0681410639564, 102, 65799, 191.0, 367.0, 454.0, 4009.0699999999997, 2.5446376286958463, 1.20476750177482, 0.7410358157175863], "isController": false}, {"data": ["Get garage cars-0", 6692, 35, 0.5230125523012552, 463.44545726240256, 101, 65799, 163.0, 288.0, 340.0, 1732.1399999995629, 2.5446376286958463, 0.9144791478125699, 0.6409853231788654], "isController": false}, {"data": ["Get garage cars-1", 1942, 1867, 96.13800205973223, 160.49382080329542, 50, 4715, 94.0, 153.0, 210.69999999999982, 3401.459999999963, 0.7460992112171522, 0.29329655059259563, 0.10108729456819028], "isController": false}, {"data": ["Get car models", 6664, 6584, 98.79951980792318, 95.231392557023, 49, 4693, 79.0, 141.0, 161.0, 229.75000000000182, 2.535264100789683, 0.9756667527733255, 0.6941650905280266], "isController": false}, {"data": ["Sign in", 6735, 6484, 96.2731997030438, 967.4636971046742, 165, 66078, 277.0, 515.8000000000011, 1795.5999999999995, 14826.000000000016, 2.559301893883401, 1.2345882573453104, 1.0127337767667448], "isController": false}, {"data": ["Get car brands", 6668, 6588, 98.8002399520096, 92.39262147570511, 49, 5002, 78.0, 139.10000000000036, 155.0, 208.0, 2.5367241031017804, 0.9461252970702511, 0.6620402781988954], "isController": false}, {"data": ["Get car brands-1", 80, 0, 0.0, 324.3499999999999, 54, 4950, 82.5, 355.40000000000003, 1756.3000000000006, 4950.0, 0.032211371016611, 0.0181503526138521, 0.006431264457369258], "isController": false}, {"data": ["Get car models-1", 80, 0, 0.0, 402.8125000000001, 53, 4642, 93.0, 1030.3000000000004, 3717.1500000000065, 4642.0, 0.032209957386226375, 0.015916248474053266, 0.006839897689096607], "isController": false}, {"data": ["Get car brands-0", 6668, 0, 0.0, 88.49715056988587, 49, 771, 77.0, 137.0, 152.0, 191.0, 2.5367241031017804, 0.9289761119757497, 0.6559637601875076], "isController": false}, {"data": ["Get expenses", 1941, 1866, 96.13601236476043, 155.3240597630086, 51, 3862, 93.0, 152.0, 183.0, 2690.58, 0.7457992597337177, 0.2719491314522106, 0.11270229708861638], "isController": false}, {"data": ["Get car models-0", 6664, 0, 0.0, 90.39120648259305, 49, 1663, 79.0, 139.0, 157.0, 198.0, 2.535264100789683, 0.9606274131898408, 0.6877020383690764], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 31,522 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,746 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,674 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 34,249 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 65,799 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 64,888 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 32,725 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["429/Too Many Requests", 6478, 21.563862720948038, 12.745445244559871], "isController": false}, {"data": ["The operation lasted too long: It took 41,118 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,659 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 32,715 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,523 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6588, 21.93002896042076, 12.96186990910164], "isController": false}, {"data": ["The operation lasted too long: It took 45,545 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 64,604 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,620 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 65,387 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 64,132 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 32,199 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 34,738 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,630 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,510 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 49,550 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,556 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["Test failed: code expected to match /200/", 11334, 37.72843780167105, 22.299610435603824], "isController": false}, {"data": ["The operation lasted too long: It took 42,413 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 65,019 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 35,814 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 64,329 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 64,219 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,641 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 64,478 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 36,320 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,485 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,635 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["401/Unauthorized", 5600, 18.641190373156686, 11.017982922126471], "isController": false}, {"data": ["The operation lasted too long: It took 31,632 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,708 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 64,884 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 31,660 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 65,077 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 65,706 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 33,693 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 65,092 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}, {"data": ["The operation lasted too long: It took 35,253 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, 0.003328783995206551, 0.0019674969503797267], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50826, 30041, "Test failed: code expected to match /200/", 11334, "Test failed: code expected to contain /200/", 6588, "429/Too Many Requests", 6478, "401/Unauthorized", 5600, "The operation lasted too long: It took 31,522 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get garage cars", 6692, 6617, "Test failed: code expected to match /200/", 4750, "401/Unauthorized", 1867, "", "", "", "", "", ""], "isController": false}, {"data": ["Get garage cars-0", 6692, 35, "The operation lasted too long: It took 31,522 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, "The operation lasted too long: It took 31,746 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, "The operation lasted too long: It took 31,674 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, "The operation lasted too long: It took 34,249 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, "The operation lasted too long: It took 65,799 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1], "isController": false}, {"data": ["Get garage cars-1", 1942, 1867, "401/Unauthorized", 1867, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get car models", 6664, 6584, "Test failed: code expected to match /200/", 6584, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Sign in", 6735, 6484, "429/Too Many Requests", 6478, "The operation lasted too long: It took 49,550 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, "The operation lasted too long: It took 45,545 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, "The operation lasted too long: It took 36,320 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1, "The operation lasted too long: It took 32,199 milliseconds, but should not have lasted longer than 20,000 milliseconds.", 1], "isController": false}, {"data": ["Get car brands", 6668, 6588, "Test failed: code expected to contain /200/", 6588, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get expenses", 1941, 1866, "401/Unauthorized", 1866, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
