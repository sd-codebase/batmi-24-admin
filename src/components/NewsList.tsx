"use client";

import supabase from "@/lib/supabase";
import { NewsItem } from "@/types";
import { Empty, List, Pagination, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

const { Title } = Typography;

interface NewsListProps {
  data: NewsItem[];
  loading?: boolean;
  title?: string;
  onEditItem?: (item: NewsItem) => void;
  onRefresh?: () => void;
  pageSize?: number;
  onUnpublishedCountChange?: (count: number) => void;
}

const NewsList: React.FC<NewsListProps> = ({
  data,
  loading = false,
  title = "News Items",
  onEditItem,
  onRefresh,
  pageSize = 15,
  onUnpublishedCountChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [actionItem, setActionItem] = useState<string | null>(null);
  const [displayItems, setDisplayItems] = useState<NewsItem[]>([]);

  // Update local state when data prop changes, filtering out bypassed items
  useEffect(() => {
    const filteredItems = data.filter((item) => item.is_published !== false);
    setDisplayItems(filteredItems);

    // Reset to first page if items were filtered out that would make the current page empty
    const totalPages = Math.ceil(filteredItems.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data, pageSize, currentPage, onUnpublishedCountChange]);

  useEffect(() => {
    // Calculate and send unpublished count to parent
    if (onUnpublishedCountChange) {
      const unpublishedCount = displayItems.filter(
        (item) => !item.is_published
      ).length;
      onUnpublishedCountChange(unpublishedCount);
    }
  }, [displayItems]);

  // Paginate the data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return displayItems.slice(startIndex, startIndex + pageSize);
  }, [displayItems, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePublishOrBypass = async (item: NewsItem) => {
    try {
      setActionItem(item.id);

      console.log(`Updating item ${item.id} to is_published=${true}`);

      const { error, status } = await supabase
        .from("scraped_news")
        .update({ is_published: true })
        .eq("title", item.title);

      console.log(`Supabase response status: ${status}, error:`, error);

      if (error) throw error;

      // Remove from display items after animation
      setDisplayItems((prevItems) =>
        prevItems.map((newsItem) => {
          if (newsItem.title === item.title) {
            return { ...newsItem, is_published: true };
          }
          return newsItem;
        })
      );

      // Recalculate and send unpublished count after updating item
      if (onUnpublishedCountChange) {
        const updatedData = data.map((newsItem) =>
          newsItem.title === item.title
            ? { ...newsItem, is_published: true }
            : newsItem
        );
        const unpublishedCount = updatedData.filter(
          (item) => item.is_published === false
        ).length;
        onUnpublishedCountChange(unpublishedCount);
      }

      message.success(`"${item.title}" has been published.`);
    } catch (error) {
      console.error("Error updating news item:", error);
      message.error("Failed to update news item. Please try again.");
    } finally {
      setActionItem(null);
    }
  };

  if (!loading && displayItems.length === 0) {
    return <Empty description="No news items found" />;
  }

  return (
    <div>
      {title && <Title level={4}>{title}</Title>}

      <List
        dataSource={paginatedData}
        loading={loading}
        renderItem={(item) => (
          <List.Item key={item.id} style={{ display: "block", width: "100%" }}>
            <NewsCard
              item={item}
              onEdit={onEditItem}
              onPublishOrBypass={handlePublishOrBypass}
              actionLoading={actionItem === item.id}
            />
          </List.Item>
        )}
      />

      {displayItems.length > pageSize && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={displayItems.length}
            pageSize={pageSize}
            showSizeChanger={false}
            showTotal={(total) => `Total ${total} items`}
          />
        </div>
      )}
    </div>
  );
};

export default NewsList;
