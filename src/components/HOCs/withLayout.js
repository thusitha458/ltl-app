import React, {Component} from 'react';
import MenuAppBar from "../MenuAppBar";

const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

const withLayout = title => WrappedComponent => {
    return class WithLayout extends Component {
        state = {title: ''};

        componentDidMount() {
            if (isFunction(title)) {
                this.setState({title: title(this.props)});
            } else {
                this.setState({title: title});
            }
        }

        render() {
            return (
                <>
                    <MenuAppBar {...this.props} title={this.state.title} />
                    <div className="content">
                        <WrappedComponent {...this.props}/>
                    </div>
                </>
            );
        }
    }
};



export default withLayout;