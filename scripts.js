/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var rownum;
var colnum;
var Ai;
var Bj;
var C;
var u;
var v;
var X;

function setRowCol() {
    rownum = parseInt(document.getElementById("rownum").value);
    colnum = parseInt(document.getElementById("colnum").value);
}

function addRow() {
    setRowCol();
    var tableSrc = document.getElementById("initTable").innerHTML;
    rownum++;
    if (2 === rownum) {
        document.getElementById("delrow").hidden = false;
    }
    var newRowSrc = "<tr id=\"row" + rownum + "\"><td><input type=\"text\" ";
    newRowSrc = newRowSrc + "size=\"2\" id=\"A" + rownum + "\"/></td>";
    for (var i = 1; i <= colnum; i++) {
        newRowSrc = newRowSrc + "<td><table class=\"inner-table\"><tr><td>";
        newRowSrc = newRowSrc + "<input type=\"text\" size=\"2\" ";
        newRowSrc = newRowSrc + "id=\"C" + rownum + "_" + i + "\"></td><td>";
        newRowSrc = newRowSrc + "</td></tr><tr><td id=\"CK" + rownum + "_" + i;
        newRowSrc = newRowSrc + "\"></td><td id=\"X" + rownum + "_" + i + "\">";
        newRowSrc = newRowSrc + "</td></tr></table></td>";
    }
    newRowSrc = newRowSrc + "</tr>";
    document.getElementById("initTable").innerHTML = tableSrc + newRowSrc;
    document.getElementById("rownum").value = rownum;
}

function deleteRow() {
    setRowCol();
    var toDelete = document.getElementById("row" + rownum);
    toDelete.parentNode.parentNode.removeChild(toDelete.parentNode);
    rownum--;
    if (1 === rownum) {
        document.getElementById("delrow").hidden = true;
    }
    document.getElementById("rownum").value = rownum;
}

function addColumn() {
    setRowCol();
    colnum++;
    if (2 === colnum) {
        document.getElementById("delcol").hidden = false;
    }
    var rowSrc;
    rowSrc = document.getElementById("row0").innerHTML;
    rowSrc = rowSrc + "<td><input type=\"text\" size=\"2\" id=\"T" + colnum;
    rowSrc = rowSrc + "\"/></td>";
    document.getElementById("row0").innerHTML = rowSrc;
    for (var i = 1; i <= rownum; i++) {
        rowSrc = document.getElementById("row" + i).innerHTML;
        rowSrc = rowSrc + "<td><table class=\"inner-table\"><tr><td><input ";
        rowSrc = rowSrc + "type=\"text\" size=\"2\" id=\"C" + i + "_" + colnum;
        rowSrc = rowSrc + "\"/></td><td></td></tr><tr><td id=\"CK" + i;
        rowSrc = rowSrc + "_" + colnum + "\"></td><td id=\"X" + i;
        rowSrc = rowSrc + "_" + colnum + "\"></td>";
        document.getElementById("row" + i).innerHTML = rowSrc;
    }
    document.getElementById("colnum").value = colnum;
}

function drawUV(u, v) {
    var tableSrc = document.getElementById("initTable").innerHTML;
    var newRowSrc = "<tr class=\"v\"><td></td>";
    for (var i = 0; i < colnum; i++) {
        newRowSrc = newRowSrc + "<td id=\"v" + (i + 1) + "\">V<sub>" + (i + 1);
        newRowSrc = newRowSrc + "</sub> = " + v[i] + "</td>";
    }
    newRowSrc = newRowSrc + "<td class=\"u\"></td></tr>";
    document.getElementById("initTable").innerHTML = tableSrc + newRowSrc;
    var rowSrc = document.getElementById("row0").innerHTML;
    rowSrc = rowSrc + "<td class=\"u\"></td>";
    document.getElementById("row0").innerHTML = rowSrc;
    for (var i = 1; i <= rownum; i++) {
        rowSrc = document.getElementById("row" + i).innerHTML;
        rowSrc = rowSrc + "<td id=\"u" + i + "\" class=\"u\">U<sub>" + i;
        rowSrc = rowSrc + "</sub> = " + u [i - 1] + "</td>";
        document.getElementById("row" + i).innerHTML = rowSrc;
    }
    for (var i = 0; i < rownum; i++) {
        for (var j = 0; j < colnum; j++) {
            document.getElementById("C" + (i + 1) + "_" + (j + 1)).value = C[i][j];
        }
    }
    for (var i = 0; i < rownum; i++) {
        document.getElementById("A" + (i + 1)).value = Ai[i];
    }
    for (var i = 0; i < colnum; i++) {
        document.getElementById("T" + (i + 1)).value = Bj[i];
    }
}

