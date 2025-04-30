// src/pages/OfferForm.tsx
import React, { FC } from 'react';
import { Form, Input, Button, Space } from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import type {
  FormInstance,
  FormListFieldData,
} from 'antd/es/form';
import axiosInstance from '../services/axiosInstance';

interface Props {
  candidateId: string;
  onSuccess?: () => void;
}

const OfferForm: FC<Props> = ({ candidateId, onSuccess }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    try {
      // assuming your backend expects { candidateId, offers: [...] }
      await axiosInstance.post('/offers', {
        candidateId,
        offers: values.offers,
      });
      form.resetFields();
      onSuccess?.();
    } catch {
      // you can show antd message.error here
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.List name="offers">
        {(
          fields: FormListFieldData[],
          operations: {
            add: () => void;
            remove: (name: number) => void;
          }
        ) => (
          <>
            {fields.map((field) => (
              <Space
                key={field.key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...field}
                  name={[field.name, 'template']}
                  fieldKey={[field.fieldKey!, 'template']}
                  rules={[{ required: true, message: 'Template required' }]}
                >
                  <Input placeholder="Offer Template" />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'sentTo']}
                  fieldKey={[field.fieldKey!, 'sentTo']}
                  rules={[{ required: true, message: 'Recipient required' }]}
                >
                  <Input placeholder="Send To (email)" />
                </Form.Item>

                <MinusCircleOutlined
                  onClick={() => operations.remove(field.name as number)}
                />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => operations.add()}
                block
                icon={<PlusOutlined />}
              >
                Add Offer
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit Offers
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OfferForm;
