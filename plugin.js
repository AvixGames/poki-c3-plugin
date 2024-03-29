"use strict";

{
  const SDK = self.SDK;

  ////////////////////////////////////////////
  // The plugin ID is how Construct identifies different kinds of plugins.
  // *** NEVER CHANGE THE PLUGIN ID! ***
  // If you change the plugin ID after releasing the plugin, Construct will think it is an entirely different
  // plugin and assume it is incompatible with the old one, and YOU WILL BREAK ALL EXISTING PROJECTS USING THE PLUGIN.
  // Only the plugin name is displayed in the editor, so to rename your plugin change the name but NOT the ID.
  // If you want to completely replace a plugin, make it deprecated (it will be hidden but old projects keep working),
  // and create an entirely new plugin with a different plugin ID.
  const PLUGIN_ID = "Avix_PokiSDK_ForC3";
  ////////////////////////////////////////////

  const PLUGIN_VERSION = "1.0.2.1";
  const PLUGIN_CATEGORY = "platform-specific";

  const PLUGIN_CLASS =
    (SDK.Plugins.Avix_PokiSDK_ForC3 = class PokiSDKC3Plugin extends (
      SDK.IPluginBase
    ) {
      constructor() {
        super(PLUGIN_ID);

        SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

        this._info.SetName(self.lang(".name"));
        this._info.SetDescription(self.lang(".description"));
        this._info.SetVersion(PLUGIN_VERSION);
        this._info.SetCategory(PLUGIN_CATEGORY);
        this._info.SetAuthor("Avix Games");
        this._info.SetHelpUrl(self.lang(".help-url"));
        this._info.SetIsSingleGlobal(true);

        this._info.SetSupportedRuntimes(["c3"]);
        this._info.AddRemoteScriptDependency(
          "//game-cdn.poki.com/scripts/v2/poki-sdk.js"
        );
        this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);

        SDK.Lang.PushContext(".properties");

        this._info.SetProperties([
          new SDK.PluginProperty("check", "poki-enabled", true),
          new SDK.PluginProperty("check", "debug-on-preview", true),
          new SDK.PluginProperty("combo", "loading-notification", {
            items: ["immediate", "first-layout", "manual"],
            initialValue: "immediate",
          }),
          new SDK.PluginProperty("check", "automatic-suspend", true),
          new SDK.PluginProperty("check", "prevent-scroll", true),
          new SDK.PluginProperty("check", "adblock-sim", false),
          new SDK.PluginProperty("integer", "suspend-timeout", 0),
          new SDK.PluginProperty("link", "site-lock-help", {
            linkCallback: () =>
              window.open("https://sdk.poki.com/html5/#thats-it"),
            callbackType: "once-for-type",
          }),
          new SDK.PluginProperty("link", "qa-link", {
            linkCallback: () => window.open("https://qa.po.ki/"),
            callbackType: "once-for-type",
          }),
        ]);

        SDK.Lang.PopContext(); // .properties
        SDK.Lang.PopContext();
      }
    });

  PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
