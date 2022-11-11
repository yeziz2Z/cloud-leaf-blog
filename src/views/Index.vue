<template>
  <div>
    <a-row :gutter="24">
      <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card
          class="project-list"
          style="margin-bottom: 24px;"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <a-carousel autoplay>
            <div
              slot="prevArrow"
              slot-scope="props"
              class="custom-slick-arrow"
              style="left: 10px;zIndex: 1"
            >
              <a-icon type="left-circle" />
            </div>
            <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
              <a-icon type="right-circle" />
            </div>
            <div>
              <img style="width: 100%;height: 100%" src="/1.jpg">
            </div>
            <div>
              <img src="/2.jpg">
            </div>
            <div>
              <img src="/3.jpg">
            </div>
            <div>
              <img src="/5.jpg">
            </div>
            <div>
              <img src="/6.jpg">
            </div>

          </a-carousel>

        </a-card>
        <a-card :bordered="false">
          <a-list
            size="large"
            rowKey="id"
            :loading="loading"
            itemLayout="vertical"
            :dataSource="data"
          >
            <a-list-item :key="item.id" slot="renderItem" slot-scope="item">
              <template slot="actions">
                <icon-text type="eye-o" :text="item.view" />
                <icon-text type="star-o" :text="item.star" />
                <icon-text type="like-o" :text="item.like" />
                <icon-text type="message" :text="item.message" />
              </template>
              <a-list-item-meta>
                <a slot="title" href="https://vue.ant.design/">{{ item.title }}</a>
                <template slot="description">
                  <span>
                    <a-tag>Ant Design</a-tag>
                    <a-tag>设计语言</a-tag>
                    <a-tag>蚂蚁金服</a-tag>
                  </span>
                </template>
              </a-list-item-meta>
              <article-list-content :description="item.description" :owner="item.owner" :avatar="item.avatar" :href="item.href" :updateAt="item.updatedAt" />
            </a-list-item>
            <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
              <a-button @click="loadMore" :loading="loadingMore">加载更多</a-button>
            </div>
          </a-list>
        </a-card>
      </a-col>
      <a-col
        style="padding: 0 12px"
        :xl="8"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24">
        <!--        <a-card
          title="便捷导航"
          style="margin-bottom: 24px"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <div class="item-group">
            <a>操作一</a>
            <a>操作二</a>
            <a>操作三</a>
            <a>操作四</a>
            <a>操作五</a>
            <a>操作六</a>
            <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
          </div>
        </a-card>-->
        <a-card
          title="热度 指数"
          style="margin-bottom: 24px"
          :loading="radarLoading"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <div style="min-height: 400px;">
            <radar :data="radarData" />
          </div>
        </a-card>
        <a-card :loading="loading" title="团队" :bordered="false">
          <div class="members">
            <a-row>
              <a-col :span="12" v-for="(item, index) in teams" :key="index">
                <a>
                  <a-avatar size="small" :src="item.avatar" />
                  <span class="member">{{ item.name }}</span>
                </a>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import { TagSelect, StandardFormRow, ArticleListContent, Radar } from '@/components'
import { Carousel } from 'ant-design-vue'
import IconText from './list/search/components/IconText'

const DataSet = require('@antv/data-set')
const TagSelectOption = TagSelect.Option

const owners = [
  {
    id: 'wzj',
    name: '我自己'
  },
  {
    id: 'wjh',
    name: '吴家豪'
  },
  {
    id: 'zxx',
    name: '周星星'
  },
  {
    id: 'zly',
    name: '赵丽颖'
  },
  {
    id: 'ym',
    name: '姚明'
  }
]

export default {
  components: {
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    ArticleListContent,
    Carousel,
    Radar,
    IconText
  },
  data () {
    return {
      owners,
      loading: true,
      loadingMore: false,
      radarLoading: true,
      radarData: [],
      teams: [],
      data: [],
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.getList()
    this.getTeams()
    this.initRadar()
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    getList () {
      this.$http.get('/list/article').then(res => {
        console.log('res', res)
        this.data = res.result
        this.loading = false
      })
    },
    loadMore () {
      this.loadingMore = true
      this.$http.get('/list/article').then(res => {
        this.data = this.data.concat(res.result)
      }).finally(() => {
        this.loadingMore = false
      })
    },
    setOwner () {
      const { form: { setFieldsValue } } = this
      setFieldsValue({
        owner: ['wzj']
      })
    },
    initRadar () {
      this.radarLoading = true

      this.$http.get('/workplace/radar').then(res => {
        const dv = new DataSet.View().source(res.result)
        dv.transform({
          type: 'fold',
          fields: ['个人', '团队', '部门'],
          key: 'user',
          value: 'score'
        })

        this.radarData = dv.rows
        this.radarLoading = false
      })
    },
    getTeams () {
      this.$http.get('/workplace/teams').then(res => {
        this.teams = res.result
      })
    }
  }
}
</script>

<style lang="less" scoped>

.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.list-articles-trigger {
  margin-left: 12px;
}
.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.ant-carousel {
  /deep/ .slick-slide {
    text-align: center;
    height: 360px;
    line-height: 260px;
    background: #364d79;
    overflow: hidden;
  }

  /deep/ .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }
  /deep/ .custom-slick-arrow:before {
    display: none;
  }

  /deep/ .custom-slick-arrow:hover {
    opacity: 0.5;
  }

}
</style>
