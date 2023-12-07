"use client";
import { useEffect, useState } from "react";
import { Input, Spin, Radio, Empty } from "antd";
import Post from "@/components/Post";
import NewPost from "@/components/NewPost";
import axios from "axios";

import styles from "./page.module.scss";

const { Search } = Input;

export default function Home() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [filterOption, setFilterOption] = useState("title");

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async (filterValue) => {
    setIsLoading(true);
    const response = await axios.get(
      "https://theblog-api.vercel.app/api/theblog/post"
    );
    setIsLoading(false);
    if (filterValue) {
      const filterList = postList.filter((post) =>
        post[filterOption].toLowerCase().includes(filterValue.toLowerCase())
      );
      setPostList(filterList);
    } else {
      setPostList(
        response.data.sort((a, b) => {
          var c = new Date(a.createdAt);
          var d = new Date(b.createdAt);
          return d - c;
        })
      );
    }
  };

  const onChangeFilterInput = (e) => {
    setFilterOption(e.target.value);
    setFilterValue("");
    getPost();
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <span className={styles.title}>TheBlog</span>
        <div className={styles.filterContainer}>
          <Search
            value={filterValue}
            className={styles.search}
            placeholder="input search text"
            allowClear
            onChange={(event) => {
              setFilterValue(event.target.value);
              getPost(event.target.value);
            }}
            size="large"
          />

          <Radio.Group onChange={onChangeFilterInput} value={filterOption}>
            <Radio value={"title"}>Post title</Radio>
            <Radio value={"author"}>Author</Radio>
            <Radio value={"content"}>Content</Radio>
          </Radio.Group>
        </div>
        <NewPost getPost={getPost} />
      </div>
      <div className={styles.content}>
        <Spin spinning={isLoading}>
          {postList.length > 0 ? (
            postList.map((post) => {
              return <Post postData={post} key={post.id} />;
            })
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Spin>
      </div>
    </main>
  );
}
