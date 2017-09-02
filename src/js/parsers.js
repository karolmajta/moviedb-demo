import * as I from 'immutable';
import * as data from './data';

export function parsePerson (source, imageRoot) {
    const knownFor = (source.known_for || []).map((kf) => {
        switch (kf.media_type) {
            case "tv":
                return parseTvShow(kf, imageRoot);
            case "movie":
                return parseMovie(kf, imageRoot);
            default:
                return null
        }
    }).filter((kf) => kf !== null);

    return new data.Person({
        id: source.id,
        knownFor: I.List(I.Set(knownFor)).sortBy((r) => r.id),
        name: source.name,
        photoUrl: source.profile_path !== null ? `${imageRoot}${source.profile_path}` : null
    })
}

export function parseMovie (source, imageRoot) {
    return new data.Movie({
        id: source.id,
        originalLanguage: source.original_language,
        backdropUrl: source.backdrop_path !== null ? `${imageRoot}${source.backdrop_path}` : null,
        overview: source.overview,
        title: source.title,
        originalTitle: source.original_title,
        posterUrl: source.poster_path !== null ? `${imageRoot}${source.poster_path}` : null,
        releaseDate: source.release_date
    });
}

export function parseTvShow (source, imageRoot) {
    return new data.TvShow({
        id: source.id,
        originalLanguage: source.original_language,
        backdropUrl: source.backdrop_path !== null ? `${imageRoot}${source.backdrop_path}`: null,
        overview: source.overview,
        name: source.name,
        originalName: source.original_name,
        posterUrl: source.poster_path !== null ? `${imageRoot}${source.poster_path}` : null,
        firstAirDate: source.first_air_date
    });
}

export function parseSearchResult (source, fetchedPages, imageRoot) {
    let results = (source.results || []).map((result) => {
        switch (result.media_type) {
            case "tv":
                return parseTvShow(result, imageRoot);
            case "movie":
                return parseMovie(result, imageRoot);
            case "person":
                return  parsePerson(result, imageRoot);
            default:
                return null
        }
    }).filter((result) => result !== null);

    return new data.SearchResult({
        results: I.List(I.Set(results)).sortBy((r) => r.id),
        totalPages: source.total_pages,
        fetchedPages: fetchedPages
    });
}