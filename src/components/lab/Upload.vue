<style scoped>
.required-info {
  display: inline-block;
  margin-right: 0.125rem;
  font-family: SimSun;
  line-height: 1;
  font-size: 0.4375rem;
  color: #f5222d;
}
</style>
<template>
  <div class="clearfix">
    <div
      v-if="params.title"
      style="margin-top:12px;margin-bottom:12px;text-align:left;"
    >
      <span v-if="params.isRequired" class="required-info">*</span>
      {{ params.title }}
    </div>
    <a-upload
      listType="picture-card"
      :fileList="fileList"
      ref="upload1"
      @preview="handlePreview"
      :remove="handleRemove"
      :showUploadList="{
        showPreviewIcon: params.showPreviewIcon,
        showRemoveIcon: params.showRemoveIcon
      }"
    ></a-upload>
    <a-upload
      v-if="params.action"
      ref="up"
      :action="params.action"
      :headers="headers"
      listType="picture-card"
      :defaultFileList="defaultList"
      :beforeUpload="beforeUpload"
      @change="handleChange"
      @preview="handlePreview"
      :remove="handleRemove1"
    >
      <div>
        <a-icon type="plus" />
        <div class="ant-upload-text">上传图片</div>
      </div>
    </a-upload>
    <vue-draggable-resizable
      :min-width="300"
      :min-height="300"
      :w="500"
      :h="500"
      v-show="previewVisible"
      style="position:fixed;z-index:99;padding:0.75rem;background-color:white;border: 1px solid #D9D9D9;"
    >
      <button aria-label="Close" class="ant-modal-close" @click="handleCancel">
        <span
          class="ant-modal-close-x"
          style="width:1.25rem;height:1.25rem;line-height:1.25rem;"
        >
          <i class="ant-modal-close-icon anticon anticon-close">
            <svg
              viewBox="64 64 896 896"
              data-icon="close"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              class
            >
              <path
                d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
              />
            </svg>
          </i>
        </span>
      </button>
      <img style="width: 100%;height: 100%;" :src="previewImage" />
    </vue-draggable-resizable>

    <!-- <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>-->
  </div>
</template>

<script>
const cloneDeep = require("clone-deep");
import LabService from "../../services/LabService";
const LabServiceApi = new LabService();

export default {
  props: ["data", "files"],
  data() {
    return {
      show: true,
      params: {
        title: "",
        action: "",
        id: "",
        showPreviewIcon: true,
        showRemoveIcon: true,
        isRequired: true
      },
      previewVisible: false,
      previewImage: "",
      defaultList: [],
      fileList: [],
      headers: {}
    };
  },
  methods: {
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("图片资源必须小于10M!");
        this.$refs["up"].handleRemove(file);
      }
      return isLt10M;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange({ file }) {
      // console.log(this.fileList,' 0-0-');
      if (file.status === "uploading") {
        this.loading = true;
        return;
      } else if (file.status === "done") {
        this.$message.success("上传成功");
        this.defaultList.push(file.response);
        // console.log(this.defaultList, "========", this.fileList);
        this.$emit("on-upload", this.fileList.concat(this.defaultList));
      } else if (file.status === "error") {
        file.status = "uploadError";
        this.$refs["up"].handleRemove(file);
      }
    },
    handleRemove(file) {
      LabServiceApi.deleteImg({ id: this.data.id, uid: file.uid }).then(res => {
        if (res.ret == 0) {
          this.fileList.forEach((v, i) => {
            if (v.uid === file.uid) {
              this.fileList.splice(i, 1);
            }
          });
          this.$message.success("删除成功");
          this.$emit("on-upload", this.fileList.concat(this.defaultList));
        } else {
          this.$message.error("删除失败111");
        }
      });
    },
    handleRemove1(file) {
      if (!file.status) {
        return true;
      }
      LabServiceApi.deleteImg({
        id: this.data.id,
        uid: file.response.uid
      }).then(res => {
        if (res.ret == 0) {
          this.defaultList.forEach((v, i) => {
            if (v.uid === file.uid) {
              this.defaultList.splice(i, 1);
            }
          });
          this.$message.success("删除成功");
          this.$emit("on-upload", this.fileList.concat(this.defaultList));
          return true;
        } else {
          if (file.status == "uploadError") {
            this.$message.error("上传失败");
          } else {
            file.status = "success";
            this.$message.error("删除失败");
          }
          return false;
        }
      });
    }
  },
  created: function() {
    this.$nextTick(() => {
      this.params = cloneDeep(this.data);
      // console.log(this.params, "params");
      if (!this.params.hasOwnProperty("showPreviewIcon")) {
        this.params["showPreviewIcon"] = true;
      }
      if (!this.params.hasOwnProperty("showRemoveIcon")) {
        this.params["showRemoveIcon"] = true;
      }
      if (!this.params.hasOwnProperty("isRequired")) {
        this.params["isRequired"] = true;
      }
      this.fileList = cloneDeep(this.files);
    });
  },
  mounted() {
    // this.headers = {
    //   UserRole: 'BDLS_DAS_LAB'
    // };
  },
  watch: {
    files: {
      handler: function(v) {
        this.fileList = cloneDeep(v);
        // console.log(this.fileList, "this.fileList");
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-upload-list-picture-card .ant-upload-list-item-info:before {
  margin-left: -50%;
}
</style>
