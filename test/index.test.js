var cep = require('../lib');
var should = require('should');
var ch = require('charlatan');

suite('cep library', function () {
    suite('validation', function () {
        test('format input without separator', function () {
            cep
                .valid
                .format( ch.numerify('########').toString() )
                .should
                .be
                .ok; 
        });

        test('format input with common separator', function () {
            cep
                .valid
                .format( ch.numerify('#####-###').toString() )
                .should
                .be
                .ok; 
        });
    });    

    suite('mount', function () {
        test('raw cep', function () {
            var CEP = ch.numerify('#####-###').toString();    
            var expected = CEP.replace('-', '');

            cep
                .mount
                .rawSequence( CEP )
                .should
                .be
                .eql( expected );
        });

        test('request path with normal cep', function () {
            var CEP = ch.numerify('########').toString();
            var expected = 'http://cep.correiocontrol.com.br/' + CEP + '.json';

            cep
                .mount
                .requestPath( CEP )
                .should
                .be
                .eql( expected );
        });
    });

    suite('request', function () {
        suite('data', function () {
            test('error handler circuit', function () {
                cep
                    .request
                    .data
                    .errorHandler( 'correiocontrolcep({"erro":true});' )
                    .should
                    .be
                    .ok;
            });

            test('from cep', function ( done ) {
                var CEP = '05211-000'; // valid CEP
                var expected = {
                    'bairro': 'Vila Perus',
                    'logradouro': 'Avenida Doutor Sylvio de Campos',
                    'cep': '05211000',
                    'uf': 'SP',
                    'localidade': 'São Paulo'
                };

                function resultHandler ( err, data ) {
                    should.not.exist( err );
                    data
                        .should
                        .be
                        .eql( expected );

                    done();
                }

                cep
                    .request
                    .data
                    .from( CEP, resultHandler );
            });
        });    
    });
});
