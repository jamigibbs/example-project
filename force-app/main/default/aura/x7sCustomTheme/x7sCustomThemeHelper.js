({
    getBodyClass: function(component) {
        let fullWidth = component.get("v.fullWidth");
        fullWidth ?
            component.set("v.bodyClass", "slds-container_center") :
            component.set("v.bodyClass", "slds-p-vertical_large slds-container_center slds-container_x-large");
    },

    getLogoImage: function(component){
        const href = window.location.href;
        const url = new URL(href);
        const id = url.searchParams.get('id');

        const logo1 = $A.get('$Resource.htlf_logo');
        const logo2 = $A.get('$Resource.logo_2');

        if (Number(id) === 1) {
            component.set('v.logo', logo1);  
        } else if (Number(id) === 2) {
            component.set('v.logo', logo2);
        } else {
            component.set('v.logo', logo1);  
        }
        
    }
});