import { useState, useRef } from 'react'

import {
  Card,
  Input,
  Button,
  Table,
  Space,
  notification,
} from 'antd'
import { ApiOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import { fetchingApi } from '@/helpers/utils'

import CallApi from './drawer/call-api'

export default function Rbac() {
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [filterData, setFilterData] = useState([])
  const [isOpen, setOpen] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    console.log('select => ', dataIndex)
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}...`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text
  });

  const columns = [
    {
      title: 'Subject',
      key: 'subject',
      dataIndex: 'subject',
      ...getColumnSearchProps('subject'),
    },
    {
      title: 'Domain',
      key: 'domain',
      dataIndex: 'domain',
      ...getColumnSearchProps('domain'),
    },
    {
      title: 'Resources',
      key: 'resources',
      dataIndex: 'resources',
      ...getColumnSearchProps('resources'),
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
      <Table
        rowKey="key"
        dataSource={data}
        columns={columns}
        loading={isLoading}
        style={{ width: '100%' }}
        scroll={{ x: 425 }}
        pagination={{
          showTotal: (total) => `${total} total records` 
        }}
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
