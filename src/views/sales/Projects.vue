<template>
  <div>
    <div v-if="loading">
      <div style="height:10vh;"></div>
      <p style="text-align:center;">
        <inline-loading></inline-loading>
      </p>
    </div>
    <div v-if="!loading" style="background-color:#F4F5FA;min-height:100vh;">
      <div style="height:13px;"></div>
      <div class="content">
        <div>
          <div :span="24"
            style="background-color:white;padding:12px 0px 12px 25px;text-align:left;border:1px solid #F9F9F9;">
            <div class="font-size:14px;font-weight:900;line-height:45px;">北斗基因测序服务</div>
          </div>

          <div>
            <a-row>
              <a-col :span="24" style="background-color:white;">
                <a-row>
                  <div :key="i" v-for="(p,i) in projects">
                    <a-col :lg="{span:10, offset:1}" :xs="{span:24, offset:0}" style="margin-bottom:25px;"
                      class="project_card">
                      <a-card :bordered="false">
                        <img :src="p.img" slot="cover" />
                        <a-card-meta>
                          <template slot="title">
                            <div style="font-size:24px;text-align:left;padding-left:23px;white-space:normal;">
                              <b>{{p.itemName}}</b></div>
                          </template>
<template slot="description">
                            <div style="text-align:left;">
                              <div style="padding:0 23px 10px;color:#666666;">
                                {{p.itemBrief}}
                              </div>
                              <div style="padding-left:23px;">
                                <div>
                                  <!-- <span style="font-size:24px;margin-bottom:24px;margin-right:22px;color:#404040;">￥{{p.discountPrice}}</span> -->
                                  <!-- <span style="text-decoration:line-through;">￥{{p.price}}</span> -->
                                </div>
                                <a-button @click="handleSubmit(p)" type="primary" icon="shopping-cart"
                                  style="height:40px;width:154px;margin-top:24px;"><span
                                    style="font-size:16px;line-height:22px;">立即购买</span></a-button>
                              </div>
                            </div>
                          </template>
</a-card-meta>
</a-card>
</a-col>

<a-col v-if="i%2 === 1" :lg='{span:24}' :xs='{span:0}' style="height:24px;background-color:#F4F5FA;"></a-col>
<a-col :lg='{span:0}' :xs='{span:24}' style="height:7px;background-color:#F4F5FA;"></a-col>
</div>

</a-row>
</a-col>
</a-row>
</div>
</div>
</div>
<toast v-model="show" width="9rem" :time="1200" type="text">
    <div style="margin:0 0.4rem;">{{errMsg}}</div>
</toast>
</div>
</div>
</template>

<script>
    // import auth from '../../auth.js'
    import {
        Toast,
        InlineLoading
    } from 'vux'
    import SalesService from '../../services/SalesService'
    const SalesServiceApi = new SalesService()

    export default {
        components: {
            Toast,
            InlineLoading
        },
        data() {
            return {
                name: 'projects',
                model: 'sales',
                loading: true,
                show: false,
                errMsg: '',
                projects: [
                    // {
                    //   itemID: 1,
                    //   itemName: 'aaaa',
                    //   itemBrief: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
                    //   discountPrice: 1299.00,
                    //   price: 2900.00,
                    //   img: '/img/report.png',
                    // }
                ],
            }
        },
        methods: {
            getProjects() {
                SalesServiceApi.projects({}).then(res => {
                    if (res.ret === 0) {
                        this.projects = res.data
                            // console.log(1111, this.projects)
                        this.loading = false
                    } else {
                        this.errMsg = res.msg
                        this.show = true
                        this.goto(`/${this.model}`)
                    }
                })
            },
            goto(path) {
                this.$router.push({
                    path: path
                })
            },
            handleSubmit(p) {
                this.goto(`/detection/${p.itemID}`)
            }
        },
        mounted: function() {
            this.getProjects()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .hide {
        display: none;
    }
    
    .show {
        display: block;
    }
    
    .t180 {
        margin: 0 auto;
        margin-top: 180px;
    }
    
    .t240 {
        margin: 0 auto;
        margin-top: 240px;
    }
    
    @media only screen and (max-width: 768px) {
        .project_card {
            /* padding: 0 26px; */
        }
    }
    
    .content {
        width: 100%;
        margin: 0 auto;
    }
</style>