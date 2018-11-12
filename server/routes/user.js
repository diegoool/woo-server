const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { verifyToken, verifyCompany_Role } = require('../middlewares/autenticacion');

const app = express();


app.get('/user', verifyToken, (req, res) => {


    let start = req.query.start || 0;
    start = Number(start);

    let end = req.query.end || 5;
    end = Number(end);

    User.find({ status: true }, 'name email role status google img')
        .skip(start)
        .limit(end)
        .exec((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ status: true }, (err, counter) => {

                res.json({
                    ok: true,
                    users,
                    counter: counter
                });

            });


        });


});

app.post('/user', [verifyToken, verifyCompany_Role], function(req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });


    });


});

app.put('/user/:id', [verifyToken, verifyCompany_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            user: userDB
        });

    })

});

app.delete('/user/:id', [verifyToken, verifyCompany_Role], function(req, res) {


    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userDeleted) => {

    let changeStatus = {
        status: false
    };

    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userDeleted) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        });

    });



});



module.exports = app;