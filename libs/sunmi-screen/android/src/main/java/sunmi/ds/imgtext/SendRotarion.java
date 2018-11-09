package sunmi.ds.imgtext;

import android.app.Activity;
import android.content.Context;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import cn.finalteam.galleryfinal.GalleryFinal;
import cn.finalteam.galleryfinal.model.PhotoInfo;
import sunmi.ds.DSKernel;
import sunmi.ds.callback.ISendCallback;
import sunmi.ds.callback.ISendFilesCallback;
import sunmi.ds.data.DataModel;
import sunmi.ds.data.UPacketFactory;
import sunmi.ds.utils.SharedPreferencesUtil;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

/**
 * 项目名称：DSC
 * 类描述：
 * 创建人：Abtswiath丶lxy
 * 创建时间：2016/10/18 16:03
 * 修改人：longx
 * 修改时间：2016/10/18 16:03
 * 修改备注：
 */
public class SendRotarion {

    private static SendRotarion mInstance;
    private Context mContext;
    private DSKernel mDSKernel;
    private long taskId_sendImgsText;
    private Activity activity;
    private static final String IMGS_ID = "LXY";
    private Promise mPromise;

    public SendRotarion(Context context, DSKernel mDSKernel){
        this.mContext = context;
        this.mDSKernel = mDSKernel;
    }

    public static SendRotarion getInstance(Context context, DSKernel mDSKernel){
        if(mInstance==null){
            mInstance = new SendRotarion(context,mDSKernel);
        }
        return mInstance;
    }

    public void sendRotarion(Activity activity, Promise promise){
        this.activity = activity;
        this.mPromise = promise;
        GalleryFinal.openGalleryMuti(1, 50, new GalleryFinal.OnHanlderResultCallback() {
            @Override
            public void onHanlderSuccess(int reqeustCode, List<PhotoInfo> resultList) {
                List<String> imgsPath = new ArrayList<>();
                if (resultList.size() > 0) {
                    imgsPath.clear();
                    for (PhotoInfo p : resultList) {
                        imgsPath.add(p.getPhotoPath());
                    }
                    sendImgFiles(imgsPath);
                } else {
                    mPromise.reject("-1", "failed");
                }
            }

            @Override
            public void onHanlderFailure(int requestCode, String errorMsg) {
                mPromise.reject("-1", "failed");
            }
        });
    }

    private void sendImgFiles(List<String> imgsPath){

        taskId_sendImgsText = SharedPreferencesUtil.getLong(mContext,IMGS_ID);
        if (taskId_sendImgsText != -1L) {
            showImgs();
            return;
        }

        JSONObject json = new JSONObject();
            try {
                json.put("rotation_time",2000);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        for(String path:imgsPath){
            File file = new File(path);
            if(!file.exists()){
                Toast.makeText(mContext,path+ "目录文件不存在", Toast.LENGTH_SHORT).show();
                return;
            }
        }

        taskId_sendImgsText = mDSKernel.sendFiles(DSKernel.getDSDPackageName(), json.toString(), imgsPath, new ISendFilesCallback() {
            @Override
            public void onAllSendSuccess(long l) {
                activity.runOnUiThread(new Runnable() {

                    @Override
                    public void run() {
//                        showToast("所有发送文件成功");
                    }
                });
                showImgs();
                SharedPreferencesUtil.put(mContext,IMGS_ID,taskId_sendImgsText);
            }

            @Override
            public void onSendSuccess(final String path, final long fileId) {
            }

            @Override
            public void onSendFaile(final int i, final String s) {
                activity.runOnUiThread(new Runnable() {

                    @Override
                    public void run() {
                        mPromise.reject("-1", "failed");
                    }
                });
            }

            @Override
            public void onSendFileFaile(String s, int i, String s1) {
                activity.runOnUiThread(new Runnable() {

                    @Override
                    public void run() {
                        mPromise.reject("-1", "failed");
                    }
                });
            }

            @Override
            public void onSendProcess(final String s, final long l, final long l1) {
            }
        });

    }

    private void showImgs() {
        String json = UPacketFactory.createJson(DataModel.IMAGES,"");
        mDSKernel.sendCMD(DSKernel.getDSDPackageName(),json,taskId_sendImgsText,new ISendCallback() {
            @Override
            public void onSendFail(int arg0, String arg1) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mPromise.reject("-1", "failed");
                    }
                });
            }
            @Override
            public void onSendProcess(long arg0, long arg1) {}
            @Override
            public void onSendSuccess(long arg0) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        WritableMap result = new WritableNativeMap();
                        result.putString("code", "1");
                        result.putString("msg", "success");
                        mPromise.resolve(result);
                    }
                });
            }
        });
    }

    private void showToast(String msg){
        Toast.makeText(activity.getApplicationContext(),msg, Toast.LENGTH_SHORT).show();
    }

}
