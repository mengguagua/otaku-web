import {client} from "../../../tina/__generated__/client";
import {useEffect, useState} from "react";
import "./index.css";
import {useNavigate} from "react-router";
import {Icon} from "@iconify/react";
import moment from "moment";

let index = () => {
  const navigate = useNavigate();

  let [htmlList, setHtmlList] = useState('');

  useEffect(() => {
    init();
  }, []);

  let goDetail = (item) => {
    if (item.url) {
      window.open(item.url);
    } else {
      navigate(`/otaku/article/text?title=${item.title}`);
    }
  };

  let getListHtml = (data) => {
    let html = data.map((item, index) => {
      return <div key={index} className={'article-item'}>
        <div className={'article-title'} onClick={() => {goDetail(item)}}>
          {index +1 }、{item.title} {item.url? '（外链）' : ''}
        </div>
        <div className={'root-flex article-text'}>
          <div style={{marginRight: '12px'}}>{moment(item.time).format('yyyy-MM-DD')}</div>
          <div>{item.resume}</div>
        </div>
      </div>
    });
    setHtmlList(html);
  };

  let goBack = () => {
    history.go(-1);
  };

  // 默认调用
  let init = async () => {
    const articleResponse = await client.queries.articleConnection()
    const posts = articleResponse.data.articleConnection.edges.map((post) => {
      return { title: post.node.title, time: post.node.time, resume: post.node.resume, url: post.node.url}
    })
    getListHtml(posts);
    // console.log('posts---', posts)
  }

  return(
    <>
      <div style={{backgroundColor: '#e2e2e2', padding: '20px 0'}}>
        <div className={'article-list'}>
          <Icon icon="material-symbols:back-to-tab-rounded" color="#333" width={40} style={{marginBottom: '20px', cursor: 'pointer'}} onClick={goBack} />
          { htmlList }
        </div>
      </div>
    </>
  );
}

export default index;
