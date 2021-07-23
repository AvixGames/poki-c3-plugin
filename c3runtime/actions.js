"use strict";

{
	self.C3.Plugins.Avix_PokiSDK_ForC3.Acts =
	{		
		NotifyLoadingFinished()
		{
			if (this._loadingNotification !== 2) {
				console.log("If you use the Notify Loading Finished action, you should configure the Poki Plugin, set the Loading Notification Mode to Manual.");
			}
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
			this._debugModeActive = enable;
			this.PostToDOMAsync("SetDebugMode", {enable:enable});
		},
		HappyTime(intensity)
		{
			this.PostToDOMAsync("HappyTime",{intensity:intensity});
		},
		
		async RequestCommercialBreak(tag)
		{
			if (this._adblockSim && this._runtime.IsPreview()) {
				await Promise.resolve();
				this._lastTriggeredTag = tag;	
				this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnCommercialBreakComplete);
				return;
			}

			const {result,err} = await this.PostToDOMAsync("RequestCommercialBreak");
			if (err) this._lastError = err;
			this._lastTriggeredTag = tag;
			
			this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnCommercialBreakComplete);
		},		
		async RequestRewardedBreak(tag)
		{
			if (this._adblockSim && this._runtime.IsPreview()) {
				await Promise.resolve();
				this._lastTriggeredTag = tag;	
				this._lastAdRewardedSuccess = false;	
				this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnRewardedBreakComplete);
				return;
			}

			const {result,err} = await this.PostToDOMAsync("RequestRewardedBreak");	
			if (err) this._lastError = err;
			this._lastTriggeredTag = tag;
			this._lastAdRewardedSuccess = result;	
			
			this.Trigger(self.C3.Plugins.Avix_PokiSDK_ForC3.Cnds.OnRewardedBreakComplete);
		}
	};
}