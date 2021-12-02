<template>
  <div>
    <v-app>
      <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>签到系统</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <div v-if="noti_list.length != 0">
          <v-alert
            v-for="(item,index) in noti_list"
            :key="index"
            class="mx-auto mt-5"
            max-width="450"
            dense
            prominent
            :type="item.type"
            transition="scale-transition"
          >
            <v-row align="center">
              <v-col class="grow">
                {{item.text}}
              </v-col>
              <v-col class="shrink">
                <v-btn text @click="noti_check(item)">已阅</v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </div>
        
        <!--  -->
        <v-container
            v-show="group == 0 && act_info.total==0"
            fluid
        >
          <div justify="center" align="center" class="mt-6">
            <v-img src="../../assets/qiqihutao.png" max-width="200px" class="mx-auto" alt=""></v-img>
            <div class="text-subtitle-1 grey--text">您的班级此时没有进行中的活动</div>
          </div>
        </v-container>

        <v-container
            v-show="group == 0 && act_info.total!=0"
        >
        <!--首页(有活动)-->
        
        <v-card
          class="mx-auto my-5"
          v-for="(info_item,i) in act_info.list"
          :key="i"
          max-width="450"
        >
        <v-img
          class="white--text align-end"
          height="200px"
          :src="info_item.act_pic"
          gradient="to top right, rgba(0,0,0,.7), rgba(240,255,255,.3)"
        >
          <v-card-title class="font-weight-black">
            {{info_item.act_name}}
          </v-card-title>
          <v-card-subtitle class="text-caption">
            {{info_item.statistic.info}}
          </v-card-subtitle>
        </v-img>
    
        <v-card-subtitle class="pb-0">
          {{info_item.end_time}} 截止 已完成 {{info_item.statistic.done}}/{{info_item.statistic.total}}
        </v-card-subtitle>
    
        <v-card-text class="text--primary pt-5">
          <div>{{info_item.act_announcement}}</div>
        </v-card-text>
    
        <v-card-actions>
          <v-btn
            color="orange"
            :disabled="info_item.status==1"
            @click="signin(info_item)"
            large
            text
          >
          签到
          <v-icon
            right
            dark
            v-if="info_item.act_type==1&&info_item.status==0"
          >
            mdi-cloud-upload
          </v-icon>
          </v-btn>
          <v-btn
            color="primary"
            @click="get_sts(info_item)"
            large
            text
          >
            完成情况
          </v-btn>
          <v-btn
            color="red darken-2"
            v-if="info_item.status==1"
            @click="cancel(info_item)"
            large
            text
          >
          取消签到
          </v-btn>
        </v-card-actions>
      </v-card>
        </v-container>

        <v-container
                v-show="group == 1"
        >
        <div class="pa-5">
          <div class="text-h4 mb-5">
            签到活动参与记录
          </div>
          <div class="text-caption">
              点击右方小图标可查看活动详情。
          </div>
        </div>
          <!--记录-->
          <v-list three-line v-if="myActLog.length != 0">
            <template v-for="(item, index) in myActLog.list">
              <v-list-item
                      :key="index"
              >
                <v-list-item-avatar>
                  <v-icon>mdi-calendar-multiple-check</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="item.act_name"></v-list-item-title>
                  <v-list-item-subtitle >参与时间：{{item.date_time}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="view_act_info(item)">
                    <v-icon color="grey lighten-1">mdi-information</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-container>

        <v-container
                v-show="group == 2"
        >
        <!-- 个人信息 -->
        <v-card class="mx-3">
          <v-parallax
            dark
            height="200px"
            class="profile_card"
          >
            <v-app-bar
              flat
              color="rgba(0, 0, 0, 0)"
            >

              <v-toolbar-title class="text-h6 white--text pl-0">
                个人信息
              </v-toolbar-title>

              <v-spacer></v-spacer>
            </v-app-bar>

            <v-card-title class="white--text mt-4">
              <v-avatar size="56">
                  <v-icon>
                      mdi-account
                  </v-icon>
                <!-- <img
                  alt="user"
                  src=""
                > -->
              </v-avatar>
              <div class="text-h5 ml-3">
                {{myInfo.user_name}}
              </div>
              <br>
            </v-card-title>
            <v-card-subtitle>
              <div class="d-flex flex-wrap">
                <v-chip class="mx-2 mb-3" color="Default">UID:{{myInfo.user_id}}</v-chip>
                <v-chip class="mx-2 mb-3" color="secondary">Email:{{myInfo.email}}</v-chip>
                <v-chip class="mx-2 mb-3" color="primary">班级:{{myInfo.class_name}}</v-chip>
                <v-chip class="mx-2 mb-3" color="orange">班级代码:{{myInfo.class_code}}</v-chip>
                <v-chip class="mx-2 mb-3 white--text" color="red" v-if="myInfo.is_admin">管理员</v-chip>
              </div>
            </v-card-subtitle>
          </v-parallax>
          

        <v-list-item-group color="primary">

          <v-list-item @click="change_noti" link>
            <v-list-item-icon>
              <v-icon>mdi-alarm</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>修改通知方式</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="bind_wechat" link>
            <v-list-item-icon>
              <v-icon>mdi-wechat</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>绑定微信账号</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          
        </v-list-item-group>  
        </v-card>
        <!-- 版本 -->
        </v-container>

        <!-- 提示框 -->
        <v-dialog v-model="dialog.open" max-width="500px">
          <v-card>
            <v-card-title>{{dialog.title}}</v-card-title>
            <v-card-text>
                {{dialog.text}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog.open=!dialog.open">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      <!-- 活动统计数据 -->
      <v-dialog
        v-model="sts_dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
      <v-card>
        <v-toolbar
          dark
          color="info"
        >
            <v-btn
              icon
              dark
              @click="sts_dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>活动统计数据</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <div class="pa-4">
          <div class="text-caption">
              数据统计刷新存在0~10s延迟。
          </div>
        </div>
        <v-card class="ma-2">
          <v-list dense class="pa-2">
            <v-subheader>未完成</v-subheader>
            <v-list-item-group
                color="primary"
            >
                <v-list-item
                v-for="(item,i) in sts.unfinished_list"
                :key="i"
                >
                <v-list-item-icon>
                    <v-icon v-text="item.id"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
    
            <v-divider></v-divider>
    
            <v-subheader>已完成</v-subheader>
            <v-list-item-group
                color="primary"
            >
                <v-list-item
                v-for="(item,i) in sts.finished_list"
                :key="i"
                >
                <v-list-item-icon>
                    <v-icon v-text="item.id"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
        
      </v-card>
      </v-dialog>


      <!-- 修改通知方式 -->
      <v-dialog
        v-model="change_noti_dialog"
        persistent
        max-width="600px"
      >
      <v-card>
        <v-card-title>
          <span class="text-h5">通知方式</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- 表单内容 -->
            <div class="text-body-1">
              若您未完成签到，系统将会在活动有效期内每天中午12:30和下午6:30按照以下所选方式提醒您。
              <br>
              信息内会包含快捷登录系统的链接，请勿泄露哦。
            </div>
            <v-radio-group
              v-model="noti_type"
              row
            >
              <v-radio
                label="关闭通知"
                value="none"
              ></v-radio>
              <v-radio
                label="邮件通知"
                value="email"
              ></v-radio>
              <v-radio
                label="微信通知"
                value="wechat"
              ></v-radio>
            </v-radio-group>
            <a href="/test/tpl" target="_blank">通知模板</a>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="change_noti_dialog = false"
          >
            关闭
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submit_noti_type"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>

      <!-- 绑定微信 -->
      <v-dialog
        v-model="bind_wechat_dialog"
        persistent
        max-width="600px"
      >
      <v-card>
        <v-card-title>
          <span class="text-h5">绑定微信</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- 内容 -->
            <div class="text-body-1">微信推送功能借助第三方平台「WxPusher」实现，关注服务号即完成绑定，系统将通过此平台向您推送通知。</div>
            <v-img :src="wechat_bind_data.qrcode_url" alt="获取失败" class="mx-auto" max-width="200px"></v-img>
            <div class="text-caption text-center">请使用微信扫描此处二维码</div>
            <!-- 内容 -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="bind_wechat"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>

      <!-- 活动详情 -->
      <v-dialog v-model="actQueryDialog" max-width="500px">
        <v-card>
          <v-card-title>{{actQuery.name}}</v-card-title>
          <v-card-text>
            <div class="text-overline">头图</div><v-img :src="actQuery.pic" max-height="200px" ></v-img><v-divider></v-divider>
          <div class="text-overline">活动公告</div>{{actQuery.announcement}}<v-divider></v-divider>
          <div class="text-overline">签到完成提示语</div>{{actQuery.cheer_text}}<v-divider></v-divider>
          <div class="text-overline">活动开始时间</div>{{actQuery.begin_time}}<v-divider></v-divider>
          <div class="text-overline">活动结束时间</div>{{actQuery.end_time}}<v-divider></v-divider>
          <div class="text-overline">创建时间</div>{{actQuery.create_time}}<v-divider></v-divider>
          <div class="text-overline">更新时间</div>{{actQuery.update_time}}<v-divider></v-divider>
          <div class="text-overline">创建人</div>{{actQuery.create_by}}<v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="actQueryDialog=!actQueryDialog">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 上传文件 -->
      <v-dialog v-model="upload.dialog" max-width="500px" v-if="upload.dialog == true">
          <v-card>
              <v-card-title class="text-h5">您需要上传文件</v-card-title>
              <v-card-text>请仔细阅读活动公告，上传所需文件。请勿上传含有违反中国大陆和香港法律内容的文件。</v-card-text>
              <v-card-text>
                  <v-file-input
                          v-model="upload.file"
                          placeholder="选择文件"
                          prepend-icon="mdi-file"
                          label="选择文件"
                  ></v-file-input>
              </v-card-text>
              <v-card-text>支持格式:{{upload.act_item.file_options.allow_ext}}</v-card-text>
              <v-card-text>文件大小不超过{{upload.act_item.file_options.max_size}}</v-card-text>
              <v-card-text>特殊要求：{{upload.act_item.file_options.note}}</v-card-text>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="upload.dialog=false" :disabled="this.upload.loading" right>关闭</v-btn>
                  <v-btn color="blue darken-1" text @click="upload_signin" :loading="upload.loading" right>OK</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>

      </v-main>
      
      <!-- 菜单 -->
      <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            功能菜单
          </v-list-item-title>
          <v-list-item-subtitle>
            用户面板
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        nav
      >
      <v-list-item-group
        v-model="group"
        active-class="deep-purple--text text--accent-4"
      >
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-calendar-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>主页</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-calendar-search</v-icon>
          </v-list-item-icon>
          <v-list-item-title>签到记录</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>我的</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item to="/admin" link v-if="myInfo.is_admin">
          <v-list-item-icon>
            <v-icon>mdi-account-tie</v-icon>
          </v-list-item-icon>
          <v-list-item-title>管理员面板</v-list-item-title>
        </v-list-item>

        <v-list-item @click="logout" link>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>退出登录</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    </v-navigation-drawer>

    <v-footer app>
    <!-- -->
    <div class="text-caption py-3">{{version}} &copy;2021 ROY233<br><a href="https://hub.fastgit.org/rroy233/signin-helper" class="text-decoration-none" target="_blank">Github</a> | <a href="https://hub.fastgit.org/rroy233/signin-helper/blob/main/CHANGELOG.md" class="text-decoration-none" target="_blank">更新日志</a></div>
    </v-footer>
    </v-app>
  </div>
</template>

<script>
const backEndUrl = process.env.VUE_APP_API_URL;
import nProgress from 'nprogress'
export default {
    name:"UserIndex",
    data(){
      return {
        navi_bar:0,
        drawer:false,
        group:0,
        badge:true,
        dialog:{
            open:false,
            title:'',
            text:''
        },
        change_noti_dialog:false,
        actQueryDialog:false,
        bind_wechat_dialog:false,
        sts_dialog:false,
        act_info:{
          total:0,
          list:[{
            act_token:"",
            act_name:"",
            act_announcement:"",
            act_pic:"",
            act_type:0,
            begin_time:"",
            end_time:"",
            status:1,
            statistic:{},
            file_options:{
              allow_ext:"",
              max_size:"",
              note:""
            },
          }],
        },
        sign_btn:{
            disabled:true,
            text:"签到",
        },
        sts:{
          done:0,
          total:0,
          unfinished_list:[],
          finished_list:[],
        },
        myInfo:{
          user_id:0,
          user_name:"",
          email:"",
          class_name:"",
          class_code:"",
          is_admin:0,
        },
        myActLog:[],
        noti_type:"none",
        actQuery:{
          name:"",
          announcement:"",
          cheer_text:"",
          pic:"",
          begin_time:"",
          end_time:"",
          create_time:"",
          update_time:"",
          create_by:"",
        },
        wechat_bind_data:{
          timer:false,
          qrcode_url:"",
          token:"",
        },
        version:"DevEnv",
        csrfHeader:{},
        noti_list:[],
        upload:{
          act_item:null,
          dialog:false,
          loading:false,
          file:null,
        }
      }
    },
    mounted:function(){
        this.initData()
    },
    methods:{
      initData:function(){
        let _this = this
        nProgress.start()
        //获取csrf-token
        if (this.$cookies.get("CSRF-TOKEN")==null){
          this.$router.push({path:"/error/csrf-token获取失败，请换个浏览器登录"})
          nProgress.done()
          return
        }else{
          this.csrfHeader = {"X-CSRF-TOKEN":this.$cookies.get("CSRF-TOKEN")}
        }

        //获取后端版本
        this.axios({
            method: 'get',
            url: backEndUrl+'/api/user/version',
        }).then(function (res) {
            if (res.data.status == 0){
                _this.version = res.data.data.version
            }else{
                _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })

        //获取活动信息
        this.axios({
            method: 'get',
            url: backEndUrl+'/api/user/act/info',
        }).then(function (res) {
            if (res.data.status == 0){
                _this.act_info = res.data.data
                if (res.data.data.status == 0){
                    _this.sign_btn.disabled = false
                    _this.sign_btn.text = "签到" 
                }else{
                    _this.sign_btn.disabled = true
                    _this.sign_btn.text = "已签到" 
                }
            }else{
                _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })

        //获取个人信息
        this.axios({
            method: 'get',
            url: backEndUrl+'/api/user/profile',
        }).then(function (res) {
            // 处理成功情况
            if (res.data.status == 0){
              _this.myInfo = res.data.data
            }else{
                _this.error(res.data.msg)
            }
        })
        .catch(function (error) {
            // 处理错误情况
            _this.error(error)
        })

        //获取参与记录
        this.axios({
            method: 'get',
            url: backEndUrl+'/api/user/act/log',
        }).then(function (res) {
            // 处理成功情况
            if (res.data.status == 0){
                _this.myActLog = res.data.data
              }else{
                _this.error(res.data.msg)
              }
        })
        .catch(function (error) {
            // 处理错误情况
            _this.error(error)
        })

        //获取顶置信息
        this.axios({
            method: 'get',
            url: backEndUrl+'/api/user/noti/fetch',
        }).then(function (res) {
            if (res.data.status == 0){
                _this.noti_list = res.data.data
            }else{
                _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })
        nProgress.done()
      },
      upload_signin:function(){
        if(this.upload.act_item==null){
          this.error('未选择活动')
          return
        }

        let _this = this
        let param = new FormData(); 
        param.append('file',this.upload.file);
        this.upload.loading = true

        //上传文件
          this.axios({
            method: 'post',
            url: backEndUrl+'/api/user/act/upload?act_token='+_this.upload.act_item.act_token,
            headers:{
              'X-CSRF-TOKEN':_this.$cookies.get("CSRF-TOKEN"),
              'Content-type':"multipart/form-data;charset:utf-8",
            },
            data:param
          }).then(function (res) {
              if (res.data.status == 0){
                let upload_tk = res.data.data.upload_token

                //普通签到接口
                _this.axios({
                    method: 'post',
                    url: backEndUrl+'/api/user/act/signin',
                    headers:_this.csrfHeader,
                    data:{
                        act_token:_this.upload.act_item.act_token,
                        upload_token:upload_tk,
                    }
                }).then(function (res) {
                    _this.upload.dialog = false
                    _this.upload.loading = false
                    if (res.data.status == 0){
                        _this.success(res.data.data.text)
                        _this.initData()
                    }else{
                        _this.error(res.data.msg)
                    }
                }).catch(function (error) {
                    _this.error(error)
                })
              }else{
                  _this.error(res.data.msg)
                  _this.upload.loading = false
                  return
              }
          }).catch(function (error) {
              _this.error(error)
              return
          })
      },
      cancel:function(info_item){
        let _this = this
          this.axios({
              method: 'post',
              url: backEndUrl+'/api/user/act/cancel',
              headers:_this.csrfHeader,
              data:{
                  act_token:info_item.act_token,
              }
          }).then(function (res) {
              if (res.data.status == 0){
                  _this.success(res.data.msg)
                  _this.initData()
              }else{
                  _this.error(res.data.msg)
              }
          }).catch(function (error) {
              _this.error(error)
          })
      },
      signin:function(info_item){
          if (info_item.act_type==1){
            this.upload.act_item = info_item
            this.upload.dialog = true
            return
          }
          let _this = this
          this.axios({
              method: 'post',
              url: backEndUrl+'/api/user/act/signin',
              headers:_this.csrfHeader,
              data:{
                  act_token:info_item.act_token,
                  upload_token:"",
              }
          }).then(function (res) {
              if (res.data.status == 0){
                  _this.success(res.data.data.text)
                  _this.initData()
              }else{
                  _this.error(res.data.msg)
              }
          }).catch(function (error) {
              _this.error(error)
          })
      },
      get_sts:function(info_item){
        let _this = this
        //获取统计数据
        this.axios({
              method: 'get',
              url: backEndUrl+'/api/user/act/statistic',
              params:{
                act_token:info_item.act_token
              }
          }).then(function (res) {
              // 处理成功情况
              if (res.data.status == 0){
                  _this.sts.done = res.data.data.done
                  _this.sts.total = res.data.data.total
                  _this.sts.unfinished_list = res.data.data.unfinished_list
                  _this.sts.finished_list = res.data.data.finished_list
                  _this.sts_dialog = true
              }else{
                  _this.error(res.data.msg)
              }
          })
          .catch(function (error) {
              // 处理错误情况
              _this.error(error)
          })
      },
      logout:function(){
        let _this = this
        this.axios({
            method: 'post',
            url: backEndUrl+'/api/logout',
            headers:_this.csrfHeader,
        }).then(function (res) {
            if (res.data.status == 0){
              setTimeout(function (){window.location.href = "https://account.roy233.com/logout"; },1000)
                _this.success("即将登出")
            }else{
                _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })
      },
      change_noti:function(){
        let _this = this
        this.axios({
            method: 'get',
            url: backEndUrl+'/api/user/noti/get',
        }).then(function (res) {
            if (res.data.status == 0){
              _this.noti_type = res.data.data.noti_type
              _this.change_noti_dialog = true
            }else{
                _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })
      },
      submit_noti_type:function(){
        let _this = this
        this.axios({
            method: 'post',
            url: backEndUrl+'/api/user/noti/edit',
            headers:_this.csrfHeader,
            data:{
              noti_type:_this.noti_type
            }
        }).then(function (res) {
            if (res.data.status == 0){
              _this.success("修改成功")
              _this.change_noti_dialog = false
            }else{
                _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })
      },
      view_act_info:function(item){
        let _this = this
        this.axios({
            method: 'get',
            url: backEndUrl+'/api/user/act/query',
            params:{
              act_token:item.act_token
            }
        }).then(function (res) {
            if (res.data.status == 0){
              _this.actQuery = res.data.data
              _this.actQueryDialog = true
              //打开dialog
            }else{
                _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })
      },
      bind_wechat:function(){
        if(this.wechat_bind_data.timer){
          this.bind_wechat_dialog = false
          clearInterval(this.wechat_bind_data.timer)
          this.wechat_bind_data.timer = null
          return
        }
        let _this=this
        this.axios({
              method: 'get',
              url: backEndUrl+'/api/user/wechat/qrcode',
          }).then(function (res) {
              // 处理成功情况
              if (res.data.status == 0){
                  _this.wechat_bind_data.qrcode_url = res.data.data.qrcode_url
                  _this.wechat_bind_data.token = res.data.data.token
                  _this.bind_wechat_dialog = true
                  _this.wechat_bind_data.timer = setInterval(function(){
                    _this.bind_wechat_query()
                  }, 3000);
              }else{
                  _this.error(res.data.msg)
              }
          })
          .catch(function (error) {
              // 处理错误情况
              _this.error(error)
          })
      },
      bind_wechat_query:function(){
        let _this=this
        this.axios({
              method: 'get',
              url: backEndUrl+'/api/user/wechat/bind',
              params:{
                token:_this.wechat_bind_data.token
              }
          }).then(function (res) {
              if (res.data.status == 0){
                return
              }else if (res.data.status == 1){
                  _this.success("绑定成功")
              }else if (res.data.status == -1){
                  _this.error(res.data.msg)
              }
              _this.bind_wechat_dialog = false
              clearInterval(_this.wechat_bind_data.timer)
              _this.wechat_bind_data.timer = null
          })
          .catch(function (error) {
              _this.error(error)
          })
      },
      noti_check:function(item){
        nProgress.start()
        let _this = this
        this.axios({
            method: 'post',
            url: backEndUrl+'/api/user/noti/check',
            headers:_this.csrfHeader,
            data:{
              token:item.token
            }
        }).then(function (res) {
            if (res.data.status == 0){
              _this.initData()
            }else{
              _this.error(res.data.msg)
            }
        }).catch(function (error) {
            _this.error(error)
        })
        nProgress.done()
      },
      success:function(text){
            this.dialog.open = true
            this.dialog.title = '成功'
            this.dialog.text = text
        },
        error:function(text){
            this.dialog.open = true
            this.dialog.title = '失败'
            this.dialog.text = text
        },
    },
    watch:{
      group:function(){
        nProgress.start()
        this.drawer = false
        nProgress.done()
      }
    },
}
</script>

<style scoped>
.profile_card{
  background: rgb(34,193,195);
  background: linear-gradient(119deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%);
}
</style>
