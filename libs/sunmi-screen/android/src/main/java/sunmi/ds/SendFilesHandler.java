package sunmi.ds;

import java.util.List;

import sunmi.ds.callback.ISendCallback;
import sunmi.ds.callback.ISendFilesCallback;

/**
 * Created by longtao.li on 2016/9/7.
 */
class SendFilesHandler implements ISendCallback {

    private List<String> files;
    private int count;
    private ISendFilesCallback userCallback;
    private DSKernel dsKernel;
    private String recePackageName;

    public SendFilesHandler(DSKernel dsKernel, List<String> files, String recePackageName, ISendFilesCallback callback){
        this.dsKernel = dsKernel;
        this.files = files;
        this.userCallback = callback;
        this.recePackageName = recePackageName;
    }

    @Override
    public void onSendSuccess(long taskId) {
            for(final String path : files){
                dsKernel.sendFile(taskId, recePackageName, path, new ISendCallback() {
                    @Override
                    public void onSendSuccess(long taskId) {
                        userCallback.onSendSuccess(path, taskId);
                        count(taskId);
                    }

                    @Override
                    public void onSendFail(int errorId, String errorInfo) {
                        userCallback.onSendFileFaile(path, errorId, errorInfo);
                    }

                    @Override
                    public void onSendProcess(long totle, long sended) {
                        userCallback.onSendProcess(path, totle, sended);
                    }
                });
            }
    }

    @Override
    public void onSendFail(int errorId, String errorInfo) {
        userCallback.onSendFaile(SF.ERROR, "msg 发送失败错误");
    }

    @Override
    public void onSendProcess(long totle, long sended) {

    }

    private synchronized void count(long fileId){
        ++count;
        if(files.size() == count){
            userCallback.onAllSendSuccess(fileId);
            count = 0;
        }
    }
}
