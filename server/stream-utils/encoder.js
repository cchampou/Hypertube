import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import Process from 'child_process';

export default class Encoder {
    constructor(props){
        this.converter = null;
        this.lastQuery = null;
    }

    async getMoviePart(req, res, stream){
        let startTime = req.url.split('_').pop().split('.')[0];

        // let next = req.url.split('_')[0] + '_' + (parseInt(startTime, 10) + 4) + '.ts';

        await Encoder.createDirectory();
        if (!await fs.existsSync(`/tmp/m3u/${req.session.id}${req.url}`) || this.lastQuery === req.url){
            let savePath = req.url.split('/').pop().split('.');

            this.sent = false;
            if (this.converter){
                this.converter.kill();
            }

            console.log("REQUESTED", req.url);

            if (!stream.downloaded && parseInt(startTime, 10) !== 0){
                const range = await Encoder.checkPieces(stream, req.url, startTime * 10);

                console.log("RANGE", range);
                await stream.getChunk(range);
            }

            console.log('OKOKOK');
            await Encoder.resetDirectory(req.session.id);
            savePath.pop();

            this.converter = Process.spawn('ffmpeg', [
                `-ss`,
                `${parseInt(startTime, 10) * 10}`,
                '-r',
                '23.976',
                `-i`,
                `${stream.path}`,
                '-y',
                '-x264opts',
                'keyint=240:min-keyint=240:no-scenecut',
                '-c:a',
                'copy',
                '-c:v',
                'libx264',
                '-preset',
                'superfast',
                '-hls_flags',
                'split_by_time',
                '-hls_list_size',
                '0',
                '-hls_time',
                '10',
                `-start_number`,
                `${startTime}`,
                `/tmp/m3u/${req.session.id}/${savePath.join('.').split('_')[0].replace(/\s/g, '')}_.m3u8`]);

            this.converter.stdout.on('data', (data) => {
                console.log("STDOUT", data);
            });

            this.converter.stderr.on('data', data => {
                let line = data.toString('utf8');

                if (line.includes('Opening') && line.includes('.ts')){
                    let part = parseInt(data.toString('utf8').split('\n')[0].split('_').pop(), 10);

                    // console.log(part);
                    // console.log(parseInt(startTime, 10) + 3);
                    // console.log(this.sent);
                    if (parseInt(part, 10) === (parseInt(startTime, 10) + 4)){
                        this.sent = true;
                        console.log(" ENCODED SENT");
                        console.log("LINE", line);
                        console.log("URL", `/tmp/m3u/${req.session.id}${req.url}`);
                        res.sendFile(`/tmp/m3u/${req.session.id}${req.url}`);
                    }


                }
            });
            this.converter.on('error', code => console.log("ERROR", code) );

            this.converter.on('close', code => {
                console.log("EXITED WITH", code);
                if (code !== 255)
                    process.exit(1);
            } );
            // this.converter = ffmpeg(stream.path)
            //     .inputOptions([ `-ss ${startTime * 10}`])
            //     .outputOptions(['-c:a copy', '-c:v libx264', '-preset veryfast','-hls_flags round_durations', '-hls_list_size 0', '-hls_time 10' , `-start_number ${startTime}`])
            //     .on('progress', async (progress) => {
            //         if (!this.sent && await fs.existsSync(`/tmp/m3u/${req.session.id}/${next}`)){
            //             this.sent = true;
            //             console.log("SENT");
            //             res.sendFile(`/tmp/m3u/${req.session.id}/${req.url}`);
            //         }
            //     })
            //     .save(`/tmp/m3u/${req.session.id}/${savePath.join('.').split('_')[0].replace(/\s/g, '')}_.m3u8`);
        } else {
            console.log("SENT", `/tmp/m3u/${req.session.id}${req.url}`);
            this.lastQuery = req.url;

            res.sendFile(`/tmp/m3u/${req.session.id}${req.url}`);
        }
    }

    static async checkPieces(stream, url, number){
        const frame = await Process.execSync(`ffprobe -i "${stream.path}" -show_frames -loglevel -8 -read_intervals ${number > 2 ? number - 2 : 0}%+#1`, {timeout: 5000}).toString('utf8');
        let start;
        console.log("FRAME", frame);
        console.log("NUMBER", number);
        if (frame) {
            start = frame.split('\n').filter(elem => elem.includes('pkt_pos'))[0].split('=').pop();
            // console.log(number);
            // console.log(Math.round(number - (number * 0.5)));
        } else {
            const percent = (number > 2  ? number - 2 : 0) / stream.duration;

            console.log("PERCENT", percent);
            start = stream.size * percent;
        }

        return ({start: parseInt(start, 10), end: stream.size});
    }

    static async createDirectory() {
        if (!await fs.existsSync('/tmp/m3u')){
            await fs.mkdirSync('/tmp/m3u');
        }
    }

    static async resetDirectory(id) {
        if (await fs.existsSync('/tmp/m3u/' + id)) {
            let files = await fs.readdirSync('/tmp/m3u/' + id);

            await Promise.all(files.map(async (elem) => {
                await fs.unlinkSync(`/tmp/m3u/${id}/${elem}`);

            }));
        } else {
            await fs.mkdirSync('/tmp/m3u/' + id);
        }
    }
}