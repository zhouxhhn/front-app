/** 
 * @Title:  InitCoreService.java 
 * @author:  blanks
 * @data:  2016年5月30日 下午3:06:48 <创建时间>
 * 
 * @history：<以下是历史记录>
 *
 * @modifier: <修改人>
 * @modify date: 2016年5月30日 下午3:06:48 <修改时间>
 * @log: <修改内容>
 *
 * @modifier: <修改人>
 * @modify date: 2016年5月30日 下午3:06:48 <修改时间>
 * @log: <修改内容>
 */
package sunmi.ds.verify;

import android.app.Service;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.IBinder;
import android.text.TextUtils;

/**
 * SDK初始化身份验证核心类
 * 
 * @author blanks
 * @versionCode 1 <每次修改提交前+1>
 */
class InitCoreService extends Service {

	/*
	 * (non-Javadoc)
	 * 
	 * @see android.app.Service#onBind(android.content.Intent)
	 */
	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see android.app.Service#onCreate()
	 */
	@Override
	public void onCreate() {
	}

	/**
	 * 预留函数
	 */
	@SuppressWarnings("unused")
	private void verift() {
		String mSecret = getMetaData();
		if (TextUtils.isEmpty(mSecret) == false && mSecret.equals("DEFAULT")) {
			return;
		} else {
			try {
				throw new Exception(
						"SecretException:The secret-key does not exist, please check your secret-key is correct");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	private String getMetaData() {
		ApplicationInfo appInfo;
		try {
			appInfo = getApplicationContext().getPackageManager()
					.getApplicationInfo(getApplicationContext().getPackageName(), PackageManager.GET_META_DATA);
			if (appInfo != null)
				return appInfo.metaData.getString("SUNMI_APPKEY");
		} catch (NameNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}
		return "";
	}

}
