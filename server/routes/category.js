const express = require('express');

let { verifyToken, verifyCompany_Role } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// ============================
// Mostrar todas las categorias
// ============================
app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('createdBy', 'name email')
        .exec((err, categories) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categories
            });

        })
});

// ============================
// Mostrar una category por ID
// ============================
app.get('/category/:id', verifyToken, (req, res) => {
    // Category.findById(....);

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'ID is not correct'
                }
            });
        }


        res.json({
            ok: true,
            category: categoryDB
        });

    });


});

// ============================
// Crear nueva category
// ============================
app.post('/category', verifyToken, (req, res) => {
    // regresa la nueva category
    // req.usuario._id
    let body = req.body;

    let category = new Category({
        description: body.description,
        createdBy: req.user._id
    });


    category.save((err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });


    });


});

// ============================
// Mostrar todas las categorias
// ============================
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descriptionCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, descriptionCategory, { new: true, runValidators: true }, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });


});

// ============================
// Mostrar todas las categorias
// ============================
app.delete('/category/:id', [verifyToken, verifyCompany_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    // Category.findByIdAndRemove
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no exist'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Category Deleted Borrada'
        });

    });


});


module.exports = app;