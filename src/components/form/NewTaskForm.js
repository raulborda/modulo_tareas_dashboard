/* eslint-disable no-unused-vars */
import { CheckOutlined, InboxOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  TimePicker,
  Upload,
} from "antd";
import Note from "..//note/Note";
import OpenNotification from "../notification/OpenNotification";
import { TaskContext } from "../../context/TaskContext";
import { NEW_TAREA } from "../../graphql/mutation/tareas";
import { GET_CLIENTES_LIMIT, GET_CONTACTOS } from "../../graphql/query/clientes";
import { GET_ORIGENES } from "../../graphql/query/origenes";
import { GET_TAREAS } from "../../graphql/query/tareas";
import { GET_TIPO_TAREA } from "../../graphql/query/tipoTareas";
import { GET_USUARIOS } from "../../graphql/query/usuarios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import "./index.css";

const NewTaskForm = ({ queryPoll }) => {
  const { idUser, noteContent, setTaskDrawerVisible } = useContext(TaskContext);

  const [tipoTareas, setTipoTareas] = useState([]);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchUsuario, setSearchUsuario] = useState("");
  const [contactos, setContactos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [origenes, setOrigenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [fList, setFlist] = useState([]);

  const [form] = Form.useForm();

  const { startPolling, stopPolling } = queryPoll;

  const [newTareaIframeResolver] = useMutation(NEW_TAREA, {
    onCompleted: () => {
      startPolling(1000);

      setTimeout(() => {
        stopPolling();
      }, 1000);

      OpenNotification(
        <h4>Tarea creada exitosamente</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
      setTaskDrawerVisible({ visible: false, content: "" });
    },
  });

  const { data: dataTipoTareas } = useQuery(GET_TIPO_TAREA, {
    variables: { idCategoria: 1 },
  });

  const { data: dataClientes } = useQuery(GET_CLIENTES_LIMIT, {
    variables: { input: searchCliente, idUsuario: idUser },
  });

  const { data: dataOrigenes } = useQuery(GET_ORIGENES);

  const { data: dataUsuarios } = useQuery(GET_USUARIOS, {
    variables: { input: searchUsuario },
  });

  const [getContactos] = useLazyQuery(GET_CONTACTOS);

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

  const onSearchCliente = (val) => {
    if (val.length >= 3) {
      setSearchCliente(val);
    }
  };

  const onSearchUsuario = (val) => {
    if (val.length >= 3) {
      setSearchUsuario(val);
    }
  };

  const handleChangeCliente = (v) => {
    form.resetFields(["contacto"]);
    getContactos({ variables: { id: Number(v) } }).then((res) => {
      if (res) {
        setContactos(res.data.getContactosResolver);
      }
    });
  };

  const onFinish = (v) => {
    const { upload } = v;

    let objetoUpload = null;
    let objetoNota = null;

    if (upload) {
      objetoUpload = {
        up_filename: upload.file.response.fileName,
        up_mimetype: upload.file.response.mimetype,
        up_hashname: upload.file.response.filename,
        up_detalle: v.nombreUpload,
        up_size: String(upload.file.response.size),
      };
    }

    if (noteContent) {
      objetoNota = {
        not_desc: noteContent,
        not_importancia: Number(v.importancia),
      };
    }

    newTareaIframeResolver({
      variables: {
        inputTarea: {
          tar_asunto: v.tar_asunto,
          tar_horavencimiento: moment(v.tar_horavencimiento).format("HH:mm"),
          tar_vencimiento: v.tar_vencimiento,
          usu_id: idUser,
          cli_id: Number(v.cliente),
          con_id: v.contacto ? Number(v.contacto) : null,
          tip_id: Number(v.tip_id),
          pri_id: Number(v.importancia),
          ori_id: v.fuente,
          asignacion: 1,
          est_id: 1,
        },
        inputNota: objetoNota,
        inputAdjunto: objetoUpload,
        usuAsig: v.usuarioAsignado ? v.usuarioAsignado : idUser,
      },
    });
  };

  useEffect(() => {
    if (dataTipoTareas) {
      setTipoTareas(dataTipoTareas.getTiposTareaResolver);
    }

    if (dataClientes) {
      setClientes(dataClientes.getClientesLimitResolver);
    }

    if (dataOrigenes) {
      setOrigenes(dataOrigenes.getOrigenesResolver);
    }

    if (dataUsuarios) {
      setUsuarios(dataUsuarios.getUsuariosResolver);
    }
  }, [dataTipoTareas, dataClientes, dataOrigenes, dataUsuarios]);

  return (
    <Row>
      <Col xs={24} style={{ justifyContent: "center", overflowX: "hidden" }}>
        <>
          <Form
            form={form}
            requiredMark="optional"
            name="newTask"
            layout="vertical"
            autoComplete="off"
            onFinish={(v) => onFinish(v)}
          >
            <Form.Item
              label="Cliente"
              name="cliente"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                onClear={() => {
                  setSearchCliente("");
                  setContactos([]);
                }}
                onSearch={onSearchCliente}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.indexOf(input >= 0)
                }
                onChange={(v) => handleChangeCliente(v)}
              >
                {clientes &&
                  clientes.map((item) => {
                    return (
                      <Select.Option key={item.cli_id} value={item.cli_id}>
                        {item.cli_nombre}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item label="Contacto" name="contacto">
              <Select disabled={contactos.length > 0 ? false : true}>
                {contactos &&
                  contactos.map((item) => {
                    return (
                      <Select.Option key={item.con_id} value={item.con_id}>
                        {item.con_nombre}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              label="Asunto"
              name="tar_asunto"
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
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <DatePicker
                        disabledDate={(current) =>
                          current.isBefore(moment().subtract(1, "day"))
                        }
                        style={{ width: "97%", marginRight: 4 }}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={5}>
                    <Form.Item
                      label="Hora"
                      name="tar_horavencimiento"
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
            <Note />

            <Form.Item name="importancia" initialValue={"1"}>
              <Row gutter={[20, 20]}>
                <Col sm={24}>
                  <Radio.Group defaultValue="1" buttonStyle="solid">
                    <Radio.Button value="1">Alta</Radio.Button>
                    <Radio.Button value="2">Media</Radio.Button>
                    <Radio.Button value="3">Baja</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Detalle del archivo" name="nombreUpload">
              <Input style={{ width: "100%" }} />
            </Form.Item>
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
        </>
      </Col>
    </Row>
  );
};

export default NewTaskForm;
