import React, {useEffect, useState, useRef} from "react";
import {Input, Radio, Button, message} from 'antd';
import styles from './index.module.css';
import OpenAI from "openai";
import {db} from  '/db';
// md相关引入
import Markdown from 'react-markdown' // 转化md
import 'github-markdown-css'; // 引入美化md样式
import remarkGfm from 'remark-gfm' // 支持删除线等样式
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter' // 支持代码高亮
import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism' // 代码高亮样式
import rehypeRaw from 'rehype-raw'
import {useSelector} from "react-redux";
import {Icon} from "@iconify/react"; // 支持md里的html标签
// ---------------------------------------------------
const { TextArea } = Input;

let modelDic = {
  R1: 'deepseek-r1',
  V3: 'deepseek-v3',
  QwenPlus: 'qwen-plus',
  QwenVlMax: 'qwen-vl-max',
};

let index = () => {
  let [messageApi, contextHolder] = message.useMessage();
  const divRef = useRef(null);
  let [text, setText] = useState('');
  let [sendStatus, setSendStatus] = useState(2); // 1发送中，2已回答/待提问
  let [aiResponse, setAiResponse] = useState([]);
  let [talkHtml, setTalkHtml] = useState('');
  let [aiType, setAiType] = useState('QwenVlMax');
  // 用户信息，判断是否登陆
  const userInfo = useSelector((state) => {
    return state.user;
  });

  useEffect(()=> {
    init();
  }, [])

  // 确保每次内容更新后都滚动到底部
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [talkHtml]);

  let changeType = (aiKey) => {
    setAiType(aiKey);
  };

  let searchData = async () => {
    try {
      let num = localStorage.getItem('aiLimitNumber');
      if (num && Number(num) > 10 && !userInfo.data?.username) {
        messageApi.warning({
          content: '已达游客使用上限，请登陆～',
          icon: <Icon icon="codex:warning" color="#333" style={{marginRight: '2px', width: '20px', height: '20px'}}/>,
        });
        return false;
      }
      if (!!!text) {
        return false;
      }
      const openai = new OpenAI(
        {
          // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
          apiKey: 'sk-dafcc84db78b42ba95e0f573adaa2a4a',
          baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
          dangerouslyAllowBrowser: true
        }
      );
      setSendStatus(1); // 设置加载中状态
      const completion = await openai.chat.completions.create({
        model: modelDic[aiType],  //模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages: [
          { role: "user", content: text }
        ],
        stream: false,
        modalities: ["text"],
      });
      setSendStatus(2); // 加载完成
      let content = completion.choices[0].message.content;
      let reasoningContent = completion.choices[0].message.reasoning_content;
      console.log("思考过程：")
      console.log(reasoningContent)
      console.log("最终答案：")
      console.log(content)
      let result = [...aiResponse, ...[{reasoningContent: reasoningContent || '空白', content: content, text: text}]];
      setAiResponse(result);
      questionHtml([result]);
      // 未登陆限制访问次数
      setLimit();
      // 缓存历史对答
      // await db.aiList.add(result);
      await editAiListDB(result);
    } catch (error) {
      console.log(`错误信息：${error}`);
      setSendStatus(2);
    }
  };

  // 没有离线数据就插入，有则刷新最新一条数据
  let editAiListDB = async(result) => {
    // console.log('editAiListDB', aiResponse, result)
    if (aiResponse?.length === 0) {
      await db.aiList.add(result);
    } else if (aiResponse?.length > 0){
      // console.log('editAiListDB', aiResponse?.length, aiResponse.id)
      await db.aiList.update(aiResponse.id, result);
    } else {
      console.log('不操作');
    }
  }

  let setLimit = () => {
    let num = localStorage.getItem('aiLimitNumber');
    localStorage.setItem('aiLimitNumber', num ? Number(num) + 1 : 1)
  };

  let keyDown = (event) => {
    if (event.key === 'Enter') {  // 检查是否是 Enter 键
      console.log('Enter键被按下');
      event.preventDefault();  // 阻止换行
      searchData();
    }
  };

  let onChange = (e) => {
    // console.log('Change:', e.target.value);
    setText(e.target.value);
  }

  let questionHtml = (result) => {
    let html = result[0].map((item,index) => {
      return <div key={`questionHtml${index}`} style={{marginTop: '12px'}}>
        <div className={styles['question-row']}>
          <div className={styles['question-text']}>{item.text}</div>
        </div>
        {
          item.reasoningContent !== '空白' && item.reasoningContent !== '' ?
            <div>
              <div style={{fontWeight: 500, fontSize: '14px', margin: '0 0 10px 0'}}>思考过程：</div>
              <div className={styles['reasoning-content']}>{item.reasoningContent}</div>
            </div> : ''
            // <div className={styles['loader']}/>
        }
        <div style={{marginTop: '20px', fontWeight: 500, fontSize: '14px'}}>回答：</div>
        {/*支持md语法*/}
        <Markdown remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  style={{color: '#0d0d0d', fontSize: '13px'}}
                  components={{
                    code(props) {
                      const {children, className, node, ...rest} = props
                      const match = /language-(\w+)/.exec(className || '')
                      return match ? (
                        <SyntaxHighlighter
                          {...rest}
                          PreTag="div"
                          children={String(children).replace(/\n$/, '')}
                          language={match[1]}
                          style={tomorrow}
                        />
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
        >
          {item.content}
        </Markdown>
        {/*<div>{item.content}</div>*/}
      </div>
    });
    setTalkHtml(html);
  };

  // 默认执行
  let init = async () => {
    const dbData = await db.aiList.toArray(); // 获取历史对话
    // console.log('useLiveQuery-222', dbData);
    setAiResponse(dbData && dbData[0] || []); // 设置页面数据。也是标记，后续判断是新增还是编辑
    questionHtml(dbData);
  };

  return(
    <>
      {contextHolder}
      <div className={styles['talk-layer']} ref={divRef}>
        {talkHtml}
        {
          sendStatus == 1 ? <div className={styles['loader']}/> : ''
        }
      </div>
      <div className={styles['question']}>
        <TextArea
          onKeyDown={keyDown}
          placeholder="给 DeepSeek 发送信息"
          variant="borderless"
          onChange={onChange}
          style={{
            padding: '0.25rem 1.25rem',
            margin: '8px 0',
            height: 72,
            resize: 'none',
          }}
        >
        </TextArea>
        <div className={text.length ? styles['send-tag'] : `${styles['send-tag']} ${styles['no-pointer']}` } onClick={searchData}>
          {
            sendStatus == 1 ? <div className={styles['tabler--square-filled']}></div> :
              text ? <div className={styles['famicons--arrow-up-outline']}></div> :
                <div className={styles['mingcute--voice-fill']}></div>
          }
        </div>
      </div>
      {/* 绝对定位的一个页面提示 */}
      <div className={styles['tip-box']}>
        这是一个<span style={{fontWeight: 500, color: '#000'}}>实验性</span>的页面，数据来源于阿里云百炼API，平台支持DeepSeek，通义千问等，提供免费Token，支持有限次数的问答。
        {/*<div style={{marginTop: '10px'}}>AI模型不联网！</div>*/}
        <div style={{marginTop: '10px'}}>未登陆可提问<span style={{fontWeight: 500, color: '#000'}}>10次</span></div>
      </div>

      <div className={styles['ai-box']} style={{top: '20px'}}>
        <button onClick={() => changeType('QwenPlus')}>
          <span className={styles['button_top']}>
            通义千问Plus
            { aiType === 'QwenPlus' ? '当前已选' : '点击切换' }
          </span>
        </button>
        <button onClick={() => changeType('QwenVlMax')}>
          <span className={styles['button_top']}>
            通义千问Max
            { aiType === 'QwenVlMax' ? '当前已选' : '点击切换' }
          </span>
        </button>
        <button onClick={() => changeType('R1')}>
          <span className={styles['button_top']}>
            DeepSeek R1
            { aiType === 'R1' ? '当前已选' : '点击切换' }
          </span>
        </button>
        <button onClick={() => changeType('V3')}>
          <span className={styles['button_top']}>
            DeepSeek V3
            { aiType === 'V3' ? '当前已选' : '点击切换' }
          </span>
        </button>
      </div>
    </>
  )
}

export default index;
