L.Control.MenuButton = L.Control.extend({
    onAdd: function(map) {
        var menuButton = L.DomUtil.create('input');
        menuButton.id = '#open_menu';
        menuButton.type = 'button';
        

        return menuButton;
    },

    onRemove: function(map) {

    }
});

L.control.menubutton = function(opts) {
    return new L.Control.MenuButton(opts);
};