import  OSS from 'ali-oss';
import { useFileStore } from '/@/store/modules/file';
import { useUserStore, useUserStoreWithOut } from '/@/store/modules/user';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { FILE_AUTH_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';

export class OssUtils {
  ossClient: OSS;
  expiredResult: boolean;

  constructor() {
    this.expiredResult = false;
    // const useFileStoreObj = useFileStore();
    // const fileStore = useFileStoreObj.getFileAuth;
     const fileStore = Persistent.getLocal(FILE_AUTH_KEY)
    this.ossClient = new OSS({
      accessKeyId: fileStore.accessKeyId,
      accessKeySecret: fileStore.accessKeySecret,
      stsToken: fileStore.securityToken,
      bucket: fileStore.bucketName,
      region: 'oss-cn-shenzhen',
    });
  }

  getSignatureUrl(url: string) {
    if (!url) {
      return;
    }
    this.checkTimestamp();
    return this.ossClient.signatureUrl(url);
  }

  // 上传文件
  uploadFile(name, file) {
    this.checkTimestamp();
    const useFileStoreObj = useFileStore();
    const fileStore = useFileStoreObj.getFileAuth;
    const userStore = useUserStore();
    const userId = userStore.getUserInfo?.id;
    return this.ossClient.put(fileStore.tempPath + userId + name, file);
  }

  // 检测当前时间戳是否超时
  checkTimestamp() {

      const currentTime = new Date().getTime();
      const fileStore = Persistent.getLocal(FILE_AUTH_KEY)
      // const useFileStoreObj = useFileStore();
      // const fileStore = useFileStoreObj.getFileAuth;
      const expirationDate = fileStore['STSExpirationDate'];

      if (currentTime >= expirationDate) {
          const { createMessage } = useMessage();
          const { t } = useI18n();

          const userStore = useUserStoreWithOut();
          if(!this.expiredResult){
            createMessage.error(t('sys.api.errMsg403'));
            this.expiredResult = true;
            userStore.logout(true);
          }
      }
  }

  pdfAction(action: string, fileUrl: string) {
    if (fileUrl) {
      const downloadURL = this.ossClient.signatureUrl(fileUrl);

      switch (action) {
        case 'review': {
          window.open(downloadURL);
          break;
        }
        case 'download': {
          // 跨域
          ossUtils.getFile(listData.wxReviewDocUrl).then((res) => {
            console.log(res.content);
          });
          break;
        }
      }
    }
  }
}
