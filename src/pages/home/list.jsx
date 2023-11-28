import './list.css';
import React, {useEffect, useState} from "react";
import {Input, Radio, Button, message, Popconfirm} from 'antd';
import {changeGoodNumber, changeRank, linkChangeIsPublic, linkCreate, linkEdit} from '../../service/interface';
import {Icon} from "@iconify/react";

const { Search } = Input;

let isEdit = false;

let index =({listData, searchData, userInfo}) => {
  let [messageApi, contextHolder] = message.useMessage();

  let [listHtml, setListHtml] = useState([]);
  let [showAdd, setShowAdd] = useState(false);
  // let [isEdit, setIsEdit] = useState(false);
  let [formData, setFormData] = useState({type: '乐趣'});

  useEffect(()=> {
    initData();
  }, [listData])

  let initListHtml = (listData) => {
    let html = listData.map((item,index) => {
      return <div className={!!userInfo?.data?.sub ? 'home-list-user-line' : 'home-list-line'} key={index}>
        <div className={'home-list-title'} onClick={() => {openWindow(item)}}>{item.name}</div>
        <div className={'home-list-sub'}>
          <span>{item.nickName || '无名'}</span>
          <span className={'home-list-circle'}></span>
          <span style={{color: '#ccc', fontWeight: 400}}>{item.updateTime}</span>
        </div>
        {
          // 下面公开列表的icon按钮
          !!userInfo?.data?.sub ? '' :
            <div>
              <div className={'home-list-public-edit'}>
                {/* 这个ant Popconfirm组件在reat严格模式下会报警告， */}
                <Popconfirm
                  title=""
                  icon={''}
                  description={`点赞，有点意思~`}
                  onConfirm={() => {changeLike(true, item)}}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon icon="material-symbols-light:thumb-up" color="#333" width="20" />
                </Popconfirm>
              </div>
              <div className={'home-list-public-edit'} style={{right: '64px', top:'25px'}}>
                <Popconfirm
                  title=""
                  icon={''}
                  description={`没意思？`}
                  onConfirm={() => {changeLike(false, item)}}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon icon="material-symbols:thumb-down-outline" color="#333" width="20" />
                </Popconfirm>
              </div>
            </div>
        }
        <div className={'home-list-number'}>{item.goodNumber}</div>
        {
          // 下面是个人列表的icon按钮
          !!userInfo?.data?.sub ?
            <div>
              <div className={'home-list-edit'}>
                <Popconfirm
                  title=""
                  icon={''}
                  description={`置顶吗?`}
                  onConfirm={() => {goUp(item)}}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon icon="material-symbols-light:thumb-up" color="#333" width="20" />
                </Popconfirm>
                <span>&nbsp;&nbsp;</span>
                <Popconfirm
                  title=""
                  icon={''}
                  description={`置底吗?`}
                  onConfirm={() => {goDown(item)}}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon icon="material-symbols:thumb-down-outline" color="#333" width="20" />
                </Popconfirm>
                <span>&nbsp;&nbsp;</span>
                <Popconfirm
                  title=""
                  icon={''}
                  description={item.isPublic ? '目前是公开的，要隐藏吗？' : '目前是隐藏的，要公开吗？'}
                  onConfirm={() => {changePublic(item)}}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  {
                    item.isPublic ?
                      <Icon icon="icon-park-outline:unlock" color="#333" width="20" /> :
                      <Icon icon="ooui:lock" color="#333" width="20" />
                  }
                </Popconfirm>
                <div  onClick={() => {toEdit(item)}} style={{marginLeft: '8px', display: "inline-block"}}>
                  <Icon icon="pixelarticons:edit-box" color="#333" width="20"/>
                </div>
              </div>
            </div> : ''
        }
      </div>
    });
    // console.log('html-',html)
    setListHtml(html);
  }

  let toEdit = (item) => {
    isEdit = true;
    setShowAdd(true);
    setFormData(item);
  }

  let changePublic = (item) => {
    linkChangeIsPublic({id: item.id, isPublic: !item.isPublic}).then((resp) => {
      messageApi.success(item.isPublic? '已隐藏' : '已公开');
      searchData();
    });
  };
  let goDown = (item) => {
    if (item.clickNumber == -1) {
      messageApi.warning('当前已经置底');
      return false;
    }
    changeRank({id: item.id, clickNumber: -1}).then((resp) => {
      messageApi.success('已置底');
      searchData();
    });
  };
  let goUp = (item) => {
    changeRank({id: item.id, clickNumber: 10000}).then((resp) => {
      messageApi.success('已置顶');
      searchData();
    });
  };

  let changeLike = (type, item) => {
    changeGoodNumber({id: item.id, likeType: type}).then(() => {
      messageApi.success(type ? '已点赞' : '已吐槽');
      searchData();
    });
  }

  let openWindow = (item) => {
    window.open(item?.url);
  }

  const onChange = (e) => {
    console.log(`radio checked:${e.target.value}`);
    setFormData({...formData, type: e.target.value});
  };

  let initData = async () => {
    initListHtml(listData);
  }

  let doSave = () => {
    if (!formData.name || !formData.url) {
      messageApi.warning('名称或者url为空');
      return false;
    }
    if (isEdit) {
      linkEdit(formData).then((resp) => {
        messageApi.success('已编辑');
        isEdit = false;
        setShowAdd(false);
        setFormData({type: '乐趣'});
        searchData();
      });
    } else {
      linkCreate(formData).then((resp) => {
        messageApi.success('已保存');
        searchData();
      });
    }
  }

  return(
    <>
      {contextHolder}
      <div className={'home-list-container'}>
        <Search
          allowClear
          placeholder="请输入链接名称"
          onSearch={searchData}
          style={{
            marginBottom: '8px',
            width: 200,
          }}
        >
        </Search>
        <div style={{backgroundColor: '#e2e2e2', height: '1px'}}></div>
        {
          // 判断是公开列表还是个人列表。这里是个人列表
          !!userInfo?.data?.sub ?
            <div className={'list-tool-container'}>
              <div onClick={() => {setShowAdd(!showAdd);isEdit = false;setFormData({type: '乐趣'});}}>
                {
                  showAdd ?
                    <Icon icon="streamline:subtract-square-solid" color="#333" width="22" /> :
                    <Icon icon="typcn:plus-outline" color="#333" width="26" />
                }
              </div>
              {
                showAdd ?
                  <div className={'list-tool-body'}>
                    <Radio.Group value={formData.type} onChange={onChange} buttonStyle="solid" defaultValue="乐趣" style={{margin: '0 0 4px'}}>
                      <Radio.Button value="新闻">新闻</Radio.Button>
                      <Radio.Button value="游戏">游戏</Radio.Button>
                      <Radio.Button value="技术">技术</Radio.Button>
                      <Radio.Button value="问答">问答</Radio.Button>
                      <Radio.Button value="乐趣">乐趣</Radio.Button>
                      <Radio.Button value="其它">其它</Radio.Button>
                    </Radio.Group>
                    <Input
                      value={formData.name}
                      showCount maxLength={20}
                      placeholder="Enter your url name"
                      prefix={<Icon icon="game-icons:compact-disc" width="20" />}
                      onChange={(e) => {setFormData({...formData, name: e.target.value})}}
                    />
                    <Input
                      value={formData.url}
                      style={{margin: '4px 0'}}
                      placeholder="Enter your url"
                      prefix={<Icon icon="game-icons:crowned-heart" color="#333" width="20" />}
                      onChange={(e) => {setFormData({...formData, url: e.target.value})}}
                    />
                    <div className={'root-flex'} style={{justifyContent: 'center', margin: '4px 0'}}>
                      <Button type={'primary'} size={'small'} style={{margin: '0 4px 0 0'}} onClick={doSave}>
                        {
                          isEdit ? '编 辑' : '保 存'
                        }
                      </Button>
                      <Button size={'small'} onClick={() => {setShowAdd(false); isEdit = false;setFormData({type: '乐趣'});}}>取 消</Button>
                    </div>
                  </div>
                  : <div className={'list-tool-empty'}></div>
              }
            </div>
            : ''
        }
        {
          listData.length ? listHtml :
            <div className={'home-list-empty'}>
              <div>
                <Icon icon="game-icons:dripping-sword" color="#333" width="60" />
                <div>empty data...</div>
              </div>
            </div>
        }
      </div>
    </>
  );
};
export default index;
