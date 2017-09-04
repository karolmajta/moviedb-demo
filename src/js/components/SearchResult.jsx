import * as React from 'react';
import * as data from '../data';
import MovieModal from './MovieModal.jsx';
import TvShowModal from './TvShowModal.jsx';
import PersonModal from './PersonModal.jsx';

export default class SearchResult extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.state = {modalItem: null}
    }

    render () {
        return (
            <div className="SearchResult">
                <div className="row results">
                    {this.props.result.results.map((item) => this.renderResult(item))}
                </div>
                {this.props.result.totalPages > this.props.result.fetchedPages
                    ? this.renderShowMore(this.props.result.fetchedPages + 1, this.props.loading, this.props.disabled, this.props.onRequestNextPage)
                    : null}
                {this.state.modalItem !== null ? this.renderModal(): null}
            </div>
        );
    }

    renderResult (result) {
        if (result instanceof data.Movie) {
            return this.renderMovie(result);
        } else if (result instanceof data.TvShow) {
            return this.renderTvShow(result);
        } else if (result instanceof data.Person) {
            return this.renderPerson(result);
        } else {
            return null;
        }
    }

    renderMovie (movie) {
        return (
            <div  key={`movie-${movie.id}`} className="col-xs-12 col-sm-6 col-md-4 text-center search-result"
                  onClick={(e) => this.onItemClick(movie)}>
                <div className="inner">
                    <i className="fa fa-2x fa-video-camera" />
                    {movie.title}
                </div>
            </div>
        );
    }

    renderTvShow (tvShow) {
        return (
            <div key={`tvshow-${tvShow.id}`} className="col-xs-12 col-sm-6 col-md-4 text-center search-result"
                 onClick={(e) => this.onItemClick(tvShow)}>
                <div className="inner">
                    <i className="fa fa-2x fa-tv" />
                    {tvShow.name}
                </div>
            </div>
        );
    }

    renderPerson (person) {
        return (
            <div key={`person-${person.id}`} className="col-xs-12 col-sm-6 col-md-4 text-center search-result"
                 onClick={(e) => this.onItemClick(person)}>
                <div className="inner">
                    <i className="fa fa-2x fa-user" />
                    {person.name}
                </div>
            </div>
        );
    }

    renderShowMore (pageToFetch, loading, disabled, onClick) {
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
    
    renderModal () {
        if (this.state.modalItem instanceof data.Movie) {
            return <MovieModal movie={this.state.modalItem} onClose={(e) => this.onModalClose()} />;
        } else if (this.state.modalItem instanceof data.TvShow) {
            return <TvShowModal tvShow={this.state.modalItem} onClose={(e) => this.onModalClose()} />;
        } else if (this.state.modalItem instanceof data.Person) {
            return <PersonModal person={this.state.modalItem} onClose={(e) => this.onModalClose()} />;
        } else {
            return null;
        }
    }

    onItemClick = (item) => {
        this.setState({modalItem: item});
    };

    onModalClose = () => {
        this.setState({modalItem: null});
    };
}