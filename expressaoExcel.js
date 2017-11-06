expressaoExcel
  = (simboloIgual:"=" expr:expressoesNumericas {
      return expr;
    }
    / simboloIgual:"=" func:funcaoMatUmArg {
      return func;
    }
    / simboloIgual:"=" func:funcaoMatMultArg {
      return func;
    }
    / simboloIgual:"=" func:funcaoLogicaSe {
      return func;
    }
    / simboloIgual:"=" func:funcaoLogicaMultArg {
      return func;
    })?

expressoesNumericas
  = expr:expressao _ {
    return expr;
  }

funcaoMatUmArg
  = func:nomeFuncaoMatUmArg _ "("  _ expr:expressao _ ")" _ {
      if (func === "ASIN" || func === "asin") { return Math.asin(expr); }
      if (func === "SIN" || func === "sin") { return Math.sin(expr); }
      if (func === "SQRT" || func === "sqrt") { return Math.sqrt(expr); }
    }
nomeFuncaoMatUmArg
  = "ASIN" / "asin"
  / "SIN" / "sin"
  / "SQRT" / "sqrt"

funcaoMatMultArg
  = func:nomeFuncaoMatMultArg _ "(" cabeca:expressao cauda:(_ (";") _ expressao)* ")" {
      return cauda.reduce(function(resultado, elemento) {
        if (func === "SUM" || func === "sum") { return resultado + elemento[3]; }
        if (func === "PRODUCT" || func === "product") { return resultado * elemento[3]; }
      }, cabeca);
    }
nomeFuncaoMatMultArg
  = "SUM" / "sum"
  / "PRODUCT" / "product"

funcaoLogicaSe
  = func:nomeFuncaoLogica _ "(" _ explog:expressaoLogica _ ";" _ exp1:expressao _ ";" _ exp2:expressao _ ")" _ {
      if (func === "IF" || func === "if") {
            if (explog) { return exp1; }
            return exp2;
        }
    }

nomeFuncaoLogica
  = "IF" / "if"

funcaoLogicaMultArg
  = func:nomeFuncaoLogicaMultArg _ "(" cabeca:expressaoLogica cauda:(_ (";") _ expressaoLogica)* ")" {
      return cauda.reduce(function(resultado, elemento) {
        if (func === "AND" || func === "and") { return resultado && elemento[3]; }
        if (func === "OR" || func === "or") { return resultado || elemento[3]; }
      }, cabeca);
    } 

nomeFuncaoLogicaMultArg
  = "AND" / "and"
  / "OR" / "or"

expressaoLogica
  = cabeca:expressao _ comparador1:Comparador comparador2:Comparador ? _ cauda:expressao {
          if(comparador1 == ">") { return (cabeca > cauda); }
          if(comparador1 == "<") { return (cabeca < cauda); }
          if(comparador1 == "=") { return (cabeca === cauda); }
          if(comparador1 == "<=") { return (cabeca <= cauda); }
          if(comparador1 == ">=") { return (cabeca >= cauda); }
          if(comparador1 == "<>") { return (cabeca !== cauda); }
   }
   / funcaoLogicaMultArg

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
  / funcaoMatUmArg
  / funcaoMatMultArg

numeroReal "numeroReal"
  = ("-"?(digito+)(".")(digito+)) { return parseFloat(text()); }

numeroInteiro "numeroInteiro"
  = ("-"?(digito+)) { return parseInt(text(),10); }

Comparador
  = ( "<" / ">" / "=" / ">=" / "<=" / "<>" )

digito = [0-9]

_ "whitespace"
  = [ \t\n\r]*