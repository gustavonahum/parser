expressaoExcel
  = cabeca:funcPrincipal cauda:(Expression)* {
      return cauda.reduce(function(result, element) {
      }, cabeca);
    }
    
funcPrincipal
  = "=" funcao

funcao
  = nomeFuncao "(" _ Expression _ ")" _
 
nomeFuncao
  = "ASIN" / "asin"
    / "SIN" / "sin"
    / "SQRT" / "sqrt"

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return result + element[3]; }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
        if (element[1] === "/") { return result / element[3]; }
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Integer
  / funcao

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

numeroReal = ("-"?(inteiro+)(".")(inteiro+) / "-"?(inteiro+))
numeroPositivo = ((inteiro+)(".")(inteiro+) / (inteiro+))
numeroModuloMenorQueUm = ("-"?("0.")(inteiro+) / "-"?"1."("0"*) / "-"?"1")
inteiroPositivo = ([1-9])([0-9]*)
letra = [a-zA-Z]
inteiro = [0-9]

_ "whitespace"
  = [ \t\n\r]*
