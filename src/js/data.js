import * as I from 'immutable';

export class Movie extends I.Record({
    id: null,
    originalLanguage: null,
    backdropUrl: null,
    overview: null,
    title: null,
    originalTitle: null,
    posterUrl: null,
    releaseDate: null
}) {}

export class TvShow extends I.Record({
    id: null,
    originalLanguage: null,
    backdropUrl: null,
    overview: null,
    name: null,
    originalName: null,
    posterUrl: null,
    firstAirDate: null
}) {}

export class Person extends I.Record({
    id: null,
    knownFor: null,
    name: null,
    photoUrl: null
}) {}

export class SearchResult extends I.Record({
    totalPages: 0,
    fetchedPages: 0,
    results: null
}) {}

export class ApplicationState extends I.Record({
    initialized: false,
    search: null,
    searchResult: null,
    recentError: null,
    pendingResultPage: null
}) {}