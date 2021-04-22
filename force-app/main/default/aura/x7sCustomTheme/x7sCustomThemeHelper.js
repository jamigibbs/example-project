/**
 * Created by brianpoulsen on 12/11/19.
 */

({
    getBodyClass: function(component) {
        let fullWidth = component.get("v.fullWidth");
        fullWidth ?
            component.set("v.bodyClass", "slds-container_center") :
            component.set("v.bodyClass", "slds-p-vertical_large slds-container_center slds-container_x-large");
    }
});