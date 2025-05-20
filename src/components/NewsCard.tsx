"use client";

import supabase from "@/lib/supabase";
import { NewsItem } from "@/types";
import {
  CheckOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Input, message, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

interface NewsCardProps {
  item: NewsItem;
  onEdit?: (item: NewsItem) => void;
  onPublishOrBypass?: (item: NewsItem) => void;
  actionLoading?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  item,
  onEdit,
  onPublishOrBypass,
  actionLoading,
}) => {
  const [isCopying, setIsCopying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(true);

  useEffect(() => {
    // Initialize editedContent with item.content when entering edit mode
    if (isEditing) {
      setEditedContent("");
      validateAndFormatJson("");
    }
  }, [isEditing]);

  const formattedDate = item.publishedDate
    ? new Date(item.publishedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No date provided";

  const validateAndFormatJson = (content: string) => {
    try {
      // Try to parse the content as JSON
      const parsedJson = JSON.parse(content);
      // Format it with proper indentation
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setEditedContent(formattedJson);
      setIsJsonValid(true);
      return formattedJson;
    } catch (error) {
      console.error("Invalid JSON format:", error);
      setIsJsonValid(false);
      return content;
    }
  };

  const handlePublishOrBypass = () => {
    onPublishOrBypass && onPublishOrBypass(item);
  };

  const handleCopy = async () => {
    try {
      setIsCopying(true);

      await navigator.clipboard.writeText(
        prompt.replace("{{content}}", item.content)
      );
      message.success("Content copied to clipboard");
    } catch (error) {
      console.error("Failed to copy content:", error);
      message.error("Failed to copy content");
    } finally {
      setIsCopying(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateContent = async () => {
    if (onEdit) {
      try {
        // Attempt to format and validate JSON before updating
        const formattedJson = validateAndFormatJson(editedContent);
        if (!isJsonValid) {
          message.error("Invalid JSON format. Please correct before updating.");
          return;
        }

        const contentData = JSON.parse(formattedJson);
        const updatedItem = { ...item, content: formattedJson };

        // Save to the articles table in Supabase
        const { error } = await supabase.from("articles").insert({
          title: contentData.title,
          slug: contentData.slug,
          description: contentData.description,
          content: contentData.content,
          category_id: contentData.category_id,
          tags: contentData.tags,
          meta_title: contentData.meta_title,
          meta_description: contentData.meta_description,
          og_title: contentData.og_title,
          og_description: contentData.og_description,
          twitter_card_type: contentData.twitter_card_type,
          twitter_title: contentData.twitter_title,
          twitter_description: contentData.twitter_description,
          reading_time_minutes: contentData.reading_time_minutes,
          word_count: contentData.word_count,
          source_url: item.link,
          published_at: new Date().toISOString(),
          is_published: true,
        });

        if (error) {
          throw error;
        }

        handlePublishOrBypass();

        // Update UI state
        onEdit(updatedItem);
        setIsEditing(false);
        message.success("Article published successfully!");
      } catch (error) {
        console.error("Error updating content:", error);
        message.error("Failed to publish article. Please try again.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(item.content);
    setIsEditing(false);
    setIsJsonValid(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditedContent(newContent);

    // Validate JSON as user types, but don't format yet
    try {
      JSON.parse(newContent);
      setIsJsonValid(true);
    } catch (error) {
      setIsJsonValid(false);
    }
  };

  return (
    <Card
      style={{
        marginBottom: 16,
      }}
      extra={
        isEditing && (
          <div>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleUpdateContent}
              style={{ marginRight: 8 }}
              disabled={!isJsonValid}
            >
              Publish Now
            </Button>
            <Button onClick={handleCancelEdit}>Cancel</Button>
          </div>
        )
      }
      actions={
        !item.is_published
          ? [
              onPublishOrBypass && !isEditing && (
                <Button
                  type="link"
                  onClick={handlePublishOrBypass}
                  icon={<SyncOutlined />}
                  loading={actionLoading}
                >
                  Bypass & Publish
                </Button>
              ),
              onEdit && !isEditing && (
                <Button
                  type="link"
                  onClick={handleEditClick}
                  icon={<EditOutlined />}
                >
                  Edit
                </Button>
              ),
              !isEditing && (
                <Button
                  type="link"
                  onClick={handleCopy}
                  icon={<CopyOutlined />}
                  loading={isCopying}
                >
                  Copy
                </Button>
              ),
              !isEditing && (
                <Button
                  type="link"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkOutlined /> View Source
                </Button>
              ),
            ].filter(Boolean)
          : []
      }
    >
      <Title level={4}>{item.title}</Title>
      {item.is_published ? (
        <Tag color="red" icon={<CloseCircleOutlined />} />
      ) : null}

      {!item.is_published ? (
        <Flex justify="space-between">
          <div style={!isEditing ? { flex: 1 } : { width: "30%" }}>
            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: "more" }}>
              {item.content}
            </Paragraph>
          </div>
          {isEditing && (
            <div style={{ flex: 1 }}>
              <Flex align="center" style={{ marginBottom: 8 }}>
                <Typography.Title
                  level={5}
                  style={{ margin: 0, marginRight: 12 }}
                >
                  Edit Content:
                </Typography.Title>
                <Button
                  icon={<CopyOutlined />}
                  onClick={async () => {
                    try {
                      const clipboardText =
                        await navigator.clipboard.readText();
                      setEditedContent(clipboardText);
                      validateAndFormatJson(clipboardText);
                      message.success("Content pasted from clipboard");
                    } catch (error) {
                      console.error("Failed to read clipboard:", error);
                      message.error("Failed to paste from clipboard");
                    }
                  }}
                  size="small"
                >
                  Paste from Clipboard
                </Button>
              </Flex>
              <TextArea
                value={editedContent}
                onChange={handleContentChange}
                autoSize={{ minRows: 3, maxRows: 15 }}
                style={{
                  marginBottom: 16,
                  borderColor: isJsonValid ? undefined : "red",
                }}
              />
              {!isJsonValid && (
                <Typography.Text type="danger">
                  Invalid JSON format. Please correct before updating.
                </Typography.Text>
              )}
            </div>
          )}
        </Flex>
      ) : null}
    </Card>
  );
};

export default NewsCard;

const prompt = `Act as marathi news writer and generate news article using given marathi source content.
writing language - marathi
writing style - news article
content - around 250 words and 3 paragraphs.
output - json.
tone - strictly nuetral and marathi
title - best suited length for SEO
slug - should be english and hypened, no punctuation, no spacial characters except hypen
category_id - Find the best suitable category id from given categories
tags - 3 to 7 tags in english and marathi both, no special characters, no punctuation, title case
Other fields - description, content, meta_title, meta_description, og_title, og_description, twitter_card_type, twitter_title, twitter_description, reading_time_minutes, word_count
Focus on below points
Rephrase content completely while preserving all factual information
Add context about news significance
Maintain flow between paragraphs
Maintain strict neutral tone
Enhance SEO elements with better keyword placement
Make the content more engaging while staying factual
Make Structured information more clearly for readers
Added value with perspective of news
Don't include typical lines in last paragraphs
Source contents: 
{{content}}
Categories:
2-महाराष्ट्र,3-देश,4-आंतरराष्ट्रीय,5-राजकारण,6-अर्थ,7-क्रीडा,8-मनोरंजन,9-तंत्रज्ञान,10-आरोग्य,11-शिक्षण,12-IPL 2025,13-ट्रेंडिंग,14-प्रॉपर्टी,15-पुणे,16-मुंबई,17-छत्रपती संभाजीनगर,18-नागपूर,19-नाशिक,20-कोल्हापूर,21-सोलापूर,22-नांदेड,23-पिंपरी-चिंचवड,24-अहिल्यानगर,25-अकोला,26-जळगाव,27-सातारा,28-पश्चिम महाराष्ट्र,29-मराठवाडा,30-विदर्भ,31-कोकण,32-उत्तर महाराष्ट्र
Start generating marathi news now
`;
