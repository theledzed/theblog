"use client";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  notification,
} from "antd";
import axios from "axios";
import styles from "./page.module.scss";

export default function NewPost({ getPost, isOnline }) {
  const [open, setOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
    form.resetFields();
  };
  const onClose = () => {
    setOpen(false);
  };

  const openNotificationWithIcon = ({ type, message, description }) => {
    api[type]({
      message,
      description,
    });
  };

  const onFinish = async (values) => {
    let notificationObj = { type: "", message: "", description: "" };
    try {
      await axios.post("https://theblog-api.vercel.app/api/theblog/post", {
        ...values,
      });
      onClose();
      getPost();
      notificationObj = {
        type: "success",
        message: "Your post was created correctly",
      };
    } catch (error) {
      notificationObj = {
        type: "Error",
        message: "Yikes an error was ocurred",
      };
      openNotificationWithIcon(notificationObj);
    }
  };

  return (
    <div className={styles.newPost}>
      {contextHolder}
      <Button
        onClick={showDrawer}
        className={styles.newPostButton}
        icon={<PlusOutlined />}
        size="large"
      >
        New post
      </Button>
      <Drawer
        title="Create a new post"
        width={400}
        onClose={onClose}
        closeIcon={false}
        open={open}
      >
        <Form
          className={styles.newPostForm}
          onFinish={onFinish}
          layout="vertical"
          hideRequiredMark
        >
          <div>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a title",
                    },
                  ]}
                >
                  <Input placeholder="Please enter a title" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="author"
                  label="Author"
                  rules={[
                    {
                      required: true,
                      message: "Please select an author",
                    },
                  ]}
                >
                  <Input placeholder="Please enter your name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="content"
                  label="Post content"
                  rules={[
                    {
                      required: true,
                      message: "please enter your post content",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="please your post content"
                    maxLength={220}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className={styles.newPostFooter}>
            <Space>
              <Button
                type="link"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                className={styles.createPostButton}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Space>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}
