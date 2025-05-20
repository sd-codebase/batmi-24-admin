"use client";

import AdminLayout from "@/components/AdminLayout";
import NewsList from "@/components/NewsList";
import { NewsItem } from "@/types";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Card, message, Space, Spin, Typography } from "antd";
import React, { useState } from "react";

const { Title } = Typography;

const NewsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [unpublishedCount, setUnpublishedCount] = useState<number>(0);

  const generateNewsFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:4500/api/scraper/news-json-feed"
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.data.articles && data.data.articles.length > 0) {
        setNewsData(data.data.articles);
        message.success("News feed generated successfully");
      } else {
        message.info("No news articles found");
      }
    } catch (error) {
      console.error("Error generating news feed:", error);
      message.error("Failed to generate news feed");
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
    <AdminLayout>
      <Title level={2}>News Management</Title>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Generate news content from external sources</span>
            <Button
              type="primary"
              icon={<SyncOutlined />}
              loading={loading}
              onClick={generateNewsFeed}
            >
              Generate News Feed
            </Button>
          </div>

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
  );
};

export default NewsPage;
