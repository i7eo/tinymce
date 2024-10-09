<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from "vue";
//:============================================================:  tinymce core  :============================================================://
import tinymce, { TinyMCE } from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver"; // default theme
import "tinymce/icons/default"; // default icon
// 皮肤样式
import 'tinymce/skins/content/default/content.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/skins/ui/oxide/skin.min.css'
//:============================================================: tinymce plugin :============================================================://
import "tinymce/plugins/advlist"; // 高级列表
import "tinymce/plugins/anchor"; // 锚点
import "tinymce/plugins/autolink"; // 自动链接
import "tinymce/plugins/autoresize"; // 编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import "tinymce/plugins/autosave"; // 自动存稿
import "tinymce/plugins/charmap"; // 特殊字符
import "tinymce/plugins/code"; // 编辑源码
import "tinymce/plugins/codesample"; // 代码示例
import "tinymce/plugins/colorpicker"; // 颜色选择器
import "tinymce/plugins/directionality"; // 文字方向
import "tinymce/plugins/emoticons"; // 表情
import "tinymce/plugins/emoticons/js/emojis"; // 表情依赖
import "tinymce/plugins/fullscreen"; // 全屏
import "tinymce/plugins/help"; // 帮助
import "tinymce/plugins/hr"; // 水平分割线
import "tinymce/plugins/image"; // 插入图片
import "tinymce/plugins/imagetools"; // 编辑图片
import "tinymce/plugins/importcss"; // 引入css
import "tinymce/plugins/insertdatetime"; // 插入日期时间
import "tinymce/plugins/link"; // 超链接
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/media"; // 插入编辑媒体
import "tinymce/plugins/nonbreaking"; // 插入不间断空格
import "tinymce/plugins/pagebreak"; // 插入分页符
import "tinymce/plugins/paste"; // 处理直接从word粘贴来的内容
import "tinymce/plugins/preview"; // 预览
import "tinymce/plugins/print"; // 打印
import "tinymce/plugins/quickbars"; // 快速工具栏
import "tinymce/plugins/save"; // 保存
import "tinymce/plugins/searchreplace"; // 查找替换
import "tinymce/plugins/table"; // 表格
import "tinymce/plugins/template"; // 内容模板
import "tinymce/plugins/textcolor"; // 文字颜色选择器
import "tinymce/plugins/textpattern"; // markdown 支持
import "tinymce/plugins/visualblocks"; // 显示元素范围
import "tinymce/plugins/visualchars"; // 显示不可见字符
import "tinymce/plugins/wordcount"; // 字数统计
// TODO: import katex for tinymce latex, see: https://stackoverflow.com/questions/76202508/how-to-add-a-custom-tinymce-plugin-with-vue3-nuxt-using-the-pluginmanager
// TODO: support markdown for tinymce, see: https://github.com/prathamVaidya/supercode-tinymce-plugin
import { handleI18n } from './i18n'

type EditorOptions = Parameters<TinyMCE["init"]>[0];
type ImageUploadHandler = Exclude<
  EditorOptions["images_upload_handler"],
  undefined
>;

handleI18n(tinymce)

