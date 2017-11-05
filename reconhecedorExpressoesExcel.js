expressaoExcel
  = (simboloIgual:"=" cabeca:funcao {
      return cabeca;
    })?

funcao
  = func:nomeFuncao "(" _ expr:expressao _ ")" _ {
      if (func === "ASIN" || func === "asin") {
          return Math.asin(expr);
        }
        if (func === "SIN" || func === "sin") {
          return Math.sin(expr);
        }
        if (func === "SQRT" || func === "sqrt") {
          return Math.sqrt(expr);
        }
    }
 
nomeFuncao
  = "ASIN" / "asin"
    / "SIN" / "sin"
    / "SQRT" / "sqrt"

expressao
  = cabeca:termo cauda:(_ ("+" / "-") _ termo)* {
      return cauda.reduce(function(resultado, elemento) {
        if (elemento[1] === "+") { return resultado + elemento[3]; }
        if (elemento[1] === "-") { return resultado - elemento[3]; }
      }, cabeca);
    }

termo
  = cabeca:fator cauda:(_ ("*" / "/") _ fator)* {
      return cauda.reduce(function(resultado, elemento) {
        if (elemento[1] === "*") { return resultado * elemento[3]; }
        if (elemento[1] === "/") { return resultado / elemento[3]; }
      }, cabeca);
    }

fator
  = "(" _ expr:expressao _ ")" { return expr; }
  / numeroReal
  /numeroInteiro
  / funcao

numeroReal "numeroReal"
  = ("-"?(inteiro+)(".")(inteiro+)) { return parseFloat(text()); }

numeroInteiro "numeroInteiro"
  = ("-"?(inteiro+)) { return parseInt(text(),10); }

inteiro = [0-9]

_ "whitespace"
  = [ \t\n\r]*
