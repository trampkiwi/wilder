var modalView = {};

modalView.openModal = function(mv, veil, height, doFreezeBody) { // Default behaviour is to freeze the body.
    veil.css('display', 'block');
    veil.css('background-color', 'rgba(0, 0, 0, 0.5)');

    mv.css('height', height);
    var transitionEndPromise = new Promise((resolve, reject) => {
        mv.on('transitionend', () => {
            resolve();
        });
    });

    if(doFreezeBody || typeof doFreezeBody == 'undefined') {
        var body = $('body');

        body.css('top', (-1 * body.scrollTop()).toString() + 'px');
        body.css('left', '0');
        body.css('position', 'fixed');
    }

    return transitionEndPromise;
};

modalView.closeModal = function(mv, veil, wasBodyFrozen) {
    veil.css('background-color', 'rgba(0, 0, 0, 0)');
    veil.on('transitionend', () => {
        veil.css('display', 'none');
    });

    mv.css('height', '0');
    var transitionEndPromise = new Promise((resolve, reject) => {
        mv.on('transitionend', () => {
            resolve();
        });
    });

    if(wasBodyFrozen || typeof wasBodyFrozen == 'undefined') { // Default behaviour is to unfreeze the body.

        var body = $('body');

        body.css('position', 'static');
        var topStr = body.css('top');
        var scrollPos = -1 * parseInt(topStr.substring(0, topStr.length - 2));

        setTimeout(() => {
            body.scrollTop(scrollPos);
        }, 2);
    }
    
    return transitionEndPromise;
}