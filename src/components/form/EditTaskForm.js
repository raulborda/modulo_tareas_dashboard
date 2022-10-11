/* eslint-disable no-unused-vars */
import {
  CheckOutlined,
  DeleteOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
  TimePicker,
  Upload,
} from "antd";
import Note from "../note/Note";
import { TaskContext } from "../../context/TaskContext";
import { UPDATE_TAREA } from "../../graphql/mutation/tareas";
import { DELETE_UPLOAD_TAREA } from "../../graphql/mutation/upload";
import { GET_ORIGENES } from "../../graphql/query/origenes";
import { GET_TIPO_TAREA } from "../../graphql/query/tipoTareas";
import { GET_USUARIOS } from "../../graphql/query/usuarios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import returnExtIcon from "../../utils/returnExtIcon";
import "./index.css";

const EditTaskForm = ({ task }) => {
  const { setTaskDrawerVisible, noteContent, idUser } = useContext(TaskContext);

  const [origenes, setOrigenes] = useState([]);
  const [tipoTareas, setTipoTareas] = useState([]);
  const [fList, setFlist] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchUsuario, setSearchUsuario] = useState("");

  const [existeUpload, setExisteUpload] = useState(task.up_id ? true : false);
  const [form] = Form.useForm();

  const [deleteUploadDeTareaIframeResolver] = useMutation(DELETE_UPLOAD_TAREA);
  const [updateTareaResolver] = useMutation(UPDATE_TAREA);

  const { data: dataTipoTareas } = useQuery(GET_TIPO_TAREA, {
    variables: { idCategoria: 1 },
  });
  const { data: dataOrigenes } = useQuery(GET_ORIGENES);

  const { data: dataUsuarios } = useQuery(GET_USUARIOS, {
    variables: { input: searchUsuario },
  });

  const onFinish = (v) => {
    let inputAdjunto;
    if (v.upload) {
      const extension = v.upload.file.name.split(".")[1];
      inputAdjunto = {
        up_filename: v.upload.file.fileName,
        up_mimetype: extension,
        up_hashname: v.upload.file.filename,
        usu_id: task.usu_id,
        up_detalle: v.nombreUpload,
        up_size: String(v.upload.file.size),
      };
    }

    const inputTarea = {
      tar_asunto: v.tar_asunto,
      tar_vencimiento: v.tar_vencimiento
        ? moment(v.tar_vencimiento).format("YYYY-MM-DD")
        : task.tar_vencimiento,
      tar_horavencimiento: v.tar_horavencimiento
        ? moment(v.tar_horavencimiento).format("HH:mm")
        : task.tar_horavencimiento,
      est_id: 1,
      usu_id: task.usu_id,
      cli_id: task.cli_id,
      ale_id: Number(v.ale_id),
      tar_alertanum: Number(v.tar_alertanum),
      tip_id: Number(v.tip_id) ? Number(v.tip_id) : task.tip_id,
      pri_id: v.importancia ? Number(v.importancia) : task.pri_id,
    };

    let inputNota = {
      not_desc: noteContent ? noteContent : task.not_desc,
      not_importancia: v.importancia ? Number(v.importancia) : task.pri_id,
      not_id: task.not_id,
    };

    if (fList.length === 0) {
      inputAdjunto = null;
    }

    // updateTareaResolver({
    //   variables: {
    //     idTarea: task.tar_id,
    //     inputTarea,
    //     inputAdjunto,
    //     inputNota,
    //     idUsuario: idUser,
    //   },
    // });
  };

  const onSearchUsuario = (val) => {
    if (val.length >= 3) {
      setSearchUsuario(val);
    }
  };

  const confirm = (item) => {
    deleteUploadDeTareaIframeResolver({
      variables: { idTarea: item.tar_id },
    }).then(() => {
      setExisteUpload(false);
      form.resetFields(["nombreUpload"]);
    });
  };

  const props = {
    //TODO : URL DINAMICA
    name: "archivo",
    multiple: false,
    uploaded: false,
    action: "http://beeapp.binamics.com.ar:4001/files",
    fileList: fList,
    onChange(info) {
      setFlist(info.fileList.slice(-1));
      const { response, status } = info.file;

      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success({
          content: `${info.file.name} El archivo se adjuntó correctamente.`,
          duration: 1,
        });
      } else if (status === "error") {
        message.error({
          content: `${info.file.name} Error al cargar el archivo.`,
          duration: 1,
        });
      }
    },
    onRemove(info) {
      const { status } = info;

      if (status === "done") {
        message.success({
          content: `El archivo se elimino correctamente.`,
          duration: 1,
        });
        setFlist([]);
      }
    },
  };

  useEffect(() => {
    if (dataTipoTareas) {
      setTipoTareas(dataTipoTareas.getTiposTareaResolver);
    }
    if (dataOrigenes) {
      setOrigenes(dataOrigenes.getOrigenesResolver);
    }
    if (dataUsuarios) {
      setUsuarios(dataUsuarios.getUsuariosResolver);
    }
  }, [dataOrigenes, dataTipoTareas, dataUsuarios]);

  return (
    <Row>
      <Col xs={24} style={{ justifyContent: "center", overflowX: "hidden" }}>
        <Form
          form={form}
          requiredMark="optional"
          name="newTask"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="Cliente"
            name="cliente"
            initialValue={task.cli_nombre}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Contacto"
            name="contacto"
            initialValue={task.con_nombre}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Asunto"
            name="tar_asunto"
            initialValue={task.tar_asunto}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tipo de tarea"
            name="tip_id"
            initialValue={task.tip_id}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Select>
              {tipoTareas &&
                tipoTareas.map((item) => {
                  return (
                    <Select.Option key={item.tip_id} value={item.tip_id}>
                      {item.tip_desc}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Fuente"
            name="fuente"
            initialValue={task.ori_id}
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <Select>
              {origenes &&
                origenes.map((item) => {
                  return (
                    <Select.Option key={item.ori_id} value={item.ori_id}>
                      {item.ori_desc}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Row>
            <Col xs={24}>
              <div className="date_wrapper">
                <Col xs={11}>
                  <Form.Item
                    label="Vencimiento"
                    name="tar_vencimiento"
                    initialValue={moment(task.tar_vencimiento)}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "97%", marginRight: 4 }}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={5}>
                  <Form.Item
                    label="Hora"
                    name="tar_horavencimiento"
                    initialValue={moment(task.tar_horavencimiento, "HH:mm:ss")}
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <TimePicker
                      style={{ width: 150 }}
                      format="HH:mm"
                      use12Hours={false}
                    />
                  </Form.Item>
                </Col>
                <Col xs={11} />
              </div>
            </Col>
          </Row>
          <Note taskNote={task.not_desc} />

          <Form.Item name="importancia" initialValue={"1"}>
            <Row gutter={[20, 20]}>
              <Col sm={24}>
                <Radio.Group
                  defaultValue={String(task.pri_id)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="1">Alta</Radio.Button>
                  <Radio.Button value="2">Media</Radio.Button>
                  <Radio.Button value="3">Baja</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label="Detalle del archivo"
            name="nombreUpload"
            initialValue={task.up_detalle}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          {!existeUpload ? (
            <Form.Item name="upload">
              <Upload.Dragger
                {...props}
                disabled={false}
                style={{ marginBottom: "1rem" }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click o arrastrar a esta área para subir un archivo
                </p>
                <p className="ant-upload-hint">
                  Los tipos de archivos son PDF, JPEG, PNG, SVG
                </p>
              </Upload.Dragger>
            </Form.Item>
          ) : (
            <Card>
              <div className="upload-wrapper">
                <div className="upload-header">
                  {returnExtIcon(task.up_mimetype)}
                  <span>{task.up_filename}</span>
                </div>
                <div className="upload-footer">
                  <Popconfirm
                    placement="topLeft"
                    title="¿Desea borrar el archivo?"
                    okText="Si"
                    cancelText="No"
                    onConfirm={() => confirm(task)}
                  >
                    <DeleteOutlined
                      style={{ fontSize: "20px", color: "red" }}
                    />
                  </Popconfirm>
                </div>
              </div>
            </Card>
          )}

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item name="usuarioAsignado" label="Asignar a usuario">
                <Select
                  showSearch
                  allowClear
                  onClear={() => setSearchUsuario("")}
                  placeholder="Usuario"
                  optionFilterProp="children"
                  onSearch={onSearchUsuario}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {usuarios &&
                    usuarios.map((item) => {
                      return (
                        <Select.Option key={item.usu_id} value={item.usu_id}>
                          {item.usu_nombre}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="buttons-wrapper">
            <Button
              type="primary"
              block
              htmlType="submit"
              style={{ marginRight: "10px" }}
            >
              Guardar
            </Button>
            <Button
              type="danger"
              block
              onClick={() => {
                setTaskDrawerVisible({ visible: false, content: "null" });
              }}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default EditTaskForm;
