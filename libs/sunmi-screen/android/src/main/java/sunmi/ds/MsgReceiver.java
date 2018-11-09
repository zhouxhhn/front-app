package sunmi.ds;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class MsgReceiver extends BroadcastReceiver {

	private static final String RECEIVE_DATA = "com.sunmi.hcservice";

	private static final String CONNECT_STATE = "com.sunmi.hcservice.status";

	private DSReceiver mDSReceiver;//处理接收到的数据

	@Override
	public void onReceive(Context context, Intent intent) {
		mDSReceiver = DSReceiver.getInstance(context);
		switch (intent.getAction()){
			case RECEIVE_DATA:
				mDSReceiver.onReceive(intent);
				break;
			case CONNECT_STATE:
				mDSReceiver.onConnectStateChange(intent);
				break;
		}

	}

}
