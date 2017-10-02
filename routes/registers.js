var Register = require('../models/register');
var nodeExcel = require('excel-export');
var mongoXlsx = require('mongo-xlsx');
var json2xls = require('json2xls');
var bluebird = require('bluebird');

//Mostrar Datos
/************************************************ */
//Mostrar todos (limitado a 100 primero registros)
exports.showAll = function (req, res) {

    Register.find({}, function (err, register) {
        if (err) throw err;
        res.send(register);
        //console.log(register);
    }).limit(100);
};

//Mostrar por Nombre
exports.showByName = function (req, res) {
    console.log(req.params.name);
    Register.find({
            $text: {
                $search: req.params.name
            }
        },
        function (err, register) {
            if (err) throw err;
            res.send(register);
            console.log(register);
        });
    //
};
//limitado a 5 resultados
exports.showByNameLimited = function (req, res) {
    console.log(req.params.name);
    Register.find({
            $text: {
                $search: req.params.name
            }
        },
        function (err, register) {
            if (err) throw err;
            res.send(register);
            console.log(register);
        }).limit(5);
    //
};

//Mostrar por DNI
exports.showByDNI = function (req, res) {
    console.log(req.params.dni);
    Register.find({
        "dni": req.params.dni
    }, function (err, register) {
        if (err) throw err;
        res.send(register);
        console.log(register);
    });
};
//limitado a 5 registros
exports.showByDNILimited = function (req, res) {
    console.log(req.params.dni);
    Register.find({
        "dni": req.params.dni
    }, function (err, register) {
        if (err) throw err;
        res.send(register);
        console.log(register);
    }).limit(5);
};

//Exportar XLS por DNI
exports.exportdnixls = function (req, res) {
    findByRut(req.params.dni)
        .then(registers => creaExcel(registers, res, req.params.dni));
};
function findByRut(rut) {
    return new Promise(function (resolve, reject) {
        Register.find({
            "dni": rut
        }, function (err, registers) {
            if (err) {
                throw err;
                reject(err);
            }
            resolve(registers);
        });
    });
};

//Exportar XLS por Nombre
exports.exportnamexls = function (req, res) {
    findByName(req.params.name)
        .then(registers => creaExcel(registers, res, req.params.name));
};
function findByName(name) {
    return new Promise(function (resolve, reject) {
        Register.find({
            $text: {$search: name}
        }, function (err, registers) {
            if (err) {
                throw err;
                reject(err);
            }
            resolve(registers);
        });
    });
};
// funcion que crea los XLS
/*************************** */
function creaExcel(registers, res, path) {
    return new Promise(function (resolve, reject) {

        var conf = {};
        conf.stylesXmlFile = "styles.xml";
        conf.name = "mysheet";
        conf.cols = [{
            caption: 'dni',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }, {
            caption: 'nombre',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }, {
            caption: 'entrada',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }, {
            caption: 'salida',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }];
        conf.rows = [];

        console.log("building xls with", registers);

        for (i = 0; i <= registers.length; i++) {
            try {
                var arr = [registers[i].dni, registers[i].nombre, registers[i].entrada, registers[i].salida];
                //console.log("pushing arr to xls", arr);
                conf.rows.push(arr);
            } catch (error) {
                console.error("Warning Captured...");
            }
        }

        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "HistoricoMEF"+path+".xlsx");
        res.end(result, 'binary');
        //console.log("result", result);
        resolve(result);
    });
};
//example to use export to xls
exports.exportxls = function (req, res) {
    var conf = {};
    conf.stylesXmlFile = "styles.xml";
    conf.name = "mysheet";
    try {
        conf.cols = [{
            caption: 'DNI',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }, {
            caption: 'nombre',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }, {
            caption: 'entrada',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }, {
            caption: 'salida',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData.toUpperCase();
            },
            width: 28.7109375
        }];
    } catch (error) {
        console.error(error);
    }

    var arr = ['123456789', 'german becker', '', ''];
    conf.rows = [
        ['16240650', 'francisco riveros yantani', '2017-02-09 20:57:24.276', '2017-02-09 20:57:11.991 '],
        ['16240650', 'francisco riveros yantani', '2017-02-09 20:57:24.276', '2017-02-09 20:57:11.991 '],
        ['16240650', 'francisco riveros yantani', '2017-02-09 20:57:24.276', '2017-02-09 20:57:11.991 '],
        ['16240650', 'francisco riveros yantani', '2017-02-09 20:57:24.276', '2017-02-09 20:57:11.991 ']
    ];
    conf.rows.push(arr);
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "HistoricMEF.xlsx");
    res.end(result, 'binary');
};