function deleteColumn() {
    setRowCol();
    colnum--;
    if (1 === colnum) {
        document.getElementById("delcol").hidden = true;
    }
    var curRow;
    for (var i = 0; i <= rownum; i++) {
        curRow = document.getElementById("row" + i).childNodes;
        curRow[curRow.length - 1].parentNode.removeChild(curRow[curRow.length - 1]);
    }
    document.getElementById("colnum").value = colnum;
}

function makeUV() {
    u = new Array(rownum);
    v = new Array(colnum);
    for (var i = 0; i < rownum; i++) {
        u[i] = NaN;
    }
    for (var i = 0; i < colnum; i++) {
        v[i] = NaN;
    }
    var stacku = new Array();
    var stackv = new Array();
    var uDone = false;
    while (!uDone) {
        for (var i = 0; i < u.length; i++) {
            if (isNaN(u[i])) {
                stacku.push(i);
                u[i] = 0;
                uDone = false;
                break;
            }
            uDone = true;
        }
        while (stacku.length !== 0 || stackv.length !== 0) {
            if (stacku.length !== 0) {
                var currentIndex = stacku.pop();
                for (var i = 0; i < v.length; i++) {
                    if (X.hasOwnProperty([currentIndex, i]) && isNaN(v[i])) {
                        v[i] = -u[currentIndex] - C[currentIndex][i];
                        stackv.push(i);
                    }
                }
            } else {
                var currentIndex = stackv.pop();
                for (var i = 0; i < u.length; i++) {
                    if (X.hasOwnProperty([i, currentIndex]) && isNaN(u[i])) {
                        u[i] = -v[currentIndex] - C[i][currentIndex];
                        stacku.push(i);
                    }
                }
            }
        }
    }
}

