"use client";
import { Divider, Drawer } from "antd";
import styles from "./page.module.scss";
import dayjs from "dayjs";

export default function PostDetail({ isOpen, onClose, postData }) {
  const DescriptionItem = ({ title, content }) => (
    <div className={styles.description}>
      <p className={styles.titleDescription}>{title}:</p>
      {content}
    </div>
  );
  return (
    <div className={styles.postDetail}>
      <Drawer
        width={400}
        placement="right"
        closable={false}
        onClose={onClose}
        open={isOpen}
      >
        <p className={styles.postTitle}>{postData?.title ?? ""}</p>
        <Divider />

        <DescriptionItem title="Author name" content={postData?.author ?? ""} />
        <DescriptionItem
          title="Date published"
          content={
            postData?.createdAt
              ? dayjs(postData?.createdAt).format("MMMM D, YYYY h:mm A")
              : ""
          }
        />
        <Divider />
        <p className={styles.titleDescription}>Content:</p>
        <p className={styles.contentText}>{postData?.content ?? ""}</p>
      </Drawer>
    </div>
  );
}
