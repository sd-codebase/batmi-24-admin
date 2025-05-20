"use client";

import AdminLayout from "@/components/AdminLayout";
import { DataItem } from "@/types";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { useState } from "react";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

// Mock data for demonstration - in a real app, this would come from Supabase
const initialData: DataItem[] = [
  {
    id: 1,
    title: "Sample Item 1",
    description: "Description for sample item 1",
    category: "Category A",
    status: "active",
  },
  {
    id: 2,
    title: "Sample Item 2",
    description: "Description for sample item 2",
    category: "Category B",
    status: "inactive",
  },
  {
    id: 3,
    title: "Sample Item 3",
    description: "Description for sample item 3",
    category: "Category A",
    status: "active",
  },
];

export default function DataManagement() {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>("");

  // This would be used in a real app with Supabase
  // const fetchData = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('your_table_name')
  //       .select('*');
  //     if (error) throw error;
  //     setData(data as DataItem[]);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     message.error('Failed to fetch data');
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record: DataItem) => {
    form.setFieldsValue(record);
    setCurrentItem(record);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // In a real app with Supabase
        // const deleteItem = async () => {
        //   try {
        //     const { error } = await supabase
        //       .from('your_table_name')
        //       .delete()
        //       .eq('id', id);
        //     if (error) throw error;
        //     message.success('Item deleted successfully');
        //     fetchData();
        //   } catch (error) {
        //     console.error('Error deleting item:', error);
        //     message.error('Failed to delete item');
        //   }
        // };
        // deleteItem();

        // For demonstration purposes
        setData(data.filter((item) => item.id !== id));
        message.success("Item deleted successfully");
      },
    });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditing && currentItem) {
          // In a real app with Supabase
          // const updateItem = async () => {
          //   try {
          //     const { error } = await supabase
          //       .from('your_table_name')
          //       .update(values)
          //       .eq('id', currentItem.id);
          //     if (error) throw error;
          //     message.success('Item updated successfully');
          //     fetchData();
          //   } catch (error) {
          //     console.error('Error updating item:', error);
          //     message.error('Failed to update item');
          //   }
          // };
          // updateItem();

          // For demonstration purposes
          setData(
            data.map((item) =>
              item.id === currentItem.id ? { ...item, ...values } : item
            )
          );
          message.success("Item updated successfully");
        } else {
          // In a real app with Supabase
          // const addItem = async () => {
          //   try {
          //     const { error } = await supabase
          //       .from('your_table_name')
          //       .insert([values]);
          //     if (error) throw error;
          //     message.success('Item added successfully');
          //     fetchData();
          //   } catch (error) {
          //     console.error('Error adding item:', error);
          //     message.error('Failed to add item');
          //   }
          // };
          // addItem();

          // For demonstration purposes
          const newId = Math.max(...data.map((item) => item.id)) + 1;
          setData([...data, { id: newId, ...values } as DataItem]);
          message.success("Item added successfully");
        }
        setIsModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            color: status === "active" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: DataItem) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2}>Data Management</Title>
      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Search
            placeholder="Search by title, description, or category"
            style={{ width: 400 }}
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add New Item
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Edit Item" : "Add New Item"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="itemForm">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Please enter a title!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter a description!",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please select a category!",
              },
            ]}
          >
            <Select>
              <Option value="Category A">Category A</Option>
              <Option value="Category B">Category B</Option>
              <Option value="Category C">Category C</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Please select a status!",
              },
            ]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
