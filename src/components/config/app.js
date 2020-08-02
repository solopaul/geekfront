module.exports = {
  appName: 'GK6+ V6',
  version: '6.0.0.*',
  releaseDate: '2019-11-19',
  copyright: 'makebyself',
  poweredBy: 'makebyself',
  langcfg: {
    zh: {name: '简体中文',key: 'zh',index: 0,imgsrc: require('~/assets/img/zh.png'),isact: false},
    en: {name: 'English',key: 'en',index: 1,imgsrc: require('~/assets/img/en.png'),isact: false}
  },
  settingdata: {
    props: [
      {title: "软件版本", langtitle: "common.soft_version", val: "v1.0.0"},
      {title: "当前机型", langtitle: "common.current_model", val: "******"},
      {title: "固件版本", langtitle: "common.firm_version", val: "v1.0.0"},
      {title: "更新日期", langtitle: "common.release_date", val: "xxxx-xx-xx"}
    ],
    versioninfo: {
      title: "更新说明",
      langtitle: "common.release_info",
      val: "1.支持机型：GK61 RGB、GK84 RGB BTH+USB、GK61 RGB光轴、GK64 RGB U+B V2、GK64 RGB、GK61 RGB U+B、GK61-RGB-V2、GK66-RGB光轴、GK66-RGB双灯位、GK66-RGB上灯位版本、GK61 RGB U+B(带侧灯灯带), KC101,GK64S RGB不带蓝牙、GK64S RGB经典款、JK-172(PAD21Key B+U)、JK-164-SK64XS-RGB B+U光轴 上灯位(ESC双灯)、JK-164-SK66XS-RGB B+U光轴 上灯位(ESC+Fnx1双灯)、JK-061-SK61-PTIR光轴、JK-061-SK61S-U+B-PTIR光轴、OK-162-87K、JK164-SK64-RGB 光轴 上灯位(ESC双灯)、JK164-SK66-RGB 光轴 上灯位(ESC双灯)；"
    },
    settings: [
      {
        title: "语言",
        langtitle: "common.language",
        val: 0,
        type: 'select',
        isshow: true,
        opts: [
          {title: '简体中文', val: 0, key: 'zh'},
          {title: 'English', val: 1, key: 'en'}
        ]
      },
      {
        title: "显示大小",
        langtitle: "common.resolution",
        val: 1,
        type: 'select',
        isshow: false,
        disabled: true,
        opts: [
          {title: 'Auto', val: 0},
          {title: '1200*900', val: 1},
          {title: '1024*768', val: 2},
          {title: '1600*1200', val: 3},
          {title: '1920*1440', val: 4}
        ]
      },
      {
        title: "恢复默认",
        langtitle: "common.device_restore",
        val: "0",
        type: "button",
        isshow: true,
        text: '恢复出厂设置',
        clickevent: 0,
        icon: 'el-icon-setting',
        isloading: false
      },
    ]
  },
  devices: {
    "0":{
      img_device: require('~/device/0/device.png')
    },
    "1":{
      img_device: require('~/device/1/device.png')
    },
    "655491084":{
      img_device: require('~/device/655491084/device.png'),
      img_panel: require('~/device/655491084/img/device_panel.png'),
      img_keycap: require('~/device/655491084/img/device_keycap.png'),
      img_outline: require('~/device/655491084/img/device_outline.png')
    },
    "655491085":{
      img_device: require('~/device/655491085/device.png'),
      img_panel: require('~/device/655491085/img/device_panel.png'),
      img_keycap: require('~/device/655491085/img/device_keycap.png'),
      img_outline: require('~/device/655491085/img/device_outline.png')
    },
    "655491117":{
      img_device: require('~/device/655491117/device.png'),
      img_panel: require('~/device/655491117/img/device_panel.png'),
      img_keycap: require('~/device/655491117/img/device_keycap.png'),
      img_outline: require('~/device/655491117/img/device_outline.png')
    },
    "655491165":{
      img_device: require('~/device/655491165/device.png'),
      img_panel: require('~/device/655491165/img/device_panel.png'),
      img_keycap: require('~/device/655491165/img/device_keycap.png'),
      img_outline: require('~/device/655491165/img/device_outline.png')
    },
    "655491247":{
      img_device: require('~/device/655491247/device.png'),
      img_panel: require('~/device/655491247/img/device_panel.png'),
      img_keycap: require('~/device/655491247/img/device_keycap.png'),
      img_outline: require('~/device/655491247/img/device_outline.png')
    },
    "655491238":{
      img_device: require('~/device/655491238/device.png'),
      img_panel: require('~/device/655491238/img/device_panel.png'),
      img_keycap: require('~/device/655491238/img/device_keycap.png'),
      img_outline: require('~/device/655491238/img/device_outline.png')
    },
    "655491239":{
      img_device: require('~/device/655491239/device.png'),
      img_panel: require('~/device/655491239/img/device_panel.png'),
      img_keycap: require('~/device/655491239/img/device_keycap.png'),
      img_outline: require('~/device/655491239/img/device_outline.png')
    },
    "655491246":{
      img_device: require('~/device/655491246/device.png'),
      img_panel: require('~/device/655491246/img/device_panel.png'),
      img_keycap: require('~/device/655491246/img/device_keycap.png'),
      img_outline: require('~/device/655491246/img/device_outline.png')
    },
    "655491200":{
      img_device: require('~/device/655491200/device.png'),
      img_panel: require('~/device/655491200/img/device_panel.png'),
      img_keycap: require('~/device/655491200/img/device_keycap.png'),
      img_outline: require('~/device/655491200/img/device_outline.png')
    },
    "655491248":{
      img_device: require('~/device/655491248/device.png'),
      img_panel: require('~/device/655491248/img/device_panel.png'),
      img_keycap: require('~/device/655491248/img/device_keycap.png'),
      img_outline: require('~/device/655491248/img/device_outline.png')
    },
    "655491249":{
      img_device: require('~/device/655491249/device.png'),
      img_panel: require('~/device/655491249/img/device_panel.png'),
      img_keycap: require('~/device/655491249/img/device_keycap.png'),
      img_outline: require('~/device/655491249/img/device_outline.png')
    },
    "656801793":{
      img_device: require('~/device/656801793/device.png'),
      img_panel: require('~/device/656801793/img/device_panel.png'),
      img_keycap: require('~/device/656801793/img/device_keycap.png'),
      img_outline: require('~/device/656801793/img/device_outline.png')
    },
    "656801796":{
      img_device: require('~/device/656801796/device.png'),
      img_panel: require('~/device/656801796/img/device_panel.png'),
      img_keycap: require('~/device/656801796/img/device_keycap.png'),
      img_outline: require('~/device/656801796/img/device_outline.png')
    },
    "656801795":{
      img_device: require('~/device/656801795/device.png'),
      img_panel: require('~/device/656801795/img/device_panel.png'),
      img_keycap: require('~/device/656801795/img/device_keycap.png'),
      img_outline: require('~/device/656801795/img/device_outline.png')
    },
    "656801797":{
      img_device: require('~/device/656801797/device.png'),
      img_panel: require('~/device/656801797/img/device_panel.png'),
      img_keycap: require('~/device/656801797/img/device_keycap.png'),
      img_outline: require('~/device/656801797/img/device_outline.png')
    },
    "656801798":{
      img_device: require('~/device/656801798/device.png'),
      img_panel: require('~/device/656801798/img/device_panel.png'),
      img_keycap: require('~/device/656801798/img/device_keycap.png'),
      img_outline: require('~/device/656801798/img/device_outline.png')
    },
    "656801800":{
      img_device: require('~/device/656801800/device.png'),
      img_panel: require('~/device/656801800/img/device_panel.png'),
      img_keycap: require('~/device/656801800/img/device_keycap.png'),
      img_outline: require('~/device/656801800/img/device_outline.png')
    },
    "656801801":{
      img_device: require('~/device/656801801/device.png'),
      img_panel: require('~/device/656801801/img/device_panel.png'),
      img_keycap: require('~/device/656801801/img/device_keycap.png'),
      img_outline: require('~/device/656801801/img/device_outline.png')
    },
    "656801802":{
      img_device: require('~/device/656801802/device.png'),
      img_panel: require('~/device/656801802/img/device_panel.png'),
      img_keycap: require('~/device/656801802/img/device_keycap.png'),
      img_outline: require('~/device/656801802/img/device_outline.png')
    },
    "656801803":{
      img_device: require('~/device/656801803/device.png'),
      img_panel: require('~/device/656801803/img/device_panel.png'),
      img_keycap: require('~/device/656801803/img/device_keycap.png'),
      img_outline: require('~/device/656801803/img/device_outline.png')
    },
    "656801804":{
      img_device: require('~/device/656801804/device.png'),
      img_panel: require('~/device/656801804/img/device_panel.png'),
      img_keycap: require('~/device/656801804/img/device_keycap.png'),
      img_outline: require('~/device/656801804/img/device_outline.png')
    },
    "656801805":{
      img_device: require('~/device/656801805/device.png'),
      img_panel: require('~/device/656801805/img/device_panel.png'),
      img_keycap: require('~/device/656801805/img/device_keycap.png'),
      img_outline: require('~/device/656801805/img/device_outline.png')
    },
    "656801806":{
      img_device: require('~/device/656801806/device.png'),
      img_panel: require('~/device/656801806/img/device_panel.png'),
      img_keycap: require('~/device/656801806/img/device_keycap.png'),
      img_outline: require('~/device/656801806/img/device_outline.png')
    },
    "656801810":{
      img_device: require('~/device/656801810/device.png'),
      img_panel: require('~/device/656801810/img/device_panel.png'),
      img_keycap: require('~/device/656801810/img/device_keycap.png'),
      img_outline: require('~/device/656801810/img/device_outline.png')
    },
    "656801811":{
      img_device: require('~/device/656801811/device.png'),
      img_panel: require('~/device/656801811/img/device_panel.png'),
      img_keycap: require('~/device/656801811/img/device_keycap.png'),
      img_outline: require('~/device/656801811/img/device_outline.png')
    },
    "656801817":{
      img_device: require('~/device/656801817/device.png'),
      img_panel: require('~/device/656801817/img/device_panel.png'),
      img_keycap: require('~/device/656801817/img/device_keycap.png'),
      img_outline: require('~/device/656801817/img/device_outline.png')
    },
    "656801818":{
      img_device: require('~/device/656801818/device.png'),
      img_panel: require('~/device/656801818/img/device_panel.png'),
      img_keycap: require('~/device/656801818/img/device_keycap.png'),
      img_outline: require('~/device/656801818/img/device_outline.png')
    },
    "656801819":{
      img_device: require('~/device/656801819/device.png'),
      img_panel: require('~/device/656801819/img/device_panel.png'),
      img_keycap: require('~/device/656801819/img/device_keycap.png'),
      img_outline: require('~/device/656801819/img/device_outline.png')
    },
    "656801820":{
      img_device: require('~/device/656801820/device.png'),
      img_panel: require('~/device/656801820/img/device_panel.png'),
      img_keycap: require('~/device/656801820/img/device_keycap.png'),
      img_outline: require('~/device/656801820/img/device_outline.png')
    },
    "656801822":{
      img_device: require('~/device/656801822/device.png'),
      img_panel: require('~/device/656801822/img/device_panel.png'),
      img_keycap: require('~/device/656801822/img/device_keycap.png'),
      img_outline: require('~/device/656801822/img/device_outline.png')
    },
    "656801824":{
      img_device: require('~/device/656801824/device.png'),
      img_panel: require('~/device/656801824/img/device_panel.png'),
      img_keycap: require('~/device/656801824/img/device_keycap.png'),
      img_outline: require('~/device/656801824/img/device_outline.png')
    },
    "656801825":{
      img_device: require('~/device/656801825/device.png'),
      img_panel: require('~/device/656801825/img/device_panel.png'),
      img_keycap: require('~/device/656801825/img/device_keycap.png'),
      img_outline: require('~/device/656801825/img/device_outline.png')
    },
    "656801826":{
      img_device: require('~/device/656801826/device.png'),
      img_panel: require('~/device/656801826/img/device_panel.png'),
      img_keycap: require('~/device/656801826/img/device_keycap.png'),
      img_outline: require('~/device/656801826/img/device_outline.png')
    }
  },
  res: {
    macro_icon_default: require('~/assets/img/macro/default.png'),
    macro_icon_default_folder: require('~/assets/img/macro/defaultcate.png'),
    macro_icon_lol: require('~/assets/img/macro/lol.png'),
    macro_icon_dota: require('~/assets/img/macro/dota.png'),
    macro_icon_bs: require('~/assets/img/macro/bs.png'),
    macro_icon_af: require('~/assets/img/macro/af.png'),
    macro_icon_ow: require('~/assets/img/macro/ow.png'),
    macro_icon_pubg: require('~/assets/img/macro/pubg.png'),
  }
}
