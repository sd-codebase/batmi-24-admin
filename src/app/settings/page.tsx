"use client";

import AdminLayout from "@/components/AdminLayout";
import { DatabaseSettings, GeneralSettings } from "@/types";
import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Select,
  Switch,
  Tabs,
  Typography,
} from "antd";
import { useState } from "react";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

export default function Settings() {
  const [generalForm] = Form.useForm();
  const [databaseForm] = Form.useForm();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // Mock initial values - in a real app, this would be fetched from Supabase or config file
  const initialGeneralSettings: GeneralSettings = {
    siteName: "Civic Diary Admin",
    siteDescription: "Admin dashboard for Civic Diary",
    primaryColor: "#1677ff",
    itemsPerPage: 10,
    darkMode: false,
  };

  const initialDatabaseSettings: DatabaseSettings = {
    tableName: "civic_entries",
    backupEnabled: true,
    backupFrequency: "daily",
    autoCleanup: false,
    retentionDays: 30,
  };

  const handleGeneralSubmit = (values: GeneralSettings) => {
    setSaveLoading(true);

    // In a real app with Supabase
    // const updateSettings = async () => {
    //   try {
    //     const { error } = await supabase
    //       .from('settings')
    //       .update({ settings: values })
    //       .eq('type', 'general');
    //     if (error) throw error;
    //     message.success('General settings updated successfully');
    //   } catch (error) {
    //     console.error('Error updating settings:', error);
    //     message.error('Failed to update settings');
    //   } finally {
    //     setSaveLoading(false);
    //   }
    // };
    // updateSettings();

    // For demonstration purposes
    setTimeout(() => {
      message.success("General settings updated successfully");
      setSaveLoading(false);
    }, 1000);
  };

  const handleDatabaseSubmit = (values: DatabaseSettings) => {
    setSaveLoading(true);

    // In a real app with Supabase
    // const updateSettings = async () => {
    //   try {
    //     const { error } = await supabase
    //       .from('settings')
    //       .update({ settings: values })
    //       .eq('type', 'database');
    //     if (error) throw error;
    //     message.success('Database settings updated successfully');
    //   } catch (error) {
    //     console.error('Error updating settings:', error);
    //     message.error('Failed to update settings');
    //   } finally {
    //     setSaveLoading(false);
    //   }
    // };
    // updateSettings();

    // For demonstration purposes
    setTimeout(() => {
      message.success("Database settings updated successfully");
      setSaveLoading(false);
    }, 1000);
  };

  const handleReset = (
    form: any,
    initialValues: GeneralSettings | DatabaseSettings
  ) => {
    form.setFieldsValue(initialValues);
    message.info("Form reset to default values");
  };

  return (
    <AdminLayout>
      <Title level={2}>Settings</Title>
      <Tabs defaultActiveKey="general">
        <TabPane tab="General Settings" key="general">
          <Card>
            <Form
              form={generalForm}
              layout="vertical"
              initialValues={initialGeneralSettings}
              onFinish={handleGeneralSubmit}
            >
              <Form.Item
                name="siteName"
                label="Site Name"
                rules={[{ required: true, message: "Please enter site name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="siteDescription" label="Site Description">
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item name="primaryColor" label="Primary Color">
                <Input type="color" style={{ width: "50px" }} />
              </Form.Item>

              <Form.Item
                name="itemsPerPage"
                label="Items Per Page"
                rules={[
                  { required: true, message: "Please enter items per page" },
                ]}
              >
                <Select>
                  <Option value={5}>5</Option>
                  <Option value={10}>10</Option>
                  <Option value={20}>20</Option>
                  <Option value={50}>50</Option>
                  <Option value={100}>100</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="darkMode"
                label="Dark Mode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Form.Item>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    onClick={() =>
                      handleReset(generalForm, initialGeneralSettings)
                    }
                  >
                    Reset to Defaults
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saveLoading}
                  >
                    Save Settings
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="Database Settings" key="database">
          <Card>
            <Form
              form={databaseForm}
              layout="vertical"
              initialValues={initialDatabaseSettings}
              onFinish={handleDatabaseSubmit}
            >
              <Form.Item
                name="tableName"
                label="Table Name"
                rules={[{ required: true, message: "Please enter table name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="backupEnabled"
                label="Enable Automatic Backups"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="backupFrequency"
                label="Backup Frequency"
                dependencies={["backupEnabled"]}
              >
                <Select disabled={!databaseForm.getFieldValue("backupEnabled")}>
                  <Option value="hourly">Hourly</Option>
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="autoCleanup"
                label="Auto Cleanup Old Backups"
                valuePropName="checked"
                dependencies={["backupEnabled"]}
              >
                <Switch
                  disabled={!databaseForm.getFieldValue("backupEnabled")}
                />
              </Form.Item>

              <Form.Item
                name="retentionDays"
                label="Retention Period (days)"
                dependencies={["backupEnabled", "autoCleanup"]}
              >
                <Input
                  type="number"
                  min={1}
                  disabled={
                    !databaseForm.getFieldValue("backupEnabled") ||
                    !databaseForm.getFieldValue("autoCleanup")
                  }
                />
              </Form.Item>

              <Divider />

              <Paragraph type="warning">
                Note: These settings interact directly with your Supabase
                database. Make changes carefully.
              </Paragraph>

              <Form.Item>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    onClick={() =>
                      handleReset(databaseForm, initialDatabaseSettings)
                    }
                  >
                    Reset to Defaults
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saveLoading}
                  >
                    Save Settings
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </AdminLayout>
  );
}
