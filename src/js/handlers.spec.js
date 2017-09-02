import * as I from 'immutable';
import * as data from './data';
import * as actions from './actions';
import { parseSearchResult } from './parsers';
import {
    initialize, search, handleSearchSuccess, handleSearchError, fetchNextSearchPage, handleNextSearchPageSuccess,
    handleNextSearchPageError
} from './handlers';

describe('initialize', () => {
    it('should assoc `initialized` true in state', function () {
        const initial = new data.ApplicationState();
        expect(initialize({})(initial, {})).toEqual(new data.ApplicationState({initialized: true}));
    });
});

describe('search', () => {
    it('should assoc proper values to state', () => {
        const initial = new data.ApplicationState({searchResult: I.List()});
        const deps = {config: {}, http: makeHttp(null, true), dispatch: jest.fn()};
        const updated = search(deps)(initial, {searchTerm: 'lion king'});
        const expected = initial.set('search', 'lion king').set('searchResult', null).set('pendingResultPage', 1);
        expect(updated).toEqual(expected);
    });

    it('should make a proper http request to fetch the first page of results', () => {
        const initial = new data.ApplicationState();
        const deps = {config: CONFIG, http: makeHttp(null, true), dispatch: jest.fn()};
        search(deps)(initial, {searchTerm: 'lion king'});
        expect(deps.http.get.mock.calls).toEqual([['http://api.com/search/multi']]);
        expect(deps.http.accept.mock.calls).toEqual([['application/json']]);
        expect(deps.http.query.mock.calls).toEqual([[{
            api_key: CONFIG.apiKey,
            language: 'en-US',
            query: 'lion king',
            include_adult: false
        }]]);
    });

    it('in case of http success should dispatch actions.handleSearchSuccess', () => {
        const initial = new data.ApplicationState();
        const deps = {config: CONFIG, http: makeHttp('whatever', true), dispatch: jest.fn()};
        search(deps)(initial, {searchTerm: 'lion king'});
        expect(deps.dispatch.mock.calls).toEqual([[{type: actions.HANDLE_SEARCH_SUCCESS, data: {result: 'whatever'}}]]);
    });

    it('in case of http error should dispatch actions.handleSearchError', () => {
        const initial = new data.ApplicationState();
        const deps = {config: CONFIG, http: makeHttp('whatever', false), dispatch: jest.fn()};
        search(deps)(initial, {searchTerm: 'lion king'});
        expect(deps.dispatch.mock.calls).toEqual([[{type: actions.HANDLE_SEARCH_ERROR, data: {}}]]);
    });
});

describe('handleSearchSuccess', () => {
    it('should assoc proper parsed values to state', () => {
        const initial = new data.ApplicationState();
        const updated = handleSearchSuccess({config: CONFIG})(initial, {result: SEARCH_BODY});
        expect(updated).toEqual(initial.set('searchResult', parseSearchResult(SEARCH_BODY, 1, CONFIG.imageRoot)))
    });
});

describe('handleSearchError', () => {
    it('should assoc proper values to state', () => {
        const initial = new data.ApplicationState({pendingResultPage: 10});
        const expected = initial
            .set('pendingResultPage', null)
            .set('recentError', "Sorry. We were unable to search for this term.");
        expect(handleSearchError({})(initial, {})).toEqual(expected);
    });
});

