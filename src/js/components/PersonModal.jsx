import * as React from 'react';
import * as data from '../data';

export default function PersonModal (props, context) {
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
                        <h1>{props.person.name}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 text-center">
                        {props.person.photoUrl !== null
                            ? <img src={props.person.photoUrl} alt={`${props.person.name} photo`} />
                            : null}
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <div>Featured in:</div>
                        <ul>
                            {props.person.knownFor.map((item) => {
                                if (item instanceof data.Movie) {
                                    return <li key={`movie ${item.id}`}>{item.title}</li>;
                                } else if (item instanceof data.TvShow) {
                                    return <li key={`tv show ${item.id}`}>{item.name}</li>;
                                } else {
                                    return null;
                                }
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}