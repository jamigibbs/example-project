/**
 * Created by brianpoulsen on 11/25/19.
 */

({
    doInit: function(component, event, helper) {
        helper.getBodyClass(component);
    },

    gotoUrl: function() {
        const action = $A.get('e.force:navigateToURL');
        action.setParams({
            url: '/'
        });
        action.fire();
    }
});