package sunmi.ds;

import java.util.ArrayList;
import java.util.List;

/**
 * 管理不受任何限制都可以控制副屏的app名单 Created by longtao.li on 2016/9/2.
 */
class Root {

	List<String> rootList = new ArrayList<>();

	public Root() {
		rootList.add(SF.SUNMI_DSD_PACKNAME);
		rootList.add("sunmi.dsc");
		rootList.add("woyou.market");
		rootList.add("woyou.system.api");
		rootList.add("com.sunmi.ota");
		rootList.add("com.woyou.hardwarekeeper");
		rootList.add("com.sunmi.vicescreensettings");
	}

	public boolean isRoot(String packageName) {
		return rootList.contains(packageName);
	}

}
