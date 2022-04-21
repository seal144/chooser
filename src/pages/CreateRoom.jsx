import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { CloseSquareOutlined, PlusOutlined } from '@ant-design/icons'

const CreateRoom = () => {
    const [ roomForm, setRoomForm ] = useState({
        hostName: '',
        roomName: '',
        roomPassword: '',
        options: []
    })

    const updateFormState = (_, formValues) => {
        setRoomForm( formValues );
    }

    const onFinish = () => {
        console.log('finished', roomForm);
    }

    const inputLayout = {
        labelCol: { sm: { span: 6 }, md: { span:5 } },
        wrapperCol: { sm: { span: 12 }, md: { span:14 } },
    }

    const buttonLayout = {
        wrapperCol: { sm: { offset:6, span: 12 }, md: { offset:5, span: 14}},
    }

    return (
        <Form
            {...inputLayout}
            name = "newRoom"
            onFinish = {onFinish}
            onValuesChange = { updateFormState }
            autoComplete = "off"
        >
            <Form.Item 
                label="Twoje Imię"
                name="hostName"
                rules={[
                    { required: true,whitespace: true, message: 'Podaj imię' },
                    { min: 2, message: 'Za krótkie imię'},
                    { max: 15, message: 'za długie imię'},
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item 
                label="Nazwa Pokoju"
                name="roomName"
                rules={[
                    { required: true, whitespace: true, message: 'Podaj nazwę pokoju' },
                    { min: 2, message: 'Za krótka nazwa'},
                    { max: 15, message: 'za długa nazwa'},
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item 
                label="Hasło"
                name="roomPassword"
            >
                <Input.Password/>
            </Form.Item>

            <Form.List
                name="options"
                rules={[
                    {
                        validator: async (_, options) => {
                            if (!options || options.length < 2) {
                                return Promise.reject(new Error('Minimum dwie opcje'));
                            }
                        },
                    },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? inputLayout : buttonLayout)}
                                label={index === 0 ? 'Opcje' : ''}
                                required={false}
                                key={field.key}
                            >
                            <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: "Wpisz opcję lub usuń pole",
                                    },
                                ]}
                                noStyle
                            >
                            <Input placeholder="Opcja" style={{ width: '90%' }} />
                            </Form.Item>
                                {fields.length > 0 ? (
                                    <CloseSquareOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                    style={{marginLeft: "5px"}}
                                    />
                                ) : null}
                            </Form.Item>
                        ))}
                        <Form.Item {...buttonLayout}>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                block
                            >
                            Dodaj opcję
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item {...buttonLayout}>
            <Button type="primary" block htmlType="submit">
                Stwórz Pokój
            </Button>
            </Form.Item>
        </Form>
     );
}
 
export default CreateRoom;