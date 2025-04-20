import React, {useState} from 'react';
import {Card, List, Input, Button, Space, message} from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import axiosInstance from '../services/axiosInstance';
const SectionCustomization: React.FC = () => {
    const [sections, setSections] = useState<string[]>([
        'Education',
        'Certifications',
        'Experience',
        'Projects',

    ]);

    const [newSec, setNewSec] = useState('');
    const [saving, setSaving] = useState(false);


    const move = (i:number, dir: -1|1) => {
        const arr = [...sections];
        [arr[i], arr[i+dir]] = [arr[i+dir], arr[i]];
        setSections(arr);
    }

    const add = () => {
        if(!newSec.trim()) {
            message.warning('Please enter a section name');
            return;
        };
        setSections((sec) => [...sec, newSec]);
        setNewSec('');
    }

    const save = async() => {
        setSaving(true);
        try {
            await axiosInstance.post('/sections', {sections});
            message.success('Sections saved successfully');
        }
        catch(error:any) {
            message.error('Failed to save sections');
            console.error('Failed to save sections', error);
        }
        finally {
            setSaving(false);
        }
    };

    return (
        <Card title = "Customize CV Sections " style={{ maxWidth: 600, margin: 'auto' }}> 
           <List
                dataSource={sections}
                renderItem={(sec, i) => (
                    <List.Item>
                        <Space>
                            <Button key= "up" type="link" onClick={() => move(i, -1)}>
                                <ArrowUpOutlined />
                            </Button>
                            <Button key= "down" type="link" onClick={() => move(i, 1)}>
                                <ArrowDownOutlined />
                            </Button>
                            {sec}
                        </Space>
                    </List.Item>
                )}
                />
                <Space style={{ marginTop: 16, width: '100%', justifyContent: 'space-between' }}>
                    <Input
                        placeholder='New Section'
                        value={newSec}
                        onChange={(e) => setNewSec(e.target.value)}
                        onPressEnter={add}
                        style={{ flex: 1 }}
                    />
                    <Button onClick={add} type="primary">Add</Button>
                </Space>

                <Button 
                   type='primary'
                   loading={saving}
                   onClick={save}
                   style={{ marginTop: 16, width: '100%' }}
                   block
                >
                    Save
                </Button>


            </Card>
        );
    };

    export default SectionCustomization;