<template>
  <a-card>
    <a-row>
      <a-col :span="21">
        <a-textarea
          class="blogTitle"
          v-model="test"
          rows="1"
          :max-length="35"
          placeholder="请输入文章标题...">

        </a-textarea>
      </a-col>
      <a-col :span="3">
        <a-popover v-model="visible" placement="bottomRight" :overlayStyle="overlayStyle" trigger="click">
          <template slot="title">
            <h2>发布文章</h2>
          </template>
          <template slot="content">
            <a-spin :spinning="confirmLoading">

              <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-form-item label="分类">
                  <a-input v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"/>
                </a-form-item>
                <a-form-item label="标签">
                  <a-select
                    v-decorator="['gender', { rules: [{ required: true, message: 'Please select your gender!' }] }]"
                    placeholder="请搜索添加标签">
                    <a-select-option value="male">male</a-select-option>
                    <a-select-option value="female">female</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="文章封面">
                  <a-upload
                    name="avatar"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                  >
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar"/>
                    <div style="width: 180px" v-else>
                      <a-icon :type="loading ? 'loading' : 'plus'"/>
                      <div class="ant-upload-text">
                        上传封面
                      </div>
                    </div>
                  </a-upload>
                </a-form-item>

                <a-form-item label="是否公开">
                  <a-switch default-checked/>
                </a-form-item>
                <a-form-item label="摘要">
                  <a-textarea
                    v-decorator="['summary', { rules: [{ required: true, message: '请输入文章摘要!' }] }]"
                    style="resize: none"
                    rows="4"
                    :max-length="100"
                    placeholder="文章摘要...">

                  </a-textarea>
                </a-form-item>

                <a-divider/>

                <a-row type="flex" justify="end">
                  <a-col>
                    <a-button @click="handleCancel">
                      取消
                    </a-button>
                    <a-button type="primary" style="margin-left: 10px" @click="handleOk">
                      确定并发布
                    </a-button>
                  </a-col>
                </a-row>
              </a-form>
            </a-spin>
          </template>

          <a-button type="primary" style="margin-right: 15px">发布</a-button>
        </a-popover>

        <avatar-dropdown :current-user="currentUser"/>
      </a-col>
    </a-row>

    <Editor
      class="bytemd"
      :value="value"
      :locale="zhHans"
      :plugins="plugins"
      :uploadImages="uploadImage"
      @change="handleChange1"/>
  </a-card>

</template>

<script>

import { Editor } from '@bytemd/vue'
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import zhHans from 'bytemd/locales/zh_Hans.json'
import 'bytemd/dist/index.min.css'

const plugins = [
  gfm(),
  highlight()
]

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'Article',
  components: {
    AvatarDropdown,
    Editor
  },
  data () {
    return {
      value: '',
      plugins,
      zhHans,
      test: '',
      currentUser: {
        name: 'Serati Ma'
      },
      visible: false,
      overlayStyle: {
        width: '480px',
        height: '200px'
      },
      confirmLoading: false,
      loading: false,
      imageUrl: ''

    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'blogForm' })
  },
  methods: {
    handleChange1 (v) {
      this.value = v
    },
    // 上传图片 点击触发上传图片事件，大家获取文件把图片上传服务器然后返回url既可
    async uploadImage (files) {
      console.log('files', files)
      return [
        {
          title: files.map((i) => i.name),
          url: 'http'
        }
      ]
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('封面图片过大，请裁剪压缩小于2MB后重新操作!')
      }
      return isJpgOrPng && isLt2M
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      this.$message.error('修改成功')
      console.log(this.value)
      this.form.validateFields((err, values) => {
        if (!err) {

        }
      })
      /* const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          if (values.id) {
            edit(values).then(resp => {
              if (resp.code === 200) {
              } else {
              }
            }).catch(err => {
              console.log(err)
            }).finally(() => {
            })
          }

        }
      }) */
    }
  }
}
</script>

<style scoped>
.blogTitle {
  font-size: 30px;
  font-weight: bolder;
  resize: none;
  box-shadow: none;
  border-style: none
}

/deep/ .bytemd {
  height: calc(100vh - 105px);
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

</style>
