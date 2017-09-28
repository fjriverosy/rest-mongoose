var Register = require('../models/register');
/*exports.setModel = function(modelo){
    Register = modelo;
};*/
exports.showAll = function (req, res) {

    Register.find({}, function (err, register) {
        if (err) throw err;
        res.send(register);
        //console.log(register);
    });
};

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

exports.showByNameT = function (req, res) {
    console.log(req.params.name);

    Register.ensureIndexes(function (err) {
        if (err) throw err;
        Register.find({
                "$text": {
                    '$search': req.params.name
                }
            },
            function (err, register) {
                if (err) throw err;
                res.send(register);
                console.log(register);
            });
    })

    //
};


exports.showByDNI = function (req, res) {
    console.log(req.params.dni);
    Register.find({
        "dni": req.params.dni
    }, function (err, register) {
        if (err) throw err;
        res.send(register);
        console.log(register);

    });
    //
};