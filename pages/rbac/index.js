import { useState } from 'react'

import {
  Card,
  Input,
  Button,
  Table,
  Space,
  notification,
  Typography,
} from 'antd'
import { ApiOutlined, FileTextOutlined } from '@ant-design/icons'
import { fetchingApi } from '@/helpers/utils'

import CallApi from './drawer/call-api'

const { Text } = Typography

export default function Rbac() {
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [filterData, setFilterData] = useState([])
  const [isOpen, setOpen] = useState(false)

  const columns = [
    {
      title: 'Subject',
      key: 'subject',
      dataIndex: 'subject',
      render: (subject) => subject,
    },
    {
      title: 'Domain',
      key: 'domain',
      dataIndex: 'domain',
      render: (domain) => domain,
    },
    {
      title: 'Resources',
      key: 'resources',
      dataIndex: 'resources',
      render: (resources) => resources,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (action) => action,
    },
  ]

  const onFinish = (values) => {
    setLoading(true)
    fetchingApi({ url: values?.url_api, authorization: values?.auth })
      .then((res) => {
        setLoading(false)
        notification.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 2,
          placement: 'top',
        })
        const permissions = res?.data?.data?.permissions
        setData(
          permissions.map((item) => ({
            subject: item?.[0],
            domain: item?.[1],
            resources: item?.[2],
            action: item?.[3],
          })),
        )
        setFilterData(
          permissions.map((item) => ({
            subject: item?.[0],
            domain: item?.[1],
            resources: item?.[2],
            action: item?.[3],
          })),
        )
      })
      .catch((err) => {
        setLoading(false)
        notification.error({
          message: err?.code,
          description: err?.message,
          duration: 2,
          placement: 'top',
        })
      })
  }

  const onSearchRole = (keyword) => {
    if (!keyword) {
      setData(filterData)
    } else {
      setData((prevState) =>
        prevState.filter(
          (item) => item.subject === keyword.toLowerCase(),
        ),
      )
    }
  }

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data),
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = `${data[0]?.subject}.json`

    link.click()
  }

  return (
    <Card
      title="RBAC-List"
      bordered={false}
      extra={
        <Space key="desktop-action-agama">
          <Input.Search
            placeholder="Search role/subject ..."
            onSearch={(val) => onSearchRole(val)}
            allowClear
            style={{
              width: 250,
            }}
          />
          <Button
            icon={<FileTextOutlined />}
            onClick={exportData}
            disabled={!data.length}
          >
            Export to JSON
          </Button>
          <Button
            type="primary"
            icon={<ApiOutlined />}
            onClick={() => setOpen(true)}
          >
            Add Endpoint
          </Button>
        </Space>
      }
    >
      <Text>{data.length} records</Text>
      <Table
        rowKey="key"
        dataSource={data}
        columns={columns}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ x: 425 }}
      />
      <CallApi
        isOpen={isOpen}
        onClose={() => setOpen(!isOpen)}
        isLoading={isLoading}
        onSubmit={onFinish}
      />
    </Card>
  )
}
