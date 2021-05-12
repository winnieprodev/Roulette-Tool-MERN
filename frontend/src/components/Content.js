import React from "react";

const Content = ({ children,...props }) => {
    const childwithprops = React.Children.map(children,child=>React.cloneElement(child,props));
    return (
        <div className="content p-0 ">{childwithprops}</div>
    )
}

export default Content;
