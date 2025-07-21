import React, { useState } from 'react';
import { Input, Select, Card, Button } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;



const defaultField = () => ({ key: '', type: 'string', children: [] });


function FieldRow({ field, onChange, onDelete }) {
  const handleKeyChange = (e) => onChange({ ...field, key: e.target.value });

  const handleTypeChange = (value) => {
    const updated = { ...field, type: value };
    if (value !== 'nested') updated.children = [];
    onChange(updated);
  };

  const addNestedField = () => {
    const children = [...field.children, defaultField()];
    onChange({ ...field, children });
  };

  const updateNestedField = (index, updatedField) => {
    const children = [...field.children];
    children[index] = updatedField;
    onChange({ ...field, children });
  };

  const deleteNestedField = (index) => {
    const children = [...field.children];
    children.splice(index, 1);
    onChange({ ...field, children });
  };

  return (
    <Card style={{ marginBottom: 10 }}>
      <Input
        placeholder="Field Name"
        value={field.key}
        onChange={handleKeyChange}
        style={{ width: 200, marginRight: 10 }}
      />
      <Select
        value={field.type}
        onChange={handleTypeChange}
        style={{ width: 150, marginRight: 10 }}
      >
        <Option value="string">String</Option>
        <Option value="number">Number</Option>
        <Option value="nested">Nested</Option>
      </Select>
      <Button icon={<CloseOutlined />} danger onClick={onDelete} />

      {field.type === 'nested' && (
        <div style={{ marginLeft: 20, marginTop: 10 }}>
          {field.children.map((child, index) => (
            <FieldRow
              key={index}
              field={child}
              onChange={(updated) => updateNestedField(index, updated)}
              onDelete={() => deleteNestedField(index)}
            />
          ))}
          <Button icon={<PlusOutlined />} onClick={addNestedField}>
            Add Nested Field
          </Button>
        </div>
      )}
    </Card>
  );
}


function App() {
  const [fields, setFields] = useState([defaultField()]);

  const addField = () => setFields([...fields, defaultField()]);
  const updateField = (index, updatedField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };
  const deleteField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  
  const buildSchema = (fieldsArray) => {
    const schema = {};
    for (const field of fieldsArray) {
      if (!field.key) continue;
      if (field.type === 'nested') {
        schema[field.key] = buildSchema(field.children);
      } else {
        schema[field.key] = field.type;
      }
    }
    return schema;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JSON Schema Builder</h1>
      {fields.map((field, index) => (
        <FieldRow
          key={index}
          field={field}
          onChange={(updated) => updateField(index, updated)}
          onDelete={() => deleteField(index)}
        />
      ))}
      <Button icon={<PlusOutlined />} onClick={addField}>
        Add Field
      </Button>

      <h2>JSON Preview</h2>
      <pre style={{ background: '#f5f5f5', padding: 10 }}>
        {JSON.stringify(buildSchema(fields), null, 2)}
      </pre>
    </div>
  );
}

export default App;
