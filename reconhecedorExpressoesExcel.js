expressaoExcel
	= cabeca:termo cauda:(termo)* {
      return cauda.reduce(function(result, element) {
      }, cabeca);
    }
    
termo
	= "=ASIN(" _ (numeroModuloMenorQueUm) _ ")" _
    / "=asin(" _ (numeroModuloMenorQueUm) _ ")" _ 
    / "=SIN(" _ (numeroReal) _ ")" _
    / "=sin(" _ (numeroReal) _ ")" _
    / "=SQRT(" _ (numeroPositivo) _ ")" _
    / "=sqrt(" _ (numeroPositivo) _ ")" _


numeroReal = ("-"?(inteiro+)(".")(inteiro+) / "-"?(inteiro+))
numeroPositivo = ((inteiro+)(".")(inteiro+) / (inteiro+))
numeroModuloMenorQueUm = ("-"?("0.")(inteiro+) / "-"?"1."("0"*) / "-"?"1")
inteiroPositivo = ([1-9])([0-9]*)
letra = [a-zA-Z]
inteiro = [0-9]

_ "whitespace"
  = [ \t\n\r]*
