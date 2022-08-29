"use strict";

{
	self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds =
	{
		OnCommercialBreakComplete(tag)
		{
			return tag === "" || tag === this._lastTriggeredTag;
		},
		OnRewardedBreakComplete(tag)
		{
			return tag === "" || tag === this._lastTriggeredTag;
		},

		OnCommercialBreakPossible()
		{
			return !this._adBlockDetected;
		},
		CommercialBreakPossible()
		{
			if (!this._pokiSDKLoaded || !this._pokiEnabled) return false;
			return !this._adBlockDetected;
		},

		LastAdRewardSuccess()
		{
			return this._lastAdRewardedSuccess;
		},
		PokiSDKLoaded()
		{
			return this._pokiSDKLoaded;
		},
		PokiPluginEnabled()
		{
			return this._pokiEnabled;
		},
		AdBlockDetected()
		{
			return this._adBlockDetected;
		},
		PokiDebugMode() {
			return this._debugModeActive;
		}
	};
}