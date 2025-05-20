"use client";

import { Row, Col, Card, Statistic, Table, Typography } from "antd";
import {
  UserOutlined,
  DatabaseOutlined,
  FileOutlined,
} from "@ant-design/icons";
import AdminLayout from "@/components/AdminLayout";

const { Title } = Typography;

// Mock data for demonstration
const tableData = [
  {
    key: "1",
    id: 1,
    name: "Sample Entry 1",
    category: "Category A",
    date: "2025-04-28",
  },
  {
    key: "2",
    id: 2,
    name: "Sample Entry 2",
    category: "Category B",
    date: "2025-04-29",
  },
  {
    key: "3",
    id: 3,
    name: "Sample Entry 3",
    category: "Category A",
    date: "2025-04-30",
  },
];

const tableColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
];

export default function Home() {
  return (
    <AdminLayout>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Entries"
              value={42}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Users" value={18} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Database Size"
              value="1.2 GB"
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Entries">
        <Table
          columns={tableColumns}
          dataSource={tableData}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </AdminLayout>
  );
}
