package sunmi.ds;

import android.content.Context;

import com.google.gson.reflect.TypeToken;

import java.util.HashMap;
import java.util.Map;

import sunmi.ds.data.DSFile;
import sunmi.ds.data.DSFiles;

/**
 * 缓存接收到的文件
 * Created by longtao.li on 2016/9/8.
 */
public class FilesManager {

    private static final String DS_FILE_LIST = "DSFileList";
    private static final String DS_FILES_LIST = "DSFilesList";

    private FilesManager(){}

    Context context;

    private static FilesManager instance;

    public static FilesManager getInstance(){
        if(instance == null){
            instance = new FilesManager();
        }
        return instance;
    }

    /**
     * 初始化filesmanager 是耗时操作
     * @param context
     */
    public void init(Context context){
        this.context = context;
        Object DSFileList = SharedPreferencesUtil.readObj(context, DS_FILE_LIST, new TypeToken<Map<Long, DSFile>>(){}.getType());
        if(DSFileList!=null){
            receFileList = (Map<Long, DSFile>) DSFileList;
        }
        Object DSFilesList = SharedPreferencesUtil.readObj(context, DS_FILES_LIST, new TypeToken<Map<Long, DSFiles>>(){}.getType());
        if(DSFilesList!=null){
            receFilesList = (Map<Long, DSFiles>) DSFilesList;
        }

    }

    Map<Long, DSFile> receFileList = new HashMap<Long, DSFile>(); // 需要持久化

    Map<Long, DSFiles> receFilesList = new HashMap<Long, DSFiles>(); // 需要持久化

    public synchronized void saveFile(DSFile dsFile ){
        receFileList.put(dsFile.taskId, dsFile);
        SharedPreferencesUtil.saveObj(context, receFileList, DS_FILE_LIST);
    }

    /**
     * 根据任务Id,获取单个缓存文件
     * @param taskId
     * @return
     */
    public synchronized DSFile getFile(Long taskId){
        return receFileList.get(taskId);
    }


    public synchronized void saveFiles(DSFiles dsFiles ){
        receFilesList.put(dsFiles.taskId, dsFiles);
        SharedPreferencesUtil.saveObj(context, receFilesList, DS_FILES_LIST);
    }

    /**
     * 根据任务Id，获取同一任务的多个缓存文件
     * @param taskId
     * @return
     */
    public synchronized DSFiles getFiles(Long taskId){
        return receFilesList.get(taskId);
    }


    public boolean checkFileExist(long fileId){
        FilesManager filesManager = FilesManager.getInstance();
        DSFile file = filesManager.getFile(fileId);
        DSFiles files = filesManager.getFiles(fileId);
        if(file == null&&files == null){
            return false;
        }
        return true;
    }
}
