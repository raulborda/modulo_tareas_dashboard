import {
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  PaperClipOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Popover, Space, Table, Tag } from "antd";
import { TaskContext } from "../../context/TaskContext";
import { useContext, useState } from "react";
import moment from "moment";
import "./index.css";
import { useMutation } from "@apollo/client";
import { UPDATE_ESTADO_TAREA } from "../../graphql/mutation/tareas";
import OpenNotification from "../notification/OpenNotification";
import DetailDrawer from "../drawer/detailDrawer/DetailDrawer";
import Calendario from "../calendario/Calendario";
import TaskCalendar from "../../components/drawer/taskCalendar/TaskCalendar";

const TaskTable = ({ tareas, queryPoll }) => {
  const [updateEstadoTareaIframeResolver] = useMutation(UPDATE_ESTADO_TAREA);
  const { setTaskDrawerVisible } = useContext(TaskContext);
  const [showDetailDrawer, setShowDetailDrawer] = useState({
    visible: false,
    type: "",
    idContent: null,
  });

  const { startPolling, stopPolling } = queryPoll;

  const handleDetail = (item) => {
    //TODO handle tipo de detalle(negocio,encuestas,lotes,etc)
    if (item.neg_id) {
      setShowDetailDrawer({
        visible: true,
        type: "negocio",
        idContent: item.neg_id,
      });
    }
  };

  const confirm = (item) => {
    updateEstadoTareaIframeResolver({
      variables: { idTarea: item.tar_id },
    }).then((res) => {
      const { data } = res;
      const resp = JSON.parse(data.updateEstadoTareaIframeResolver);

      startPolling(1000);
      setTimeout(() => {
        stopPolling();
      }, 1000);

      OpenNotification(
        <h4>{resp.response}</h4>,
        null,
        "topleft",
        <CheckOutlined style={{ color: "green" }} />,
        null
      );
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={"Buscar ..."}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "...",
      dataIndex: "",
      key: "prioridad",
      render: (dataIndex, item) => {
        let tagColor = "";
        switch (true) {
          case item.pri_id === 1:
            tagColor = "red";
            break;
          case item.pri_id === 2:
            tagColor = "gold";
            break;
          case item.pri_id === 3:
            tagColor = "green";
            break;
          default:
            break;
        }
        return (
          <div className="firstcolumn-wrapper">
            <Tag color={tagColor}>{item.pri_desc}</Tag>
            {item.up_id && (
              <PaperClipOutlined
                onClick={() => {
                  setTaskDrawerVisible({
                    visible: true,
                    content: "Ver Tarea",
                    task: item,
                  });
                }}
              />
            )}
          </div>
        );
      },
      width: 80,
    },
    {
      title: "Asunto",
      dataIndex: "tar_asunto",
      key: "tar_asunto",
      ellipsis: true,
      width: 200,
      ...getColumnSearchProps("tar_asunto"),
    },
    {
      title: "Cliente",
      dataIndex: "cli_nombre",
      key: "cli_nombre",
      width: 200,
      ...getColumnSearchProps("cli_nombre"),
      render: (dataIndex, item) => {
        return (
          <span>
            {dataIndex}
            <span>
              {" "}
              {item.con_nombre && (
                <Popover
                  title={item.con_nombre}
                  trigger={"hover"}
                  placement="top"
                  content={
                    <div className="infocontacto-wrapper">
                      <span>{item.con_telefono1}</span>
                      <span>{item.con_email1}</span>
                    </div>
                  }
                >
                  <UserOutlined />
                </Popover>
              )}
            </span>
          </span>
        );
      },
    },
    {
      title: "Fuente",
      key: "fuente",
      width: 90,
      dataIndex: "ori_id",
      render: (dataIndex, item) => (
        <Tag color={item.ori_color} key={"key"}>
          {item.ori_desc}
        </Tag>
      ),
    },
    {
      title: "Creación",
      key: "fechaCreacion",
      width: 100,
      dataIndex: "fechacreacion",
      sorter: (a, b) => a.tar_fecha.localeCompare(b.tar_fecha),
      showSorterTooltip: false,
      // render: (dataIndex, item) => {
      //   return <span>{moment(dataIndex).format("DD/MM/YYYY")}</span>;
      // },
    },
    {
      title: "Vencimiento",
      key: "fechaVto",
      dataIndex: "tar_vencimiento",
      showSorterTooltip: false,
      width: 150,
      sorter: (a, b) => {
        a.tar_vencimiento.localeCompare(b.tar_vencimiento);
      },
      render: (dataIndex, item) => (
        <div className="vencimiento-wrapper">
          <span style={{ marginRight: "5px" }}>
            {dataIndex ? moment(dataIndex).format("DD/MM/YYYY") : "-"}
          </span>
          {/* <span>
            {item.tar_horavencimiento && item.tar_horavencimiento.slice(0, -3)}
          </span> */}
        </div>
      ),
    },
    {
      title: "Asignado",
      key: "asignado",
      width: 90,
      dataIndex: "asignado",
      render: (dataIndex, item) => <span>{item.usu_nombre} </span>,
    },
    {
      title: "Módulo",
      key: "modori",
      width: 90,
      dataIndex: "mod_id",
      render: (dataIndex, item) => {
        return (
          <Tag
            color="lime"
            onClick={() => handleDetail(item)}
            style={{ cursor: "pointer" }}
          >
            {item.modori_desc ? item.modori_desc : "TAREAS"}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "",
      width: 90,
      render: (dataIndex, item) => (
        <div className="options-wrapper">
          <EyeOutlined
            style={{ fontSize: "12px", marginRight: "15px", color: "green" }}
            onClick={() => {
              setTaskDrawerVisible({
                visible: true,
                content: "Ver Tarea",
                task: item,
              });
            }}
          />
          <EditOutlined
            style={{ fontSize: "12px", marginRight: "15px", color: "green" }}
            onClick={() => {
              setTaskDrawerVisible({
                visible: true,
                content: "Editar Tarea",
                task: item,
              });
            }}
          />
          <Popconfirm
            placement="topLeft"
            title="¿Desea completar la tarea?"
            okText="Si"
            cancelText="No"
            onConfirm={() => confirm(item)}
          >
            <CheckOutlined style={{ fontSize: "12px", color: "green" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                // alert(JSON.stringify(record));
                // console.log("click", record);
              }, // click row
              onDoubleClick: (event) => {}, // double click row
              onContextMenu: (event) => {}, // right button click row
              onMouseEnter: (event) => {}, // mouse enter row
              onMouseLeave: (event) => {}, // mouse leave row
            };
          }}
          columns={columns}
          dataSource={tareas}
          rowKey={"tar_id"}
          size="small"
        />
        <DetailDrawer
          showDetailDrawer={showDetailDrawer}
          closeDrawer={setShowDetailDrawer}
        />

        {/* <Calendario/> */}

        <div>
          <TaskCalendar queryPoll={queryPoll} />
        </div>
      </div>
    </>
  );
};

export default TaskTable;
