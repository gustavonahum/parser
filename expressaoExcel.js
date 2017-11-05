expressaoExcel
  = (simboloIgual:"=" func:funcaoMatematica {
      return func;
    }
    / simboloIgual:"=" func:expressoesNumericas {
      return func;
    }
    / simboloIgual:"=" func:funcaoLogica {
      return func;
    })?

expressoesNumericas
  = expr:expressao _ {
    return expr;
  }

funcaoMatematica
  = func:nomeFuncaoMatematica "("  _ expr:expressao _ ")" _ {
      if (func === "ASIN" || func === "asin") { return Math.asin(expr); }
      if (func === "SIN" || func === "sin") { return Math.sin(expr); }
      if (func === "SQRT" || func === "sqrt") { return Math.sqrt(expr); }

    }

nomeFuncaoMatematica
  = "ASIN" / "asin"
    / "SIN" / "sin"
    / "SQRT" / "sqrt"

funcaoLogica
  = func:nomeFuncaoLogica "(" _ explog:expressaoLogica _ ";" _ exp1:expressao _ ";" _ exp2:expressao _ ")" _ {
      if (func === "IF" || func === "if") {
            if (explog) { return exp1; }
            return exp2;
        }
    }

nomeFuncaoLogica
  = "IF" / "if"


expressaoLogica
  = cabeca:expressao _ comparador1:Comparador comparador2:Comparador ? _ cauda:expressao {
        if(comparador1 == ">") { return (cabeca > cauda); }
          if(comparador1 == "<") { return (cabeca < cauda); }
          if(comparador1 == "=") { return (cabeca === cauda); }
          if(comparador1 == "<=") { return (cabeca <= cauda); }
          if(comparador1 == ">=") { return (cabeca >= cauda); }
          if(comparador1 == "<>") { return (cabeca !== cauda); }
   }

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
  / numeroInteiro
  / funcaoMatematica

numeroReal "numeroReal"
  = ("-"?(digito+)(".")(digito+)) { return parseFloat(text()); }

numeroInteiro "numeroInteiro"
  = ("-"?(digito+)) { return parseInt(text(),10); }

Comparador
  = ( "<" / ">" / "=" / ">=" / "<=" / "<>" )

digito = [0-9]

_ "whitespace"
  = [ \t\n\r]*
