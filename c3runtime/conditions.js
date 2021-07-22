"use strict";

{
	self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds =
	{
		OnCommercialBreakComplete(tag)
		{
			return tag === "" || tag === this._lastTriggeredTag;
		},
		OnCommercialBreakError(tag)
		{
			return tag === "" || tag === this._lastTriggeredTag;
		},
		OnRewardedBreakComplete(tag)
		{
			return tag === "" || tag === this._lastTriggeredTag;
		},
		OnRewardedBreakError(tag)
		{
			return tag === "" || tag === this._lastTriggeredTag;
		},

		OnCommercialBreakPossibleChecked()
		{
			return true;
		},
		CommercialBreakPossible()
		{
			if (!this._pokiSDKLoaded || !this._pokiEnabled) return false;
			if (this._shouldCheckForBreakPossible) console.log("CommercialBreakPossible should not be called every tick AND it should be used after CheckCommercialBreakPossible action");
			return this._commercialBreakPossible;
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
		}
	};
}