package sunmi.ds.utils;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.text.TextUtils;

/**
 * 进程相关工具
 * @author shenzhou.lee 
 */
public class ProcessUtils {

	/**
	 * 获取当前在应用在前台
	 * API 21 and above
	 * @param context
	 * @return
	 */
	@SuppressLint("NewApi")
	public static boolean isForegroundAppFor21(Context context, String packageName) {
		ActivityManager am = (ActivityManager) context.getSystemService(context.ACTIVITY_SERVICE);
		ComponentName cn = am.getRunningTasks(1).get(0).topActivity;
		if(TextUtils.equals(cn.getPackageName(),packageName)){
			return true;
		}else{
			return false;
		}
	}


	
}