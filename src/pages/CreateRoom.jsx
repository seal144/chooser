import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';

const CreateRoom = () => {
    const [ roomForm, setRoomForm ] = useState({
        hostName: '',
        roomName: '',
        roomPassword: ''
    })

    const updateFormState = (changedValue) => {
        setRoomForm( prevState => { return {...prevState, ...changedValue}});
    }

    const onFinish = () => {
        console.log('finished', roomForm);
    }

    const inputLayout = {
        labelCol: { sm: { span: 7 }, md: { span:5 } },
        wrapperCol: { sm: { span: 10 }, md: { span:14 } },
    }

    const buttonLayout = {
        wrapperCol: { sm: { offset:7, span: 10 }, md: { offset:5, span: 14}},
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
                    { required: true, message: 'Podaj imię' },
                    { min: 2, message: 'Za krótkie imię'},
                    { max: 15, message: 'za długie imię'},
                    { whitespace: true, message: 'Niepoprawne imię'},
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item 
                label="Nazwa Pokoju"
                name="roomName"
                rules={[
                    { required: true, message: 'Podaj nazwę pokoju' },
                    { min: 2, message: 'Za krótka nazwa'},
                    { max: 15, message: 'za długa nazwa'},
                    { whitespace: true, message: 'Niepoprawne hasło'},
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

            <Form.Item {...buttonLayout}>
            <Button type="primary" block htmlType="submit">
                Stwórz Pokój
            </Button>
            </Form.Item>
        </Form>
     );
}
 
export default CreateRoom;