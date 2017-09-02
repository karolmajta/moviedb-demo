import * as React from 'react';
import * as data from '../data';

export default function SearchResult (props, context) {
    return (
        <div className="SearchResult">
            <div className="row results">
                {props.result.results.map((triple) => renderResult(triple, props.onItemSelect))}
            </div>
            {props.result.totalPages > props.result.fetchedPages
                ? renderShowMore(props.result.fetchedPages+1, props.loading, props.disabled, props.onRequestNextPage)
                : null}
        </div>
    );
}

function renderResult (result, onClick) {
    if (result instanceof data.Movie) {
        return renderMovie(result, onClick);
    } else if (result instanceof data.TvShow) {
        return renderTvShow(result, onClick);
    } else if (result instanceof data.Person) {
        return renderPerson(result, onClick);
    } else {
        return null;
    }
}

function renderMovie (movie, onClick) {
    return (
        <div  key={`movie-${movie.id}`} className="col-xs-12 col-sm-6 col-md-4 text-center search-result"
              onClick={(e) => onClick(movie)}>
            <div className="inner">
                <i className="fa fa-2x fa-video-camera" />
                {movie.title}
            </div>
        </div>
    );
}

function renderTvShow (tvShow, onClick) {
    return (
        <div key={`tvshow-${tvShow.id}`} className="col-xs-12 col-sm-6 col-md-4 text-center search-result"
             onClick={(e) => onClick(tvShow)}>
            <div className="inner">
                <i className="fa fa-2x fa-tv" />
                {tvShow.name}
            </div>
        </div>
    );
}

function renderPerson (person, onClick) {
    return (
        <div key={`person-${person.id}`} className="col-xs-12 col-sm-6 col-md-4 text-center search-result"
             onClick={(e) => onClick(person)}>
            <div className="inner">
                <i className="fa fa-2x fa-user" />
                {person.name}
            </div>
        </div>
    );
}

function renderShowMore (pageToFetch, loading, disabled, onClick) {
    return (
        <div className="row show-more">
            <div className="col-xs-8 col-xs-offset-2 col-md-6 col-md-offset-3">
                <button className="btn btn-lg btn-block btn-default"
                        disabled={loading || disabled}
                        onClick={(e) => onClick(pageToFetch)}>
                    {'Show more '}{loading ? <i className="fa fa-spinner fa-spin" /> : null}
                </button>
            </div>
        </div>
    );
}