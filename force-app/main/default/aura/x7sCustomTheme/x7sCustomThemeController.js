({
    doInit: function(component, event, helper) {
        const logo = $A.get('$Resource.htlf_logo');
        component.set('v.logo', logo);

        helper.getBodyClass(component);
        helper.getLogoImage(component);
    },

    gotoUrl: function() {
        const action = $A.get('e.force:navigateToURL');
        action.setParams({
            url: '/'
        });
        action.fire();
    }
});