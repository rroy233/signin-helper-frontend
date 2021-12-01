<template>
  <div>
      <v-app id="inspire">
    <v-app-bar app>
      <v-toolbar-title>管理员面板</v-toolbar-title>
    </v-app-bar>

    <v-main>
      
      <v-container>
        <!--  -->
        <v-alert
        class="ma-2"
        text
        color="info"
        >
        <h3 class="text-h5">
            管理员您好
        </h3>
        <div>如果遇到什么问题可以联系QQ:2867984618</div>
        <div>系统现已支持多任务并行，您可以在发布多个签到活动了。</div>

        <v-divider
            class="my-4 info"
            style="opacity: 0.22"
        ></v-divider>

        <div class="v-text-body-1">
            您当前所管理的班级名称为<code>{{class_info.class_name}}</code>,一共有<code>{{class_info.total}}</code>名同学已加入班级。
            新同学可以使用班级代码<code>{{class_info.class_code}}</code>加入。
        </div>
        </v-alert>

        <!-- 菜单开始 -->
        <v-list-item-group color="primary" class="ma-2">

            
            <v-list-item @click="edit_class" link>
                <v-list-item-icon>
                  <v-icon>mdi-google-classroom</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>修改班级信息</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

              <v-list-item @click="show_act_list" link>
                <v-list-item-icon>
                  <v-icon>mdi-calendar-search</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>活动管理</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="show_user_list" link>
                <v-list-item-icon>
                  <v-icon>mdi-account-cog-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>班级成员管理</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              

              <v-divider></v-divider>

              <v-list-item to="/user" link>
                <v-list-item-icon>
                  <v-icon>mdi-keyboard-return</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>返回用户端</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
    
          </v-list-item-group>
          <!-- 菜单结束 -->


      </v-container>


      <!-- 提示框 -->
      <v-dialog v-model="dialog.open" max-width="450px">
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

      <!-- 编辑班级信息 -->
        <v-dialog v-model="editClassDialog" max-width="450px">
            <v-card>
            <v-card-title>编辑班级信息</v-card-title>
            <v-card-text>
                <v-text-field
                    label="班级名称"
                    v-model="class_edit.class_name"
                    outlined
                ></v-text-field>
                <v-text-field
                    label="班级代码"
                    v-model="class_edit.class_code"
                    outlined
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="editClassDialog=!editClassDialog">取消</v-btn>
                <v-btn color="blue darken-1" text @click="save_class">保存</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 加载框 -->
      <v-dialog
        v-model="loading_dialog"
        hide-overlay
        persistent
        width="300"
        >
        <v-card
            color="white"
            dark
        >
            <v-card-text class="mt-1 primary--text">
            加载中
            <v-progress-linear
                indeterminate
                color="primary"
                class="mb-0"
            ></v-progress-linear>
            </v-card-text>
        </v-card>
        </v-dialog>


        <!-- 活动列表 -->
        <v-dialog v-model="act_list_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar
                  color="cyan"
                  dark
                  flat
                >
                <v-btn icon dark @click="act_list_dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                  <v-toolbar-title>活动管理</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn depressed color="cyan darken-2" @click="new_act">
                    新建活动
                  </v-btn>
                  <template v-slot:extension>
                    <v-tabs v-model="act_list_tab" align-with-title>
                      <v-tabs-slider color="yellow"></v-tabs-slider>
                      <v-tab>
                        <v-badge color="pink" dot v-if="act_list.active_num!=0">
                            当前活动
                        </v-badge>
                        {{act_list.active_num==0?'当前活动':''}}
                      </v-tab>
                      <v-tab>
                        历史活动
                      </v-tab>
                      <v-tab-item>
                        <v-card>
                        <v-container>
                            <!-- 当前活动 -->
                            <v-list three-line>
                                <template v-for="(item, index) in act_list.active_list">
                                  <v-list-item :key="index">
                                    <v-list-item-avatar>
                                      <v-icon>mdi-calendar-cursor</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                      <v-list-item-title >{{item.name}}</v-list-item-title>
                                      <v-list-item-subtitle >创建时间{{item.begin_time}}</v-list-item-subtitle>
                                      <v-list-item-subtitle >截止时间{{item.end_time}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                      <v-btn depressed @click="edit_act(item)">
                                        编辑
                                      </v-btn>
                                    </v-list-item-action>
                                    <v-list-item-action>
                                        <v-btn depressed @click="get_sts(item)">
                                          数据
                                          <v-icon v-if="item.type==1" small right>mdi-cloud-check-outline</v-icon>
                                        </v-btn>
                                        <v-list-item-action-text class="text-center">创建人:{{item.create_by}}</v-list-item-action-text>
                                      </v-list-item-action>
                                  </v-list-item>
                                </template>
                            </v-list>
                            <!-- 当前活动 -->
                        </v-container>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card>
                            <!-- 历史活动 -->
                            <v-list three-line>
                                <template v-for="(item, index) in act_list.history_list">
                                  <v-list-item :key="index">
                                    <v-list-item-avatar>
                                      <v-icon>mdi-calendar-lock</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                      <v-list-item-title v-html="item.name"></v-list-item-title>
                                      <v-list-item-subtitle >创建时间{{item.begin_time}}</v-list-item-subtitle>
                                      <v-list-item-subtitle >截止时间{{item.end_time}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                      <v-btn depressed @click="edit_act(item)">
                                        编辑
                                      </v-btn>
                                    </v-list-item-action>
                                    <v-list-item-action>
                                        <v-btn depressed @click="get_sts(item)">
                                          数据
                                          <v-icon v-if="item.type==1" small right>mdi-cloud-check-outline</v-icon>
                                        </v-btn>
                                        <v-list-item-action-text class="text-center">创建人:{{item.create_by}}</v-list-item-action-text>
                                    </v-list-item-action>
                                  </v-list-item>
                                </template>
                            </v-list>
                            <!-- 历史活动 -->
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                  </template>
                </v-toolbar>
            </v-card>
        </v-dialog>


        <!-- 编辑活动信息 -->
        <v-dialog
            v-model="act_dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
        <v-card>
            <v-toolbar
            dark
            color="primary"
            >
            <v-btn
                icon
                dark
                @click="act_dialog = false"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{act_edit_mode == "new"?"🌟新建活动":"📝编辑当前活动"}}</v-toolbar-title>
            <v-spacer></v-spacer>
            
            <v-toolbar-items>
            <v-btn
            dark
            text
            @click="save_act"
            >
            保存
            </v-btn>
            </v-toolbar-items>
            </v-toolbar>
            
            <!-- 编辑区开始 -->
            <v-container>
                <v-alert
                    dense
                    type="info"
                    icon="mdi-folder-plus-outline"
                    v-if="act_edit_mode=='new'"
                    class="mt-2 mb-4"
                >
                请正确填写结束日期，活动状态会在到期后自动变更。
                <br>
                建议管理员为每一个活动都选择不同的配图，便于区分。
                <br>
                保存之后，活动即开始，系统将向班级内每一位同学发送通知。
                </v-alert>
                <v-alert
                dense
                color="#2A3B4D"
                dark
                icon="mdi-calendar-edit"
                v-if="act_edit_mode=='edit'"
                class="mt-2 mb-4"
                >
                若您提前关闭此活动，我们将自动为您设置结束时间。
                </v-alert>

                <v-text-field
                    label="活动名称"
                    v-model="act_info.name"
                    :rules="name_rule"
                    hint="建议不要与过去的重复，可以是:第x周xxxx"
                    outlined
                ></v-text-field>

                <v-switch
                v-model="act_info.active"
                v-if="act_edit_mode=='edit'"
                inset
                label="是否启用活动"
                class="my-0"
                ></v-switch>

                <v-switch
                v-model="act_info.daily_notify"
                inset
                label="是否启用每日提醒"
                class="my-0"
                ></v-switch>
                
                <v-textarea
                    label="活动公告"
                    v-model="act_info.announcement"
                    :rules="announcement_rule"
                    outlined
                ></v-textarea>

                <v-text-field
                    label="完成签到提示语"
                    v-model="act_info.cheer_text"
                    :rules="cheerText_rule"
                    outlined
                ></v-text-field>

                <div class="text-overline">头图设置</div>
                <div class="text-body-1 mb-3">
                    我们允许您个性化设置签到卡片的背景图片，如果您要使用默认图片的话，下方输入框请 <code>留空</code>。
                    <br>
                    如果需要自定义图片，请前往<a href="https://sm.ms" target="_blank">SM.MS</a>上传图片，在下方填入图片的地址。
                    <br>
                    地址示例: <code>https://i.loli.net/2021/10/24/9DjB5EhacuVGPHT.jpg</code>，预览卡片会同步更新。
                </div>
                <v-text-field
                    label="头图地址"
                    v-model="act_info.pic"
                    outlined
                ></v-text-field>


                <!-- 预览 -->
                <v-container>
                    <v-card
                    class="mx-auto"
                    max-width="450"
                    >
                    <v-img
                        class="white--text align-end"
                        height="200px"
                        :src="img_preview"
                        gradient="to top right, rgba(0,0,0,.7), rgba(240,255,255,.3)"
                    >
                        <v-card-title class="font-weight-black">
                            {{act_info.name}}
                          </v-card-title>
                          <v-card-subtitle class="text-caption">
                            还有xxx等x名同学未完成
                          </v-card-subtitle>
                    </v-img>
                
                    <v-card-subtitle class="pb-0">
                        预览卡片
                    </v-card-subtitle>
                
                    <v-card-text class="text--primary pt-5">
                        <div>{{act_info.announcement}}</div>
                    </v-card-text>
                
                    <v-card-actions>
                        <v-btn
                        color="orange"
                        large
                        text
                        >
                        签到
                        <v-icon
                            right
                            dark
                            v-if="act_info.upload.enabled"
                        >
                            mdi-cloud-upload
                        </v-icon>
                        </v-btn>
                        <v-btn
                        color="primary"
                        large
                        text
                        >
                        完成情况
                        </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-container>
                <!-- 预览结束 -->

                <!-- 上传设置 -->
                <v-card v-if="act_edit_mode=='new'" class="my-3">
                    <v-card-title>文件上传设置</v-card-title>
                    <v-card-subtitle>
                        系统默认会将用户上传的文件名改为用户的姓名，如果需要保留原文件名，请关闭“上传后重新命名”开关。
                        <br>
                        活动一旦发布将无法更改下列设置!
                    </v-card-subtitle>
                    <v-card-text>
                        <v-switch
                        v-model="act_info.upload.enabled"
                        inset
                        label="是否需要上传文件"
                        ></v-switch>
                    </v-card-text>
                    
                    
                    <v-card-text v-if="act_info.upload.enabled">
                        <v-radio-group
                        v-model="act_info.upload.type"
                        label="文件类型"
                        >
                        <v-radio
                            label="图片文件(png,jpg)"
                            value="image"
                        ></v-radio>
                        <v-radio
                            label="压缩包(zip,rar)"
                            value="archive"
                        ></v-radio>
                        </v-radio-group>
                        <v-slider
                        v-model="act_info.upload.max_size"
                        label="文件大小不超过(MB)"
                        thumb-color="green lighten-1"
                        thumb-label="always"
                        max="100"
                        min="1"
                        ></v-slider>
                        <v-switch
                        v-model="act_info.upload.rename"
                        inset
                        label="上传后重新命名"
                        class="my-0"
                        ></v-switch>
                    </v-card-text>
                </v-card>
                <v-card v-if="act_edit_mode=='edit' && act_info.upload.enabled==true" class="my-3">
                    <v-card-title>文件上传设置浏览</v-card-title>
                    <v-card-text>
                        文件类型：<code>{{upload_type[act_info.upload.type]}}</code>
                        <br>
                        大小限制：<code>{{act_info.upload.max_size}} MB</code>
                        <br>
                        上传后是否重新命名：<code>{{act_info.upload.rename}}</code>
                    </v-card-text>
                </v-card>    
                <!-- 上传设置结束 -->

                <!-- 结束时间选择 -->
                <v-menu
                        ref="end_date_menu"
                        v-model="date_time_menu.end_date_menu"
                        :close-on-content-click="false"
                        :return-value.sync="act_info.end_time.d"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                                v-model="act_info.end_time.d"
                                label="选择活动结束日期"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                            v-model="act_info.end_time.d"
                            no-title
                            scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn
                                text
                                color="primary"
                                @click="date_time_menu.end_date_menu = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                                text
                                color="primary"
                                @click="$refs.end_date_menu.save(act_info.end_time.d)"
                        >
                            OK
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <v-menu
                        ref="end_time_menu"
                        v-model="date_time_menu.end_time_menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="act_info.end_time.t"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                                v-model="act_info.end_time.t"
                                label="活动结束时间(24小时制)"
                                prepend-icon="mdi-clock-time-four-outline"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-time-picker
                            v-if="date_time_menu.end_time_menu"
                            v-model="act_info.end_time.t"
                            format="24hr"
                            full-width
                            @click:minute="$refs.end_time_menu.save(act_info.end_time.t)"
                    ></v-time-picker>
                </v-menu>

                <small>完成编辑后记得点击右上角的“保存”按钮</small>
            </v-container>
            <!-- 结束时间选择 -->
            

            <!-- 编辑区结束 -->

        </v-card>
        </v-dialog>
        
        <!-- 活动统计数据 sts_dialog -->
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
            <v-card-text>
                <v-btn
                    depressed
                    @click="export_file"
                    v-if="export_data.act_id != 0 && export_data.url ==''"
                    :loading="export_data.loading"
                    class="ma-3"
                >
                导出所有文件
                </v-btn>
                <v-btn
                    depressed
                    color="primary"
                    target="_blank"
                    :href="export_data.url"
                    v-if="export_data.act_id != 0 && export_data.url !=''"
                    class="ma-3"
                >
                下载
                </v-btn>
                <small v-if="export_data.act_id != 0 && export_data.url !=''">下载链接有效期为5分钟。</small>
            </v-card-text>
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
                        <v-list-item-title>{{item.user_name}} (UID:{{item.user_id}})</v-list-item-title>
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
                        <v-list-item-title>{{item.user_name}} (UID:{{item.user_id}})</v-list-item-title>
                        <v-list-item-subtitle>完成时间:{{item.date_time}}</v-list-item-subtitle>
                    </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            </v-card>
            
        </v-card>
        </v-dialog>

        <!-- 用户管理 user_dialog -->
        <v-dialog
            v-model="user_dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
        <v-card class="pa-4">
            <v-toolbar
            dark
            color="info"
            >
                <v-btn
                icon
                dark
                @click="user_dialog = false"
                >
                <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>班级成员管理</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

             <v-alert
            shaped
            type="info"
            class="mx-auto ma-4"
            max-width="450px"
            >
            【踢出班级】:点击按钮后，将立即清除用户的签到记录，记录无法恢复。用户将重新回到“初始化”阶段。谨慎操作！
            </v-alert>
            <v-card class="mx-auto ma-4" max-width="450px">
                <v-card-title>
                所有班级成员
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="userlist_search"
                        append-icon="mdi-magnify"
                        label="搜索"
                        single-line
                        hide-details
                    ></v-text-field>
                    </v-card-title>
                <v-card-text>
                    <v-data-table
                    :headers="userlist_headers"
                    :items="user_list"
                    :search="userlist_search"
                    >
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn depressed small class="ma-2" @click="confirn_delete(item)">踢出班级</v-btn>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete.open" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">确定要删除该用户?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogDelete.open=false">取消</v-btn>
                    <v-btn color="blue darken-1" text @click="op_user">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-main>

  </v-app>
  </div>
</template>

<script>
const backEndUrl = process.env.VUE_APP_API_URL;
export default {
    name:"AdminIndex",
    data(){
      return {
        announcement_rule:[v => v.length <= 50 || '字数不能超过50'],
        name_rule:[v => v.length <= 40 || '字数不能超过40'],
        cheerText_rule:[v => v.length <= 20 || '字数不能超过20'],
      dialog:{
          open:false,
          title:'',
          text:''
      },
      act_list:{
        active_num:0,
        active_list:[],
        history_list:[],
      },
      class_info:{
          class_name:"",
          class_code:"",
          total:0,
          act_id:"",
          act_name:''
      },
      class_edit:{
          class_name:"",
          class_code:"",
      },
      act_dialog:false,
      editClassDialog:false,
      act_list_dialog:false,
      loading_dialog:false,
      sts_dialog:false,
      user_dialog:false,
      editUserDialog:false,
      dialogDelete:{
          item:null,
          open:false
      },
      act_list_tab:0,
      act_info:{
          name:"",
          active:false,
          daily_notify:true,
          pic:"",
          announcement:"",
          cheer_text:"",
          end_time:{
              d:"",
              t:"",
          },
          upload:{
            enabled:false,
            type:"",
            max_size:5,
            rename:true
          },
      },    
      sts:{
        done:0,
        total:0,
        unfinished_list:[],
        finished_list:[],
      },
      act_edit_mode:"edit",
      date_time_menu:{
        begin_date_menu: false,
        begin_time_menu:false,
        end_date_menu: false,
        end_time_menu:false
        },
        csrfHeader:{},
        user_list:[],
        userlist_search:'',
        userlist_headers: [
          {
            text: 'ID',
            align: 'start',
            value: 'id',
          },
          { text: '姓名', value: 'name' },
          { text: '操作', value: 'actions',sortable: false,},
        ],
        upload_type:{
            "image":"图片",
            "archive":"压缩文件"
        },
        export_data:{
            act_id:0,
            loading:false,
            url:""
        },
      }
    },
    mounted:function(){
        //获取csrf-token
        if (this.$cookies.get("CSRF-TOKEN")==null){
          this.$router.push({path:"/error/csrf-token获取失败，请换个浏览器登录"})
          return
        }else{
          this.csrfHeader = {"X-CSRF-TOKEN":this.$cookies.get("CSRF-TOKEN")}
        }

        //获取班级信息
        this.initClass()
    },
    methods:{
        initClass:function(){
            let _this = this
            this.axios({
                method: 'get',
                url: backEndUrl+"/api/admin/class/info",
            }).then(function (res) {
                if (res.data.status == 0){
                    _this.class_info = res.data.data
                }else{
                    _this.error(res.data.msg)
                }
            })
            .catch(function (error) {
                _this.error(error)
            })
        },
        edit_act:function(act_item){
            //获取要编辑的活动信息
            let _this = this
            this.axios({
                method: 'get',
                url: backEndUrl+"/api/admin/act/info",
                params:{
                    act_id:act_item.act_id,
                }
            }).then(function (res) {
                if (res.data.status == 0){
                    _this.act_info = res.data.data
                    _this.act_dialog = true
                    _this.act_edit_mode = "edit"
                }else{
                    _this.error(res.data.msg)
                }
            })
            .catch(function (error) {
                _this.error(error)
            })
        },
        new_act:function(){
            this.act_info.name = ""
            this.act_info.active = true
            this.act_info.daily_notify = true
            this.act_info.announcement = ""
            this.act_info.pic = ""
            this.act_info.cheer_text = "恭喜完成"
            this.act_info.end_time.d = ""
            this.act_info.end_time.t = ""
            this.act_info.upload.enabled = false
            this.act_info.upload.max_size = 5
            this.act_info.upload.rename = true

            this.act_dialog = true
            this.act_edit_mode = "new"
        },
        edit_class:function(){
            this.editClassDialog = true
            this.class_edit.class_name = this.class_info.class_name
            this.class_edit.class_code = this.class_info.class_code
        },
        show_act_list:function(){
            let _this = this
            this.loading_dialog = true
            this.axios({
                method: 'get',
                url: backEndUrl+"/api/admin/act/list",
            }).then(function (res) {
                if (res.data.status == 0){
                    _this.act_list = res.data.data
                    _this.loading_dialog = false
                }else{
                    _this.error(res.data.msg)
                }
            }).catch(function (error) {
                _this.error(error)
            })
            _this.act_list_dialog = true
        },
        save_class:function(){
            let _this = this
            this.axios({
                method: 'post',
                url: backEndUrl+"/api/admin/class/edit",
                headers:_this.csrfHeader,
                data:_this.class_edit
            }).then(function (res) {
                if (res.data.status == 0){
                    _this.success("保存成功")
                    _this.editClassDialog = false
                    _this.initClass()
                }else{
                    _this.error(res.data.msg)
                }
            })
            .catch(function (error) {
                _this.error(error)
            })
        },
        save_act:function(){
            let apiUrl = ""
            let _this = this
            if (this.act_edit_mode == "new"){
                apiUrl = "/api/admin/act/new"
            }else if (this.act_edit_mode == "edit"){
                apiUrl = "/api/admin/act/edit"
            }

            this.axios({
                method: 'post',
                url: backEndUrl+apiUrl,
                headers:_this.csrfHeader,
                data:_this.act_info
            }).then(function (res) {
                if (res.data.status == 0){
                    _this.success("保存成功")
                    _this.act_dialog = false
                    _this.show_act_list()
                }else{
                    _this.error(res.data.msg)
                }
            })
            .catch(function (error) {
                // 处理错误情况
                _this.error(error)
            })

        },
        get_sts:function(info_item){
            let _this = this
            //获取统计数据
            this.axios({
                method: 'get',
                url: backEndUrl+'/api/admin/act/statistic',
                params:{
                    act_id:info_item.act_id
                }
            }).then(function (res) {
                // 处理成功情况
                if (res.data.status == 0){
                    _this.sts.done = res.data.data.done
                    _this.sts.total = res.data.data.total
                    _this.sts.unfinished_list = res.data.data.unfinished_list
                    _this.sts.finished_list = res.data.data.finished_list

                    if(info_item.type == 1){
                        _this.export_data.act_id = info_item.act_id
                    }else{
                        _this.export_data.act_id = 0
                    }
                    _this.export_data.url = ""
                    
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
        show_user_list:function(){
            let _this = this
            //获取用户
            this.axios({
                method: 'get',
                url: backEndUrl+'/api/admin/user/list',
            }).then(function (res) {
                // 处理成功情况
                if (res.data.status == 0){
                    _this.user_list = res.data.data.data
                    _this.user_dialog = true
                }else{
                    _this.error(res.data.msg)
                }
            }).catch(function (error) {
                // 处理错误情况
                _this.error(error)
            })
        },
        get_user_list:function(){
            let _this = this
            //获取用户
            this.axios({
                method: 'get',
                url: backEndUrl+'/api/admin/user/list',
            }).then(function (res) {
                // 处理成功情况
                if (res.data.status == 0){
                    _this.user_list = res.data.data.data
                }else{
                    _this.error(res.data.msg)
                }
            }).catch(function (error) {
                // 处理错误情况
                _this.error(error)
            })
        },
        op_user:function(){
             let _this = this
            
            this.axios({
                method: 'post',
                url: backEndUrl+"/api/admin/user/del",
                headers:_this.csrfHeader,
                data:{
                    user_id:_this.dialogDelete.item.user_id,
                    sign:_this.dialogDelete.item.sign
                },
            }).then(function (res) {
                if (res.data.status == 0){
                    _this.get_user_list()
                    _this.success("操作成功")
                }else{
                    _this.error(res.data.msg)
                }
            }).catch(function (error) {
                // 处理错误情况
                _this.error(error)
            })

        },
        confirn_delete:function(item){
            this.dialogDelete.item = item
            this.dialogDelete.open = true
        },
        export_file:function(){
            let _this = this
            this.export_data.loading = true
            this.axios({
                method: 'post',
                url: backEndUrl+"/api/admin/act/export",
                headers:_this.csrfHeader,
                data:{
                    act_id:_this.export_data.act_id,
                },
            }).then(function (res) {
                if (res.data.status == 0){
                    _this.export_data.url = res.data.data.download_url
                }else{
                    _this.error(res.data.msg)
                }
                _this.export_data.loading = false
            }).catch(function (error) {
                // 处理错误情况
                _this.error(error)
            })
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
    computed:{
        img_preview:function(){
            if (this.act_info.pic == ""){
                return "/static/image/default.jpg"
            }else{
                return this.act_info.pic
            }
        }
    },
}
</script>

<style>

</style>