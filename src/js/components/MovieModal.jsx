import * as React from 'react';

export default function MovieModal (props, context) {
    return (
        <div id="myModal" className="MovieModal fullscreen-overlay">
            <div className="close text-right">
                <a href="" onClick={(e) => {e.preventDefault(); props.onClose()}}>
                    <i className="fa fa-3x fa-close" />
                </a>
            </div>
            <div className="container">
                <div className="row title">
                    <div className="col-xs-12 text-center">
                        <h1>{props.movie.title}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 text-center">
                        {props.movie.posterUrl !== null
                            ? <img src={props.movie.posterUrl} alt={`${props.movie.title} photo`} />
                            : null}
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <div>
                            <strong>Release Date</strong>
                        </div>
                        <div>{props.movie.releaseDate || 'N/A'}</div>
                        <div>
                            <strong>Original Language</strong>
                        </div>
                        <div>{props.movie.originalLanguage || 'N/A'}</div>
                        <div>
                            <strong>Original Title</strong>
                        </div>
                        <div>{props.movie.originalTitle || 'N/A'}</div>
                        <div>
                            <strong>Overview</strong>
                        </div>
                        <div>{props.movie.overview || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}