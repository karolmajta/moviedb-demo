import * as React from 'react';

export default function TvShowModal (props, context) {
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
                        <h1>{props.tvShow.name}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 text-center">
                        {props.tvShow.posterUrl !== null
                            ? <img src={props.tvShow.posterUrl} alt={`${props.tvShow.name} photo`} />
                            : null}
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <div>
                            <strong>First Air Date</strong>
                        </div>
                        <div>{props.tvShow.firstAirDate || 'N/A'}</div>
                        <div>
                            <strong>Original Language</strong>
                        </div>
                        <div>{props.tvShow.originalLanguage || 'N/A'}</div>
                        <div>
                            <strong>Original Name</strong>
                        </div>
                        <div>{props.tvShow.originalName || 'N/A'}</div>
                        <div>
                            <strong>Overview</strong>
                        </div>
                        <div>{props.tvShow.overview || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}