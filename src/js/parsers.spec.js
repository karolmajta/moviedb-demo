import * as I from 'immutable';
import * as data from './data';
import { parseMovie, parsePerson ,parseTvShow, parseSearchResult } from './parsers';

describe('parseMovie', () => {
    it('should correctly parse raw movie representation', () => {
        expect(parseMovie(SAVING_PRIVATE_RYAN_RAW, IMAGE_URL)).toEqual(SAVING_PRIVAGE_RYAN_PARSED);
        expect(parseMovie(JACKIE_AND_RYAN_RAW, IMAGE_URL)).toEqual(JACKIE_AND_RYAN_PARSED);
    });
});

describe('parseTvShow', () => {
    it('should correctly parse raw tv show representation', () => {
        expect(parseTvShow(THE_SIMPSONS_RAW, IMAGE_URL)).toEqual(THE_SIMPSONS_PARSED);
        expect(parseTvShow(MALCOLM_IN_THE_MIDDLE_RAW, IMAGE_URL)).toEqual(MALCOLM_IN_THE_MIDDLE_PARSED);
    });
});

describe('parsePerson', () => {
    it('should correctly parse raw person representation', () => {
        expect(parsePerson(MEG_RYAN_RAW, IMAGE_URL)).toEqual(MEG_RAYAN_PARSED);
        expect(parsePerson(RYAN_GOSLING_RAW, IMAGE_URL)).toEqual(RYAN_GOSLING_PARSED);
    });
});

describe('parseSearchResult', () => {
    it('should correctly parse raw search result representation', () => {
        const searchResultRaw = {
            results: [
                MEG_RYAN_RAW, RYAN_GOSLING_RAW, THE_SIMPSONS_RAW, MALCOLM_IN_THE_MIDDLE_RAW,
                SAVING_PRIVATE_RYAN_RAW, JACKIE_AND_RYAN_RAW
            ],
            page: 1,
            total_pages: 20,
            total_results: 341
        };

        const searchResultParsed = new data.SearchResult({
            totalPages: 20,
            fetchedPages: 15,
            results: I.List.of(
                MEG_RAYAN_PARSED, RYAN_GOSLING_PARSED, THE_SIMPSONS_PARSED, MALCOLM_IN_THE_MIDDLE_PARSED,
                SAVING_PRIVAGE_RYAN_PARSED, JACKIE_AND_RYAN_PARSED
            ).sortBy((r) => r.id)
        });

        expect(parseSearchResult(searchResultRaw, 15, IMAGE_URL)).toEqual(searchResultParsed);
    });
});

const IMAGE_URL = 'http://example.com';

const SAVING_PRIVATE_RYAN_RAW = {
    "vote_average":7.9,
    "vote_count":4933,
    "id":857,
    "video":false,
    "media_type":"movie",
    "title":"Saving Private Ryan",
    "popularity":14.133465,
    "poster_path":"/miDoEMlYDJhOCvxlzI0wZqBs9Yt.jpg",
    "original_language":"en",
    "original_title":"Saving Private Ryan",
    "genre_ids":[
        18,
        36,
        10752
    ],
    "backdrop_path":"/gRtLcCQOpYUI9ThdVzi4VUP8QO3.jpg",
    "adult":false,
    "overview":"As U.S. troops storm the beaches of Normandy, three brothers lie dead on the battlefield, with a fourth trapped behind enemy lines. Ranger captain John Miller and seven men are tasked with penetrating German-held territory and bringing the boy home.",
    "release_date":"1998-07-24"
};

const JACKIE_AND_RYAN_RAW = {
    "vote_average":5.5,
    "vote_count":46,
    "id":289891,
    "video":false,
    "media_type":"movie",
    "title":"Jackie & Ryan",
    "popularity":2.821156,
    "poster_path":"/lyGjHaLMVNuwrxkqrJvMjXceRAU.jpg",
    "original_language":"en",
    "original_title":"Jackie & Ryan",
    "genre_ids":[
        18
    ],
    "backdrop_path":"/esNzfoM8mbGFQP4Edq9NdwciarT.jpg",
    "adult":false,
    "overview":"A modern day train hopper fighting to be a successful musician and a single mom battling to maintain custody of her daughter defy their circumstances by coming together in a relationship that may change each others lives forever.",
    "release_date":"2014-09-01"
};

const THE_SIMPSONS_RAW = {
    "original_name":"The Simpsons",
    "id":456,
    "media_type":"tv",
    "name":"The Simpsons",
    "vote_count":1051,
    "vote_average":7.05,
    "poster_path":"/yTZQkSsxUFJZJe67IenRM0AEklc.jpg",
    "first_air_date":"1989-12-17",
    "popularity":66.757317,
    "genre_ids":[
        16,
        35
    ],
    "original_language":"en",
    "backdrop_path":"/f5uNbUC76oowt5mt5J9QlqrIYQ6.jpg",
    "overview":"Set in Springfield, the average American town, the show focuses on the antics and everyday adventures of the Simpson family; Homer, Marge, Bart, Lisa and Maggie, as well as a virtual cast of thousands. Since the beginning, the series has been a pop culture icon, attracting hundreds of celebrities to guest star. The show has also made name for itself in its fearless satirical take on politics, media and American life in general.",
    "origin_country":[
        "US"
    ]
};

