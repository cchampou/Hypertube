import fs from 'fs';
import http from 'http';
import Tstream from 'torrent-stream';
import ffmpeg from 'fluent-ffmpeg';
import process from 'child_process';

let _ = require('lodash');
let torrentSearch = new (require('torrent-search-api'));
let {File} = require('../models/file.js');

torrentSearch.enableProvider('Torrent9');
torrentSearch.enableProvider('1337x');

export default class Stream {
    constructor(previous) {
        this.query = null;
        this.started = false;
        this.path = '';
        this.sent = false;
        this.downloaded = false;
        this.stream = null;
        this.engine = null;
    }

    async sendPlaylist(res, req, socket) {
        this.res = res;
        if (this.downloaded) {
            return this.playlist;
        } else {
            this.query = req.query;
            this.magnetLink = req.query.magnetLink ? req.query.magnetLink : await this.getMagnetLink(req.query);

            if (this.magnetLink) {
                try {
                    return await this.getMovie(res, req, socket);
                } catch (e){
                    return null;
                }
            } else {
            }
        }
    }


    getMovie(res, req, socket) {
        return new Promise(async (resolve, reject) => {
            let engine = Tstream(this.magnetLink, {
                path: '/tmp/torrent-stream/files'
            });


            this.engine = engine;

            engine.on('ready', () => {
                engine.files.forEach(file => {
                    if (Stream.isVideo(file.name) && !file.name.includes('sample') && parseInt(file.length, 10) >= (300 * 1000000)) {
                        let stream = file.createReadStream();

                        this.stream = stream;
                        this.size = engine.torrent.length;
                        this.path = (stream._engine.path + '/' + file.path);

                    } else {
                        file.deselect();
                    }
                });
            });

            engine.on('download', async (index) => {
                if (!this.started && await this.canPlay(socket)) {
                    this.started = true;
                    this.addToDb();
                    try {
                        resolve(await this.createPlayList(res, req, socket));
                    } catch (e) {
                        reject();
                    }
                }
            });

            engine.on('idle', async () => {
                this.downloaded = true;
                if (!this.started) {
                    this.started = true;

                    socket.emit('downloading', 100);
                    resolve(await this.createPlayList(res, req, socket));
                }
                engine.destroy();
            });
        });

    }

