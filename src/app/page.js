"use client";
import { useEffect, useState } from "react";
import { Input, Spin, Radio, Empty, notification } from "antd";
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
  const [isOnline, setIsOnline] = useState(window?.navigator?.onLine ?? true);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (isOnline) {
      getPost();
    }
  }, []);

  const openNotificationWithIcon = ({ type, message, description }) => {
    api[type]({
      message,
      description,
    });
  };

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(window?.navigator?.onLine);
      console.log("isOnline");
      let notificationObj = {
        type: "success",
        message: "Connected",
        description: "You are online",
      };
      if (window?.navigator?.onLine) {
        openNotificationWithIcon(notificationObj);
        getPost();
      } else {
        notificationObj = {
          type: "error",
          message: "Disconnected",
          description: "You are offline",
        };
        openNotificationWithIcon(notificationObj);
      }
    };

    window.addEventListener("online", handleStatusChange);

    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [isOnline]);

  console.log("isOnline", isOnline);

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
      {contextHolder}
      <div className={styles.header}>
        <span className={styles.title}>TheBlog</span>
        {isOnline && (
          <>
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

              <Radio.Group
                disabled={!isOnline}
                onChange={onChangeFilterInput}
                value={filterOption}
              >
                <Radio value={"title"}>Post title</Radio>
                <Radio value={"author"}>Author</Radio>
                <Radio value={"content"}>Content</Radio>
              </Radio.Group>
            </div>
            <NewPost isOnline={isOnline} getPost={getPost} />
          </>
        )}
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
