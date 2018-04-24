import Library from './library.js';
import Stream from './stream.js';
import fs from 'fs';
import http from 'http';
import srt2vtt from 'srt2vtt';
let openSubtitles = new (require('opensubtitles-api'))({
    useragent: 'TemporaryUserAgent',
    username: 'garouche',
    password: 'hypertube'
});

export default class Movie {
    constructor(props) {
        this.library = new Library();
        this.stream = [];
    }

    async getPlaylist(res, req, socket){

        let index = this.stream.findIndex(elem => elem.id === socket.id);

        if (index !== -1) {

            if (!this.stream[index].torrent || (this.stream[index].torrent.newQuery(req.query))) {

                this.stopConverterAndEngine(index);
                this.stream[index] = Object.assign(this.stream[index], {torrent: new Stream()});
            }

            if (!this.stream[index].torrent.playlist) {
                return (await this.stream[index].torrent.sendPlaylist(res, req, socket));
            } else {
                return this.stream[index].torrent.playlist;
            }

        } else {
            let stream = {id: socket.id, torrent: new Stream()};

            this.stream.push(stream);
            return (await stream.torrent.sendPlaylist(res, req, socket));
        }
    }

    async deleteStream(index) {
        let found = this.stream.findIndex(elem => elem.id === index);
        if (found !== -1){
            this.stopConverterAndEngine(found);
            this.stream.splice(found, 1);
        }
    }

    stopConverterAndEngine(index){
        if (this.stream[index].torrent) {
            if (this.stream[index].torrent.engine){
                this.stream[index].torrent.engine.destroy();
            }

            if (this.stream[index].torrent.converter) {
                this.stream[index].torrent.converter.kill();
            }
        }
    }

    async getSrt(imdbId){
        if (!await fs.existsSync('/tmp/sub')){
            await fs.mkdirSync('/tmp/sub');
        }

        let srtList = await this.downloadSub(imdbId);

        await this.convertSrt(srtList);
    }

    async getSubList(imdbid){
        let {fr, en} = await openSubtitles.search({
            extensions: ['srt', 'vtt'],
            imdbid
        });
        let srt = [fr, en];

        return srt;
    }

    async convertSrt(srtList){
        await Promise.all(srtList.map(elem => {
            return new Promise (async (resolve, reject) => {
                if (elem && elem.format === 'srt' && !await fs.existsSync(`/tmp/sub/${elem.imdbid}_${elem.lang}.vtt`)){
                    let file =  await fs.readFileSync(`/tmp/sub/${elem.imdbid}_${elem.lang}.srt`);

                    if (file){
                        srt2vtt(file, async (err, data) => {
                            if (!err) {
                                await fs.writeFileSync(`/tmp/sub/${elem.imdbid}_${elem.lang}.vtt`, data);
                            }
                            resolve();
                        });
                    } else {
                        reject();
                    }
                } else {
                    resolve();
                }
            });
        }));
    }

    async downloadSub(imdbid){
        let srt = await this.getSubList(imdbid);

        await Promise.all(srt.map(async (elem) => {
            return new Promise(async (resolve, reject) => {
                if (elem){
                    elem.imdbid = imdbid;
                }

                if (elem && !await fs.existsSync(`/tmp/sub/${imdbid}_${elem.lang}.${elem.format}`)) {

                    let file = fs.createWriteStream(`/tmp/sub/${imdbid}_${elem.lang}.${elem.format}`);

                    let request = http.get(elem.url, (res) => {
                        res.on('end', () => {
                            file.end();
                            file.on('close', () => {
                                resolve();
                            })
                        });

                        res.on('data', (data) => file.write(data));
                    });

                    request.on('error', (error) => { });
                } else {
                    resolve();
                }
            });
        }));
        return srt;
    }
};