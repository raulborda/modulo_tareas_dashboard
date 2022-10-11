/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useQuery } from "@apollo/client";
import { Card, Col, Form, Row, Tag } from "antd";
import { TaskContext } from "../../context/TaskContext";
import { GET_ORIGENES } from "../../graphql/query/origenes";
import { GET_TIPO_TAREA } from "../../graphql/query/tipoTareas";
import { GET_USUARIOS } from "../../graphql/query/usuarios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import returnExtIcon from "../../utils/returnExtIcon";
import "./index.css";

const SeeTaskForm = ({ task }) => {
  const [form] = Form.useForm();

  const { setTaskDrawerVisible } = useContext(TaskContext);
  const [origenes, setOrigenes] = useState([]);
  const [tipoTareas, setTipoTareas] = useState([]);
  const [tagColor, setTagColor] = useState("green");

  const { data: dataTipoTareas } = useQuery(GET_TIPO_TAREA, {
    variables: { idCategoria: 1 },
  });
  const { data: dataOrigenes } = useQuery(GET_ORIGENES);

  useEffect(() => {
    if (dataTipoTareas) {
      setTipoTareas(dataTipoTareas.getTiposTareaResolver);
    }
    if (dataOrigenes) {
      setOrigenes(dataOrigenes.getOrigenesResolver);
    }

    switch (true) {
      case task.pri_id === 1:
        setTagColor("red");
        break;
      case task.pri_id === 2:
        setTagColor("gold");
        break;
      case task.pri_id === 3:
        setTagColor("green");
        break;
      default:
        break;
    }
  }, [dataOrigenes, dataTipoTareas]);

  return (
    <Row>
      <Col xs={24} style={{ justifyContent: "center", overflowX: "hidden" }}>
        <Form
          form={form}
          requiredMark="optional"
          name="seeTaskForm"
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: "0px" }}
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
            <p className="task-client">{task.cli_nombre}</p>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "0px" }}
            label="Contacto"
            name="contacto"
            required
            initialValue={task.con_nombre}
          >
            <p className="task-client">{task.con_nombre}</p>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "0px" }}
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
            <p className="task-client">{task.tar_asunto}</p>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "0px" }}
            label="Tipo de tarea"
            name="tip_id"
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
          >
            <p className="task-client">{task.tip_desc}</p>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "0px" }}
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
            <span>
              <Tag color={task.ori_color} style={{ marginBottom: "15px" }}>
                {task.ori_desc}{" "}
              </Tag>
            </span>
          </Form.Item>

          <Row>
            <Col xs={24}>
              <div className="date_wrapper">
                <Col xs={11}>
                  <Form.Item
                    style={{ marginBottom: "0px" }}
                    label="Vencimiento"
                    name="tar_vencimiento"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <p className="task-client">{task.tar_vencimiento}</p>
                  </Form.Item>
                </Col>
                <Col xs={6}>
                  <Form.Item
                    style={{ marginBottom: "0px" }}
                    label="Hora"
                    name="tar_horavencimiento"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <p className="task-client">{task.tar_horavencimiento}</p>
                  </Form.Item>
                </Col>
                <Col xs={11} />
              </div>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item
                required
                name="asignado"
                style={{ marginBottom: "0px" }}
              >
                <div
                  className="note-wrapper"
                  dangerouslySetInnerHTML={{
                    __html: task.not_desc,
                  }}
                  style={{ marginBottom: "20px" }}
                ></div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item
                required
                label="Prioridad"
                name="asignado"
                style={{ marginBottom: "0px" }}
              >
                <span>
                  <Tag color={tagColor} style={{ marginBottom: "15px" }}>
                    {task.pri_desc}
                  </Tag>
                </span>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <Form.Item
                required
                label="Asignado"
                name="asignado"
                style={{ marginBottom: "0px" }}
              >
                <p className="task-client">{task.usu_nombre}</p>
              </Form.Item>
            </Col>
          </Row>

          {task.up_filename && (
            <>
              <Form.Item
                style={{ marginBottom: "0px" }}
                label="Detalle del archivo"
                name="nombreUpload"
                required
                initialValue={task.up_detalle}
              >
                <span>{task.up_detalle}</span>
              </Form.Item>

              <Card>
                <div className="upload-wrapper">
                  <div className="upload-header">
                    {returnExtIcon(task.up_mimetype)}
                    <span style={{ marginLeft: "10px" }}>
                      {task.up_filename}
                    </span>
                  </div>
                </div>
              </Card>
            </>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default SeeTaskForm;
