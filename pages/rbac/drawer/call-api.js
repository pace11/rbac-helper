import { Drawer, Space, Button, Form, Input } from 'antd'
import { CloseOutlined, SwapOutlined } from '@ant-design/icons'

export default function CallApi({ isLoading, onClose, isOpen, onSubmit }) {
  const [form] = Form.useForm()

  return (
    <Drawer
      title="Add Endpoint"
      width={480}
      placement="right"
      onClose={() => {
        onClose()
      }}
      open={isOpen}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button
            onClick={() => {
              onClose()
            }}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
        onFinish={onSubmit}
        labelAlign="left"
      >
        <Form.Item
          label="URL Api"
          name="url_api"
          rules={[
            {
              required: true,
              message: 'Harap isikan url api!',
            },
          ]}
        >
          <Input size="large" placeholder="ex: includes http:/https: ..." />
        </Form.Item>
        <Form.Item
          label="Headers Authorization"
          name="auth"
          rules={[
            {
              required: true,
              message: 'Harap isikan headers!',
            },
          ]}
        >
          <Input.TextArea rows={5} size="large" placeholder="ex: without Bearer ..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} icon={<SwapOutlined />}>
            Sent
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
