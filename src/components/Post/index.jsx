"use client";
import { useState } from "react";
import { Avatar, Tooltip } from "antd";
import dayjs from "dayjs";
import PostDetail from "@/components/PostDetail";
import styles from "./page.module.scss";

export default function Post({ postData }) {
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const getInitials = () => {
    if (postData?.author) {
      const fullNameSplice = postData?.author.split(" ");
      const firstName = fullNameSplice[0];
      const lastName = fullNameSplice[1];
      const initials = `${firstName?.charAt(0)?.toUpperCase()} ${
        lastName ? lastName?.charAt(0)?.toUpperCase() : ""
      }`;
      return initials;
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setIsOpenDetail(true);
        }}
        className={styles.post}
      >
        <p className={styles.postHeader}>
          <span className={styles.postDate}>
            <Tooltip title={postData?.author}>
              <Avatar className={styles.avatar} size="large">
                {getInitials()}
              </Avatar>
            </Tooltip>
            {postData?.createdAt
              ? dayjs(postData?.createdAt).format("MMMM D, YYYY h:mm A")
              : ""}
          </span>
          <span className={styles.postTitle}>{postData?.title}</span>
        </p>
        <p className={styles.postContent}>
          {postData?.content ? `${postData?.content.substring(0, 70)}...` : ""}
        </p>
      </div>

      <PostDetail
        isOpen={isOpenDetail}
        postData={postData}
        onClose={() => {
          setIsOpenDetail(false);
        }}
      />
    </>
  );
}