describe('fetchNextSearchPage', () => {
    it('should assoc proper values to state', () => {
        const initial = new data.ApplicationState();
        const deps = {config: {}, http: makeHttp(null, true), dispatch: jest.fn()};
        const updated = fetchNextSearchPage(deps)(initial, {page: 15});
        const expected = initial.set('pendingResultPage', 15);
        expect(updated).toEqual(expected);
    });

    it('should make a proper http request to fetch the given page of results', () => {
        const initial = new data.ApplicationState({search: 'matrix'});
        const deps = {config: CONFIG, http: makeHttp(null, true), dispatch: jest.fn()};
        fetchNextSearchPage(deps)(initial, {page: 22});
        expect(deps.http.get.mock.calls).toEqual([['http://api.com/search/multi']]);
        expect(deps.http.accept.mock.calls).toEqual([['application/json']]);
        expect(deps.http.query.mock.calls).toEqual([[{
            api_key: CONFIG.apiKey,
            language: 'en-US',
            query: 'matrix',
            include_adult: false,
            page: 22
        }]]);
    });

    it('in case of http success should dispatch actions.handleFetchNextSearchPageSuccess', () => {
        const initial = new data.ApplicationState();
        const deps = {config: CONFIG, http: makeHttp('whatever', true), dispatch: jest.fn()};
        fetchNextSearchPage(deps)(initial, {page: 22});
        expect(deps.dispatch.mock.calls).toEqual([[{type: actions.HANDLE_NEXT_SEARCH_PAGE_SUCCESS, data: {result: 'whatever'}}]]);
    });

    it('in case of http error should dispatch actions.handleFetchNextSearchPageError', () => {
        const initial = new data.ApplicationState();
        const deps = {config: CONFIG, http: makeHttp('whatever', false), dispatch: jest.fn()};
        fetchNextSearchPage(deps)(initial, {page: 300});
        expect(deps.dispatch.mock.calls).toEqual([[{type: actions.HANDLE_NEXT_SEARCH_PAGE_ERROR, data: {}}]]);
    });
});

describe('handleFetchNextSearchPageSuccess', () => {
    it('should assoc proper parsed values to state', () => {
        const initial = new data.ApplicationState({searchResult: parseSearchResult(SEARCH_BODY, 3, CONFIG.imageRoot)});
        const updated = handleNextSearchPageSuccess({config: CONFIG})(initial, {result: FETCH_NEXT_SEARCH_PAGE_BODY});
        const newResult = parseSearchResult(FETCH_NEXT_SEARCH_PAGE_BODY, 1, CONFIG.imageRoot);
        const merged = new data.SearchResult({
            results: I.List(I.Set(initial.searchResult.results.concat(newResult.results))).sortBy((x) => x.id),
            totalPages: FETCH_NEXT_SEARCH_PAGE_BODY.total_pages,
            fetchedPages: initial.searchResult.fetchedPages + newResult.fetchedPages
        });
        expect(updated).toEqual(initial.set('searchResult', merged));
    });
});

describe('handleFetchNextSearchPageError', () => {
    it('should assoc proper values to state', () => {
        const initial = new data.ApplicationState();
        const expected = initial
            .set('pendingResultPage', null)
            .set('recentError', "Sorry. We were unable to fetch more results.");
        expect(handleNextSearchPageError({})(initial, {})).toEqual(expected);
    });
});

const makeHttp = (returnValue, succeed) => {
    let http = {};

    http.get = jest.fn(() => http);
    http.accept = jest.fn(() => http);
    http.query = jest.fn(() => http);
    http.end = (callback) => {
        if (succeed) {
            callback(null, {body: returnValue});
        } else {
            callback({body: returnValue}, null);
        }
    };

    return http;
};

const CONFIG = {apiRoot: 'http://api.com', imageRoot: 'http://images.com', apiKey: 'APIKEY'};

