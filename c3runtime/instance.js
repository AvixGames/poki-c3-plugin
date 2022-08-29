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

			// Initialise object properties
			this._pokiEnabled = true;
			this._debugOnPreview = false;
			this._loadingNotification = 0;// Immediate
			this._automaticSuspend = true;
			this._preventScroll = true;
			this._adblockSim = false;

			//respecto al site lock, hay que tener en cuenta que ese codigo
			//debe ser ejecutado en el DOM del canvas, y no en el worker del runtime

			if (properties)		// note properties may be null in some cases
			{
				[this._pokiEnabled,
				this._debugOnPreview,
				this._loadingNotification,
				this._automaticSuspend,
				this._preventScroll,
				this._adblockSim] = properties;
			}

			this.AddDOMMessageHandlers([
				["SuspendRuntime", this.SuspendRuntime.bind(this)],
				["ResumeRuntime", this.ResumeRuntime.bind(this)],
				["SetCommercialBreakConstraint", this.SetCommercialBreakConstraint.bind(this)],
			])

			if (this._loadingNotification === 0) {// Immediate
				runOnStartup(async runtime => {
					runtime.addEventListener("beforeprojectstart", () => {
						this.PostToDOMAsync("GameLoadingFinished");
					});
				});
			}
			else if (this._loadingNotification === 1) {//After First Layout
				let ignoreFirstLayout = true;
				runOnStartup(async runtime => {
					const sendLoadFinishOnLayoutStart = () => {
						if (ignoreFirstLayout) {
							ignoreFirstLayout = false;
							return;
						}
						this.PostToDOMAsync("GameLoadingFinished");
						runtime.getAllLayouts().forEach(
							cada => {
								cada.removeEventListener("beforelayoutstart", sendLoadFinishOnLayoutStart)
							})
					};
					// se triggerea en el loader!! osea que esta medio mal
					runtime.getAllLayouts().forEach(
						cada => cada.addEventListener("beforelayoutstart", sendLoadFinishOnLayoutStart));
				});
			}

			if (this._pokiEnabled) {
				this._debugModeActive = this._debugOnPreview && this._runtime.IsPreview();
				this._runtime.AddLoadPromise(
					this.PostToDOMAsync("InitPoki", ({ debugMode: this._debugModeActive, preventScroll: this._preventScroll }))
						.then(({ loaded, adBlock }) => {
							this._adBlockDetected = adBlock;
							this._pokiSDKLoaded = loaded;

							if (this._adblockSim && this._runtime.IsPreview()) this._adBlockDetected = true;

							if (!this._pokiSDKLoaded) this._lastError = "Poki SDK did not load";
							else if (this._adBlockDetected) this._lastError = "User is likely to have an AdBlock active";
						})
						.catch(console.error));
			}
		}

		SuspendRuntime() {
			if (this._automaticSuspend) this._runtime.SetSuspended(true);
		}
		ResumeRuntime() {
			if (this._automaticSuspend && this._runtime._suspendCount > 0) this._runtime.SetSuspended(false);
		}
		SetCommercialBreakConstraint({ constrained }) {
			//this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnCommercialBreakPossible);
		}

		Release() {
			super.Release();
		}
	};
}