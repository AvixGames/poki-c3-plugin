"use strict";

{
	const C3 = self.C3;
	const DOM_COMPONENT_ID = "avix-pokisdk-forc3";

	C3.Plugins.Avix_PokiSDK_ForC3.Instance = class PokiSDKC3Instance extends C3.SDKInstanceBase {
		constructor(inst, properties) {
			super(inst, DOM_COMPONENT_ID);

			this._pokiSDKLoaded = false;
			this._adBlockDetected = false;
			this._lastError = "";
			this._lastAdRewardedSuccess = false;
			this._debugModeActive = false;
			this._lastTriggeredTag = "";
			this._commercialBreakPossible = false;
			this._shouldCheckForBreakPossible = true;
			
			// Initialise object properties
			this._pokiEnabled = true;
			this._siteLockCode = "";
			this._debugOnPreview = false;
			this._loadingNotification = 0;// Immediate
			this._automaticSuspend = true;

			if (properties)		// note properties may be null in some cases
			{
				this._pokiEnabled = properties[0];
				this._siteLockCode = properties[1];
				this._debugOnPreview = properties[2];
				this._automaticSuspend = properties[3];
				this._loadingNotification = properties[4];
			}

			if (this._loadingNotification === 0) {// Immediate
				runOnStartup(async runtime => {
					runtime.addEventListener("beforeprojectstart", () => {
						this.PostToDOMAsync("GameLoadingFinished");
					});
				});
			}
			else if (this._loadingNotification === 1) {//After First Layout
				runOnStartup(async runtime => {
					const sendLoadFinishOnLayoutStart = ()=>{
						this.PostToDOMAsync("GameLoadingFinished");
						runtime.getAllLayouts().forEach(
							cada => {
								cada.removeEventListener("beforelayoutstart",sendLoadFinishOnLayoutStart)
							})
					};
					runtime.getAllLayouts().forEach(
						cada => cada.addEventListener("beforelayoutstart",sendLoadFinishOnLayoutStart));
				});
			}

			const activateDebugMode = this._debugOnPreview && this._runtime.IsPreview();

			if (this._pokiEnabled) {
				this._runtime.AddLoadPromise(
					this.PostToDOMAsync("InitPoki", ({ debugMode: activateDebugMode }))
						.then(({ loaded, adBlock }) => {
							this._adBlockDetected = adBlock;
							this._pokiSDKLoaded = loaded;

							if (!this._pokiSDKLoaded) this._lastError = "Poki SDK did not load";
							else if (this._adBlockDetected) this._lastError = "User is likely to have an AdBlock active";

							if (this._siteLockCode && !this._runtime.IsPreview()) {
								eval(this._siteLockCode);
							}
						})
						.catch(console.error));
			}
		}

		Release() {
			super.Release();
		}
	};
}