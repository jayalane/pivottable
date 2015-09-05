(function() {
  var callWithJQuery,
    hasProp = {}.hasOwnProperty;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    return $.pivotUtilities.datatables_renderers = {
      "Datatable": function(pivotData, opts) {
        var aggregator, c, colAttrs, colKey, colKeys, defaults, i, j, r, result, rowAttrs, rowKey, rowKeys, spanSize, tbody, td, tfoot, th, thead, totalAggregator, tr, txt, val, x;
        defaults = {
          localeStrings: {
            totals: "Totals"
          }
        };
        opts = $.extend(defaults, opts);
        colAttrs = pivotData.colAttrs;
        rowAttrs = pivotData.rowAttrs;
        rowKeys = pivotData.getRowKeys();
        colKeys = pivotData.getColKeys();
        result = document.createElement("table");
        result.className = "pvtTable";
        thead = document.createElement("thead");
        tbody = document.createElement("tbody");
        tfoot = document.createElement("tfoot");
        spanSize = function(arr, i, j) {
          var k, l, len, noDraw, ref, ref1, stop, x;
          if (i !== 0) {
            noDraw = true;
            for (x = k = 0, ref = j; 0 <= ref ? k <= ref : k >= ref; x = 0 <= ref ? ++k : --k) {
              if (arr[i - 1][x] !== arr[i][x]) {
                noDraw = false;
              }
            }
            if (noDraw) {
              return -1;
            }
          }
          len = 0;
          while (i + len < arr.length) {
            stop = false;
            for (x = l = 0, ref1 = j; 0 <= ref1 ? l <= ref1 : l >= ref1; x = 0 <= ref1 ? ++l : --l) {
              if (arr[i][x] !== arr[i + len][x]) {
                stop = true;
              }
            }
            if (stop) {
              break;
            }
            len++;
          }
          return len;
        };
        for (j in colAttrs) {
          if (!hasProp.call(colAttrs, j)) continue;
          c = colAttrs[j];
          tr = document.createElement("tr");
          if (parseInt(j) === 0 && rowAttrs.length !== 0) {
            th = document.createElement("th");
            th.setAttribute("colspan", rowAttrs.length);
            th.setAttribute("rowspan", colAttrs.length);
            tr.appendChild(th);
          }
          th = document.createElement("th");
          th.className = "pvtAxisLabel";
          th.innerHTML = c;
          tr.appendChild(th);
          for (i in colKeys) {
            if (!hasProp.call(colKeys, i)) continue;
            colKey = colKeys[i];
            x = spanSize(colKeys, parseInt(i), parseInt(j));
            if (x !== -1) {
              th = document.createElement("th");
              th.className = "pvtColLabel";
              th.innerHTML = colKey[j];
              th.setAttribute("colspan", x);
              if (parseInt(j) === colAttrs.length - 1 && rowAttrs.length !== 0) {
                th.setAttribute("rowspan", 2);
              }
              tr.appendChild(th);
            }
          }
          if (parseInt(j) === 0) {
            th = document.createElement("th");
            th.className = "pvtTotalLabel";
            th.innerHTML = opts.localeStrings.totals;
            th.setAttribute("rowspan", colAttrs.length + (rowAttrs.length === 0 ? 0 : 1));
            tr.appendChild(th);
          }
          thead.appendChild(tr);
        }
        if (rowAttrs.length !== 0) {
          tr = document.createElement("tr");
          for (i in rowAttrs) {
            if (!hasProp.call(rowAttrs, i)) continue;
            r = rowAttrs[i];
            th = document.createElement("th");
            th.className = "pvtAxisLabel";
            th.innerHTML = r;
            tr.appendChild(th);
          }
          th = document.createElement("th");
          if (colAttrs.length === 0) {
            th.className = "pvtTotalLabel";
            th.innerHTML = opts.localeStrings.totals;
          }
          tr.appendChild(th);
          thead.appendChild(tr);
        }
        for (i in rowKeys) {
          if (!hasProp.call(rowKeys, i)) continue;
          rowKey = rowKeys[i];
          tr = document.createElement("tr");
          for (j in rowKey) {
            if (!hasProp.call(rowKey, j)) continue;
            txt = rowKey[j];
            th = document.createElement('th');
            th.className = 'pvtRowLabel';
            th.innerHTML = txt;
            tr.appendChild(th);
            if (parseInt(j) === rowAttrs.length - 1 && colAttrs.length !== 0) {
              tr.appendChild(document.createElement('th'));
            }
          }
          for (j in colKeys) {
            if (!hasProp.call(colKeys, j)) continue;
            colKey = colKeys[j];
            aggregator = pivotData.getAggregator(rowKey, colKey);
            val = aggregator.value();
            td = document.createElement("td");
            td.className = "pvtVal row" + i + " col" + j;
            td.innerHTML = aggregator.format(val);
            td.setAttribute("data-value", val);
            tr.appendChild(td);
          }
          totalAggregator = pivotData.getAggregator(rowKey, []);
          val = totalAggregator.value();
          td = document.createElement("td");
          td.className = "pvtTotal rowTotal";
          td.innerHTML = totalAggregator.format(val);
          td.setAttribute("data-value", val);
          td.setAttribute("data-for", "row" + i);
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
        tr = document.createElement("tr");
        th = document.createElement("th");
        th.className = "pvtTotalLabel";
        th.innerHTML = opts.localeStrings.totals;
        th.setAttribute("colspan", rowAttrs.length + (colAttrs.length === 0 ? 0 : 1));
        tr.appendChild(th);
        for (j in colKeys) {
          if (!hasProp.call(colKeys, j)) continue;
          colKey = colKeys[j];
          totalAggregator = pivotData.getAggregator([], colKey);
          val = totalAggregator.value();
          td = document.createElement("td");
          td.className = "pvtTotal colTotal";
          td.innerHTML = totalAggregator.format(val);
          td.setAttribute("data-value", val);
          td.setAttribute("data-for", "col" + j);
          tr.appendChild(td);
        }
        totalAggregator = pivotData.getAggregator([], []);
        val = totalAggregator.value();
        td = document.createElement('td');
        td.className = 'pvtGrandTotal';
        td.innerHTML = totalAggregator.format(val);
        td.setAttribute("data-value", val);
        tr.appendChild(td);
        result.appendChild(thead);
        result.appendChild(tbody);
        tfoot.appendChild(tr);
        result.appendChild(tfoot);
        result.setAttribute("data-numrows", rowKeys.length);
        result.setAttribute("data-numcols", colKeys.length);
        return result;
      }
    };
  });

}).call(this);

//# sourceMappingURL=datatables_renderers.js.map