/*
 * O Parse reconhece expressoes numericas, matematicas e logicas, alem de expressoes em formato de datas.
 * Sempre que a expressao for matematica ou logica, deve-se inicia-la com "="
 * Caso seja uma data, apenas deve-se dividi-la em dias, meses e anos adequadamente
 * Alem disso, reconhece tambem a expressao vazia (nenhum caracter)
 */
expressaoExcel
  = (
    simboloIgual:"=" expr:expressoesNumericas {
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
    }
    / data:formatoData {
      return data;
    }
    )?

/*
 * Expressoes numericas. Elas podem comecar e terminar com espacos.
 */
expressoesNumericas
  = _ expr:expressao _ {
    return expr;
  }

/*
 * Algumas funcoes matematicas, que recebem apenas um argumento.
 * Utilizam-se as funcoes da bilioteca de matematica do JavaScript para
 * obterem-se os valores de retorno.
 */
funcaoMatUmArg
  = _ func:nomeFuncaoMatUmArg _ "("  _ expr:expressao _ ")" _ {
      if (func === "ASIN" || func === "asin") { return Math.asin(expr); }
      if (func === "SIN" || func === "sin") { return Math.sin(expr); }
      if (func === "SQRT" || func === "sqrt") { return Math.sqrt(expr); }
    }
/*
 * Nomes das funcoes a serem correspondidas
 */
nomeFuncaoMatUmArg
  = "ASIN" / "asin"
  / "SIN" / "sin"
  / "SQRT" / "sqrt"

/*
 * 
 */
funcaoMatMultArg
  = _ func:nomeFuncaoMatMultArg _ "(" cabeca:expressao cauda:(_ ";" _ expressao)* ")" {
      return cauda.reduce(function(resultado, elemento) {
        if (func === "SUM" || func === "sum") { return resultado + elemento[3]; }
        if (func === "PRODUCT" || func === "product") { return resultado * elemento[3]; }
      }, cabeca);
    }
nomeFuncaoMatMultArg
  = "SUM" / "sum"
  / "PRODUCT" / "product"

funcaoLogicaSe
  = _ func:nomeFuncaoLogicaSe _ "(" _ explog:expressaoLogica _ ";" _ exp1:expressao _ ";" _ exp2:expressao _ ")" _ {
      if (func === "IF" || func === "if") {
            if (explog) { return exp1; }
            return exp2;
        }
    }

nomeFuncaoLogicaSe
  = "IF" / "if"

funcaoLogicaMultArg
  = _ func:nomeFuncaoLogicaMultArg _ "(" cabeca:expressaoLogica cauda:(_ (";") _ expressaoLogica)* ")" {
      return cauda.reduce(function(resultado, elemento) {
        if (func === "AND" || func === "and") { return resultado && elemento[3]; }
        if (func === "OR" || func === "or") { return resultado || elemento[3]; }
      }, cabeca);
    } 

nomeFuncaoLogicaMultArg
  = "AND" / "and"
  / "OR" / "or"

expressaoLogica
  = _ cabeca:expressao _ comparador1:Comparador comparador2:Comparador ? _ cauda:expressao {
          if(comparador1 == ">") { return (cabeca > cauda); }
          if(comparador1 == "<") { return (cabeca < cauda); }
          if(comparador1 == "=") { return (cabeca === cauda); }
          if(comparador1 == "<=") { return (cabeca <= cauda); }
          if(comparador1 == ">=") { return (cabeca >= cauda); }
          if(comparador1 == "<>") { return (cabeca !== cauda); }
   }
   / funcaoLogicaMultArg

expressao
  = _ cabeca:termo cauda:(_ ("+" / "-") _ termo)* {
      return cauda.reduce(function(resultado, elemento) {
        if (elemento[1] === "+") { return resultado + elemento[3]; }
        if (elemento[1] === "-") { return resultado - elemento[3]; }
      }, cabeca);
    }