    addToDb(){
        let path = this.path.split('/');
        let now = new Date();
        let expire = new Date();
        expire = expire.setMonth(now.getMonth() + 1);

        path.pop();

        File.findOrCreate({ path: path.join("/") }, { path: path.join("/"), expire: expire }, function (err, res) {
            if (err) {
                console.log(err);
            }
            if (res) {
                File.update({ _id : res.id }, { $set :  { expire : expire } }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        });
        File.find({ expire : { $lt : now.getTime() }}, (err, res) => {
            if (err){
                console.log(err);
            }
            res.map(async (e) => {
                if ((await fs.existsSync(e.path))) {
                    let files = await fs.readdirSync(e.path);
                    await Promise.all(files.map(async (elem) => {
                        if (await fs.existsSync(`${e.path}/${elem}`)){
                            await fs.unlinkSync(`${e.path}/${elem}`);
                        }
                    }));
                    await fs.rmdirSync(e.path);
                }
            });
        })
    }
    
    async createPlayList(res, req, socket){
        return new Promise(async (resolve, reject) => {
            try {
                if (!await fs.existsSync(`/tmp/part`)) {
                    await fs.mkdirSync(`/tmp/part`);
                }

                await Stream.resetDirectory(socket.id.replace(/[\s+]/g, ''));

                let path = this.path.split('.');

                path.pop();
                path = path.join('.').split(' ').join('.').split('/').pop();

                this.converter = process.spawn('ffmpeg',[
                        `-i`,
                        `${this.path}`,
                        '-sn',
                        '-c:v',
                        'libx264',
                        '-y',
                        '-c:a',
                        'aac',
                        '-ac',
                        '2',
                        '-preset',
                        'veryfast',
                        '-hls_time',
                        '10',
                        '-hls_list_size',
                        '0',
                        '-hls_playlist_type',
                        'vod',
                        '-hls_base_url',
                        `/video/part/${socket.id.replace(/[\s+]/g, '')}/`,
                        `/tmp/part/${socket.id.replace(/[\s+]/g, '')}/${path}_.m3u8`,
                ]);
                let time = 0;

                this.converter.stderr.on('data', async (data) => {
                        let string =  data.toString('utf8').split(' ');
                        let index = string.findIndex(elem => elem.includes('time') && elem.includes('='));

                        if (index !== -1){
                            let time = string[index].split('=')[1].split(':')
                            let seconds = Math.round(time.pop());

                            if ((parseInt(time.pop(), 10) <= 0)) {
                                socket.emit('converting', Math.round(seconds / 28 * 100));
                            }
                        }
                    if (await fs.existsSync(`/tmp/part/${socket.id.replace(/[\s+]/g, '')}/${path}_2.ts`) && !this.sent) {
                        this.sent = true;
                        this.playlist = `/tmp/part/${socket.id.replace(/[\s+]/g, '')}/${path}_.m3u8`;
                        resolve(this.playlist);
                    }
                });

                    this.converter.on('error', error => console.log("ERROR OCCURED", error));
                    this.converter.on('close', code => {
                        this.sent = false;
                        if (code !== 255) {
                            reject();
                        }
                    });
                }catch (e){
                    console.log(e);
                }
        });
    }

    static async resetDirectory(id) {
        if ((await fs.existsSync('/tmp/part/' + id))) {
            let files = await fs.readdirSync('/tmp/part/' + id);

            await Promise.all(files.map(async (elem) => {
                if (await fs.existsSync(`/tmp/part/${id}/${elem}`)){
                    await fs.unlinkSync(`/tmp/part/${id}/${elem}`);
                }
            }));
        } else {
            await fs.mkdirSync('/tmp/part/' + id);
        }
    }

    async canPlay(socket) {
        if (this.stream && this.engine.selection[0]) {
            const start =this.engine.selection[0].from;
            const end = this.engine.selection[0].to;
            const nbPieceNeeded = Math.round((end - start) * 0.015);
            const valid = Math.floor(nbPieceNeeded / 8);
            const buffer = JSON.parse(JSON.stringify(this.engine.bitfield.buffer)).data;

            await this.sendValue(socket, buffer, valid);
            let length = buffer.filter((elem, index) => {
                return (index >= 0 && index <= valid && buffer[index] !== 255);
            }).length;
            return length === 0;
        } else {
            return false;
        }
    }

    async sendValue(socket, buffer, valid){
        let value = 0;

        buffer.map((elem, index) => {
            if (index <= valid){
                value += elem;
            }
        });

        socket.emit('downloading', value / ((valid + 1) * 255) * 100);
    }

    async getMagnetLink(query) {
        const {name, original, year} = query;
        const lang = query.lang && query.lang === 'fr' ? 'french' : '';

        let link = await this.searchLink([name, year, lang]);
        if (!link){
            link =  await this.searchLink([original, year, lang]);
        }

        return link;
    }


    async searchLink(query){
        while (query.length){
            const torrents = await torrentSearch.search(`${query.join(' ')}`, 'Movies');

            if (torrents[0] && torrents[0].seeds > 50) {
                this.actualTorrent = query.join(' ');
                return await torrentSearch.getMagnet(torrents[0]);
            }
            query.pop();
        }
        return null;
    }

    newQuery(query) {
        let newQuery = true;

        if (this.query) {
            newQuery = Object.keys(this.query).filter(key => this.query[key] !== query[key]).length !== 0;
        }

        return newQuery;
    }

    static isVideo(elem) {
        const format = ['mp4', 'avi', 'webm', 'flv', 'mkv', 'wmv', 'mpeg', 'mpg'];

        return format.indexOf(elem.split('.').pop()) !== -1;
    }
}
