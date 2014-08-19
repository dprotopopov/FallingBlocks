
$(function() {
    var startupView = "View1";

    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    if(DevExpress.devices.real().platform === "win8") {
        $("body").css("background-color", "#000");
    }

    document.addEventListener("deviceready", onDeviceReady, false);
    
    function onDeviceReady() {
        navigator.splashscreen.hide();
        document.addEventListener("backbutton", onBackButton, false);
    }

    function onBackButton() {
        DevExpress.hardwareBackButton.fire();
    }

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !FallingBlocks.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "tizen":
                tizen.application.getCurrentApplication().exit();
                break;
            case "android":
                navigator.app.exitApp();
                break;
            case "win8":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }

    FallingBlocks.app = new DevExpress.framework.html.HtmlApplication({
        namespace: FallingBlocks,
        layoutSet: DevExpress.framework.html.layoutSets[FallingBlocks.config.layoutSet],
        navigation: FallingBlocks.config.navigation,
        commandMapping: FallingBlocks.config.commandMapping
    });

    $(window).unload(function() {
        FallingBlocks.app.saveState();
    });

    FallingBlocks.app.router.register(":view/:id", { view: startupView, id: undefined });
    FallingBlocks.app.navigatingBack.add(onNavigatingBack);
    FallingBlocks.app.navigate();
});