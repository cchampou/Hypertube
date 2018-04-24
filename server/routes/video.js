const express = require('express');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');

const { mongoose } = require('./../database/mongoose.js');
const { Video } = require('./../models/video.js');
const { User } = require('./../models/user.js');
const authenticate = require('./../middleware/auth.js');
const { ObjectID } = require('mongodb');
require('babel-polyfill');
require('babel-register');

const fs = require('fs');
const Movie = require('../stream-utils/movie');


const test = new Movie.default;

module.exports = (io) => {

    io.on('connection', (socket) => {

        this.socket = socket;
        socket.on('disconnect', (index) => {
            test.deleteStream(socket.id);
        });

        socket.on('destroyStream', () => {
            test.deleteStream(socket.id)
        });

        socket.on('getSubs', async (imdbid) => {
            let srt = await test.getSubList(imdbid);
            let list = [];

            srt.forEach(elem => {
                if (elem) {
                    list.push(elem.langcode);
                }
            });
            socket.emit("subList", list);
        });
        let sendPLaylist = async (req, res) => {
            let playlist = await test.getPlaylist(res, req, this.socket);

            if (playlist) {
                res.sendFile(playlist);
            } else {
                res.writeHead(500);

            }
        };
        router.get('/m3u', sendPLaylist);
    });


    router.get('/list', (req, res) => {
        Video.find().then((videos) => {
            if (!videos) {
                return res.status(404).send('No video found')
            }
            return res.status(200).send(videos);
        }).catch((err) => {
            return res.status(400).send(err);
        });
    });

    /***** GET VIDEO *****/

    router.get('/:lang/:genre/:page/:dategte/:datelte/:vgte/:vlte/:sort/:name?', authenticate, async (req, res) => {
        try {
            const results = await test.library.getMovieList(req.params.lang, req.params.name, req.params.page, req.params.genre, req.params.dategte, req.params.datelte, req.params.vgte, req.params.vlte, req.params.sort);

            res.json(results);
        } catch(e) {
            res.status(400).send();
        }

    });

    router.get("/sub/:query", async (req, res) => {

        let imdbid = req.url.split('/').pop().split('_').splice(0, 1);

        if (!await fs.existsSync("/tmp" + req.url)){
            await test.getSrt(imdbid);
        } else {
        }
       res.sendFile("/tmp" + req.url);
    });

    router.get('/part/:username/:filepart', async (req, res) => {
        res.sendFile('/tmp' + req.url);
    });


    router.post('/', authenticate, (req, res) => {
        let body = _.pick(req.body, ['idmovieDb']);
        let id = req.user._id;

        Video.findOrCreate({idmovieDb: body.idmovieDb}, {idmovieDb: body.idmovieDb}, (err) => {
            if (err) {
                return res.status(400).send(err);
            } else
                User.findById(id).then((user) => {
                    if (user.seen.indexOf(body.idmovieDb) === -1) {
                        user.seen.push(body.idmovieDb);
                    }
                    user.save((e) => {
                        if (err) {
                            return res.status(400).end();
                        }
                    })
                })
            res.status(200).send();
        });
    });

    router.get('/select/:id', (req, res) => {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send('wrong ID');
        }
        Video.findById(id, (err, video) => {
            if (err) {
                return res.status(400).send();
            }
            if (!video) {
                return res.status(404).send();
            }
            res.status(200).send(video);
        });
    });


    /***** POST VIDEO *****/

    router.post('/', authenticate, (req, res) => {
        let body = _.pick(req.body, ['idmovieDb']);
        Video.findOrCreate({ idmovieDb : body.idmovieDb }, { idmovieDb : body.idmovieDb } , (err) => {
            if (err) {
                return res.status(400).send(err);
            } else {
                res.status(200).send();
            }
        });
    });


    /***** POST COMMENT *****/

    router.post('/comment/:id', authenticate, (req, res) => {
        let id = req.params.id;
        let body = _.pick(req.body, ['text']);
        body.author = req.user.id;
        body.date = moment().format('MMMM Do YYYY, h:mm:ss a');
        Video.findOne({ idmovieDb : id }).then((video) => {
            if (!video) {
                return res.status(400).send();
            }
            if (!video.comment) {
                video.comment = [];
            }
            video.comment.push(body);
            video.save((err) => {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(200).send();
            });
        });
    });

    router.get('/comment/:id', authenticate, async (req, res) => {
        const id = req.params.id;
        try {
            const video = await Video.findOne({ idmovieDb : id });
            if (video) {
                const tmp = video.comment.toObject();
                const comments = await tmp.map(async (e) => {
                    try {
                        const author = await User.findOne({ _id : e.author });
                        e.name = author.username;
                        return e;
                    } catch (err) {
                        console.log(err);
                    }
                });
                const result = await Promise.all(comments).then((comment) => {
                    return comment;
                }).catch((err) => {
                    console.log(err);
                });
                return res.json(result);
            }
            return res.json([]);
        } catch (err) {
            res.status(400).send();
        }
    });

    return router;
};