import * as React from 'react';

export default class SearchInput extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.state = {
            focused: false,
            value: ''
        }
    }

    render () {
        return (
            <div className="SearchInput row">
                <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
                    <div className="input-group input-group-lg">
                        <input type="text" className="form-control" placeholder="Harrison Ford..."
                               value={this.state.value}
                               disabled={this.props.disabled}
                               onFocus={this.onInputFocus}
                               onBlur={this.onInputBlur}
                               onChange={this.onInputChange}
                               onKeyUp={this.onInputKeyUp} />
                        <span className="input-group-btn">
                        <button className="btn btn-default" type="button"
                                disabled={this.props.disabled || this.state.value.trim() === ''}
                                onClick={this.onButtonClick}>
                            <i className="fa fa-search"/>
                        </button>
                    </span>
                    </div>
                </div>
            </div>
        );
    };

    onInputFocus = (e) => {
        this.setState({focused: true});
    };

    onInputBlur = (e) => {
        this.setState({focused: false});
    };

    onInputChange = (e) => {
        this.setState({value: e.target.value});
    };

    onInputKeyUp = (e) => {
        let trimmedValue = e.target.value.trim();
        if (e.key === "Enter" && trimmedValue !== '') {
            this.props.onSubmit(trimmedValue);
        }
    };

    onButtonClick = (e) => {
        this.props.onSubmit(this.state.value.trim());
    };
}