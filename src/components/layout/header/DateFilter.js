import { CalendarOutlined } from "@ant-design/icons";
import { Button, Calendar, Dropdown, Popover, Radio } from "antd";
import { TaskContext } from "../../../context/TaskContext";
import { useContext, useState } from "react";
import moment from "moment";
import "./index.css";

const DateFilter = ({ filterEnable }) => {
  const { setFilterDate, filterDate } = useContext(TaskContext);
  const [dropdownText, setDropdownText] = useState("Semana");

  const handleChangeOptions = (v) => {
    //* las fechas tienen este formato para poder operar en la query
    switch (true) {
      case v.target.value === "date":
        const currentDay = moment().format("YYYY-MM-DD");
        setFilterDate({ mode: "date", date: currentDay });
        break;
      case v.target.value === "week":
        const weeknumber = moment().week();
        const yearnumber = moment().year();
        const currentWeek = `${yearnumber}${weeknumber}`;
        setFilterDate({ mode: "week", date: currentWeek });
        break;
      case v.target.value === "nextweek":
        const nextweeknumber = moment().week() + 1;
        const nextyearnumber = moment().year();
        const nextcurrentWeek = `${nextyearnumber}${nextweeknumber}`;
        setFilterDate({ mode: "nextweek", date: nextcurrentWeek });
        break;
      case v.target.value === "all":
        setFilterDate({ mode: "", date: "" });
        break;
      case v.target.value === "expired":
        const untilToday = moment().format("YYYY-MM-DD");
        setFilterDate({ mode: "expired", date: untilToday });
        break;

      default:
        //TODO evitar este comportamiento cuando se abre el calendario, pisa la fecha actual del filtro
        // const day = moment().format("YYYY-MM-DD");
        // setFilterDate({ mode: "date", date: day });
        break;
    }
  };

  const returnCustomFormat = () => {
    //* formato visible del picker
    switch (true) {
      case filterDate.mode === "date" || filterDate.mode === "month":
        const dateFormat = moment(filterDate.date).format("DD/MM/YYYY");
        return dateFormat;
      case filterDate.mode === "week":
        let currentDate = moment();
        let weekStart = currentDate.clone().startOf("week");
        let weekEnd = currentDate.clone().endOf("week");
        return `${moment(weekStart).format("DD/MM")} - ${moment(weekEnd).format(
          "DD/MM"
        )}`;

      case filterDate.mode === "nextweek":
        let currentDay = moment();
        let nextWeekStart = currentDay.clone().startOf("week").add(7, "days");
        let nextWeekEnd = currentDay.clone().endOf("week").add(7, "days");
        return `${moment(nextWeekStart).format("DD/MM")} - ${moment(
          nextWeekEnd
        ).format("DD/MM")}`;

      default:
        break;
    }
  };

  return (
    <div className="filter-wrapper">
      <Radio.Group
        disabled={filterEnable}
        style={{ marginLeft: 8 }}
        optionType="button"
        buttonStyle="solid"
        defaultValue={"week"}
        onChange={(v) => {
          handleChangeOptions(v);
        }}
      >
        <Radio.Button value={"date"} onClick={() => setDropdownText("Semana")}>
          Hoy
        </Radio.Button>

        <Dropdown
          disabled={filterEnable}
          overlay={
            <div className="week-dropdown">
              <Radio.Button
                value={"week"}
                onClick={() => setDropdownText("Esta semana")}
              >
                Esta semana
              </Radio.Button>
              <Radio.Button
                value={"nextweek"}
                onClick={() => setDropdownText("Próxima semana")}
              >
                Próxima semana
              </Radio.Button>
              <Radio.Button
                value={"expired"}
                onClick={() => setDropdownText("Vencidas")}
              >
                Vencidas
              </Radio.Button>
              <Radio.Button
                value={"all"}
                onClick={() => setDropdownText("Todas")}
              >
                Todas
              </Radio.Button>
            </div>
          }
        >
          <Button>{dropdownText}</Button>
        </Dropdown>

        <Popover
          trigger={"click"}
          content={
            <div className="site-calendar-demo-card">
              <Calendar
                fullscreen={false}
                onChange={(v) => {
                  setFilterDate({
                    mode: "month",
                    date: v.format("YYYY-MM-DD"),
                  });
                }}
              />
            </div>
          }
        >
          <Radio.Button
            value={"month"}
            onClick={() => setDropdownText("Semana")}
          >
            {returnCustomFormat()} <CalendarOutlined />
          </Radio.Button>
        </Popover>
      </Radio.Group>
    </div>
  );
};

export default DateFilter;