/*
 * Um termo eh todo o conjunto constituido por, ao menos, um fator, ...
 * e, entao, de 0 a infinitas repeticoes de "*" ou "/" seguido por outro ...
 * fator. O primeiro fator estah associado a cabeca, e os demais a cauda.
 * Como retorno, faz-se uso do metodo "reduce"; este metodo parte de um ...
 * "fator" inicial, a "cabeca", e, a partir dele, analisa a expressao em "cauda".
 * O "elemento[0]" equivale a "_"; "elemento[1]" equivale a operacao; ...
 * "elemento[2]" eh , novamente, "_"; por fim, "elemento[3]" eh o fator seguinte.
 * Dessa forma, retorna-se, recursivamente, o valor obtido em "resultado", que ...
 * sera usado nas operacoes subsequentes.
 */
termo
  = _ cabeca:fator cauda:(_ ("*" / "/") _ fator)* {
      return cauda.reduce(function(resultado, elemento) {
        if (elemento[1] === "*") { return resultado * elemento[3]; }
        if (elemento[1] === "/") { return resultado / elemento[3]; }
      }, cabeca);
    }

/*
 * Um fator eh toda unidade iniciada por "(" e terminada em ")", ...
 * ... cujo conteudo interno eh uma "expressao".
 */
fator
  = "(" _ expr:expressao _ ")" { return expr; }
  / numeroReal
  / numeroInteiro
  / funcaoMatUmArg
  / funcaoMatMultArg

/*
 * O formato de datas eh dado em DD/MM/AAAA ou DD/MM/AA.
 * Por simplificacoes de implementacao, admite-se que os labels "dia" e ...
 * "mes" incluem as barras de divisao "/".
 */
formatoData
  = dia:numeroDia mes:numeroMes ano:numeroAno {
    if (dia[1] == "/")
      dia = "0" + dia[0];
    else
        dia = dia[0] + dia[1];
    if (mes[1] == "/")
      mes = "0" + mes[0];
    else
      mes = mes[0] + mes[1];
    if(ano.length == 4)
      ano = ano[0] + ano[1] + ano[2] + ano[3];
    else
      ano = "20" + ano[0] + ano[1];
    
    return dia + "/" + mes + "/" + ano;
  }

/*
 * Formatos permitidos para o dia (restringem-se os numeros ao intervalo ...
 * ... 0-31). Nao se consideram, para este proposito, limites de dias ...
 * ... que variam de mes para mes.
 */
numeroDia "numeroDia"
  = [1-9] "/"
  / "0" [1-9] "/"
  / [1,2] (digito) "/"
  / "3" [0,1] "/"
  
/*
 * Formatos permitidos para o mes
 */
numeroMes "numeroMes"
  = [1-9] "/"
  / "0" [1-9] "/"
  / "1" [0-2] "/"

/*
 * O formato de ano pode ser dado em 4 digitos...
 * ... ou em 2 digitos (supoe-se que seja da forma 20xx)
 */
numeroAno "numeroAno"
  = [1,2,3,4,5,6,7,8,9](digito)(digito)(digito)
  / (digito)(digito)

numeroReal "numeroReal"
  = ("-"?(digito+)(".")(digito+)) { return parseFloat(text()); }

/*
 * parseInt(text(),10) analisa uma string e a retorna como um numero decimal
 * Pode haver ou nao um sinal de "-" antes do numero natural
 */
numeroInteiro "numeroInteiro"
  = ("-"? numeroNatural) { return parseInt(text(),10); }

/*
 * Um numero natural pode conter um ou mais digitos
 */
numeroNatural "numeroNatural"
  = (digito+) { return parseInt(text(),10); }

Comparador
  = ( "<" / ">" / "=" / ">=" / "<=" / "<>" )

digito = [0-9]

/*
 * Espacos/Tabs
 */
_ "whitespace"
  = [ \t\r]*
