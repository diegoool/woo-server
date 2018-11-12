const express = require('express');

const { verifyToken } = require('../middlewares/authentication');


let app = express();
let Event = require('../models/event');


// ===========================
//  Obtener events
// ===========================
app.get('/events', verifyToken, (req, res) => {
    // trae todos los events
    // populate: user category
    // paginado

    let start = req.query.start || 0;
    start = Number(start);

    Event.find({ status: true })
        .skip(start)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, events) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                events
            });


        })

});

// ===========================
//  Obtener un event por ID
// ===========================
app.get('/events/:id', (req, res) => {
    // populate: user category
    // paginado
    let id = req.params.id;

    Event.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, eventDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!eventDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no exist'
                    }
                });
            }

            res.json({
                ok: true,
                event: eventDB
            });

        });

});

// ===========================
//  Buscar events
// ===========================
app.get('/events/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Event.find({ name: regex })
        .populate('category', 'name')
        .exec((err, events) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                events
            })

        })


});


// ===========================
//  Crear un nuevo event
// ===========================
app.post('/events', verifyToken, (req, res) => {
    // grabar el user
    // grabar una category del listado 

    let body = req.body;

    let event = new Event({
        name: body.name,
        description: body.description,
        status: body.status,
        place: body.place,
        createdBy: req.user._id,
        category: body.category
    });

    event.save((err, eventDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            event: eventDB
        });

    });

});

// ===========================
//  Actualizar un event
// ===========================
app.put('/events/:id', verifyToken, (req, res) => {
    // grabar el user
    // grabar una category del listado 

    let id = req.params.id;
    let body = req.body;

    Event.findById(id, (err, eventDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!eventDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID not found'
                }
            });
        }

        eventDB.name = body.name;
        eventDB.description = body.description;
        eventDB.status = body.status;
        eventDB.place = body.place;
        eventDB.category = body.category;
        // eventDB.createdBy = body.createdBy;

        eventDB.save((err, eventSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                event: eventSaved
            });

        });

    });


});

// ===========================
//  Borrar un event
// ===========================
app.delete('/events/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Event.findById(id, (err, eventDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!eventDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID not found'
                }
            });
        }

        eventDB.status = false;

        eventDB.save((err, eventDeleted) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                event: eventDeleted,
                mensaje: 'Event Deleted'
            });

        })

    })


});


module.exports = app;