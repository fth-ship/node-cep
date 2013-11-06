# Node CEP

Módulo para lidar, com consultas ao [Correio control para buscar CEP's](http://cep.correiocontrol.com.br/)

## Instalação

    [sudo] npm install cep

## exemplo:

``` javascript 
var cep = require('cep');

// O uso é bem simples, quando você requisitar
// algum CEP ele vai fazer a requsição e devolver
// um argumento com o Erro e os Dados.
function print ( err, data ) { 
    console.log( err, data );  
}
cep.request.data.from('05211-000', print);
```

## Licensa BSD
