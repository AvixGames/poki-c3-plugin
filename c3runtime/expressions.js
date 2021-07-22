"use strict";

{
	self.C3.Plugins.Avix_PokiSDK_ForC3.Exps =
	{
		LastAdRewardSuccess()
		{
			return this._lastAdRewardedSuccess;
		},

		CommercialBreakPossible()
		{
			if (!this._pokiSDKLoaded || !this._pokiEnabled) return false;
			return this._commercialBreakPossible;
		},

		AdBlockDetected()
		{
			return this._adBlockDetected;
		},
		LastError()
		{
			return this._lastError;
		},

		PokiSDKLoaded()
		{
			return this._pokiSDKLoaded;
		},
		PokiPluginEnabled()
		{
			return this._pokiEnabled;
		}
	};
}