const SEARCH_BODY = {
    "page":1,
    "total_results":2,
    "total_pages":1,
    "results":[
        {
            "popularity":10.106655,
            "media_type":"person",
            "id":524,
            "profile_path":"/jJcRWku3e9OHrmRqytn6WcBjhvh.jpg",
            "name":"Natalie Portman",
            "known_for":[
                {
                    "vote_average":6.6,
                    "vote_count":6385,
                    "id":10195,
                    "video":false,
                    "media_type":"movie",
                    "title":"Thor",
                    "popularity":26.997862,
                    "poster_path":"/bIuOWTtyFPjsFDevqvF3QrD1aun.jpg",
                    "original_language":"en",
                    "original_title":"Thor",
                    "genre_ids":[
                        12,
                        14,
                        28
                    ],
                    "backdrop_path":"/LvmmDZxkTDqp0DX7mUo621ahdX.jpg",
                    "adult":false,
                    "overview":"Against his father Odin's will, The Mighty Thor - a powerful but arrogant warrior god - recklessly reignites an ancient war. Thor is cast down to Earth and forced to live among humans as punishment. Once here, Thor learns what it takes to be a true hero when the most dangerous villain of his world sends the darkest forces of Asgard to invade Earth.",
                    "release_date":"2011-04-21"
                },
                {
                    "vote_average":6.8,
                    "vote_count":4617,
                    "id":76338,
                    "video":false,
                    "media_type":"movie",
                    "title":"Thor: The Dark World",
                    "popularity":28.867596,
                    "poster_path":"/bnX5PqAdQZRXSw3aX3DutDcdso5.jpg",
                    "original_language":"en",
                    "original_title":"Thor: The Dark World",
                    "genre_ids":[
                        28,
                        12,
                        14
                    ],
                    "backdrop_path":"/3FweBee0xZoY77uO1bhUOlQorNH.jpg",
                    "adult":false,
                    "overview":"Thor fights to restore order across the cosmos… but an ancient race led by the vengeful Malekith returns to plunge the universe back into darkness. Faced with an enemy that even Odin and Asgard cannot withstand, Thor must embark on his most perilous and personal journey yet, one that will reunite him with Jane Foster and force him to sacrifice everything to save us all.",
                    "release_date":"2013-10-29"
                },
                {
                    "vote_average":7.7,
                    "vote_count":4322,
                    "id":752,
                    "video":false,
                    "media_type":"movie",
                    "title":"V for Vendetta",
                    "popularity":16.97239,
                    "poster_path":"/AoGpqw4S4ZGgwhlM3FgzFVwyIGl.jpg",
                    "original_language":"en",
                    "original_title":"V for Vendetta",
                    "genre_ids":[
                        28,
                        53,
                        14
                    ],
                    "backdrop_path":"/gcxpeba5CtUA8Jkwio8sNZyimEC.jpg",
                    "adult":false,
                    "overview":"In a world in which Great Britain has become a fascist state, a masked vigilante known only as 'V' conducts guerrilla warfare against the oppressive British government. When 'V' rescues a young woman from the secret police, he finds in her an ally with whom he can continue his fight to free the people of Britain.",
                    "release_date":"2005-12-11"
                }
            ],
            "adult":false
        },
        {
            "vote_average":0,
            "vote_count":0,
            "id":298545,
            "video":true,
            "media_type":"movie",
            "title":"Natalie Portman: Starting Young",
            "popularity":1.814351,
            "poster_path":"/40vFol7nqwMPeJFaVnoRkzDooDS.jpg",
            "original_language":"en",
            "original_title":"Natalie Portman: Starting Young",
            "genre_ids":[
                99
            ],
            "backdrop_path":"/ioqE6LCDJchMhbTdcpMA9kpF0dg.jpg",
            "adult":false,
            "overview":"Natalie Portman reflects on how she was cast in the film Léon: The Professional (1994) at such a young age.",
            "release_date":"2005-01-11"
        }
    ]
};