const MALCOLM_IN_THE_MIDDLE_RAW = {
    "original_name":"Malcolm in the Middle",
    "id":2004,
    "media_type":"tv",
    "name":"Malcolm in the Middle",
    "vote_count":207,
    "vote_average":7.46,
    "poster_path":"/8I6xRdYBZhmGV0cKBGZZSham12T.jpg",
    "first_air_date":"2000-01-09",
    "popularity":9.264907,
    "genre_ids":[
        35
    ],
    "original_language":"en",
    "backdrop_path":"/8VmOlxllljk6AiamMK8odBFNKl5.jpg",
    "overview":"A gifted young teen tries to survive life with his dimwitted, dysfunctional family.",
    "origin_country":[
        "US"
    ]
};

const MEG_RYAN_RAW =  {
    "popularity":1.642142,
    "media_type":"person",
    "id":5344,
    "profile_path":"/iv33eEcSakPCkO2MiR4bIZpjgyg.jpg",
    "name":"Meg Ryan",
    "known_for":[THE_SIMPSONS_RAW, SAVING_PRIVATE_RYAN_RAW],
    "adult":false
};

const RYAN_GOSLING_RAW = {
    "popularity":7.023499,
    "media_type":"person",
    "id":30614,
    "profile_path":"\/3KQmNWksVbk1foVe1n1qmuZXMCN.jpg",
    "name":"Ryan Gosling",
    "known_for":[JACKIE_AND_RYAN_RAW, MALCOLM_IN_THE_MIDDLE_RAW],
    "adult":false
};

const SAVING_PRIVAGE_RYAN_PARSED = new data.Movie({
    id: 857,
    title :"Saving Private Ryan",
    posterUrl: `${IMAGE_URL}/miDoEMlYDJhOCvxlzI0wZqBs9Yt.jpg`,
    originalLanguage: "en",
    originalTitle: "Saving Private Ryan",
    backdropUrl: `${IMAGE_URL}/gRtLcCQOpYUI9ThdVzi4VUP8QO3.jpg`,
    overview :"As U.S. troops storm the beaches of Normandy, three brothers lie dead on the battlefield, with a fourth trapped behind enemy lines. Ranger captain John Miller and seven men are tasked with penetrating German-held territory and bringing the boy home.",
    releaseDate :"1998-07-24"
});

const JACKIE_AND_RYAN_PARSED = new data.Movie({
    id :289891,
    title: "Jackie & Ryan",
    posterUrl: `${IMAGE_URL}/lyGjHaLMVNuwrxkqrJvMjXceRAU.jpg`,
    originalLanguage: "en",
    originalTitle: "Jackie & Ryan",
    backdropUrl: `${IMAGE_URL}/esNzfoM8mbGFQP4Edq9NdwciarT.jpg`,
    overview: "A modern day train hopper fighting to be a successful musician and a single mom battling to maintain custody of her daughter defy their circumstances by coming together in a relationship that may change each others lives forever.",
    releaseDate: "2014-09-01"
});

const THE_SIMPSONS_PARSED = new data.TvShow({
    originalName: "The Simpsons",
    id: 456,
    name: "The Simpsons",
    posterUrl: `${IMAGE_URL}/yTZQkSsxUFJZJe67IenRM0AEklc.jpg`,
    firstAirDate: "1989-12-17",
    originalLanguage: "en",
    backdropUrl: `${IMAGE_URL}/f5uNbUC76oowt5mt5J9QlqrIYQ6.jpg`,
    overview: "Set in Springfield, the average American town, the show focuses on the antics and everyday adventures of the Simpson family; Homer, Marge, Bart, Lisa and Maggie, as well as a virtual cast of thousands. Since the beginning, the series has been a pop culture icon, attracting hundreds of celebrities to guest star. The show has also made name for itself in its fearless satirical take on politics, media and American life in general.",
});

const MALCOLM_IN_THE_MIDDLE_PARSED = new data.TvShow({
    originalName: "Malcolm in the Middle",
    id : 2004,
    name: "Malcolm in the Middle",
    posterUrl: `${IMAGE_URL}/8I6xRdYBZhmGV0cKBGZZSham12T.jpg`,
    firstAirDate: "2000-01-09",
    originalLanguage: "en",
    backdropUrl: `${IMAGE_URL}/8VmOlxllljk6AiamMK8odBFNKl5.jpg`,
    overview:"A gifted young teen tries to survive life with his dimwitted, dysfunctional family.",
});

const MEG_RAYAN_PARSED = new data.Person({
    id: 5344,
    photoUrl: `${IMAGE_URL}/iv33eEcSakPCkO2MiR4bIZpjgyg.jpg`,
    name: "Meg Ryan",
    knownFor: I.List.of(THE_SIMPSONS_PARSED, SAVING_PRIVAGE_RYAN_PARSED).sortBy((r) => r.id)
});

const RYAN_GOSLING_PARSED = new data.Person({
    id: 30614,
    photoUrl: `${IMAGE_URL}/3KQmNWksVbk1foVe1n1qmuZXMCN.jpg`,
    name: "Ryan Gosling",
    knownFor: I.List.of(JACKIE_AND_RYAN_PARSED, MALCOLM_IN_THE_MIDDLE_PARSED).sortBy((r) => r.id)
});