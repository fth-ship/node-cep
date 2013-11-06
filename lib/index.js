var root = this;
// modules
var agent = require('superagent').agent();
// main exposition of objects 
var valid = root.valid = {}; 
var request = root.request = {};
var data = request.data = {};
var mount = root.mount = {};

// valid format of an CEP code
function validCepFormat ( value ) {
    var out = false;
    var reRawCepFormat = /^[0-9]{8}$/;
    var reCompCepFormat = /^[0-9]{5}\-[0-9]{3}$/; 

    if ( 
        value && ( 
            reRawCepFormat.test( value ) || ( 
                reCompCepFormat.test( value ) 
            )
        ) 
    ) out = true;

    return out;
}
valid.format = validCepFormat;

// handler for error in the output
function requestDataErrorHandler ( raw ) {
    var out = false;
    var errorFlag = 'correiocontrolcep({"erro":true});';

    if ( raw && ( raw === errorFlag ) ) out = true;

    return out;
}
data.errorHandler = requestDataErrorHandler;

// host for requests
data.url = 'http://cep.correiocontrol.com.br/';
// format of the requests
data.format = 'json';

// mount a raw CEP sequence based on argument
function mountRawSequence ( value ) {
    var out = '';
    var isCep = validCepFormat( value );

    if ( isCep ) out = value.replace('-', '');

    return out;
}
mount.rawSequence = mountRawSequence;

// mount the path for request
function mountRequestPath ( value ) {
    var out = '';
    var rawCep = mountRawSequence( value );

    if ( rawCep ) {
        out = [
            request.data.url,
            rawCep,
            '.', request.data.format
        ].join('');    
    }

    return out;
}
mount.requestPath = mountRequestPath;

// internal handler from request data from
function requestDataFromHandler ( fn ) {
    var fn = fn || function () {};

    return function ( err, res ) {
        var out = {};
        var hasError = requestDataErrorHandler( res.text );

        if ( res.ok && !hasError ) out = JSON.parse( res.text );

        fn( err, out ); 
    }    
}

// request data from CEP received with argument
function requestDataFrom ( cep, fn ) {
    var dataURL = mountRequestPath( cep );

    agent
        .get( dataURL )
        .end( requestDataFromHandler( fn ) );

    return data;
}
data.from = requestDataFrom;