function solve() {
    setRowCol();
    makeArrays();
    var satisfied = [];
    var empty = [];
    var min;
    var minI;
    var minJ;
    X = {};
    while (satisfied.length !== colnum) {
        min = 9007199254740992;
        for (var i = 0; i < rownum; i++) {
            if (empty.indexOf(i) < 0) {
                for (var j = 0; j < colnum; j++) {
                    if (satisfied.indexOf(j) < 0) {
                        if (C[i][j] < min) {
                            min = C[i][j];
                            minI = i;
                            minJ = j;
                        }
                    }
                }
            }
        }
        if (Ai[minI] >= Bj[minJ]) {
            X[[minI, minJ]] = Bj[minJ];
            document.getElementById("X" + (minI + 1) + "_" + (minJ + 1)).innerHTML = Bj[minJ];
            Ai[minI] = Ai[minI] - Bj[minJ];
            Bj[minJ] = 0;
            satisfied[satisfied.length] = minJ;
        } else {
            X[[minI, minJ]] = Ai[minI];
            document.getElementById("X" + (minI + 1) + "_" + (minJ + 1)).innerHTML = Ai[minI];
            Bj[minJ] = Bj[minJ] - Ai[minI];
            Ai[minI] = 0;
            empty[empty.length] = minI;
        }
    }
    makeUV();
    makeArrays();
    drawUV(u, v);
    var isOptimal = true;
    var Ck = new Array(rownum);
    for (var i = 0; i < rownum; i++) {
        Ck[i] = new Array(colnum);
        for (var j = 0; j < colnum; j++) {
            Ck[i][j] = u[i] + v[j] + C[i][j];
            if (Ck[i][j] < 0) {
                isOptimal = false;
            }
            document.getElementById("CK" + (i + 1) + "_" + (j + 1)).innerHTML = Ck[i][j];
        }
    }
    if (isOptimal) {
        document.getElementById("solution").innerHTML = "Found solution is optimal";
    } else {
        var min = 9007199254740992;
        var minI;
        var minJ;
        for (var i = 0; i < rownum; i++) {
            for (var j = 0; j < colnum; j++) {
                if (Ck[i][j] < min) {
                    min = Ck[i][j];
                    minI = i;
                    minJ = j;
                }
            }
        }
        countourComplete = false;
        var turningPoints = [];
        turningPoints = makeContour(Ck, [[minI, minJ]], 0);
        drawContour(turningPoints, "");
        var displace = X[turningPoints[1]];
        var remove = turningPoints[1];
        for (var i = 3; i < (turningPoints.length - 1); i = i + 2) {
            if (X[turningPoints[i]] < displace) {
                displace = X[turningPoints[i]];
                remove = turningPoints[i];
            }
        }
        X[turningPoints[0]] = displace;
        for (var i = 1; i < (turningPoints.length - 1); i++) {
            if (i % 2 === 0) {
                X[turningPoints[i]] = X[turningPoints[i]] + displace;
            } else {
                X[turningPoints[i]] = X[turningPoints[i]] - displace;
            }
        }
        delete X[remove];
        var resultSrc = "";
        var count = 0;
        while (!isOptimal) {
            resultSrc = document.getElementById("solution").innerHTML;
            isOptimal = true;
            resultSrc = resultSrc + "Solution is not optimal</br>New base ";
            resultSrc = resultSrc + "square: [" + (turningPoints[0][0] + 1) + ", ";
            resultSrc = resultSrc + (turningPoints[0][1] + 1) + "]<br/>Minimum ";
            resultSrc = resultSrc + "X in minus-squares: " + displace + "<br/>";
            makeUV();
            for (var i = 0; i < rownum; i++) {
                for (var j = 0; j < colnum; j++) {
                    Ck[i][j] = u[i] + v[j] + C[i][j];
                    if (Ck[i][j] < 0) {
                        isOptimal = false;
                    }
                }
            }
            var contPoints;
            if (isOptimal) {
                turningPoints = [];
                contPoints = [];
            } else {
                var min = 9007199254740992;
                var minI;
                var minJ;
                for (var i = 0; i < rownum; i++) {
                    for (var j = 0; j < colnum; j++) {
                        if (Ck[i][j] < min) {
                            min = Ck[i][j];
                            minI = i;
                            minJ = j;
                        }
                    }
                }
                countourComplete = false;
                turningPoints = makeContour(Ck, [[minI, minJ]], 0);
            }
            resultSrc = resultSrc + "<table class=\"outer-table\" id=\"table";
            resultSrc = resultSrc + count + "\"><tr id=\"t" + count + "row0\">";
            resultSrc = resultSrc + "<td><table class=\"inner-table\"><tr><td>";
            resultSrc = resultSrc + "</td><td>T<sub>j</sub></td></tr><tr><td>";
            resultSrc = resultSrc + "A<sub>i</sub></td><td></td></tr></table>";
            resultSrc = resultSrc + "</td>";
            for (var i = 0; i < colnum; i++) {
                resultSrc = resultSrc + "<td>" + Bj[i] + "</td>";
            }
            resultSrc = resultSrc + "<td class=\"u\"></td>";
            resultSrc = resultSrc + "</tr>";
            for (var i = 0; i < rownum; i++) {
                resultSrc = resultSrc + "<tr id=\"t" + count + "row" + (i + 1);
                resultSrc = resultSrc + "\"><td>" + Ai[i] + "</td>";
                for (var j = 0; j < colnum; j++) {
                    resultSrc = resultSrc + "<td><table class=\"inner-table\">";
                    resultSrc = resultSrc + "<tr><td id=\"t" + count + "C";
                    resultSrc = resultSrc + (i + 1) + "_" + (j + 1) + "\">" + C[i][j];
                    resultSrc = resultSrc + "</td><td></td></tr><tr><td id=\"";
                    resultSrc = resultSrc + "t" + count + "CK" + (i + 1) + "_";
                    resultSrc = resultSrc + (j + 1) + "\">";
                    resultSrc = resultSrc + Ck[i][j];
                    resultSrc = resultSrc + "</td><td id=\"t" + count;
                    resultSrc = resultSrc + "X" + (i + 1) + "_" + (j + 1) + "\">";
                    if (X.hasOwnProperty([i, j])) {
                        resultSrc = resultSrc + X[[i, j]];
                    }
                    resultSrc = resultSrc + "</td></tr></table></td>";
                }
                resultSrc = resultSrc + "<td class=\"u\">U<sub>" + (i + 1);
                resultSrc = resultSrc + "</sub> = " + u[i] + "</td></tr>";
            }
            resultSrc = resultSrc + "<tr class=\"v\"><td></td>";
            for (var i = 0; i < v.length; i++) {
                resultSrc = resultSrc + "<td>V<sub>" + (i+1) + "</sub> = " + v[i];
                resultSrc = resultSrc + "</td>";
            }
            resultSrc = resultSrc + "<td class=\"u\"></td></tr></table><br/>";
            if (!isOptimal) {
                document.getElementById("solution").innerHTML = resultSrc;
                drawContour(turningPoints, "t" + count);
                displace = X[turningPoints[1]];
                remove = turningPoints[1];
                for (var i = 3; i < (turningPoints.length - 1); i = i + 2) {
                    if (X[turningPoints[i]] < displace) {
                        displace = X[turningPoints[i]];
                    }
                }
                X[turningPoints[0]] = displace;
                for (var i = 1; i < (turningPoints.length - 1); i++) {
                    if (i % 2 === 0) {
                        X[turningPoints[i]] = X[turningPoints[i]] + displace;
                    } else {
                        X[turningPoints[i]] = X[turningPoints[i]] - displace;
                    }
                }
                delete X[remove];
            } else {
                resultSrc = resultSrc + "Found solution is optimal";
                document.getElementById("solution").innerHTML = resultSrc;
            }
            count++;
        }
    }
}

