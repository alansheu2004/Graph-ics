var generateButton = document.getElementById("generate");
var hidden = document.getElementById("hidden");
var equationP = document.getElementById("equation");

function setUpHidden() {
    generateButton.addEventListener("click", function() {
        hidden.style.display = "block";
        window.scrollTo(0, hidden.getBoundingClientRect().top - 15);
        setUpEquation();
    });
}

function setUpEquation() {
    equationP.parentNode.children[1].style.display = "initial";
    var equation = "";
    for (let component of components) {
        equation += par(component.getEquation());
    }
    equationP.textContent = "\\[" + equation + "=0\\]";
    MathJax.typesetPromise()
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
    if (isConstant(numerator) && isConstant(denominator)) {
        var gcd = function gcd(a,b){
            return b ? gcd(b, a%b) : a;
        };
        gcd = gcd(numerator,denominator);
        gcd = Math.abs(gcd)<0.1 ? 1 : gcd;

        num = numerator/gcd;
        den = denominator/gcd;

        if(num<0 && den<0) {
            num *= -1;
            den *= -1;
        }

        if (den == 1) {
            return num;
        } else if (num == 0) {
            return 0;
        } else {
            var negative = "";
            if(num<0 || den<0) {
                num = Math.abs(num);
                den = Math.abs(den);
                negative = "-";
            }

            return negative + "{" + round(num) + " \\over " + round(den) + "}";
        }
    }

    if (denominator == 1 || denominator == "1") {
        return numerator;
    } else if (numerator == 0 || numerator == "0" || numerator == "-0") {
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

function add() {
    var addends = Array.prototype.slice.call(arguments);
    var sum = "";
    var constant = 0;
    for(let addend of addends) {
        if(typeof addend == "number") {
            addend = addend.toString();
        }

        if (addend != "0" && addend != "-0") {
            if (isConstant(addend)) {
                constant += Number(addend);
            } else if (addend.startsWith("-")) {
                sum += addend;
            } else if (sum == "") {
                sum += addend;
            } else {
                sum += "+" + addend;
            }
        }
    }

    if (constant != 0) {
        if(constant > 0 && sum != "") {
            sum += "+" + constant;
        } else {
            sum += constant;
        }
    }

    return sum;
}

function restrict() {
    var restrictions = Array.prototype.slice.call(arguments);
    var product = "";
    if (restrictions.length > 1) {
        for (let restriction of restrictions) {
            if (restriction.dir == "min") {
                product += par(add(restriction.value, neg(restriction.limit)));
            } else if (restriction.dir == "max") {
                product += par(add(restriction.limit, neg(restriction.value)));
            }
        }
    } else {
        if (restrictions[0].dir == "min") {
            product = add(restrictions[0].value, neg(restrictions[0].limit));
        } else if (restrictions[0].dir == "max") {
            product = add(restrictions[0].limit, neg(restrictions[0].value));
        }
    }
    
    return "\\sqrt{|" + product + "| \\over " + product + "}";
}

function neg(expression) {
    if(typeof expression == "number") {
        expression = expression.toString();
    }

    if(isConstant(expression)) {
        if (expression.startsWith("-")) {
            return expression.substring(1);
        } else {
            return "-"+ expression;
        }
    } else {
        if (expression.match(/[^(]*[\+-][^)]*/g) == null) {
            return "-" + expression;
        } else {
            return "- \\left(" + expression + "\\right)";    
        }
    }  
}

function isConstant(expression) {
    if(typeof expression == "number") {
        expression = expression.toString();
    }

    return expression.match(/^[-]?\d*\.?\d*$/g) != null;
}

function par(expression) {
    return "\\left(" + expression + "\\right)";
}