const FETCH_NEXT_SEARCH_PAGE_BODY = {
    "page":2,
    "total_results":868,
    "total_pages":44,
    "results":[
        {
            "original_name":"Boys Be...",
            "id":34740,
            "media_type":"tv",
            "name":"Boys Be...",
            "vote_count":0,
            "vote_average":0,
            "poster_path":"/CxVrdgIUec9aWMsvAjGvw0zdCV.jpg",
            "first_air_date":"",
            "popularity":1.608173,
            "genre_ids":[

            ],
            "original_language":"en",
            "backdrop_path":"/36KzyNW13sbWoGFccUzXNb3wpx1.jpg",
            "overview":"Boys Be... is a manga created and written by Masahiro Itabashi and illustrated by Hiroyuki Tamakoshi, which was in 2000 adapted into a 13 episode anime series by Hal Film Maker.\n\nThree different Boys Be... manga series were serialized by Kodansha in Shukan Shōnen Magazine. In 2009 Kodansha announced a fourth series, Boys Be... Next Season, starting in the November 2009 issue of Magazine Special. The second manga series is licensed in North America by Tokyopop.\n\nThe anime first aired on WOWOW in April-June 2000. It was licensed by The Right Stuf International. The first DVD volume of the series was released in North America on February 28, 2006. Comcast and several other cable providers have shown Boys Be On Demand in the United States through the Anime Network. This series was aired on AXN-Asia before it handed all anime broadcasting duties to ANIMAX Asia, and, unlike other AXN anime making it to ANIMAX, was never retained. It also aired on Spanish networks Jonu Media and K3.",
            "origin_country":[
                "JP"
            ]
        },
        {
            "vote_average":0,
            "vote_count":0,
            "id":463632,
            "video":false,
            "media_type":"movie",
            "title":"Boys",
            "popularity":1.001875,
            "poster_path":"/2GRANntoKMEnq9ILIevu9Cq496a.jpg",
            "original_language":"ru",
            "original_title":"Мальчишки",
            "genre_ids":[
                18,
                10751,
                12
            ],
            "backdrop_path":"/vkBfEKqEEOURKf2qpTUTLHQ2jG9.jpg",
            "adult":false,
            "overview":"Two stories about the life of a young boxer Sasha and his friends in Leningrad during a first years after WWII.",
            "release_date":"1969-12-27"
        },
        {
            "vote_average":0,
            "vote_count":0,
            "id":334345,
            "video":false,
            "media_type":"movie",
            "title":"Boys",
            "popularity":1.000392,
            "poster_path":"/7r4sAI9f4dvWg6dV2qOsMFaWoPB.jpg",
            "original_language":"en",
            "original_title":"Xiao hai",
            "genre_ids":[

            ],
            "backdrop_path":null,
            "adult":false,
            "overview":"While preparing to shoot this short feature for television, Tsai discovered and auditioned a young man working as a guard at a video arcade. This was Lee Kang-sheng, Tsai’s muse-to-be, who has appeared in all of his feature films to date. Lee plays a junior-high student who bullies and blackmails a younger boy, then receives the same treatment at the hands of some older students, in what could be a practice run for the presentation of dog-eat-dog youth in the following year’s Rebels of the Neon God. One of ten television features Tsai wrote between 1989 and 1991, Boys offers a rare glimpse into his apprenticeship period. “I decided to be more accepting of Hsiao-kang's acting, rather than force him to react quicker,” said Tsai. “If that's the way he reacts, that's the way he is.”",
            "release_date":"1991-04-10"
        },
        {
            "vote_average":5.7,
            "vote_count":29,
            "id":18394,
            "video":false,
            "media_type":"movie",
            "title":"Essex Boys",
            "popularity":4.113989,
            "poster_path":"/utskEljHWucO6lFsZLvWrRIE8c6.jpg",
            "original_language":"en",
            "original_title":"Essex Boys",
            "genre_ids":[
                80,
                53
            ],
            "backdrop_path":"/l5mdQKqdVzVEo47qiXAdH7dwdqL.jpg",
            "adult":false,
            "overview":"Billy has just scored an entry-level position with the local crime cartel. His first job is to mind Jason, a newly released thug with a vicious temper. Jason thinks it's his job to teach Billy about crime, drugs and women. Little does he know that Billy has his eyes on Jason's own wife, Lisa. When an ecstasy deal goes bad, Jason vows revenge on the boss, while Billy looks to take out Jason. Before long, bodies start turning up",
            "release_date":"2000-07-14"
        },
        {
            "original_name":"My Boys",
            "id":3965,
            "media_type":"tv",
            "name":"My Boys",
            "vote_count":1,
            "vote_average":2,
            "poster_path":"/1crxPgb6drtgDC5NOMHWEiKv5OJ.jpg",
            "first_air_date":"2006-11-28",
            "popularity":2.001613,
            "genre_ids":[
                35
            ],
            "original_language":"en",
            "backdrop_path":"/vxr7ff4woiR3yXm04QSTakCV1ws.jpg",
            "overview":"My Boys is an American television sitcom that debuted on November 28, 2006, on TBS. The show deals with a female sports columnist in Chicago, Illinois and the men in her life including her brother and her best friend. The show was canceled by TBS on September 14, 2010, making the fourth season finale, broadcast two days prior, the series finale.",
            "origin_country":[
                "US"
            ]
        },
        {
            "original_name":"Angry Boys",
            "id":32722,
            "media_type":"tv",
            "name":"Angry Boys",
            "vote_count":9,
            "vote_average":6.5,
            "poster_path":"/wLlSiM9XyJkCO3WcuHAd1SuWPKF.jpg",
            "first_air_date":"2011-05-11",
            "popularity":1.931296,
            "genre_ids":[
                18,
                35
            ],
            "original_language":"en",
            "backdrop_path":"/AcK4mvPKgr0ygLparETPuUAxPLc.jpg",
            "overview":"Angry Boys is an Australian television mockumentary series written by and starring Chris Lilley. Continuing the mockumentary style of his previous series, the show explores the issues faced by young males in the 21st century – their influences, their pressures, their dreams and ambitions. In Angry Boys, Lilley plays multiple characters: S.mouse, an American rapper; Jen, a manipulative Japanese mother; Blake Oakfield, a champion surfer; Ruth \"Gran\" Sims, a guard at a juvenile detention facility; and her grandchildren, South Australian twins Daniel and Nathan Sims.\n\nThe series is a co-production between the Australian Broadcasting Corporation and US cable channel HBO, with a pre-sale to BBC Three in the United Kingdom. Filmed in Melbourne, Los Angeles and Tokyo, Angry Boys premièred on 11 May 2011 at 9:00 pm on ABC1.",
            "origin_country":[
                "AU"
            ]
        },
        {
            "original_name":"Boys Will Be Boys",
            "id":44159,
            "media_type":"tv",
            "name":"Boys Will Be Boys",
            "vote_count":0,
            "vote_average":0,
            "poster_path":null,
            "first_air_date":"1987-12-01",
            "popularity":1.506811,
            "genre_ids":[

            ],
            "original_language":"en",
            "backdrop_path":null,
            "overview":"",
            "origin_country":[

            ]
        },
        {
            "vote_average":7.2,
            "vote_count":340,
            "id":226,
            "video":false,
            "media_type":"movie",
            "title":"Boys Don't Cry",
            "popularity":5.30972,
            "poster_path":"/6bqIZTEuJnUrgnxcymciszvOz8J.jpg",
            "original_language":"en",
            "original_title":"Boys Don't Cry",
            "genre_ids":[
                80,
                18
            ],
            "backdrop_path":"/nriBinb7Y3Bm6LdbmOC0mFxSm8d.jpg",
            "adult":false,
            "overview":"Female born, Teena Brandon adopts his male identity of Brandon Teena and attempts to find himself and love in Nebraska.",
            "release_date":"1999-09-02"
        },
        {
            "original_name":"ファイアーボーイズ",
            "id":35510,
            "media_type":"tv",
            "name":"Fire Boys",
            "vote_count":0,
            "vote_average":0,
            "poster_path":"/tQKXXsj6VJSqKLu1EidOGRky3uM.jpg",
            "first_air_date":"2004-01-06",
            "popularity":1.016461,
            "genre_ids":[
                28,
                18
            ],
            "original_language":"ja",
            "backdrop_path":null,
            "overview":"",
            "origin_country":[
                "JP"
            ]
        },
        {
            "vote_average":6.9,
            "vote_count":533,
            "id":1547,
            "video":false,
            "media_type":"movie",
            "title":"The Lost Boys",
            "popularity":6.4485,
            "poster_path":"/evo7oiay9qDUzY510VhrB3YzyJs.jpg",
            "original_language":"en",
            "original_title":"The Lost Boys",
            "genre_ids":[
                27,
                35
            ],
            "backdrop_path":"/3wMkHCnwG2PdNeFkfou8vTY2g5b.jpg",
            "adult":false,
            "overview":"A mother and her two teenage sons move to a seemingly nice and quiet small coastal California town yet soon find out that it's overrun by bike gangs and vampires. A couple of teenage friends take it upon themselves to hunt down the vampires that they suspect of a few mysterious murders and restore peace and calm to their town.",
            "release_date":"1987-07-31"
        },
        {
            "original_name":"Happii Bōizu",
            "id":42536,
            "media_type":"tv",
            "name":"Happy Boys",
            "vote_count":0,
            "vote_average":0,
            "poster_path":null,
            "first_air_date":"",
            "popularity":1.210945,
            "genre_ids":[
                35
            ],
            "original_language":"ja",
            "backdrop_path":null,
            "overview":"Happy Boys is a Japanese television comedy, following five young men who work at Lady Braganza, a shitsuji kissa. It was adapted into a manga by Makoto Tateno.",
            "origin_country":[
                "JP"
            ]
        },
        {
            "vote_average":3.8,
            "vote_count":3,
            "id":90241,
            "video":false,
            "media_type":"movie",
            "title":"All Boys",
            "popularity":2.016841,
            "poster_path":"/gg503Ehy4DdSUvhBTQ9G0djOGRM.jpg",
            "original_language":"fi",
            "original_title":"Poikien bisnes",
            "genre_ids":[
                99
            ],
            "backdrop_path":"/33U21rrX95MpfOXOp3CoW2fBxje.jpg",
            "adult":false,
            "overview":"A look at the social and individual impact of the boy porn industry in Europe. Men in boy porn business within the commerciality of the passing beauty of youth, of poverty. Gay porn is the fastest growing segment of the Entertainment business. And it's the exploitation of the lonely...",
            "release_date":"2009-06-15"
        },
        {
            "vote_average":0,
            "vote_count":0,
            "id":434458,
            "video":false,
            "media_type":"movie",
            "title":"Star Boys",
            "popularity":2.002707,
            "poster_path":"/oE7NGHrQrWcKA7L6cxNRITnGV4a.jpg",
            "original_language":"fi",
            "original_title":"Kaiken se kestää",
            "genre_ids":[
                18
            ],
            "backdrop_path":null,
            "adult":false,
            "overview":"Through the eyes of two 12-year-old boys, the sexual revolution arrives in a conservative and religious small town in Northern Finland.",
            "release_date":"2017-02-01"
        },
        {
            "vote_average":6.8,
            "vote_count":157,
            "id":11004,
            "video":false,
            "media_type":"movie",
            "title":"Wonder Boys",
            "popularity":3.12126,
            "poster_path":"/aajFu5pK4YqBLKEkZzSBpJjoG68.jpg",
            "original_language":"en",
            "original_title":"Wonder Boys",
            "genre_ids":[
                35,
                18
            ],
            "backdrop_path":"/rm17rjlE1cMZ3htuLu4BVXJxh5m.jpg",
            "adult":false,
            "overview":"Grady (Michael Douglas) is a 50-ish English professor who hasn't had a thing published in years -- not since he wrote his award winning \"Great American Novel\" 7 years ago. This weekend proves even worse than he could imagine as he finds himself reeling from one misadventure to another in the company of a new wonder boy author.",
            "release_date":"2000-02-22"
        },
        {
            "original_name":"チア男子!!",
            "id":67616,
            "media_type":"tv",
            "name":"Cheer Boys!!",
            "vote_count":1,
            "vote_average":5,
            "poster_path":"/22ml2O1aQGwzeDREb4AR2LHejCD.jpg",
            "first_air_date":"2016-07-05",
            "popularity":1.670224,
            "genre_ids":[
                16,
                35
            ],
            "original_language":"ja",
            "backdrop_path":null,
            "overview":"Disheartened with judo, college student Haruki Bando was invited by his childhood friend Kazuma Hashimoto to create \"BREAKERS\", an unprecedented boys' cheerleading team. Those that came to join all were very characteristic in nature: argumentative Mizoguchi, voracious Ton, frivolous Kansai boys Gen and Ichiro, and Sho who has cheerleading experience.",
            "origin_country":[

            ]
        },
        {
            "original_name":"Os Boys",
            "id":67917,
            "media_type":"tv",
            "name":"Os Boys",
            "vote_count":0,
            "vote_average":0,
            "poster_path":"/rOwhJcWiBZJFqidSRQjdh9F22lt.jpg",
            "first_air_date":"2016-09-07",
            "popularity":1.59487,
            "genre_ids":[
                35
            ],
            "original_language":"pt",
            "backdrop_path":null,
            "overview":"Political comedy series about the political advisers of the ministerial cabinets and the opposition and their connivance with economic and political interests that determine how decisions are made.",
            "origin_country":[
                "PT"
            ]
        },
        {
            "original_name":"Momma's Boys",
            "id":8465,
            "media_type":"tv",
            "name":"Momma's Boys",
            "vote_count":0,
            "vote_average":0,
            "poster_path":"/n4Xw8Qj5Ru2JWajtVOd53WYBLs.jpg",
            "first_air_date":"2008-12-16",
            "popularity":1.430752,
            "genre_ids":[
                10764
            ],
            "original_language":"en",
            "backdrop_path":"/z4hRyGNfI3KNgBi2DprYdz0bCZL.jpg",
            "overview":"Momma's Boys is an American reality television series on the NBC network, executive produced by Ryan Seacrest and Andrew Glassman, which centers on a group of mothers who must help choose the perfect woman for their complacent sons. Ultimately, the series poses the question: \"Who is really the most important woman in every man's life?\"\n\nAt the beginning of the series, 32 single women are contestants seeking romance with any of three single men. The men's mothers are brought in to live in a house with the female contestants while the sons are housed in a nearby condominium.\n\nThroughout the series, the female contestants participate in competitions and are selected by the men for dates, with some of the contestants being eliminated at various intervals. Each woman receives a text message of \"yes\" if any of the men want to keep her in contention or \"no\" if none of them want to keep her in contention. If the men are undecided, they send a text message for the woman to meet them at the house's swimming pool, where the men have an additional opportunity to talk to her before deciding whether she should stay or go.",
            "origin_country":[
                "US"
            ]
        },
        {
            "original_name":"花より男子",
            "id":27757,
            "media_type":"tv",
            "name":"Boys Over Flowers",
            "vote_count":0,
            "vote_average":0,
            "poster_path":"/yPG2GiTqZgmvjyq93lBPDaoQ79E.jpg",
            "first_air_date":"",
            "popularity":1.585872,
            "genre_ids":[
                16,
                18
            ],
            "original_language":"ja",
            "backdrop_path":null,
            "overview":"",
            "origin_country":[
                "JP"
            ]
        },
        {
            "original_name":"Boys' Toys",
            "id":59846,
            "media_type":"tv",
            "name":"Boys' Toys",
            "vote_count":0,
            "vote_average":0,
            "poster_path":null,
            "first_air_date":"",
            "popularity":1.210938,
            "genre_ids":[

            ],
            "original_language":"en",
            "backdrop_path":null,
            "overview":"",
            "origin_country":[

            ]
        },
        {
            "vote_average":5.8,
            "vote_count":21,
            "id":256969,
            "video":false,
            "media_type":"movie",
            "title":"Boys of Abu Ghraib",
            "popularity":4.969656,
            "poster_path":"/8AfK1rgEQZ8s2m3caPwm1VlOz7D.jpg",
            "original_language":"en",
            "original_title":"Boys of Abu Ghraib",
            "genre_ids":[
                18,
                10752,
                53
            ],
            "backdrop_path":"/wFKIcThy4sDfZKkSZcPBHDbchmt.jpg",
            "adult":false,
            "overview":"An American soldier deployed at Abu Ghraib finds himself behind the walls of the infamous Hard Site, where he develops a secret friendship with an Iraqi detainee.",
            "release_date":"2014-03-15"
        }
    ]
};