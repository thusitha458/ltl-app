import React from 'react';
import MenuAppBar from "./MenuAppBar";

const Layout = props => {
    return (
        <>
            <MenuAppBar {...props} title={props.title} isHome={props.isHome} />
            <div className="content">
                {props.children}
            </div>
        </>
    );
};

export default Layout;