const props = defineProps({
  /** 编辑器内容（双向绑定） */
  value: {
    type: String,
    required: true,
    default: "",
  },
  /** 编辑器 id，建议传入，尤其是同一页面多个编辑器的场景 */
  id: {
    type: [String, Number],
    default: "tinymce",
  },
  /** 编辑器显示高度，默认 500px */
  height: {
    type: Number,
    default: 500,
  },
  placeholder: {
    type: String,
    default: "请输入内容",
  },

  // menubar: {
  //   type: [Boolean, String],
  //   default: "file edit insert view format table tools help",
  // },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:value"]);

const editorValue = computed({
  get() {
    return props.value;
  },
  set(value) {
    emits("update:value", value);
  },
});

const editorOptions = computed(() => {
  const options: EditorOptions = {
    //:============================================================:  tinymce 内部功能设置  :============================================================://
    language: "zh_CN",
    /** 预览显示的样式初始化设置，必须与组件库中的 normailizecss 一致，改配置取自 antd */
    content_style: `html,body{width:100%;height:100%;}input::-ms-clear,input::-ms-reveal{display:none;}*,*::before,*::after{box-sizing:border-box;}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;-ms-overflow-style:scrollbar;-webkit-tap-highlight-color:rgba(0,0,0,0);}body{margin:0;color:rgba(0,0,0,0.85);font-size:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';font-variant:tabular-nums;line-height:1.5715;background-color:#fff;font-feature-settings:'tnum';}[tabindex='-1']:focus{outline:none !important;}hr{box-sizing:content-box;height:0;overflow:visible;}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:0.5em;color:rgba(0,0,0,0.85);font-weight:500;}p{margin-top:0;margin-bottom:1em;}abbr[title],abbr[data-original-title]{text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted;border-bottom:0;cursor:help;}address{margin-bottom:1em;font-style:normal;line-height:inherit;}input[type='text'],input[type='password'],input[type='number'],textarea{-webkit-appearance:none;}ol,ul,dl{margin-top:0;margin-bottom:1em;}ol ol,ul ul,ol ul,ul ol{margin-bottom:0;}dt{font-weight:500;}dd{margin-bottom:0.5em;margin-left:0;}blockquote{margin:0 0 1em;}dfn{font-style:italic;}b,strong{font-weight:bolder;}small{font-size:80%;}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline;}sub{bottom:-0.25em;}sup{top:-0.5em;}a{color:#1890ff;text-decoration:none;background-color:transparent;outline:none;cursor:pointer;transition:color 0.3s;-webkit-text-decoration-skip:objects;}a:hover{color:#40a9ff;}a:active{color:#096dd9;}a:active,a:hover{text-decoration:none;outline:0;}a:focus{text-decoration:none;outline:0;}a[disabled]{color:rgba(0,0,0,0.25);cursor:not-allowed;}pre,code,kbd,samp{font-size:1em;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;}pre{margin-top:0;margin-bottom:1em;overflow:auto;}figure{margin:0 0 1em;}img{vertical-align:middle;border-style:none;}a,area,button,[role='button'],input:not([type='range']),label,select,summary,textarea{touch-action:manipulation;}table{border-collapse:collapse;}caption{padding-top:0.75em;padding-bottom:0.3em;color:rgba(0,0,0,0.45);text-align:left;caption-side:bottom;}input,button,select,optgroup,textarea{margin:0;color:inherit;font-size:inherit;font-family:inherit;line-height:inherit;}button,input{overflow:visible;}button,select{text-transform:none;}button,html [type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button;}button::-moz-focus-inner,[type='button']::-moz-focus-inner,[type='reset']::-moz-focus-inner,[type='submit']::-moz-focus-inner{padding:0;border-style:none;}input[type='radio'],input[type='checkbox']{box-sizing:border-box;padding:0;}input[type='date'],input[type='time'],input[type='datetime-local'],input[type='month']{-webkit-appearance:listbox;}textarea{overflow:auto;resize:vertical;}fieldset{min-width:0;margin:0;padding:0;border:0;}legend{display:block;width:100%;max-width:100%;margin-bottom:0.5em;padding:0;color:inherit;font-size:1.5em;line-height:inherit;white-space:normal;}progress{vertical-align:baseline;}[type='number']::-webkit-inner-spin-button,[type='number']::-webkit-outer-spin-button{height:auto;}[type='search']{outline-offset:-2px;-webkit-appearance:none;}[type='search']::-webkit-search-cancel-button,[type='search']::-webkit-search-decoration{-webkit-appearance:none;}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button;}output{display:inline-block;}summary{display:list-item;}template{display:none;}[hidden]{display:none !important;}mark{padding:0.2em;background-color:#feffe6;}::-moz-selection{color:#fff;background:#1890ff;}::selection{color:#fff;background:#1890ff;}`,
    /** 字体大小设置，暂不允许用户设置字体大小 */
    font_size_formats: `12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px`,
    /** 字体设置，暂不允许用户设置；此设置必须与 content_style 中 font-family 一致 */
    font_family_formats: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    /** 行高配置，暂不允许用户设置行高 */
    line_height_formats: `0.5 1 1.2 1.5 1.75 2 2.5 3 4 5`,
    /** 设置 formatselect 选项 */
    block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6;',
    /** 不显示右键菜单 */
    contextmenu: false,
    /** 撤销与重做缓存次数 */
    custom_undo_redo_levels: 15,
    /** 编辑器内部弹窗是否允许脱拽 */
    draggable_modal: false,
    /** 引入 autoresize 插件时，此属性失效 */
    height: props.height,
    placeholder: props.placeholder,
    
    //:============================================================:  tinymce 图片上传  :============================================================://
    //如需ajax上传可参考https://www.luweipai.cn/html/1670332196/
    images_file_types: "gif,jpeg,jpg,png",
    images_upload_handler: tinymceImageUploadHandler,
    //:============================================================:  tinymce 图片上传  :============================================================://

    //:============================================================:  tinymce 内部功能设置  :============================================================://

    //:============================================================:  tinymce 插件（plugin）  :============================================================://
    /** 插件配置，与上方引入插件一一对应 */
    plugins: `advlist anchor autolink autoresize autosave charmap code codesample colorpicker directionality emoticons fullscreen help hr image imagetools importcss insertdatetime link lists media nonbreaking pagebreak paste preview print quickbars save searchreplace table template textcolor textpattern visualblocks visualchars wordcount`,
    /** plugin:autolink 设置，see：https://www.tiny.cloud/docs/tinymce/5/autolink/ */
    default_link_target: '_blank',
    /** plugin:autosave 设置，see：https://www.tiny.cloud/docs/tinymce/5/autosave/ */
    autosave_interval: '10s',
    /** plugin:help 设置，see：https://www.tiny.cloud/docs/tinymce/5/help/ */
    help_tabs: [
      "shortcuts",
      // "keyboardnav",
      // "plugins",
      // "versions"
    ],
    /** plugin:paste 设置，see：https://www.tiny.cloud/docs/tinymce/5/paste */
    paste_preprocess: (...args: any[]) => {
      // TODO: 粘贴的内容插入编辑器之前对其进行修改
      console.log("🚀 ~ editorOptions ~ args:", args)
    },
    paste_postprocess: (...args: any[]) => {
      // TODO: 粘贴的内容插入编辑器之前但在将其解析为 DOM 结构之后对其修改
      console.log("🚀 ~ editorOptions ~ args:", args)
    },
    //:============================================================:  tinymce 插件（plugin）  :============================================================://

    //:============================================================:  tinymce 顶部菜单栏（menubar）  :============================================================://
    /** see: https://www.tiny.cloud/docs/tinymce/6/menus-configuration-options/ */
    // menubar: "file edit insert view format table tools help",
    menubar: false,
    /** 菜单子项配置 */
    menu: {
      file: {
        title: "File",
        items: "newdocument | preview | export | deleteallconversations",
      },
      edit: {
        title: "Edit",
        items: "undo redo restoredraft | cut copy | selectall | searchreplace",
      },
      insert: {
        title: "Insert",
        items:
          "image link media template codesample inserttable | charmap emoticons | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
      },
      view: {
        title: "View",
        items: "code | visualaid visualchars visualblocks | preview fullscreen",
      },
      format: {
        title: "Format",
        items:
          "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat",
      },
      table: {
        title: "Table",
        items:
          "inserttable | cell row column | advtablesort | tableprops deletetable",
      },
      tools: { title: "Tools", items: "code wordcount" },
      help: { title: "Help", items: "help" },
    },
    //:============================================================:  tinymce 顶部菜单栏（menubar）  :============================================================://

    //:============================================================:  tinymce 顶部工具栏（toolbar）  :============================================================://
    /** see: https://www.tiny.cloud/docs/tinymce/6/toolbar-configuration-options/ */
    // toolbar: `fullscreen | code forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent lineheight | fontsize bullist numlist | blockquote subscript superscript removeformat | table image media | indent2em formatpainter axupimgs hr`,
    toolbar: `undo redo removeformat | formatselect bold italic | lists aligns blockquote hr | image media link charmap emoticons tableofcontents insertdatetime | restoredraft preview fullscreen code help`,
    // toolbar: `lists`,
    /** 工具栏是否固定 */
    toolbar_sticky: true,
    /** 按钮过多的显示模式 */
    toolbar_mode: "floating",
    //:============================================================:  tinymce 顶部工具栏（toolbar）  :============================================================://

    //:============================================================:  tinymce 底部状态栏（statusbar）  :============================================================://
    /** see: https://www.tiny.cloud/docs/tinymce/6/statusbar-configuration-options/ */
    statusbar: true,
    /** 左下角元素路径是否显示 */
    elementpath: false,
    /** 编辑器相关 logo 是否显示 */
    branding: false,
    /** 编辑器宽高是否可变，false|true|'both' */
    resize: "both",
    //:============================================================:  tinymce 底部状态栏（statusbar）  :============================================================://

    setup(editor) {
      editor.ui.registry.addMenuButton("lists", {
        // text: "列表",
        icon: "toc",
        tooltip: "列表",
        fetch: (callback) => {
          callback([
            {
              type: "menuitem",
              icon: "ordered-list",
              text: "有序列表",
              onAction: () =>
                editor.execCommand("InsertOrderedList", false, {
                  "list-style-type": "decimal",
                }),
            },
            {
              type: "menuitem",
              icon: "unordered-list",
              text: "无序列表",
              onAction: () =>
                editor.execCommand("InsertUnorderedList", false, {
                  "list-style-type": "disc",
                }),
            },
          ]);
        },
      });

      editor.ui.registry.addMenuButton("aligns", {
        // text: "对齐方式",
        icon: "align-left",
        tooltip: "对齐方式",
        fetch: (callback) => {
          callback([
            {
              type: "menuitem",
              icon: "align-left",
              text: "左对齐",
              onAction: () => editor.execCommand("JustifyLeft"),
            },
            {
              type: "menuitem",
              icon: "align-center",
              text: "居中对齐",
              onAction: () => editor.execCommand("JustifyCenter"),
            },
            {
              type: "menuitem",
              icon: "align-right",
              text: "右对齐",
              onAction: () => editor.execCommand("JustifyRight"),
            },
            {
              type: "menuitem",
              icon: "align-justify",
              text: "俩端对齐",
              onAction: () => editor.execCommand("JustifyFull"),
            },
          ]);
        },
      });
    },
  };

  return options;
});

function tinymceImageUploadHandler(
  blobInfo: Parameters<ImageUploadHandler>[0],
  progress: Parameters<ImageUploadHandler>[1]
): ReturnType<ImageUploadHandler> {
  return (new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open("POST", "/api/TIANTA-FILE/api/file/upload/image");

    xhr.upload.onprogress = (e: any) => {
      progress(((Number(e.loaded) / Number(e.total)) * 100) as any);
    };

    xhr.onload = () => {
      if (xhr.status === 403) {
        reject({ message: "HTTP Error: " + xhr.status, remove: true });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject("HTTP Error: " + xhr.status);
        return;
      }

      const json = JSON.parse(xhr.responseText);

      if (!json || typeof json.location != "string") {
        reject("Invalid JSON: " + xhr.responseText);
        return;
      }

      resolve(json.location);
    };

    xhr.onerror = () => {
      reject(
        "Image upload failed due to a XHR Transport error. Code: " + xhr.status
      );
    };

    const formData = new FormData();
    formData.append("files", blobInfo.blob());
    formData.append("isCompress", '1');
    formData.append("isScale", '0');

    xhr.send(formData);
  })) as any;
}

onMounted(async () => {
  /** 初始化 */
  await tinymce.init({});
});

onUnmounted(() => {
  /** 销毁 */
  tinymce.remove();
});
</script>

<template>
  <section class="editor-wrapper">
    <Editor
      v-model="editorValue"
      :init="editorOptions"
      :id="props.id"
      :readonly="props.readonly"
    />
  </section>
</template>

<style>
.editor-wrapper {
  width: 100%;
  height: 100%;
}
</style>
