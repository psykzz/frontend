/**
 * general onbeforeremove funciton for components
 * that places a clone of the node in its place.
 * we use this to keep multiple components visible 
 * for state transitions
 */
export default function ({ dom }, done) {
    const dupe = dom.cloneNode(true);
    dom.insertAdjacentElement("afterend", dupe);
    done();
    setTimeout(function () {
        dupe.remove();
    }, 310);
};
