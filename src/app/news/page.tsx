"use client";

import AdminLayout from "@/components/AdminLayout";
import NewsList from "@/components/NewsList";
import { NewsItem } from "@/types";
import {
  DeleteOutlined,
  MenuFoldOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  message as messageApi,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useState } from "react";
import supabase from "@/lib/supabase";

const { Title } = Typography;

const NewsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [unpublishedCount, setUnpublishedCount] = useState<number>(0);
  const [message, contextHolder] = messageApi.useMessage();

  const generateNewsFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEWS_SCRAPE_URL}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      message.error("Failed to generate news feed");
    } finally {
      setLoading(false);
    }
  };

  const getUnPublishedNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scraped_news")
        .select("*")
        .eq("is_published", false);

      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setNewsData(data);
        message.success("Unpublished news fetched successfully");
      } else {
        message.info("No unpublished news found");
      }
    } catch (error) {
      console.error("Error fetching unpublished news:", error);
      message.error("Failed to fetch unpublished news");
    } finally {
      setLoading(false);
    }
  };

  const deleteOlderNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scraped_news")
        .delete()
        .lt(
          "created_at",
          new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
        );

      if (error) {
        throw error;
      }

      if (data) {
        message.success("Old news deleted successfully");
      } else {
        message.info("No old news found to delete");
      }
    } catch (error) {
      console.error("Error deleting old news:", error);
      message.error("Failed to delete old news");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNews = (item: NewsItem) => {
    // Placeholder for edit functionality
    message.info(
      `Edit functionality for item: ${item.id} will be implemented soon`
    );
  };

  // Simple refresh function that just calls the API again
  const refreshNewsData = () => {
    if (newsData.length > 0) {
      generateNewsFeed();
    }
  };

  return (
    <>
      {contextHolder}
      <AdminLayout>
        <Title level={2}>News Management</Title>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Flex justify="space-between" align="center">
              <span>Generate news content from external sources</span>
              <Flex gap={8}>
                <Button
                  color="cyan"
                  variant="solid"
                  icon={<SyncOutlined />}
                  loading={loading}
                  onClick={generateNewsFeed}
                >
                  Scrape News
                </Button>
                <Button
                  type="primary"
                  icon={<MenuFoldOutlined />}
                  loading={loading}
                  onClick={getUnPublishedNews}
                >
                  Get Scraped News
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  icon={<DeleteOutlined />}
                  loading={loading}
                  onClick={deleteOlderNews}
                >
                  Delete Old News
                </Button>
              </Flex>
            </Flex>

            {loading && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin size="large" />
                <p>Fetching news data...</p>
              </div>
            )}

            {!loading && (
              <NewsList
                data={newsData}
                loading={loading}
                title={
                  newsData.length > 0
                    ? `News Items: ${newsData.length}${
                        unpublishedCount > 0
                          ? ` (${unpublishedCount} unpublished)`
                          : ""
                      }`
                    : undefined
                }
                onEditItem={handleEditNews}
                onRefresh={refreshNewsData}
                pageSize={15}
                onUnpublishedCountChange={setUnpublishedCount}
              />
            )}
          </Space>
        </Card>
      </AdminLayout>
    </>
  );
};

export default NewsPage;
