export const INITIALIZE = "@@moviedb-demo/initialize";
export const initialize = () => { return {type: INITIALIZE, data: {}}; };

export const SEARCH = "@@moviedb-demo/search";
export const search = (searchTerm) => { return {type: SEARCH, data: {searchTerm: searchTerm}} };

export const HANDLE_SEARCH_SUCCESS = "@@moviedb-demo/handle-search-success";
export const handleSearchSuccess = (result) => { return {type: HANDLE_SEARCH_SUCCESS, data: {result: result}} };

export const HANDLE_SEARCH_ERROR = "@@moviedb-demo/handle-search-error";
export const handleSearchError = () => { return {type: HANDLE_SEARCH_ERROR, data: {}} };

export const FETCH_NEXT_SEARCH_PAGE = "@@moviedb-demo/fetch-next-search-page";
export const fetchNextSearchPage = (page) => { return {type: FETCH_NEXT_SEARCH_PAGE, data: {page: page}} };

export const HANDLE_NEXT_SEARCH_PAGE_SUCCESS = "@@moviedb-demo/handle-next-search-page-success";
export const handleNextSearchPageSuccess = (result) => {
    return {type: HANDLE_NEXT_SEARCH_PAGE_SUCCESS, data: {result: result}}
};

export const HANDLE_NEXT_SEARCH_PAGE_ERROR = "@@moviedb-demo/handle-next-search-page-error";
export const handleNextSearchPageError = () => { return {type: HANDLE_NEXT_SEARCH_PAGE_ERROR, data: {}} };

export const DISMISS_ERROR = "@@moviedb-demo/dismiss-error";
export const dismissError = () => { return {type: DISMISS_ERROR, data: {}} };