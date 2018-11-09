package sunmi.ds.video;

import android.content.Context;

import sunmi.ds.DSKernel;
import sunmi.ds.data.DataModel;
import sunmi.ds.data.UPacketFactory;
import sunmi.ds.utils.SharedPreferencesUtil;

/**
 * 项目名称：DSC
 * 类描述：
 * 创建人：Abtswiath丶lxy
 * 创建时间：2016/10/19 10:43
 * 修改人：longx
 * 修改时间：2016/10/19 10:43
 * 修改备注：
 */
public class SendPlayVideo {

    private Context mContext;
    private DSKernel mDSKernel;
    private long taskId_sendVideo;
    private String cacheKey;
    private ISendCallback iSendCallback;
    private PlayIng playIng;

    public SendPlayVideo(Context mContext, DSKernel mDSKernel, String cacheKey, ISendCallback iSendCallback, PlayIng playIng){
        this.mContext = mContext;
        this.mDSKernel = mDSKernel;
        this.cacheKey = cacheKey;
        this.iSendCallback = iSendCallback;
        this.playIng = playIng;
    }


    public void sendVideoFile(String path){
        taskId_sendVideo = SharedPreferencesUtil.getLong(mContext, cacheKey);
        if (taskId_sendVideo != -1L) {
            showVideo();
            return;
        }

        taskId_sendVideo = mDSKernel.sendFile(DSKernel.getDSDPackageName(), path, new sunmi.ds.callback.ISendCallback() {
            @Override
            public void onSendSuccess(long l) {
                iSendCallback.onSendSuccess(l);
                SharedPreferencesUtil.put( mContext, cacheKey, taskId_sendVideo);
                showVideo();
            }

            @Override
            public void onSendFail(int i, String s) {
                iSendCallback.onSendFail(i,s);
            }

            @Override
            public void onSendProcess(final long l,final long l1) {
                iSendCallback.onSendProcess(l,l1);
            }
        });
    }


    private void showVideo(){
        String json = UPacketFactory.createJson(DataModel.VIDEO,"");
        mDSKernel.sendCMD(DSKernel.getDSDPackageName(), json, taskId_sendVideo, null);
        playIng.playing();
    }

    public interface ISendCallback{
        void onSendProcess(final long l, final long l1);
        void onSendFail(int i, String s);
        void onSendSuccess(long l);
    }

    public interface PlayIng{
        void playing();
    }

}
