import React from 'react';
import MenuAppBar from "./MenuAppBar";

const Layout = props => {
    return (
        <>
            <MenuAppBar {...props} title={props.title} isHome={props.isHome} items={props.items} />
            <div className="content">
                {props.children}
            </div>
        </>
    );
};

export default Layout;