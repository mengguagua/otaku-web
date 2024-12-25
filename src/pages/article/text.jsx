import {client} from "../../../tina/__generated__/client";
import React, {useEffect, useState} from "react";
import "./index.css";
import {useNavigate} from "react-router";
import {getQueryStringArgs} from "../../tool/index";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Icon } from '@iconify/react';

let index = () => {
  const navigate = useNavigate();

  let [richText, setRichText] = useState([]);

  useEffect(() => {
    init();
  }, []);

  let goBack = () => {
    history.go(-1);
  };

  // 默认调用
  let init = async () => {
    let args = getQueryStringArgs();
    let title = args['title']
    const articleResponse = await client.queries.articleConnection()
    const posts = articleResponse.data.articleConnection.edges.filter((post) => {
      // console.log('post+++', post)
      return post.node.title === title
    })
    // console.log('posts---', posts)
    setRichText(posts[0].node.body);
  }

  return(
    <>
      <div style={{backgroundColor: '#e2e2e2', padding: '20px 0'}}>
        <div className={'article-list'}>
          <Icon icon="material-symbols:back-to-tab-rounded" color="#333" width={40} style={{marginBottom: '20px', cursor: 'pointer'}} onClick={goBack} />
          <TinaMarkdown content={richText} />
        </div>
      </div>
    </>
  );
}

export default index;
