import request from 'request-promise';
let torrentSearch = new (require('torrent-search-api'));

export default class Library {
    async getMovieInfo(id, lang){
        if (id) {
            let info = {
                global: await request(`https://api.themoviedb.org/3/movie/${id}?api_key=a4343157cee95013cd656c957307d784${'&language=' + (lang ? lang : 'en')}`),
                cast: await request(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=a4343157cee95013cd656c957307d784${'&language=' + (lang ? lang : 'en')}`),
                videos: await request(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=a4343157cee95013cd656c957307d784${'&language=' + (lang ? lang : 'en')}`)
            };

            if (info){
                Object.keys(info).forEach(key => {
                    if (info[key]){
                        info[key] = JSON.parse(info[key]);
                    }
                });

                return ({
                    summary: info.global.overview,
                    cover: info.global.poster_path,
                    language: info.global.original_language,
                    id: info.global.id,
                    title: info.global.title,
                    original_title: info.global.original_title,
                    rating: info.global.vote_average,
                    year: parseInt(info.global.release_date),
                    casting: Library.getCasting(info.cast.cast),
                    director: Library.getDirectors(info.cast.crew)
                })
            }
        }
    }

    static getDirectors(list){
        let directors = [];

        if (list){
            list.forEach((elem, index) => {
                if (["Director", "Producer"].indexOf(elem.job) !== -1){
                    directors.push({name: elem.name, job: elem.job});
                }
            });
        }

        return directors;
    }

    static  getCasting(list){
        let casting = [];

        if (list) {
            list.forEach((elem, index) => {
                if (index <= 3 && elem.name) {
                    casting.push(elem.name);
                }
            });
        }

        return casting;
    }

    async getMovieList(lang, name, page, genre, dategte, datelte, vgte, vlte, sort) {
        const query = {
            base_url: name ? 'https://api.themoviedb.org/3/search/movie' : 'https://api.themoviedb.org/3/discover/movie',
            api_key: '?api_key=a4343157cee95013cd656c957307d784',
            genre: genre !== '0' ? `&with_genres=${genre}` : '',
            lang: '&language=' + (lang ? lang : 'en'),
            name: name ? `&query=${name}` : '',
            page: page ? `&page=${page}` : '',
            dategte: dategte ? `&release_date.gte=${dategte}` : '',
            datelte: datelte ? `&release_date.lte=${datelte}` : '',
            vgte: vgte ? `&vote_average.gte=${vgte}` : '',
            vlte: vlte ? `&vote_average.lte=${vlte}` : '',
            sort: sort ? `&sort_by=${sort}` : ''
        };
        try {
            let list = await request(query.base_url + query.api_key + query.lang + query.name + query.page + query.genre + query.dategte + query.datelte + query.vgte + query.vlte + query.sort + '&include_adult=false');

            if (list) {
                list = JSON.parse(list);
                if (list.results) {
                    const toDelete = [];

                    await Promise.all(list.results.map(async (elem, index) => {
                        const torrents = await torrentSearch.search(`${elem.original_title}`, 'Movies');

                        if (!torrents[0] || parseInt(torrents[0].seeds, 10) < 50) {
                            toDelete.push(elem.original_title);
                        }
                    }));

                    return list.results.filter(elem => {
                        return (toDelete.findIndex(title => title === elem.original_title) === -1);
                    });
                }
            } else {
                return [];
            }
        } catch (e) {
            console.log(e);
            return;
        }

        return false;
    }
}