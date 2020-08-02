document.addEventListener("plusready", function() {
	plus.bloomAd = {
		setUserId : function (userId) {
			return plus.bridge.execSync("BloomAd", "setUserId", [userId])
		},
		showRewardVideoAd : function (unitId, callback) {
			callbackId = plus.bridge.callbackId(callback, null)
			return plus.bridge.exec("BloomAd", "showRewardVideoAd", [callbackId, unitId])
		},
		loadBannerAd : function (unitId, margins, callback) {
			callbackId = plus.bridge.callbackId(callback, null)
			return plus.bridge.exec("BloomAd", "loadBannerAd", [callbackId, unitId, margins])
		},
		showBannerAd : function (unitId, layout, margins, callback) {
			callbackId = plus.bridge.callbackId(callback, null)
			return plus.bridge.exec("BloomAd", "showBannerAd", [callbackId, unitId, layout, margins])
		},
		destroyBannerAd : function (unitId) {
		    return plus.bridge.execSync("BloomAd", "destroyBannerAd", [unitId])
		},
		showInterstitialAd : function (unitId, callback) {
			callbackId = plus.bridge.callbackId(callback, null)
			return plus.bridge.exec("BloomAd", "showInterstitialAd", [callbackId, unitId])
		}
	}
}, true)