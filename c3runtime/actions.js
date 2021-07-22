"use strict";

{
	self.C3.Plugins.Avix_PokiSDK_ForC3.Acts =
	{		
		NotifyLoadingFinished()
		{
			this.PostToDOMAsync("GameLoadingFinished");
		},
		NotifyGameplayStart()
		{
			this.PostToDOMAsync("NotifyGameplayStart");
		},		
		NotifyGameplayStop()
		{
			this.PostToDOMAsync("NotifyGameplayStop");
		},
		
		SetDebugMode(enable)
		{
			this.PostToDOMAsync("SetDebugMode", {enable:enable});
		},
		HappyTime(intensity)
		{
			this.PostToDOMAsync("HappyTime",{intensity:intensity});
		},
		
		async RequestCommercialBreak(tag)
		{
			this._shouldCheckForBreakPossible = true;
			const {result,err} = await this.PostToDOMAsync("RequestCommercialBreak");
			if (err) this._lastError = err;
			this._lastTriggeredTag = tag;
			if (err) this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnCommercialBreakError);
			else this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnCommercialBreakComplete);
		},		
		async RequestRewardedBreak(tag)
		{
			this._shouldCheckForBreakPossible = true;
			const {result,err} = await this.PostToDOMAsync("RequestRewardedBreak");	
			if (err) this._lastError = err;
			this._lastTriggeredTag = tag;
			this._lastAdRewardedSuccess = result;	
			if (err) this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnRewardedBreakError);
			else this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnRewardedBreakComplete);
		}
	};
}