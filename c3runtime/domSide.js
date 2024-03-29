"use strict";

{
    // In the C3 runtime's worker mode, all the runtime scripts (e.g. plugin.js, instance.js, actions.js)
    // are loaded in a Web Worker, which has no access to the document so cannot make DOM calls. To help
    // plugins use DOM elements the runtime internally manages a postMessage() bridge wrapped in some helper
    // classes designed to manage DOM elements. Then this script (domSide.js) is loaded in the main document
    // (aka the main thread) where it can make any DOM calls on behalf of the runtime. Conceptually the two
    // ends of the messaging bridge are the "Runtime side" in a Web Worker, and the "DOM side" with access
    // to the Document Object Model (DOM). The addon's plugin.js specifies to load this script on the
    // DOM side by making the call: this._info.SetDOMSideScripts(["c3runtime/domSide.js"])
    // Note that when NOT in worker mode, this entire framework is still used identically, just with both
    // the runtime and the DOM side in the main thread. This allows non-worker mode to work the same with
    // no additional code changes necessary. However it's best to imagine that the runtime side is in a
    // Web Worker, since that is when it is necessary to separate DOM calls from the runtime.

    // NOTE: use a unique DOM component ID to ensure it doesn't clash with anything else
    // This must also match the ID in instance.js and plugin.js.
    const DOM_COMPONENT_ID = "avix-pokisdk-forc3";

    // this method is the same that PokiSDK uses to detect if navigator is mobile
    function IsMobile() {
        return "undefined" != typeof navigator && /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera\smini|avantgo|mobilesafari|docomo)/i.test(navigator.userAgent)
    }    
    // this method is the same that PokiSDK uses to detect if navigator is tablet
    // el problema es que no estoy muy seguro que comportamiento tiene Poki en las tablets :/
    function IsTablet() {
        return "undefined" != typeof navigator && /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i.test(navigator.userAgent)
    }

    const HANDLER_CLASS = class PokiHandler extends self.DOMHandler {
        
        constructor(iRuntime) {
            super(iRuntime, DOM_COMPONENT_ID);
            
			this._pokiSDKLoaded = false;
            this._debugModeActive = false;
            this._gameplayActive = false;
            this._finishedLoadingSent = false;
            
            this.AddRuntimeMessageHandlers([
                ["InitPoki", this.InitPoki.bind(this)],
                ["NotifyGameplayStart", this.NotifyGameplayStart.bind(this)],
                ["NotifyGameplayStop", this.NotifyGameplayStop.bind(this)],
                ["HappyTime", this.HappyTime.bind(this)],
                ["RequestCommercialBreak", this.RequestCommercialBreak.bind(this)],
                ["RequestRewardedBreak", this.RequestRewardedBreak.bind(this)],
                ["SetDebugMode", this.SetDebugMode.bind(this)],
                ["GameLoadingFinished", this.GameLoadingFinished.bind(this)],
            ]);
        }

        GameLoadingFinished() {
            if (!this._pokiSDKLoaded) return;
            if (this._finishedLoadingSent) return;
            this._finishedLoadingSent = true;
            PokiSDK.gameLoadingFinished();
        }
        NotifyGameplayStart() {
            if (!this._pokiSDKLoaded) return;

            if (!this._finishedLoadingSent) {
                console.log("Don't forget to send the Loading Finished Notification, or configure the Poki Plugin to manage it automatically.");
            }

            this._gameplayActive = true;
            PokiSDK.gameplayStart();
        }
        NotifyGameplayStop() {
            if (!this._pokiSDKLoaded) return;
            this._gameplayActive = false;
            PokiSDK.gameplayStop();
        }
        HappyTime({ intensity }) {
            if (!this._pokiSDKLoaded) return;
            PokiSDK.happyTime(intensity);
        }

        RequestCommercialBreak() {
            if (!this._pokiSDKLoaded) return {result:false,err:false};
            if (this._gameplayActive) this.NotifyGameplayStop();
            this.PostToRuntime("SuspendRuntime");
            return PokiSDK.commercialBreak()
                .then(() => {
                    this.PostToRuntime("ResumeRuntime");
                    return {result:true,err:false};
                })
                .catch((err)=>{
                    console.error(err);
                    return {result:false,err:err};
                });
        }
        RequestRewardedBreak() {
            if (!this._pokiSDKLoaded) return {result:false,err:false};
            if (this._gameplayActive) this.NotifyGameplayStop();
            this.PostToRuntime("SuspendRuntime");
            return PokiSDK.rewardedBreak()
                .then((success) => {
                    this.PostToRuntime("ResumeRuntime");
                    return {result:success,err:false};
                })
                .catch((err)=>{
                    console.error(err);
                    return {result:false,err:err};
                });
        }

        SetDebugMode({ enable }) {
            if (!this._pokiSDKLoaded) return;
            PokiSDK.setDebug(this._debugModeActive = enable);
        }
        InitPoki({ debugMode, preventScroll }) {
            if (typeof PokiSDK !== "undefined") {
                if (preventScroll) this.preventScroll();

                this._pokiSDKLoaded = true;
                let adBlock = false;
                return PokiSDK.init()
                    .then(() => {
                        console.log("Poki SDK successfully initialized");
                        return { loaded: this._pokiSDKLoaded, adBlock: adBlock };
                    })
                    .catch(() => {
                        console.log("Initialized, but the user likely has adblock");
                        adBlock = true;
                        return { loaded: this._pokiSDKLoaded, adBlock: adBlock };
                    })
                    .finally(() => {
                        if (debugMode) this.SetDebugMode(true);
                        PokiSDK.gameLoadingStart();
                    });
            }
            else {
                console.log("Poki SDK failed to load");
                return Promise.resolve({loaded: this._pokiSDKLoaded, adBlock: false});
            }
        }
        preventScroll() {
            window.addEventListener('keydown', ev => {
                if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
                    ev.preventDefault();
                }
            });
            window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
        }

    };

    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}