function drawContour(points, prefix) {
    for (var i = 1; i < points.length; i++) {
        if (points[i][0] === points[i - 1][0]) {
            if (points[i][1] > points [i - 1][1]) {
                for (var j = (points[i - 1][1] + 1); j < points[i][1]; j++) {
                    document.getElementById(prefix + "C" + (points[i][0] + 1) + "_" + (j + 1)).className = "passby";
                }
            } else {
                for (var j = (points[i][1] + 1); j < points[i - 1][1]; j++) {
                    document.getElementById(prefix + "C" + (points[i][0] + 1) + "_" + (j + 1)).className = "passby";
                }
            }
        } else {
            if (points[i][0] > points [i - 1][0]) {
                for (var j = (points[i - 1][0] + 1); j < points[i][0]; j++) {
                    document.getElementById(prefix + "C" + (j + 1) + "_" + (points[i][1] + 1)).className = "passby";
                }
            } else {
                for (var j = (points[i][0] + 1); j < points[i - 1][0]; j++) {
                    document.getElementById(prefix + "C" + (j + 1) + "_" + (points[i][1] + 1)).className = "passby";
                }
            }
        }
        document.getElementById(prefix + "C" + (points[i][0] + 1) + "_" + (points[i][1] + 1)).className = "turnpoint";
    }
}

var countourComplete;

function makeContour(c, points, i) {
    var lim;
    if (i === 0) {
        lim = rownum;
    } else {
        lim = colnum;
    }
    var currentPoint = [];
    currentPoint[0] = points[points.length - 1][0];
    currentPoint[1] = points[points.length - 1][1];
    currentPoint[i]--;
    while (currentPoint[i] >= 0) {
        points = checkPoints(c, points, currentPoint, i);
        if (countourComplete) {
            return points;
        }
        currentPoint[i]--;
    }
    currentPoint[0] = points[points.length - 1][0];
    currentPoint[1] = points[points.length - 1][1];
    currentPoint[i]++;
    while (currentPoint[i] < lim) {
        points = checkPoints(c, points, currentPoint, i);
        if (countourComplete) {
            return points;
        }
        currentPoint[i]++;
    }
    return points;
}

function checkPoints(c, points, currentPoint, i) {
    if (i === 0) {
        i = 1;
    } else {
        i = 0;
    }
    if (currentPoint[0] === points[0][0] && currentPoint[1] === points[0][1]) {
        countourComplete = true;
        points.push(currentPoint);
        return points;
    } else if (c[currentPoint[0]][currentPoint[1]] === 0 && X.hasOwnProperty([currentPoint[0], currentPoint[1]])) {
        points.push(currentPoint);
        points = makeContour(c, points, i);
        if (countourComplete) {
            return points;
        } else {
            points.pop();
            return points;
        }
    } else {
        return points;
    }
}

function makeArrays() {
    Ai = [];
    for (var i = 0; i < rownum; i++) {
        Ai[i] = parseInt(document.getElementById("A" + (i + 1)).value);
    }
    Bj = [];
    for (var i = 0; i < colnum; i++) {
        Bj[i] = parseInt(document.getElementById("T" + (i + 1)).value);
    }
    C = [];
    for (var i = 0; i < rownum; i++) {
        C[i] = [];
        for (var j = 0; j < colnum; j++) {
            C[i][j] = parseInt(document.getElementById("C" + (i + 1) + "_" + (j + 1)).value);
        }
    }
}