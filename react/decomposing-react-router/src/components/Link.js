import React from 'react';
import navigateTo from './history';

const Link = props => {
    /* This function will replace the normal click handler for a link.
     * Normally, a link will make a new HTTP request with the new URL.
     * Instead, this transition will alter the URL through the history
     * object, allowing our JS (React in particular) to control what
     * is displayed without making a new HTTP request for content to
     * show.
     */
    const transition = event => {
        // Prevent click from causing HTTP request.
        event.preventDefault();
        /* NOTE: event.currentTarget returns the element whose event
         * listners triggered the clicking event. We clicked on the
         * the `a` element, so the value of event.currentTarget is the
         * `a` element itself. We can get attributes from this tag
         * by using dot notation. The attributes of the tag are
         * represented as keys of the object returned by
         * event.currentTarget.
         *
         * Source:
         * <https://www.w3schools.com/jsref/dom_obj_anchor.asp>
         */
        console.log("href:", event.currentTarget.href);
        console.log("pathname:", event.currentTarget.pathname);
        //console.log("Search:", event.currentTarget.search);
        navigateTo(event.currentTarget.pathname);
    }

    console.log("Link render.");
    return (
        <a href={props.to} onClick={transition}>
            {props.children}
        </a>
    );
}

export default Link;
