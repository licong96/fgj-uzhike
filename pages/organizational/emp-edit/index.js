
const { $Message } = require('../../../components/base/index');
import { GetEmployeeByID } from '../../../api/organizational/employee';
// import {  } from '../../../api/organizational/department';
import { FileUpLoad } from '../../../api/public';

import { maximum } from '../../../utils/config';

Page({
  data: {
    params: {
      UserGroupID: '',  // 用户组id
      EmpID: '',        // 人员id
      DeptID: '',       // 部门id
      PositionID: '',   // 职务id
      EmpName: '',      // 用户名称
      Sex: '男',         // 性别
      Birthday: '',     // 生日
      Remark: '',       // 备注
      JoinDate: '',     // 加入时间
      Source: '',       // 来源
      EmpImg: '',       // 头像
      DeptName: '请选择部门',     // 选项
    },
    EmpImg: 'https://licong96.github.io/lib/image/licong.jpg',
    pickerValueSex: [
      {
        label: '男',
        value: '男'
      }, {
        label: '女',
        value: '女'
      }
    ],
    pickerValueSexIndex: 0,
    pickerValueType: [
      {
        label: '0',
        value: '0'
      }, {
        label: '1',
        value: '1'
      }, {
        label: '2',
        value: '2'
      }, {
        label: '3',
        value: '3'
      }, {
        label: '4',
        value: '4'
      }
    ],
    pickerValueTypeIndex: 0,
    disabled: false,
    loading: false,
  },
  onLoad: function (options) {
    console.log('emp-edit', options)
    // let { EmpID } = options;

    this.GetEmployeeByID('76B7D769409E4A10B843356515B75C7A');
  },
  onReady: function () {
    this.selectDept = this.selectComponent('#selectDept');
  },
  onShow: function () {
  
  },
  // 根据用户id获取用户信息
  GetEmployeeByID(EmpID) {
    wx.showLoading({
      title: '加载中',
    });
    GetEmployeeByID({
      EmpID
    }).then(res => {
      if (res.data.result === 'success') {

      } else {
        $Message({ content: res.data.msg, type: 'warning' })
      };
      wx.hideLoading();
    })
  },
  // 上传头像
  uploadPic() {
    let _this = this;

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '图片上传中',
        });
        wx.uploadFile({
          url: FileUpLoad,
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            var data = JSON.parse(res.data);
            if (data.result === 'success') {
              $Message({ content: '上传成功', type: 'success' });
              _this.setData({
                params: {
                  EmpImg: data.path.replace(/\|/, ''),
                },
                EmpImg: tempFilePaths[0]
              });
            } else {
              $Message({ content: '上传失败', type: 'error' });
            }
            wx.hideLoading();
          },
          fail(error) {
            $Message({ content: '网络错误' + error, type: 'error' });
          }
        })
      }
    })
  },
  // 打开部门选择器
  bindOpenSelectDept() {
    this.selectDept.show();
  },
  // 选择部门返回值
  bindSelectConfirm(data) {
    let { DeptID, DeptName } = data.detail.value;
    let params = this.data.params;

    params.DeptID = DeptID;
    params.DeptName = DeptName;

    this.setData({
      params
    })
  },
})