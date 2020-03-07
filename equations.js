var generateButton = document.getElementById("generate");
var hiddenDiv = document.getElementById("hiddenDiv");
var equationP = document.getElementById("equation");

function setUpHiddenDiv() {
    generateButton.addEventListener("click", function() {
        var equation = "";
        for (let component of components) {
            equation += par(component.getEquation());
        }
        equationP.textContent = "\\[" + equation + "=0\\]";
        MathJax.typeset();
        hiddenDiv.style.display = "initial";
    });
}

function fraction(numerator, denominator) {
    var gcd = function gcd(a,b){
        return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);

    numerator = numerator/gcd;
    denominator - denominator/gcd;

    if(numerator<0 && denominator<0) {
        numerator *= -1;
        denominator *= -1;
    }

    if (denominator == 1) {
        return numerator;
    } else if (numerator == 0) {
        return 0;
    } else {
        var negative = "";
        if(numerator<0 || denominator<0) {
            numerator = Math.abs(numerator);
            denominator = Math.abs(denominator);
            negative = "-";
        }
        return negative + "{" + numerator + " \\over " + denominator + "}";
    }
}

function multiply() {
    var factors = Array.prototype.slice.call(arguments);
    var product = "";
    for(let factor of factors) {
        if (factor == 0 || factor == "0") {
            return 0;
        } else if (factor != 1 || factor != "1") {
            product += factor;
        }
    }
    return product;
}

function divide(numerator, denominator) {
    return "{" + numerator + " \\over " + denominator + "}";
}

function add() {
    var addends = Array.prototype.slice.call(arguments);
    var sum = "";
    for(let addend of addends) {
        if(typeof addend == "number") {
            addend = addend.toString();
        }

        if (addend != "0" && addend != "-0") {
            if (addend.startsWith("-")) {
                sum += addend;
            } else if (sum == "") {
                sum += addend;
            } else {
                sum += "+" + addend;
            }
        }
    }
    return sum;
}

function restrict() {
    var restrictions = Array.prototype.slice.call(arguments);
    var product = "";
    for (let restriction of restrictions) {
        if (restriction.dir == "min") {
            product += par(add(restriction.value, neg(restriction.limit)));
        } else if (restriction.dir == "max") {
            product += par(add(restriction.limit, neg(restriction.value)));
        }
    }
    return "\\sqrt{|" + product + "|\\over" + product + "}";
}

function neg(expression) {
    if(typeof expression == "number") {
        expression = expression.toString();
    }

    if (expression.startsWith("-")) {
        return expression.substring(1);
    } else {
        return "-"+ expression;
    }
}

function par(expression) {
    return "\\left(" + expression + "\\right)";
}