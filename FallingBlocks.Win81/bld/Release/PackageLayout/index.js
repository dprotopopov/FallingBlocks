
$(function() {
    var startupView = "View1";


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
    FallingBlocks.app.navigate();
});